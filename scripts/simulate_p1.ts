import { exec } from 'child_process';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import util from 'util';
import path from 'path';

const execAsync = util.promisify(exec);
const prisma = new PrismaClient();

const WAIT_INTERVAL_MS = 1000;
const CONTAINER_NAME = 'diligent_os_postgres';

async function checkHealth() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (e) {
        return false;
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🏁 Starting P1 Incident Simulation: Total Database Failure');

    // 1. Baseline Check
    console.log('1. Verifying System Baseline...');
    if (!await checkHealth()) {
        console.error('❌ System is ALREADY down. Aborting simulation.');
        process.exit(1);
    }
    console.log('✅ System Nominal.');

    // 2. Trigger Failure
    console.log(`2. ⚠️ SIMULATING FAILURE: Stopping ${CONTAINER_NAME}...`);
    const failStart = Date.now();
    await execAsync(`docker stop ${CONTAINER_NAME}`);
    console.log('   Container Stopped.');

    // 3. Measure Detection Time
    console.log('3. Measuring Detection Time...');
    let monitoring = true;
    let detectionTime = 0;

    while (monitoring) {
        const isUp = await checkHealth();
        if (!isUp) {
            detectionTime = Date.now();
            monitoring = false;
            console.log('   🚨 IMPACT DETECTED! Database connection lost.');
        } else {
            process.stdout.write('.');
            await sleep(WAIT_INTERVAL_MS);
        }
    }

    const ttd = (detectionTime - failStart) / 1000;
    console.log(`   ⏱️ Time to Detect (TTD): ${ttd}s`);

    // 4. Trigger Recovery
    console.log('4. 🚑 INITIATING RECOVERY: Restarting container...');
    const recoveryStart = Date.now();
    await execAsync(`docker start ${CONTAINER_NAME}`);

    // 5. Measure Recovery Time
    console.log('5. Measuring Recovery Time...');
    monitoring = true;
    let recoveryFinish = 0;

    while (monitoring) {
        // We might need a small backoff as container starts
        const isUp = await checkHealth();
        if (isUp) {
            recoveryFinish = Date.now();
            monitoring = false;
            console.log('   ✅ SERVICE RESTORED! Database accepting connections.');
        } else {
            process.stdout.write('.');
            await sleep(WAIT_INTERVAL_MS);
        }
    }

    const ttr = (recoveryFinish - recoveryStart) / 1000;
    const totalDowntime = (recoveryFinish - failStart) / 1000;

    console.log(`   ⏱️ Time to Recover (TTR): ${ttr}s`);
    console.log(`   📉 Total Downtime: ${totalDowntime}s`);

    // 6. Generate Analysis Report
    const reportDate = new Date().toISOString().split('T')[0];
    const reportPath = path.join(process.cwd(), `incident_report_simulation_${Date.now()}.md`);

    const reportContent = `# Incident Post-Mortem (Simulated)

**Date**: ${new Date().toISOString()}
**Incident Type**: P1 - Total Database Outage (Simulated)
**Simulation Script**: \`scripts/simulate_p1.ts\`

## Timeline
*   **Failure Induced**: ${new Date(failStart).toISOString()}
*   **Detection**: ${new Date(detectionTime).toISOString()} (TTD: ${ttd}s)
*   **Recovery Started**: ${new Date(recoveryStart).toISOString()}
*   **Service Restored**: ${new Date(recoveryFinish).toISOString()} (TTR: ${ttr}s)

## Metrics
*   **SLO Status**: ${ttr < 900 ? '✅ MET (<15m)' : '❌ MISSED (>15m)'}
*   **Total Downtime**: ${totalDowntime}s

## Root Cause Analysis
*   **Direct Cause**: Intentional execution of \`docker stop\` command on primary database container.
*   **Detection Mechanism**: Application health checks failed immediately upon connection loss.
*   **Recovery Action**: Container restart via Docker daemon.

## Action Items
*   [ ] Verify automated alerts (Prometheus/PagerDuty) triggered during this window.
*   [ ] Ensure application reconnected automatically without manual restart (Confirmed: ${await checkHealth()}).
`;

    fs.writeFileSync(reportPath, reportContent);
    console.log(`\n📄 Post-Mortem Report generated: ${reportPath}`);

    await prisma.$disconnect();
}

main();
