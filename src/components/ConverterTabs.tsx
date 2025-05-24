import React from 'react';
import { ConversionMode } from '../types';
import { ArrowLeftRight } from 'lucide-react';

interface ConverterTabsProps {
  activeMode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
}

const ConverterTabs: React.FC<ConverterTabsProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-1">
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5
          ${activeMode === ConversionMode.XML_TO_JSON 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}
        onClick={() => onModeChange(ConversionMode.XML_TO_JSON)}
      >
        <span className="text-blue-600 font-semibold">XML</span>
        <ArrowLeftRight size={14} />
        <span className="text-orange-500 font-semibold">JSON</span>
      </button>
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5
          ${activeMode === ConversionMode.JSON_TO_XML 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}
        onClick={() => onModeChange(ConversionMode.JSON_TO_XML)}
      >
        <span className="text-orange-500 font-semibold">JSON</span>
        <ArrowLeftRight size={14} />
        <span className="text-blue-600 font-semibold">XML</span>
      </button>
    </div>
  );
};

export default ConverterTabs;