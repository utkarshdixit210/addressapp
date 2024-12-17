import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  suggestion?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, suggestion }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {suggestion && (
          <div className="bg-gray-50 p-4 rounded-lg mt-4 text-sm text-gray-700">
            {suggestion}
          </div>
        )}
      </div>
    </div>
  );
}