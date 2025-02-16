import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-900 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-blue-900">Checking availability...</h2>
        <p className="text-gray-600 mt-2">Please wait while we process your request</p>
      </div>
    </div>
  );
};

export default LoadingScreen;