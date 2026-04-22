const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL  = process.env.SENDGRID_FROM_EMAIL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Stuur bevestigingsemail naar de klant
async function sendQuoteConfirmation(contactData, quoteId) {
    const msg = {
        to:      contactData.email,
        from:    FROM_EMAIL,
        subject: `✅ Offerte ontvangen — ${quoteId}`,
        text: [
            `Beste ${contactData.name},`,
            '',
            'Bedankt voor je offerte-aanvraag! We nemen zo snel mogelijk contact met je op.',
            '',
            `Jouw offerte-ID: ${quoteId}`,
            '',
            'Met vriendelijke groet,',
            'Pillar Workbench',
        ].join('\n'),
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Bevestigingsemail verzonden naar ${contactData.email}`);
    } catch (err) {
        console.error(`❌ Bevestigingsemail mislukt (${contactData.email}):`, err.message);
        throw err;
    }
}

// Stuur notificatie naar de admin
async function sendAdminNotification(contactData, configData, quoteId) {
    const moduleCount = configData?.modules?.length ?? 0;

    const msg = {
        to:      ADMIN_EMAIL,
        from:    FROM_EMAIL,
        subject: `🔔 Nieuwe offerte: ${quoteId} — ${contactData.name}`,
        text: [
            `Nieuwe offerte-aanvraag ontvangen.`,
            '',
            `ID:      ${quoteId}`,
            `Naam:    ${contactData.name}`,
            `Email:   ${contactData.email}`,
            `Bedrijf: ${contactData.company || '—'}`,
            `Telefoon:${contactData.phone   || '—'}`,
            `Modules: ${moduleCount} stuks`,
            '',
            `Bericht: ${contactData.message || '—'}`,
        ].join('\n'),
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Admin-notificatie verzonden naar ${ADMIN_EMAIL}`);
    } catch (err) {
        console.error(`❌ Admin-notificatie mislukt:`, err.message);
        throw err;
    }
}

// Stuur beide emails in één aanroep
async function sendQuoteEmails(quoteData) {
    const { contactData, configData, quoteId } = quoteData;

    console.log(`📧 Emails verzenden voor offerte ${quoteId}...`);

    await Promise.all([
        sendQuoteConfirmation(contactData, quoteId),
        sendAdminNotification(contactData, configData, quoteId),
    ]);

    console.log(`✅ Alle emails verzonden voor ${quoteId}`);
}

module.exports = { sendQuoteEmails, sendQuoteConfirmation, sendAdminNotification };
