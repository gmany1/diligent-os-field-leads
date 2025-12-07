import { z } from 'zod';
// import { Role, LeadStage } from '@prisma/client';

// Define Enums locally to decouple validation logic from DB availability for testing
export enum Role {
    EXECUTIVE = 'EXECUTIVE',
    MANAGER = 'MANAGER',
    FIELD_LEAD_REP = 'FIELD_LEAD_REP',
    IT_ADMIN = 'IT_ADMIN',
}

export enum LeadStage {
    COLD = 'COLD',
    WARM = 'WARM',
    HOT = 'HOT',
    QUOTE = 'QUOTE',
    WON = 'WON',
    LOST = 'LOST',
}

// --- Shared Enums (mapped from Zod to avoid direct excessive Prisma imports in client if needed, though here we use Prisma types for single source of truth where possible) ---

// --- LEAD SCHEMAS ---

export const LeadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().optional().nullable(),
    phone: z.string()
        .min(10, "Phone number too short")
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format (E.164 preferred)")
        .optional()
        .nullable(),
    stage: z.nativeEnum(LeadStage).default(LeadStage.COLD),
    branch: z.string().optional().nullable(),
    industry: z.string().optional().nullable(),
    source: z.string().optional().nullable(),
    notes: z.string().max(1000, "Notes too long").optional().nullable(),
    assignedToId: z.string().cuid().optional().nullable(),
});

export const CreateLeadSchema = LeadSchema.omit({ stage: true }); // Stage usually defaults to COLD
export const UpdateLeadSchema = LeadSchema.partial().extend({
    id: z.string().cuid(),
});

// --- ACTIVITY SCHEMAS ---

export const ActivitySchema = z.object({
    type: z.enum(['CALL', 'EMAIL', 'MEETING', 'NOTE', 'REMINDER', 'HANDOFF']),
    description: z.string().min(1, "Description is required"),
    leadId: z.string().cuid(),
    userId: z.string().optional(), // Often inferred from session
});

// --- USER SCHEMAS ---

export const RegisterUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name required"),
    role: z.nativeEnum(Role).default(Role.FIELD_LEAD_REP),
    territory: z.string().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password required"),
});

// --- AI SCHEMAS ---

export const AIAnalyzeSchema = z.object({
    context: z.enum(['EXECUTIVE', 'MANAGER', 'FIELD_LEAD_REP', 'IT_ADMIN']).optional(),
});

export const AIScoreSchema = z.object({
    leadId: z.string().cuid(),
    transcript: z.string().optional(),
});
