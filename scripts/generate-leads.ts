
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Generating Mock Leads...');

    const rep = await prisma.user.findUnique({ where: { email: 'rep@diligentos.com' } });
    if (!rep) {
        console.log('Rep user not found, run seed first.');
        return;
    }

    const industries = ['Tech', 'Medical', 'Manufacturing', 'Retail', 'Logistics'];
    const stages = ['COLD', 'WARM', 'HOT', 'QUOTE', 'WON', 'LOST'];

    for (let i = 0; i < 20; i++) {
        await prisma.lead.create({
            data: {
                name: `Lead Company ${i + 1}`,
                address: `${100 + i} Main St, Cityville`,
                phone: `555-01${i.toString().padStart(2, '0')}`,
                stage: stages[Math.floor(Math.random() * stages.length)],
                assignedToId: rep.id,
                // We don't have industry column in schema yet? 
                // Wait, let me check schema. Lead model has name, address, phone, stage.
                // It does NOT have industry.
                // But the UI uses it.
            }
        });
    }
    console.log('Created 20 mock leads.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
