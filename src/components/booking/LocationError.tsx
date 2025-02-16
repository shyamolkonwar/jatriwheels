import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LocationErrorProps {
  onClose: () => void;
}

const LocationError = ({ onClose }: LocationErrorProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Unavailable</h2>
          <p className="text-gray-600 mb-6">
            We apologize, but our services are currently available only within Assam, India.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationError;