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
        console.log('Connecting...');
        await client.connect();

        // Check if table exists
        const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'AuditLog'
      );
    `);

        console.log('AuditLog table exists:', res.rows[0].exists);

        if (!res.rows[0].exists) {
            console.error('AuditLog table missing!');
            process.exit(1);
        }

        // Insert Log
        const insertRes = await client.query(`
      INSERT INTO "AuditLog" ("id", "action", "entity", "details", "createdAt")
      VALUES ('test-id-1', 'DIAGNOSTIC_TEST', 'SYSTEM', '{"status":"ok"}', NOW())
      RETURNING *;
    `);

        console.log('Inserted Log:', insertRes.rows[0]);

        // Cleanup
        await client.query(`DELETE FROM "AuditLog" WHERE id = 'test-id-1'`);
        console.log('Validation successful. Cleanup done.');

        await client.end();
    } catch (e) {
        console.error('Validation error:', e);
        process.exit(1);
    }
}

main();
