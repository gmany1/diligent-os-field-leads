// Native fetch in Node 18+
const BASE_URL = 'http://localhost:3000/api';

async function verifyActivities() {
    try {
        // 1. Create a Lead
        console.log('Creating lead for activity test...');
        const createRes = await fetch(`${BASE_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Activity Test Lead' })
        });
        const lead = await createRes.json();
        console.log('Created Lead:', lead.id);

        // 2. Add Activity
        console.log('Adding activity...');
        const actRes = await fetch(`${BASE_URL}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                leadId: lead.id,
                type: 'CALL',
                notes: 'Initial discovery call'
            })
        });
        const activity = await actRes.json();
        console.log('Created Activity:', activity);

        if (activity.type !== 'CALL') throw new Error('Activity type mismatch');

        // 3. Verify Activity List
        console.log('Fetching activities...');
        const listRes = await fetch(`${BASE_URL}/activities?leadId=${lead.id}`);
        const list = await listRes.json();
        console.log('Activity List:', list.length, 'items');

        if (list.length !== 1) throw new Error('Activity list count mismatch');

        // 4. Verify Lead Last Contact
        console.log('Verifying Lead Last Contact...');
        const leadsRes = await fetch(`${BASE_URL}/leads`);
        const leads = await leadsRes.json();
        const updatedLead = leads.find(l => l.id === lead.id);

        console.log('Lead Last Contact:', updatedLead.lastContactedAt);

        if (!updatedLead.lastContactedAt) throw new Error('Lead lastContactedAt not updated');

        console.log('Activity Verification SUCCESS!');

    } catch (error) {
        console.error('Activity Verification FAILED:', error);
        process.exit(1);
    }
}

verifyActivities();
