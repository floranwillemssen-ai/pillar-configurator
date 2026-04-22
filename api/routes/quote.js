const express            = require('express');
const router             = express.Router();
const { sendQuoteEmails } = require('../services/email-service.js');

// --- POST /api/quote — Ontvang en verwerk een nieuwe offerte-aanvraag ---
router.post('/quote', async (req, res) => {
    console.log('📋 req.body:', req.body);

    const { configData, contactData } = req.body;

    // Validatie: email en naam zijn verplicht
    if (!contactData?.email) {
        return res.status(400).json({ success: false, error: 'E-mail is verplicht' });
    }
    if (!contactData?.name) {
        return res.status(400).json({ success: false, error: 'Naam is verplicht' });
    }

    console.log('📋 Nieuwe offerte ontvangen:');
    console.log('  Contact:', contactData);
    console.log('  Modules:', configData?.modules?.length ?? 0, 'stuks');

    // Tijdelijk ID — wordt later vervangen door MongoDB _id
    const quoteId = `Q-${Date.now()}`;

    // Emails verzenden naar klant + admin
    try {
        await sendQuoteEmails({ contactData, configData, quoteId });
    } catch (err) {
        // Email-fout logt al in de service; server geeft toch een response
        console.error('❌ Email verzenden mislukt:', err.message);
    }

    res.status(201).json({
        success: true,
        quoteId,
        message: 'Quote received',
    });
});

// --- GET /api/quote/:id — Haal een offerte op via ID ---
router.get('/quote/:id', (req, res) => {
    const { id } = req.params;

    console.log(`📋 Offerte opgevraagd: ${id}`);

    // Mock data — wordt later vervangen door DB lookup
    res.json({
        quoteId: id,
        contactData: {
            email: 'test@example.com',
            name: 'Test Klant',
            company: 'Test BV',
            phone: '',
            message: '',
        },
        configData: {
            modules: [],
            workspace: { width: 4, depth: 6, height: 2.4 },
        },
    });
});

module.exports = router;
