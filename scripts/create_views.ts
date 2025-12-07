
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Creating Views...');

        // 1. vw_pipeline_summary
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW vw_pipeline_summary AS
            SELECT 
                stage, 
                COUNT(*) as count, 
                'Unknown' as value -- Placeholder until we have deal value in Lead or join with Quote
            FROM "Lead"
            GROUP BY stage;
        `);
        console.log('✅ vw_pipeline_summary created');

        // 2. vw_conversion_rates (Simplified global conversion)
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW vw_conversion_rates AS
            SELECT 
                (SELECT COUNT(*) FROM "Lead") as total_leads,
                (SELECT COUNT(*) FROM "Lead" WHERE stage = 'QUOTE') as quoted_leads,
                (SELECT COUNT(*) FROM "Lead" WHERE stage = 'WON') as won_leads,
                CASE 
                    WHEN (SELECT COUNT(*) FROM "Lead") > 0 
                    THEN ((SELECT COUNT(*) FROM "Lead" WHERE stage = 'WON')::float / (SELECT COUNT(*) FROM "Lead")::float) * 100 
                    ELSE 0 
                END as conversion_rate;
        `);
        console.log('✅ vw_conversion_rates created');

        // 3. vw_commissions_summary
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW vw_commissions_summary AS
            SELECT 
                u.name as rep_name,
                c.status,
                SUM(c.amount) as total_amount,
                COUNT(c.id) as count
            FROM "Commission" c
            JOIN "User" u ON c."userId" = u.id
            GROUP BY u.name, c.status;
        `);
        console.log('✅ vw_commissions_summary created');

        // 4. vw_activity_stats
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW vw_activity_stats AS
            SELECT 
                u.name as user_name,
                a.type,
                COUNT(a.id) as count,
                DATE(a."createdAt") as activity_date
            FROM "Activity" a
            JOIN "User" u ON a."userId" = u.id
            GROUP BY u.name, a.type, DATE(a."createdAt");
        `);
        console.log('✅ vw_activity_stats created');

        // 5. vw_ccpa_activity
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW vw_ccpa_activity AS
            SELECT 
                action,
                COUNT(*) as count,
                MAX("createdAt") as last_action
            FROM "AuditLog"
            WHERE action LIKE 'CCPA_%' OR action IN ('EXPORT', 'DELETE')
            GROUP BY action;
        `);
        console.log('✅ vw_ccpa_activity created');

        // 6. vw_system_health (Based on logs/activity volume)
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW vw_system_health AS
            SELECT 
                COUNT(*) as log_volume_24h,
                SUM(CASE WHEN action LIKE '%ERROR%' OR action LIKE '%FAIL%' THEN 1 ELSE 0 END) as error_count_24h
            FROM "AuditLog"
            WHERE "createdAt" > NOW() - INTERVAL '24 hours';
        `);
        console.log('✅ vw_system_health created');

    } catch (e) {
        console.error('Error creating views:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
