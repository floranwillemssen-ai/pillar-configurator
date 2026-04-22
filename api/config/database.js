const mongoose = require('mongoose');

// Verbind met MongoDB via de URI uit .env.local
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
        throw new Error('MONGODB_URI is niet ingesteld in .env.local');
    }

    try {
        await mongoose.connect(mongoURI, {
            // Verwijderd verouderde opties — mongoose 7+ heeft geen extra flags nodig
        });
        console.log('✓ MongoDB connected:', mongoose.connection.host);
    } catch (err) {
        console.error('✗ MongoDB verbinding mislukt:', err.message);
        // Stop het proces zodat de server niet zonder database opstart
        process.exit(1);
    }
}

module.exports = { connectDB };
