import React from 'react';
import { ErrorOverlayProps } from '../types';
import { X } from 'lucide-react';

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ message, position, onDismiss }) => {
  // Extract line number from error message if available
  const extractLineInfo = () => {
    if (position) {
      return { line: position.line, column: position.column };
    }
    
    // Try to extract line number from common error patterns
    const lineMatch = message.match(/line (\d+)/i) || message.match(/at line (\d+)/i);
    const colMatch = message.match(/column (\d+)/i) || message.match(/at column (\d+)/i);
    
    if (lineMatch) {
      return {
        line: parseInt(lineMatch[1], 10),
        column: colMatch ? parseInt(colMatch[1], 10) : undefined
      };
    }
    
    return null;
  };
  
  const lineInfo = extractLineInfo();
  
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-start justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-full shadow-sm relative">
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
        >
          <X size={16} />
        </button>
        
        <h3 className="text-red-600 font-medium mb-2 flex items-center pr-6">
          <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          Error
        </h3>
        <div className="text-sm text-red-700 whitespace-pre-wrap">{message}</div>
        {lineInfo && (
          <div className="mt-2 text-xs text-red-600">
            At line {lineInfo.line}{lineInfo.column ? `, column ${lineInfo.column}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorOverlay;