const express = require('express');
const router  = express.Router();
const Quote   = require('../models/Quote.js');

// --- GET /api/admin/quotes — Alle quotes, nieuwste eerst ---
router.get('/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.json({ quotes, total: quotes.length });
    } catch (err) {
        console.error('❌ Admin quotes ophalen mislukt:', err.message);
        res.status(500).json({ error: 'Ophalen mislukt' });
    }
});

// --- GET /api/admin/quote/:configId — Eén quote ---
router.get('/quote/:configId', async (req, res) => {
    try {
        const quote = await Quote.findOne({ configId: req.params.configId });
        if (!quote) return res.status(404).json({ error: 'Quote niet gevonden' });
        res.json(quote);
    } catch (err) {
        console.error('❌ Admin quote ophalen mislukt:', err.message);
        res.status(500).json({ error: 'Ophalen mislukt' });
    }
});

// --- PATCH /api/admin/quote/:configId — Status + notities updaten ---
router.patch('/quote/:configId', async (req, res) => {
    const { status, notes } = req.body;
    const allowed = ['new', 'reviewing', 'approved', 'sent'];

    if (status && !allowed.includes(status)) {
        return res.status(400).json({ error: `Ongeldige status: ${status}` });
    }

    try {
        const update = {};
        if (status) update.status     = status;
        if (notes  !== undefined) update.adminNotes = notes;

        const updatedQuote = await Quote.findOneAndUpdate(
            { configId: req.params.configId },
            { $set: update },
            { new: true }
        );

        if (!updatedQuote) return res.status(404).json({ error: 'Quote niet gevonden' });

        console.log(`✅ Quote ${req.params.configId} → status: ${updatedQuote.status}`);
        res.json({ success: true, updatedQuote });
    } catch (err) {
        console.error('❌ Admin quote updaten mislukt:', err.message);
        res.status(500).json({ error: 'Update mislukt' });
    }
});

module.exports = router;
