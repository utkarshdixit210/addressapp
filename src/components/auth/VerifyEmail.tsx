import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface VerifyEmailProps {
  isLoading: boolean;
  isVerified: boolean;
  error: string | null;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({
  isLoading,
  isVerified,
  error,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : isVerified ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">
              Your email has been successfully verified. You can now use all features of your account.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};