import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    console.log('\n📊 VERIFICACIÓN DE BASE DE DATOS\n');
    console.log('='.repeat(50));

    // 1. Sucursales
    const branches = await prisma.branch.findMany();
    console.log(`\n🏢 SUCURSALES: ${branches.length}`);
    branches.forEach(b => console.log(`   - ${b.name} (${b.code}) - ${b.city}, ${b.state}`));

    // 2. Usuarios
    const users = await prisma.user.findMany({ include: { branch: true } });
    console.log(`\n👥 USUARIOS: ${users.length}`);

    const usersByRole = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    Object.entries(usersByRole).forEach(([role, count]) => {
        console.log(`   - ${role}: ${count}`);
    });

    // 3. Leads
    const leads = await prisma.lead.findMany({ include: { branch: true } });
    console.log(`\n📊 LEADS: ${leads.length}`);

    const leadsByStage = leads.reduce((acc, l) => {
        acc[l.stage] = (acc[l.stage] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log('   Por etapa:');
    Object.entries(leadsByStage).forEach(([stage, count]) => {
        console.log(`   - ${stage}: ${count}`);
    });

    const leadsByBranch = leads.reduce((acc, l) => {
        const branchName = l.branch?.name || 'Sin sucursal';
        acc[branchName] = (acc[branchName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log('   Por sucursal:');
    Object.entries(leadsByBranch).forEach(([branch, count]) => {
        console.log(`   - ${branch}: ${count}`);
    });

    const leadsBySource = leads.reduce((acc, l) => {
        const source = l.source || 'MANUAL';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log('   Por fuente:');
    Object.entries(leadsBySource).forEach(([source, count]) => {
        console.log(`   - ${source}: ${count}`);
    });

    // 4. Actividades
    const activities = await prisma.activity.findMany();
    console.log(`\n📝 ACTIVIDADES: ${activities.length}`);

    const activitiesByType = activities.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    Object.entries(activitiesByType).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count}`);
    });

    const avgActivitiesPerLead = (activities.length / leads.length).toFixed(2);
    console.log(`   Promedio por lead: ${avgActivitiesPerLead}`);

    // 5. Cotizaciones
    const quotes = await prisma.quote.findMany();
    console.log(`\n💰 COTIZACIONES: ${quotes.length}`);

    const quotesByStatus = quotes.reduce((acc, q) => {
        acc[q.status] = (acc[q.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    Object.entries(quotesByStatus).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
    });

    const totalQuoteAmount = quotes.reduce((sum, q) => sum + q.amount, 0);
    console.log(`   Total en cotizaciones: $${totalQuoteAmount.toLocaleString()}`);

    // 6. Comisiones
    const commissions = await prisma.commission.findMany();
    console.log(`\n💵 COMISIONES: ${commissions.length}`);

    const commissionsByStatus = commissions.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    Object.entries(commissionsByStatus).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
    });

    const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
    const paidCommissions = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);
    console.log(`   Total comisiones: $${totalCommissions.toLocaleString()}`);
    console.log(`   Comisiones pagadas: $${paidCommissions.toLocaleString()}`);
    console.log(`   Comisiones pendientes: $${(totalCommissions - paidCommissions).toLocaleString()}`);

    // 7. Auditorías
    const audits = await prisma.auditLog.findMany();
    console.log(`\n📋 AUDITORÍAS: ${audits.length}`);

    const auditsByAction = audits.reduce((acc, a) => {
        acc[a.action] = (acc[a.action] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    Object.entries(auditsByAction).forEach(([action, count]) => {
        console.log(`   - ${action}: ${count}`);
    });

    // Rango de fechas
    const oldestLead = leads.reduce((oldest, lead) =>
        lead.createdAt < oldest.createdAt ? lead : oldest
    );
    const newestLead = leads.reduce((newest, lead) =>
        lead.createdAt > newest.createdAt ? lead : newest
    );

    console.log(`\n📅 RANGO DE FECHAS:`);
    console.log(`   Más antiguo: ${oldestLead.createdAt.toLocaleDateString()}`);
    console.log(`   Más reciente: ${newestLead.createdAt.toLocaleDateString()}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Verificación completada\n');
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
