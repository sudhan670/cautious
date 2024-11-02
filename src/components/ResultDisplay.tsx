import React from 'react';
import { CheckCircle, CreditCard, Car, FileText } from 'lucide-react';
import type { DocumentData } from '../types';

const DocumentIcon = ({ type }: { type: DocumentData['documentType'] }) => {
  switch (type) {
    case 'PAN':
      return <CreditCard className="w-6 h-6" />;
    case 'DL':
      return <Car className="w-6 h-6" />;
    case 'PASSPORT':
      return <FileText className="w-6 h-6" />;
    default:
      return null;
  }
};

const ResultDisplay: React.FC<{
  data: DocumentData;
  onReset: () => void;
}> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-6">
          <h3 className="text-xl font-semibold text-center">
            Document Scanned Successfully
          </h3>
          <DocumentIcon type={data.documentType} />
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Document Type</p>
            <p className="text-lg font-medium">
              {data.documentType || 'Unknown Document'}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{data.name}</p>
          </div>
          
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">Document Number</p>
            <p className="text-lg font-medium">{data.documentNumber}</p>
          </div>
          
          {data.documentType !== 'PAN' && (
            <div className="border-b pb-3">
              <p className="text-sm text-gray-500">Expiration Date</p>
              <p className="text-lg font-medium">{data.expirationDate}</p>
            </div>
          )}
        </div>
        
        <button
          onClick={onReset}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Scan Another Document
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;