const express             = require('express');
const router              = express.Router();
const { sendQuoteEmails } = require('../services/email-service.js');
const Config              = require('../models/Config.js');
const Quote               = require('../models/Quote.js');

// --- POST /api/quote — Ontvang, sla op en stuur emails voor een offerte ---
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

    // Uniek config-ID op basis van timestamp + willekeurige waarde
    const configId = `Q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const safeConfigData = configData ?? { modules: [], workspace: { width: 4, depth: 6, height: 2.4 } };

    // Config opslaan in MongoDB
    try {
        await Config.create({ configId, contactData, configData: safeConfigData });
        console.log(`✅ Config opgeslagen in MongoDB: ${configId}`);
    } catch (err) {
        console.error('❌ Config opslaan mislukt:', err.message);
    }

    // Quote aanmaken voor admin panel (status: "new")
    try {
        await Quote.create({ configId, contactData, configData: safeConfigData, status: 'new' });
        console.log(`✅ Quote aangemaakt: ${configId}`);
    } catch (err) {
        console.error('❌ Quote aanmaken mislukt:', err.message);
    }

    // Emails verzenden naar klant + admin
    try {
        await sendQuoteEmails({ contactData, configData, quoteId: configId });
    } catch (err) {
        console.error('❌ Email verzenden mislukt:', err.message);
    }

    res.status(201).json({
        success:  true,
        configId,
        message:  'Quote received',
    });
});

// --- GET /api/quote/:id — Haal een offerte op uit MongoDB ---
router.get('/quote/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await Config.findOne({ configId: id });

        if (!doc) {
            return res.status(404).json({ success: false, error: `Quote niet gevonden: ${id}` });
        }

        console.log(`✅ Quote geladen: ${id}`);
        res.json({
            configId:    doc.configId,
            contactData: doc.contactData,
            configData:  doc.configData,
            createdAt:   doc.createdAt,
        });
    } catch (err) {
        console.error('❌ Quote ophalen mislukt:', err.message);
        res.status(500).json({ success: false, error: 'Quote ophalen mislukt' });
    }
});

module.exports = router;
