export interface DocumentData {
    name: string;
    documentNumber: string;
    expirationDate: string;
    documentType: 'PAN' | 'DL' | 'PASSPORT' | null;
}

export interface ScanResult {
    text: string;
    confidence: number;
}

export interface ScanError {
    type: 'PROCESSING_ERROR' | 'NO_DATA_FOUND' | 'INVALID_IMAGE';
    message: string;
}