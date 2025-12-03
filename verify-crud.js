// Native fetch in Node 18+

const BASE_URL = 'http://localhost:3000/api';

async function verifyCRUD() {
    try {
        // 1. CREATE
        console.log('Creating lead...');
        const createRes = await fetch(`${BASE_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'API CRUD Test Lead' })
        });

        if (!createRes.ok) {
            const text = await createRes.text();
            throw new Error(`Create failed: ${createRes.status} ${text}`);
        }

        const lead = await createRes.json();
        console.log('Created:', lead);

        if (!lead.id) throw new Error('Failed to create lead');

        // 2. UPDATE
        console.log('Updating lead...');
        const updateRes = await fetch(`${BASE_URL}/leads/${lead.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: 'WON' })
        });
        const updatedLead = await updateRes.json();
        console.log('Updated:', updatedLead);

        if (updatedLead.stage !== 'WON') throw new Error('Failed to update lead');

        // 3. DELETE
        console.log('Deleting lead...');
        const deleteRes = await fetch(`${BASE_URL}/leads/${lead.id}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteRes.json();
        console.log('Deleted:', deleteData);

        if (!deleteData.success) throw new Error('Failed to delete lead');

        console.log('CRUD Verification SUCCESS!');
    } catch (error) {
        console.error('CRUD Verification FAILED:', error);
        process.exit(1);
    }
}

verifyCRUD();
