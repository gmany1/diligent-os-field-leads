import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import fs from 'fs';
import path from 'path';
import { type NormalizedLead } from '@/lib/migration';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api/migration');

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to read/write DB (same as in main API, duplicated for simplicity in this migration script)
const getDb = () => {
    if (!fs.existsSync(DB_PATH)) return { leads: [], users: [], activities: [], quotes: [] };
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const saveDb = (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

app.post('/import', async (c) => {
    try {
        const contentType = c.req.header('Content-Type') || '';

        // CASE 1: File Upload (Parsing)
        if (contentType.includes('multipart/form-data')) {
            const body = await c.req.parseBody();
            const file = body['file'];

            if (!file || !(file instanceof File)) {
                return c.json({ error: 'No file uploaded' }, 400);
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const XLSX = await import('xlsx');
            const workbook = XLSX.read(buffer, { type: 'buffer' });

            let allNormalizedData: any[] = [];

            // Iterate over all sheets
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];

                // 1. Convert to array of arrays to find the header row
                const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                // 2. Find the header row index
                let headerRowIndex = 0;
                for (let i = 0; i < Math.min(rawRows.length, 10); i++) { // Check first 10 rows
                    const rowStr = JSON.stringify(rawRows[i]).toLowerCase();
                    if (rowStr.includes('address') && (rowStr.includes('lead') || rowStr.includes('name') || rowStr.includes('contact'))) {
                        headerRowIndex = i;
                        break;
                    }
                }

                // 3. Parse with the correct header row
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex });

                // Normalization for this sheet
                const sheetData = jsonData.map((row: any) => {
                    const normalizedRow: any = {};
                    Object.keys(row).forEach(key => {
                        const cleanKey = key.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
                        normalizedRow[cleanKey] = row[key];
                    });

                    // Map fields
                    const name = normalizedRow['lead name'] || normalizedRow['company'] || normalizedRow['name'] || 'Unknown';
                    const address = normalizedRow['address'] || '';
                    const industry = normalizedRow['industry'] || '';
                    const contactName = normalizedRow['contact name'] || 'Primary';
                    const contactPhone = normalizedRow['contact number'] || normalizedRow['phone'] || '';
                    const contactEmail = normalizedRow['email address'] || normalizedRow['email'] || '';

                    // Status Inference
                    let status = 'COLD';
                    const rawStatus = (normalizedRow['status'] || normalizedRow['estado'] || '').toLowerCase();
                    const quoteGiven = normalizedRow['quote given'] || normalizedRow['quote'] || '';

                    if (rawStatus.includes('won') || rawStatus.includes('ganado') || rawStatus.includes('sold') || rawStatus.includes('vendido')) {
                        status = 'WON';
                    } else if (rawStatus.includes('lost') || rawStatus.includes('perdido') || rawStatus.includes('not interested')) {
                        status = 'LOST';
                    } else if (quoteGiven || rawStatus.includes('hot') || rawStatus.includes('caliente')) {
                        status = 'HOT';
                    } else if (rawStatus.includes('warm') || rawStatus.includes('tibio')) {
                        status = 'WARM';
                    }

                    // Map Activities
                    const activities: any[] = [];

                    // 1. Notes (Robust matching)
                    const noteContent = normalizedRow['notes'] || normalizedRow['notas'] || normalizedRow['comments'] || normalizedRow['comentarios'] || normalizedRow['description'] || normalizedRow['descripcion'];
                    if (noteContent) {
                        activities.push({
                            content: noteContent,
                            type: 'NOTE',
                            date: new Date().toISOString()
                        });
                    }

                    // 2. Follow Ups
                    Object.keys(normalizedRow).forEach(key => {
                        if (key.startsWith('follow up') || key.startsWith('follow_up')) {
                            const content = normalizedRow[key];
                            if (content && typeof content === 'string' && content.trim().length > 0) {
                                const dateMatch = content.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
                                let date = new Date().toISOString();
                                if (dateMatch) {
                                    try {
                                        date = new Date(dateMatch[0]).toISOString();
                                    } catch (e) { }
                                }

                                activities.push({
                                    content: content,
                                    type: 'FOLLOW_UP',
                                    date: date
                                });
                            }
                        }
                    });

                    return {
                        originalData: row,
                        name: name,
                        address: address,
                        industry: industry,
                        source: `Import - ${sheetName}`,
                        status: status,
                        contacts: [{
                            name: contactName,
                            phone: contactPhone,
                            email: contactEmail
                        }],
                        activities: activities,
                        quotes: []
                    };
                });

                allNormalizedData = [...allNormalizedData, ...sheetData];
            });

            return c.json({ success: true, data: allNormalizedData });

        }

        // CASE 2: JSON Data (Saving to DB)
        else if (contentType.includes('application/json')) {
            const body = await c.req.json();
            console.log('Received import request with leads:', body.leads?.length);
            const leadsToImport: NormalizedLead[] = body.leads;

            if (!leadsToImport || !Array.isArray(leadsToImport)) {
                return c.json({ error: 'Invalid data format' }, 400);
            }

            const db = getDb();
            let importedCount = 0;

            const userId = body.userId || 'user_field_rep_1';

            leadsToImport.forEach((normalizedLead) => {
                // 1. Create Lead
                const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newLead = {
                    id: leadId,
                    name: normalizedLead.name,
                    email: normalizedLead.contacts[0]?.email || `lead_${leadId}@example.com`, // Fallback
                    phone: normalizedLead.contacts[0]?.phone || '',
                    address: normalizedLead.address || '',
                    industry: normalizedLead.industry || '',
                    source: normalizedLead.source || 'Migration',
                    status: normalizedLead.status || 'COLD',
                    value: 0, // Default
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId: userId, // Assign to current user
                };
                db.leads.push(newLead);

                // 2. Create Activities
                normalizedLead.activities.forEach((activity) => {
                    db.activities.push({
                        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        leadId: leadId,
                        type: activity.type,
                        content: activity.content,
                        createdAt: new Date(activity.date).toISOString(),
                        userId: userId, // Assign to current user
                    });
                });

                // 3. Create Quotes
                normalizedLead.quotes.forEach((quote) => {
                    db.quotes.push({
                        id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        leadId: leadId,
                        amount: quote.amount,
                        status: quote.status,
                        createdAt: new Date(quote.createdAt).toISOString(),
                        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                    });
                    // Update lead value if quote exists
                    newLead.value += quote.amount;
                });

                importedCount++;
            });

            saveDb(db);

            return c.json({ success: true, importedCount });
        }

        return c.json({ error: 'Unsupported Content-Type' }, 400);

    } catch (error: any) {
        console.error('Import error:', error);
        return c.json({ error: error.message || 'Internal Server Error' }, 500);
    }
});

export const GET = handle(app);
export const POST = handle(app);
