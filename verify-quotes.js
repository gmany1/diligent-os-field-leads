// Native fetch in Node 18+
const BASE_URL = 'http://localhost:3000/api';

async function verifyQuotes() {
    try {
        // 1. Get Initial Stats
        console.log('Fetching initial stats...');
        const statsRes1 = await fetch(`${BASE_URL}/stats`);
        if (!statsRes1.ok) {
            const text = await statsRes1.text();
            throw new Error(`Stats API failed: ${statsRes1.status} ${text}`);
        }
        const stats1 = await statsRes1.json();
        console.log('Initial Active Quotes:', stats1.activeQuotes);

        // 2. Create a Lead
        console.log('Creating lead for quote test...');
        const createRes = await fetch(`${BASE_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Quote Test Lead' })
        });
        if (!createRes.ok) throw new Error('Create Lead failed');
        const lead = await createRes.json();
        console.log('Created Lead:', lead.id);

        // 3. Create Quote
        console.log('Creating quote...');
        const quoteRes = await fetch(`${BASE_URL}/quotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                leadId: lead.id,
                items: [{ description: 'Service A', amount: 100 }, { description: 'Service B', amount: 50 }],
                totalAmount: 150
            })
        });
        if (!quoteRes.ok) {
            const text = await quoteRes.text();
            throw new Error(`Create Quote failed: ${text}`);
        }
        const quote = await quoteRes.json();
        console.log('Created Quote:', quote.id, 'Total:', quote.totalAmount);

        if (quote.totalAmount !== 150) throw new Error('Quote total mismatch');

        // 4. Verify Quote List
        console.log('Fetching quotes for lead...');
        const listRes = await fetch(`${BASE_URL}/quotes?leadId=${lead.id}`);
        const list = await listRes.json();
        console.log('Quote List:', list.length, 'items');

        if (list.length !== 1) throw new Error('Quote list count mismatch');

        // 5. Verify Stats Increment
        console.log('Verifying Stats Increment...');
        const statsRes2 = await fetch(`${BASE_URL}/stats`);
        const stats2 = await statsRes2.json();
        console.log('New Active Quotes:', stats2.activeQuotes);

        if (stats2.activeQuotes <= stats1.activeQuotes) throw new Error('Active Quotes stat did not increment');

        console.log('Quote Verification SUCCESS!');

    } catch (error) {
        console.error('Quote Verification FAILED:', error);
        process.exit(1);
    }
}

verifyQuotes();
