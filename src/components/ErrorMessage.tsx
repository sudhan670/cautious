import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ScanError } from '../types';

const ErrorMessage: React.FC<{
    error: ScanError;
    onDismiss: () => void;
}> = ({ error, onDismiss }) => {
    return (
        <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                        {error.type === 'PROCESSING_ERROR' && 'Error Processing Document'}
                        {error.type === 'NO_DATA_FOUND' && 'No Document Data Found'}
                        {error.type === 'INVALID_IMAGE' && 'Invalid Image'}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{error.message}</p>
                    </div>
                    <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex">
                            <button
                                type="button"
                                onClick={onDismiss}
                                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;