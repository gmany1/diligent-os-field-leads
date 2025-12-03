const fs = require('fs').promises;
const path = require('path');

const DB_PATH = 'C:\\Users\\gmany\\.gemini\\antigravity\\scratch\\diligent-os-field-leads\\data\\db.json';
console.log('Checking DB at:', DB_PATH);

async function check() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        console.log('Read success. Length:', data.length);
        const json = JSON.parse(data);
        console.log('Parse success. Leads:', json.leads.length);
    } catch (e) {
        console.error('Check failed:', e);
    }
}

check();
