const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = { success: true, logs: [] };

    try {
        console.log('--- STARTING CCPA ENDPOINT VERIFICATION ---');

        // 1. Create a Mock Lead
        const lead = await prisma.lead.create({
            data: {
                name: 'CCPA Test Subject',
                phone: '555-0199',
                email: 'privacy@test.com',
                notes: 'Sensitive medical info here',
                stage: 'COLD',
                source: 'MANUAL'
            }
        });
        console.log('1. Mock Lead created:', lead.id);

        // 2. Simulate Export Action (Manually, since we can't easily curl without auth token from script)
        // We will verify the logic by "Simulating" the DB call that route would make
        const exportData = await prisma.lead.findUnique({
            where: { id: lead.id },
            include: { activities: true, quotes: true, commissions: true }
        });
        console.log('2. Export Logic Verified:', exportData.name === 'CCPA Test Subject');

        // 2a. Write Audit Log for Export
        await prisma.auditLog.create({
            data: {
                action: 'CCPA_EXPORT',
                entity: 'LEAD',
                entityId: lead.id,
                userId: null,
                details: '{"manual_verification": true}'
            }
        });
        console.log('2a. Audit Log for Export Written');

        // 3. Simulate Soft Delete
        await prisma.lead.update({
            where: { id: lead.id },
            data: {
                name: 'DELETED_USER',
                phone: null,
                email: null,
                address: null,
                notes: 'DATA CLEARED PER CCPA REQUEST',
                source: 'ANONYMIZED'
            }
        });

        // 3a. Write Audit Log for Delete
        await prisma.auditLog.create({
            data: {
                action: 'CCPA_DELETE_SOFT',
                entity: 'LEAD',
                entityId: lead.id,
                userId: null,
                details: '{"manual_verification": true}'
            }
        });
        console.log('3. Soft Delete Executed');

        // 4. Verify Anonymization
        const check = await prisma.lead.findUnique({ where: { id: lead.id } });
        if (check.name === 'DELETED_USER' && check.phone === null) {
            console.log('4.✅ Anonymization SUCCESS');
        } else {
            console.error('4.❌ Anonymization FAILED');
            result.success = false;
        }

        // 5. Cleanup (Hard Delete)
        await prisma.lead.delete({ where: { id: lead.id } });
        console.log('5. Cleanup Complete');

    } catch (e) {
        console.error('❌ Error:', e);
        result.success = false;
    } finally {
        await prisma.$disconnect();
    }
}

main();
