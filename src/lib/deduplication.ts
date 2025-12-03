import { get } from 'fast-levenshtein';
import { type NormalizedLead } from './migration';

export interface DuplicateGroup {
    id: string;
    leads: NormalizedLead[];
    confidence: number;
    reason: string[];
}

// Configuration for matching
const THRESHOLDS = {
    NAME_SIMILARITY: 3, // Levenshtein distance (lower is closer)
    ADDRESS_SIMILARITY: 0.8, // 0-1 scale (higher is closer)
};

function calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    if (longer.length === 0) return 1.0;
    const distance = get(str1, str2);
    return (longer.length - distance) / longer.length;
}

export function findDuplicates(leads: NormalizedLead[]): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processedIndices = new Set<number>();

    for (let i = 0; i < leads.length; i++) {
        if (processedIndices.has(i)) continue;

        const currentLead = leads[i];
        const group: NormalizedLead[] = [currentLead];
        const reasons: Set<string> = new Set();
        let maxConfidence = 0;

        for (let j = i + 1; j < leads.length; j++) {
            if (processedIndices.has(j)) continue;

            const otherLead = leads[j];
            let isMatch = false;
            let confidence = 0;

            // 1. Exact Phone Match (High Confidence)
            const currentPhone = currentLead.contacts[0]?.phone;
            const otherPhone = otherLead.contacts[0]?.phone;

            if (currentPhone && otherPhone && currentPhone === otherPhone) {
                isMatch = true;
                confidence = 1.0;
                reasons.add('Exact Phone Match');
            }

            // 2. Name Levenshtein Match (High Confidence)
            const nameDistance = get(currentLead.name.toLowerCase(), otherLead.name.toLowerCase());
            if (nameDistance <= THRESHOLDS.NAME_SIMILARITY) {
                isMatch = true;
                confidence = Math.max(confidence, 0.9);
                reasons.add(`Similar Company Name (Dist: ${nameDistance})`);
            }

            // 3. Contact Name Match (Medium Confidence)
            const currentContact = currentLead.contacts[0]?.name;
            const otherContact = otherLead.contacts[0]?.name;
            if (currentContact && otherContact && currentContact !== 'Primary' && otherContact !== 'Primary') {
                const contactDistance = get(currentContact.toLowerCase(), otherContact.toLowerCase());
                if (contactDistance <= 2) {
                    isMatch = true;
                    confidence = Math.max(confidence, 0.8);
                    reasons.add(`Similar Contact Name (${currentContact})`);
                }
            }

            if (isMatch) {
                group.push(otherLead);
                processedIndices.add(j);
                maxConfidence = Math.max(maxConfidence, confidence);
            }
        }

        if (group.length > 1) {
            processedIndices.add(i);
            groups.push({
                id: `group_${i}`,
                leads: group,
                confidence: maxConfidence,
                reason: Array.from(reasons),
            });
        }
    }

    return groups;
}

export function mergeLeads(leads: NormalizedLead[]): NormalizedLead {
    // Simple merge strategy: Take the first one as base, append unique info from others
    const base = { ...leads[0] };

    for (let i = 1; i < leads.length; i++) {
        const other = leads[i];

        // Merge activities
        // Merge activities
        base.activities = [...base.activities, ...other.activities].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });

        // Merge quotes
        base.quotes = [...base.quotes, ...other.quotes];

        // Merge contacts (simple uniq by phone)
        other.contacts.forEach(c => {
            if (!base.contacts.find(bc => bc.phone === c.phone)) {
                base.contacts.push(c);
            }
        });

        // Append source info
        base.source = `${base.source}, ${other.source}`;
    }

    return base;
}
