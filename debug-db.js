const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function readDb() {
    try {
        console.log('Reading DB from:', DB_PATH);
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const json = JSON.parse(data);
        console.log('DB Keys:', Object.keys(json));
        return {
            users: json.users || [],
            leads: json.leads || [],
            quotes: json.quotes || [],
            activities: json.activities || []
        };
    } catch (error) {
        console.error('Error reading DB:', error);
        return { users: [], leads: [], quotes: [], activities: [] };
    }
}

readDb().then(db => {
    console.log('Leads count:', db.leads.length);
    console.log('Quotes count:', db.quotes.length);
});
