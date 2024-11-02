import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, CreditCard, Car, FileText } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import type { DocumentData, ScanError } from '../types';
import { extractDocumentData } from '../utils/documentParser';
import ErrorMessage from './ErrorMessage';

const Scanner: React.FC<{
    onScanComplete: (data: DocumentData) => void;
}> = ({ onScanComplete }) => {
    const webcamRef = useRef<Webcam>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ScanError | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processImage = async (imageData: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const worker = await createWorker('eng');
            const result = await worker.recognize(imageData);
            await worker.terminate();

            const documentData = extractDocumentData(result.data.text);
            if (documentData) {
                onScanComplete(documentData);
            } else {
                setError({
                    type: 'NO_DATA_FOUND',
                    message: 'Could not find required document information. Please ensure the document is clearly visible and try again.'
                });
            }
        } catch (error) {
            setError({
                type: 'PROCESSING_ERROR',
                message: 'An error occurred while processing the document. Please try again.'
            });
            console.error('Error processing image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            processImage(imageSrc);
        }
    }, [webcamRef]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError({
                    type: 'INVALID_IMAGE',
                    message: 'Please select a valid image file.'
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                processImage(imageData);
            };
            reader.onerror = () => {
                setError({
                    type: 'INVALID_IMAGE',
                    message: 'Failed to read the selected file. Please try again.'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

            <div className="relative rounded-lg overflow-hidden bg-gray-900">
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={capture}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Camera className="w-5 h-5" />
                            {isLoading ? 'Processing...' : 'Capture'}
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Upload className="w-5 h-5" />
                            Upload
                        </button>
                    </div>
                </div>
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Passport</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Car className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Driver's License</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">PAN Card</p>
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
                <p>Make sure the document is well-lit and all text is clearly visible</p>
            </div>
        </div>
    );
};

export default Scanner;