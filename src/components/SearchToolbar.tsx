import React from 'react';
import { SearchToolbarProps } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onNext,
  onPrevious,
  onReplace,
  onReplaceAll,
  replaceTerm,
  onReplaceTermChange,
  matchCount,
  currentMatch,
  readOnly
}) => {
  return (
    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2">
      <div className="flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="px-2 py-1 border border-slate-300 rounded text-sm w-40"
        />
        <div className="flex ml-1">
          <button
            onClick={onPrevious}
            disabled={matchCount === 0}
            className={`p-1 rounded-l border border-slate-300 ${
              matchCount === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={onNext}
            disabled={matchCount === 0}
            className={`p-1 rounded-r border border-slate-300 border-l-0 ${
              matchCount === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowDown size={14} />
          </button>
        </div>
        {matchCount > 0 && (
          <span className="ml-2 text-xs text-slate-500">
            {currentMatch} of {matchCount}
          </span>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center">
          <input
            type="text"
            value={replaceTerm}
            onChange={(e) => onReplaceTermChange(e.target.value)}
            placeholder="Replace with..."
            className="px-2 py-1 border border-slate-300 rounded text-sm w-40"
          />
          <button
            onClick={onReplace}
            disabled={matchCount === 0}
            className={`ml-1 px-2 py-1 rounded text-xs ${
              matchCount === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Replace
          </button>
          <button
            onClick={onReplaceAll}
            disabled={matchCount === 0}
            className={`ml-1 px-2 py-1 rounded text-xs ${
              matchCount === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Replace All
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchToolbar;