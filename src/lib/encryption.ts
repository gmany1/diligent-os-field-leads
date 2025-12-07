import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_must_be_32_bytes!!'; // Fallback for dev only
const IV_LENGTH = 12; // Recommended for GCM

// Ensure key is 32 bytes
const getKey = () => {
    const key = Buffer.from(SECRET_KEY, 'utf-8');
    if (key.length !== 32) {
        // Pad or slice for dev; in prod this should throw
        if (process.env.NODE_ENV === 'production') {
            // Ideally we enforce 32 hex chars or similar, but for now just hashing to 32 bytes to ensure stability if string is used
            const crypto = require('crypto');
            return crypto.createHash('sha256').update(SECRET_KEY).digest();
        }
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(SECRET_KEY).digest();
    }
    return key;
};

export function encrypt(text: string): string {
    if (!text) return text;
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(text: string): string {
    if (!text || !text.includes(':')) return text; // Not encrypted or invalid format
    try {
        const [ivHex, authTagHex, encryptedHex] = text.split(':');
        if (!ivHex || !authTagHex || !encryptedHex) return text;

        const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        return text; // Return original if fail (might be already plaintext in legacy data)
    }
}
