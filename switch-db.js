#!/usr/bin/env node

/**
 * Script para cambiar entre SQLite (desarrollo) y PostgreSQL (producción)
 * Uso: node switch-db.js [sqlite|postgres]
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const envPath = path.join(__dirname, '.env');

const args = process.argv.slice(2);
const target = args[0];

if (!target || !['sqlite', 'postgres', 'postgresql'].includes(target.toLowerCase())) {
    console.log('❌ Uso: node switch-db.js [sqlite|postgres]');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node switch-db.js sqlite     # Cambiar a SQLite (desarrollo)');
    console.log('  node switch-db.js postgres   # Cambiar a PostgreSQL (producción)');
    process.exit(1);
}

const useSQLite = target.toLowerCase() === 'sqlite';

// Leer schema actual
let schema = fs.readFileSync(schemaPath, 'utf8');

// Cambiar provider
if (useSQLite) {
    schema = schema.replace(
        /datasource db \{[\s\S]*?provider = "postgresql"/,
        'datasource db {\n  provider = "sqlite"'
    );
    console.log('✅ Schema actualizado a SQLite');
    console.log('');
    console.log('📝 Actualiza tu .env:');
    console.log('   DATABASE_URL="file:./dev.db"');
    console.log('');
    console.log('🔄 Ejecuta:');
    console.log('   npx prisma generate');
    console.log('   npx prisma db push');
} else {
    schema = schema.replace(
        /datasource db \{[\s\S]*?provider = "sqlite"/,
        'datasource db {\n  provider = "postgresql"'
    );
    console.log('✅ Schema actualizado a PostgreSQL');
    console.log('');
    console.log('📝 Actualiza tu .env:');
    console.log('   DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"');
    console.log('');
    console.log('🔄 Ejecuta:');
    console.log('   npx prisma generate');
    console.log('   npx prisma migrate dev');
}

// Guardar schema
fs.writeFileSync(schemaPath, schema);

console.log('');
console.log('✨ ¡Listo! No olvides actualizar tu .env y regenerar el cliente Prisma.');
