import { useState } from 'react';
import { ScanLine } from 'lucide-react';
import Scanner from './components/Scanner';
import ResultDisplay from './components/ResultDisplay';
import type { DocumentData } from './types';

function App() {
    const [scannedData, setScannedData] = useState<DocumentData | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <ScanLine className="h-8 w-8 text-blue-600" />
                        <h1 className="ml-3 text-2xl font-bold text-gray-900">
                            Document Scanner
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {scannedData ? (
                        <ResultDisplay
                            data={scannedData}
                            onReset={() => setScannedData(null)}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Scan Your Document
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    Position your passport, driver's license, or PAN card in the camera frame
                                </p>
                            </div>
                            <Scanner onScanComplete={setScannedData} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;