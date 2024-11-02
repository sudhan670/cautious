import { parse, isValid } from 'date-fns';
import type { DocumentData } from '../types';

const findName = (text: string): string | null => {
    const normalizedText = text.toUpperCase().replace(/\s+/g, ' ');
    const lines = normalizedText.split('\n').map(line => line.trim());

    // Special handling for PAN card format
    if (text.includes('INCOME TAX DEPARTMENT') || text.match(/[A-Z]{5}[0-9]{4}[A-Z]/)) {
        // In PAN cards, typically the first non-empty line after "PERMANENT ACCOUNT NUMBER"
        // or "INCOME TAX DEPARTMENT" contains the person's name
        const panIndex = lines.findIndex(line =>
            line.includes('PERMANENT ACCOUNT NUMBER') ||
            line.includes('INCOME TAX DEPARTMENT')
        );

        if (panIndex !== -1) {
            // Look for the first non-empty line after the header that matches name format
            for (let i = panIndex + 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && /^[A-Z][A-Z\s.'-]{2,}$/.test(line)) {
                    const formattedName = line
                        .split(/\s+/)
                        .map(part => part.charAt(0) + part.slice(1).toLowerCase())
                        .join(' ');
                    return formattedName;
                }
            }
        }
    }

    // Patterns for other document types
    const patterns = [
        // Passport style
        /(?:GIVEN NAME[S]?|SURNAME|NOM|PRENOM)[\s:]+([A-Z][A-Z\s.'-]{2,}(?:\s+[A-Z][A-Z\s.'-]{2,}){0,3})/,

        // Driver's License style
        /(?:NAME|^)[\s:]+([A-Z][A-Z\s.'-]{2,}(?:\s+[A-Z][A-Z\s.'-]{2,}){0,3})/m,

        // Generic name pattern
        /\b([A-Z][A-Z\s.'-]{2,}(?:\s+[A-Z][A-Z\s.'-]{2,}){1,3})\b/
    ];

    for (const pattern of patterns) {
        const match = normalizedText.match(pattern);
        if (match) {
            const rawName = match[1].trim();
            const formattedName = rawName
                .split(/\s+/)
                .map(part => part.charAt(0) + part.slice(1).toLowerCase())
                .join(' ');

            if (formattedName.length > 2 && formattedName.length < 50 && /^[A-Z][a-z]/.test(formattedName)) {
                return formattedName;
            }
        }
    }

    return null;
};

const findDocumentNumber = (text: string): string | null => {
    const patterns = [
        // PAN Card (10 characters: AAAPL1234C format)
        /(?:PERMANENT\s+ACCOUNT\s+NUMBER|PAN)?\s*([A-Z]{5}[0-9]{4}[A-Z])/i,

        // Driver's License
        /(?:DL(?:\.|\s)?NO(?:\.|\s)?|LICENCE(?:\s)?NO(?:\.|\s)?|#)[\s:]*([A-Z0-9]{6,16})/i,

        // Passport
        /(?:PASSPORT\s+NO(?:\.|\s)?|^)[\s:]*([A-Z][0-9]{7}|[A-Z0-9]{9})/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }
    return null;
};

const findExpirationDate = (text: string): string | null => {
    if (text.includes('INCOME TAX DEPARTMENT') || text.match(/[A-Z]{5}[0-9]{4}[A-Z]/)) {
        return '9999-12-31';
    }

    const datePatterns = [
        /(?:EXP(?:IRY|IRES)?(?:\.|\s)?|VALID(?:\sUNTIL)?(?:\.|\s)?|DATE\sOF\sEXPIRY)[\s:]*(\d{2}[\s-](?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\s-]\d{4})/i,
        /(?:EXP(?:IRY|IRES)?(?:\.|\s)?|VALID(?:\sUNTIL)?(?:\.|\s)?)[\s:]*(\d{2}[-/.]\d{2}[-/.]\d{4})/i,
        /(?:EXP(?:IRY|IRES)?(?:\.|\s)?|VALID(?:\sUNTIL)?(?:\.|\s)?)[\s:]*(\d{4}[-/.]\d{2}[-/.]\d{2})/i
    ];

    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            const dateStr = match[1];
            const formats = ['dd MMM yyyy', 'MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd'];

            for (const format of formats) {
                const parsed = parse(dateStr, format, new Date());
                if (isValid(parsed)) {
                    return parsed.toISOString().split('T')[0];
                }
            }
        }
    }

    return null;
};

const detectDocumentType = (text: string): 'PAN' | 'DL' | 'PASSPORT' | null => {
    const normalizedText = text.toUpperCase();

    if (normalizedText.includes('INCOME TAX DEPARTMENT') ||
        normalizedText.includes('PERMANENT ACCOUNT NUMBER') ||
        text.match(/[A-Z]{5}[0-9]{4}[A-Z]/)) {
        return 'PAN';
    }

    if (normalizedText.match(/DRIVING LICEN[SC]E|DRIVER'?S LICEN[SC]E|DL NO/)) {
        return 'DL';
    }

    if (normalizedText.match(/PASSPORT|REPUBLIC OF INDIA.*PASSPORT|PASS(?:\s)?PORT/)) {
        return 'PASSPORT';
    }

    return null;
};

export const extractDocumentData = (text: string): DocumentData | null => {
    const documentType = detectDocumentType(text);
    const name = findName(text);
    const documentNumber = findDocumentNumber(text);
    const expirationDate = findExpirationDate(text);

    if (name && documentNumber && (expirationDate || documentType === 'PAN')) {
        return {
            name,
            documentNumber,
            expirationDate: expirationDate || '9999-12-31',
            documentType
        };
    }

    return null;
};