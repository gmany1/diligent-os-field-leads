import { describe, it, expect } from 'vitest';
import { LeadSchema, CreateLeadSchema, RegisterUserSchema, LeadStage } from '../schemas';

describe('Zod Schemas Validation', () => {

    describe('LeadSchema', () => {
        it('should validate a correct lead', () => {
            const validLead = {
                name: 'Valid Name',
                phone: '+1234567890',
                stage: LeadStage.COLD,
                notes: 'Some notes'
            };
            const result = LeadSchema.safeParse(validLead);
            expect(result.success).toBe(true);
        });

        it('should fail with short name', () => {
            const invalidLead = {
                name: 'A',
                items: []
            };
            const result = LeadSchema.safeParse(invalidLead);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('at least 2 characters');
            }
        });

        it('should fail with invalid phone', () => {
            const invalidLead = {
                name: 'Valid Name',
                phone: '123' // Too short
            };
            const result = LeadSchema.safeParse(invalidLead);
            expect(result.success).toBe(false);
        });
    });

    describe('RegisterUserSchema', () => {
        it('should validate correct user registration', () => {
            const validUser = {
                email: 'test@example.com',
                password: 'password123',
                name: 'John Doe',
                role: 'FIELD_LEAD_REP'
            };
            const result = RegisterUserSchema.safeParse(validUser);
            expect(result.success).toBe(true);
        });

        it('should reject short password', () => {
            const invalidUser = {
                email: 'test@example.com',
                password: '123',
                name: 'John Doe',
                role: 'FIELD_LEAD_REP'
            };
            const result = RegisterUserSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });
    });
});
