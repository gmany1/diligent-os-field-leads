import { type Lead, type User } from '@prisma/client';

// --- Types ---

export interface RawCSVRow {
    lead_name?: string;
    address?: string;
    phone?: string;
    contact_name_number?: string;
    industry?: string;
    quote_given?: string;
    source_sheet?: string;
    extraction_date?: string;
    // Dynamic follow-up columns (e.g., "follow_up_1", "follow_up_2")
    [key: string]: string | undefined;
}

export interface NormalizedContact {
    name: string;
    phone: string; // E.164 format
    email?: string;
    role?: string;
}

export interface NormalizedActivity {
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'STATUS_CHANGE';
    content: string;
    date: Date;
    performedBy?: string; // Extracted from text if possible
}

export interface NormalizedQuote {
    amount: number;
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    createdAt: Date;
}

export interface NormalizedLead {
    name: string;
    address?: string;
    industry?: string;
    source?: string;
    status: 'COLD' | 'WARM' | 'HOT' | 'WON' | 'LOST';
    contacts: NormalizedContact[];
    activities: NormalizedActivity[];
    quotes: NormalizedQuote[];
    originalData: RawCSVRow; // Keep reference for audit
}

// --- Transformation Logic ---

export function normalizePhone(raw?: string): string | undefined {
    if (!raw) return undefined;
    // Remove non-digits
    const digits = raw.replace(/\D/g, '');
    // Basic US/North America logic: if 10 digits, add +1. If 11 and starts with 1, add +.
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    // Fallback: return as is if it looks like a phone number, or undefined
    return digits.length > 7 ? `+${digits}` : undefined;
}

export function parseFollowUps(row: RawCSVRow): NormalizedActivity[] {
    const activities: NormalizedActivity[] = [];

    // Iterate through keys to find follow_up_*
    Object.keys(row).forEach(key => {
        if (key.startsWith('follow_up_') && row[key]) {
            const content = row[key] as string;
            // Heuristic: Try to extract date from content (e.g., "10/12/2024 - Called John")
            // This is a simplified regex for MM/DD/YYYY or YYYY-MM-DD
            const dateMatch = content.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{4}-\d{2}-\d{2})/);
            let date = new Date(); // Default to now if no date found (or extraction_date)

            if (dateMatch) {
                const parsedDate = new Date(dateMatch[0]);
                if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate;
                }
            }

            activities.push({
                type: 'NOTE', // Default to NOTE, could infer CALL/EMAIL from keywords
                content: content,
                date: date,
            });
        }
    });

    return activities.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function parseQuote(raw?: string): NormalizedQuote | undefined {
    if (!raw) return undefined;
    // Extract currency value
    const amountMatch = raw.match(/(\d{1,3}(,\d{3})*(\.\d{2})?)/);
    if (amountMatch) {
        const amount = parseFloat(amountMatch[0].replace(/,/g, ''));
        return {
            amount,
            status: 'SENT', // Assume sent if recorded
            createdAt: new Date(), // Unknown date, default to now
        };
    }
    return undefined;
}

export function mapRowToEntity(row: RawCSVRow): NormalizedLead {
    // 1. Lead Basic Info
    const name = row.lead_name || row.address || 'Unknown Lead';

    // Status Inference Logic
    let status: 'COLD' | 'WARM' | 'HOT' | 'WON' | 'LOST' = 'COLD';
    const rawStatus = (row.status || row.estado || '').toLowerCase();
    const quoteGiven = row.quote_given || '';

    if (rawStatus.includes('won') || rawStatus.includes('ganado') || rawStatus.includes('sold') || rawStatus.includes('vendido')) {
        status = 'WON';
    } else if (rawStatus.includes('lost') || rawStatus.includes('perdido') || rawStatus.includes('not interested')) {
        status = 'LOST';
    } else if (quoteGiven || rawStatus.includes('hot') || rawStatus.includes('caliente')) {
        status = 'HOT';
    } else if (rawStatus.includes('warm') || rawStatus.includes('tibio')) {
        status = 'WARM';
    }

    // 2. Contacts
    const contacts: NormalizedContact[] = [];
    // Try 'phone' column
    if (row.phone) {
        const p = normalizePhone(row.phone);
        if (p) contacts.push({ name: 'Primary', phone: p });
    }
    // Try 'contact_name_number' column (often mixed "John 555-1234")
    if (row.contact_name_number) {
        // Simple split strategy
        const parts = row.contact_name_number.split(/[\s,]+/);
        const potentialPhone = parts.find(p => /\d{7,}/.test(p));
        const potentialName = parts.filter(p => !/\d{7,}/.test(p)).join(' ');

        if (potentialPhone) {
            const p = normalizePhone(potentialPhone);
            if (p) contacts.push({ name: potentialName || 'Contact', phone: p });
        }
    }

    // 3. Activities
    const activities = parseFollowUps(row);

    // Capture generic "Notes" or "Comments" columns
    const noteContent = row.notes || row.notas || row.comments || row.comentarios || row.description || row.descripcion;
    if (noteContent) {
        activities.push({
            type: 'NOTE',
            content: noteContent,
            date: new Date(), // Default to now
        });
    }

    // 4. Quotes
    const quotes: NormalizedQuote[] = [];
    const q = parseQuote(row.quote_given);
    if (q) quotes.push(q);

    return {
        name,
        address: row.address,
        industry: row.industry,
        source: row.source_sheet, // Track which sheet it came from
        status,
        contacts,
        activities,
        quotes,
        originalData: row
    };
}
