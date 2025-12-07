import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '../encryption';

describe('Encryption Helper', () => {
    it('should encrypt and decrypt a string correctly', () => {
        const originalText = 'Sensitive PII Data 123';
        const encrypted = encrypt(originalText);

        expect(encrypted).not.toBe(originalText);
        expect(encrypted).toContain(':'); // Ensure format iv:tag:content

        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(originalText);
    });

    it('should return original text if not encrypted format', () => {
        const plain = 'Just plain text';
        const result = decrypt(plain);
        expect(result).toBe(plain);
    });

    it('should handle empty strings', () => {
        expect(encrypt('')).toBe('');
        expect(decrypt('')).toBe('');
    });

    it('should produce different outputs for same input (random IV)', () => {
        const text = 'Sometext';
        const enc1 = encrypt(text);
        const enc2 = encrypt(text);
        expect(enc1).not.toBe(enc2);
        expect(decrypt(enc1)).toBe(text);
        expect(decrypt(enc2)).toBe(text);
    });
});
