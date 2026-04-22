import { submitQuote } from '../api/api-client.js';

// Maakt het offerteformulier aan en voegt het toe aan de DOM
function createQuoteForm() {
    const form = document.createElement('form');
    form.id = 'quote-form';

    form.innerHTML = `
        <h2>Offerte aanvragen</h2>

        <label for="qf-email">E-mail *</label>
        <input type="email" id="qf-email" name="email" required placeholder="jouw@email.nl">

        <label for="qf-name">Naam *</label>
        <input type="text" id="qf-name" name="name" required placeholder="Voor- en achternaam">

        <label for="qf-company">Bedrijf</label>
        <input type="text" id="qf-company" name="company" placeholder="Bedrijfsnaam (optioneel)">

        <label for="qf-phone">Telefoon</label>
        <input type="tel" id="qf-phone" name="phone" placeholder="+31 6 00000000">

        <label for="qf-message">Bericht</label>
        <textarea id="qf-message" name="message" rows="4" placeholder="Aanvullende opmerkingen..."></textarea>

        <button type="submit">Offerte aanvragen</button>
        <p id="qf-status"></p>
    `;

    // Submit handler — roept echte backend API aan
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const statusEl  = form.querySelector('#qf-status');

        const contactData = {
            email:   form.email.value.trim(),
            name:    form.name.value.trim(),
            company: form.company.value.trim(),
            phone:   form.phone.value.trim(),
            message: form.message.value.trim(),
        };

        console.log('📋 Offerte aanvraag:', contactData);

        submitBtn.disabled   = true;
        submitBtn.textContent = 'Versturen...';
        statusEl.textContent  = '';

        try {
            const result = await submitQuote({}, contactData);

            // Succesbericht
            form.innerHTML = `
                <p id="quote-success">
                    ✅ Bedankt, ${contactData.name}! Je aanvraag is ontvangen.<br>
                    We nemen zo snel mogelijk contact op via <strong>${contactData.email}</strong>.<br>
                    <small>Referentie: ${result.quoteId}</small>
                </p>
            `;
        } catch (err) {
            console.error('✗ Submit mislukt:', err);
            statusEl.textContent  = '❌ Er ging iets mis. Probeer opnieuw.';
            statusEl.style.color  = 'red';
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Offerte aanvragen';
        }
    });

    // Voeg het formulier toe aan de pagina
    const container = document.getElementById('quote-form-container') ?? document.body;
    container.appendChild(form);

    console.log('✓ Quote form ready');
    return form;
}

export { createQuoteForm };
