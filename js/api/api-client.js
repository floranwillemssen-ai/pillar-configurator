// Volledige URL nodig: frontend (5500) en backend (3000) zijn verschillende origins
const API_BASE = 'http://localhost:3000/api';

// Stuur een offerte-aanvraag naar de backend
async function submitQuote(configData, contactData) {
    const body = { configData, contactData };

    console.log('📤 submitQuote → POST /api/quote', body);

    try {
        const response = await fetch(`${API_BASE}/quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Server antwoord: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✓ submitQuote geslaagd:', data);
        return data;
    } catch (err) {
        console.error('✗ submitQuote mislukt:', err);
        throw err;
    }
}

// Sla de huidige configuratie op in de database
async function saveConfig(configData) {
    console.log('📤 saveConfig → POST /api/config', configData);

    try {
        const response = await fetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configData),
        });

        if (!response.ok) {
            throw new Error(`Server antwoord: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✓ saveConfig geslaagd:', data);
        return data;
    } catch (err) {
        console.error('✗ saveConfig mislukt:', err);
        throw err;
    }
}

// Laad een opgeslagen configuratie op basis van ID
async function loadConfig(configId) {
    console.log(`📤 loadConfig → GET /api/config/${configId}`);

    try {
        const response = await fetch(`${API_BASE}/config/${configId}`);

        if (!response.ok) {
            throw new Error(`Server antwoord: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✓ loadConfig geslaagd:', data);
        return data;
    } catch (err) {
        console.error(`✗ loadConfig mislukt (id: ${configId}):`, err);
        throw err;
    }
}

export { submitQuote, saveConfig, loadConfig };
