#!/usr/bin/env node

/**
 * Script de Verificación del Sistema
 * Verifica que todos los componentes estén funcionando correctamente
 */

console.log('🔍 Verificando Sistema DiligentOS Field Leads...\n');

// 1. Verificar Node.js version
console.log('✓ Node.js Version:', process.version);

// 2. Verificar variables de entorno
const requiredEnvVars = [
    'DATABASE_URL',
    'AUTH_SECRET',
    'NEXTAUTH_URL'
];

console.log('\n📋 Variables de Entorno:');
let envOk = true;
requiredEnvVars.forEach(varName => {
    const exists = process.env[varName] !== undefined;
    console.log(`  ${exists ? '✓' : '✗'} ${varName}: ${exists ? 'Configurada' : 'FALTANTE'}`);
    if (!exists) envOk = false;
});

// 3. Verificar archivos críticos
const fs = require('fs');
const path = require('path');

console.log('\n📁 Archivos Críticos:');
const criticalFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'src/app/layout.tsx',
    'src/middleware.ts',
    'prisma/schema.prisma'
];

let filesOk = true;
criticalFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
    if (!exists) filesOk = false;
});

// 4. Verificar dependencias
console.log('\n📦 Dependencias Principales:');
const packageJson = require('./package.json');
const mainDeps = ['next', 'react', 'prisma', 'hono', 'next-auth'];
mainDeps.forEach(dep => {
    const version = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    console.log(`  ${version ? '✓' : '✗'} ${dep}: ${version || 'NO INSTALADA'}`);
});

// 5. Resumen final
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(50));

const allOk = envOk && filesOk;
if (allOk) {
    console.log('✅ SISTEMA LISTO PARA USAR');
    console.log('\nComandos disponibles:');
    console.log('  npm run dev     - Iniciar servidor de desarrollo');
    console.log('  npm run build   - Crear build de producción');
    console.log('  npm run start   - Iniciar en modo producción');
    console.log('  npm run db:setup - Configurar base de datos');
} else {
    console.log('⚠️  ATENCIÓN: Hay problemas que necesitan resolverse');
    if (!envOk) console.log('   - Configurar variables de entorno faltantes');
    if (!filesOk) console.log('   - Restaurar archivos críticos faltantes');
}

console.log('\n');
process.exit(allOk ? 0 : 1);
