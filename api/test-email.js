// Laad .env.local zodat SENDGRID_API_KEY beschikbaar is
require('dotenv').config({ path: '.env.local' });

const { sendQuoteEmails } = require('./services/email-service.js');

console.log('📧 Test email starten...');
console.log('  FROM:', process.env.SENDGRID_FROM_EMAIL);
console.log('  ADMIN:', process.env.ADMIN_EMAIL);
console.log('  KEY geladen:', process.env.SENDGRID_API_KEY ? '✅ ja' : '❌ nee');

const testData = {
    quoteId: 'test-123',
    contactData: {
        email:   'floran.willemssen@gmail.com',
        name:    'Test User',
        company: 'Pillar',
        phone:   '',
        message: 'Test email',
    },
    configData: {
        modules:   new Array(5),    // simuleert 5 modules
        workspace: { width: 4, depth: 6, height: 2.4 },
    },
};

sendQuoteEmails(testData)
    .then(() => console.log('✅ Test geslaagd — check inbox!'))
    .catch((err) => console.error('❌ Test mislukt:', err.message));
