const express = require('express');
const router  = express.Router();
const Config  = require('../models/Config.js');

// --- POST /api/config/save — Sla een configuratie op in MongoDB ---
router.post('/save', async (req, res) => {
    const { configData, contactData, configId } = req.body;

    // Validatie: configData met modules is verplicht
    if (!configData || !Array.isArray(configData.modules)) {
        return res.status(400).json({ success: false, error: 'configData.modules ontbreekt of is geen array' });
    }

    try {
        const doc = await Config.create({ configId, contactData, configData });

        console.log(`✅ Config opgeslagen: ${doc.configId}`);
        res.status(201).json({ success: true, configId: doc.configId });
    } catch (err) {
        console.error('❌ Config opslaan mislukt:', err.message);
        res.status(500).json({ success: false, error: 'Config opslaan mislukt' });
    }
});

// --- GET /api/config/:configId — Haal een config op uit MongoDB ---
router.get('/:configId', async (req, res) => {
    const { configId } = req.params;

    try {
        const doc = await Config.findOne({ configId });

        if (!doc) {
            return res.status(404).json({ success: false, error: `Config niet gevonden: ${configId}` });
        }

        console.log(`✅ Config geladen: ${configId}`);
        res.json({
            configId:    doc.configId,
            contactData: doc.contactData,
            configData:  doc.configData,
            status:      doc.status,
            createdAt:   doc.createdAt,
            updatedAt:   doc.updatedAt,
        });
    } catch (err) {
        console.error('❌ Config ophalen mislukt:', err.message);
        res.status(500).json({ success: false, error: 'Config ophalen mislukt' });
    }
});

module.exports = router;
