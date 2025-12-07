const { Client } = require('pg');

const client = new Client({
    user: 'diligent_user',
    host: '127.0.0.1',
    database: 'diligent_os_db',
    password: 'password123',
    port: 5433,
});

async function main() {
    try {
        console.log('Connecting with pg client...');
        await client.connect();
        console.log('Connected!');

        const res = await client.query('SELECT $1::text as message', ['Hello world!']);
        console.log(res.rows[0].message);

        await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        console.log('Created pgcrypto extension');

        await client.end();
    } catch (e) {
        console.error('Connection error:', JSON.stringify(e, null, 2));
    }
}

main();
