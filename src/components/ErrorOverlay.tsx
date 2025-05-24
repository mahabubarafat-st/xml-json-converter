import React from 'react';
import { ErrorOverlayProps } from '../types';

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ message, position }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-start justify-center p-4 pointer-events-none">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-full shadow-sm">
        <h3 className="text-red-600 font-medium mb-2 flex items-center">
          <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          Error
        </h3>
        <div className="text-sm text-red-700 whitespace-pre-wrap">{message}</div>
        {position && (
          <div className="mt-2 text-xs text-red-600">
            At line {position.line}, column {position.column}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorOverlay;