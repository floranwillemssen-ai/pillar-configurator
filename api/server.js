// Laad .env.local als eerste zodat alle process.env vars beschikbaar zijn
require('dotenv').config({ path: '.env.local' });

console.log(`Environment: ${process.env.NODE_ENV}`);

const express   = require('express');
const cors      = require('cors');
const { connectDB } = require('./config/database.js');

const app  = express();
const PORT = process.env.PORT || 3000;

// --- CORS: voor alle andere middleware en routes ---
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
console.log('CORS enabled');

// --- JSON body parser ---
app.use(express.json());

// --- Routes ---
const quoteRoutes  = require('./routes/quote.js');
const configRoutes = require('./routes/config.js');
const adminRoutes  = require('./routes/admin.js');
app.use('/api', quoteRoutes);
app.use('/api/config', configRoutes);
app.use('/api/admin', adminRoutes);

// --- Health check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// --- 404 handler: geen route gevonden ---
app.use((req, res) => {
    res.status(404).json({ error: `Route niet gevonden: ${req.method} ${req.path}` });
});

// --- Centrale error handler ---
app.use((err, req, res, next) => {
    console.error('✗ Server error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Interne serverfout',
    });
});

// --- Database verbinden, daarna server starten ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV}`);
    });
});
