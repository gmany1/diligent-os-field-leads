import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAIL'
    | 'EXPORT';

export type AuditEntity =
    | 'LEAD'
    | 'ACTIVITY'
    | 'QUOTE'
    | 'COMMISSION'
    | 'USER'
    | 'AUTH';

interface AuditLogParams {
    userId?: string;
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    details?: Record<string, any>;
}

export async function logAudit(params: AuditLogParams) {
    try {
        const headersList = await headers();
        const ipAddress = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        await prisma.auditLog.create({
            data: {
                userId: params.userId,
                action: params.action,
                entity: params.entity,
                entityId: params.entityId,
                details: params.details ? JSON.stringify(params.details) : null,
                ipAddress,
                userAgent,
            },
        });
    } catch (error) {
        // Audit logging should not break the application flow, but we should log the error
        console.error('FAILED_TO_AUDIT:', error);
    }
}
