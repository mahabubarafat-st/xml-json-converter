import React from 'react';
import { EditorToolbarProps, ViewMode } from '../types';
import { Code, File as FileTree, Copy, Search, RefreshCcw, Undo2, Redo2, Maximize, Minimize } from 'lucide-react';

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onFormat,
  onCompact,
  onCopy,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  searchVisible,
  toggleSearch,
  readOnly
}) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="border-r border-slate-200 pr-1 mr-1">
        <button
          className={`p-1.5 rounded ${viewMode === ViewMode.CODE 
            ? 'bg-blue-100 text-blue-600' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          onClick={() => onViewModeChange(ViewMode.CODE)}
          title="Code View"
        >
          <Code size={16} />
        </button>
        <button
          className={`p-1.5 rounded ${viewMode === ViewMode.TREE 
            ? 'bg-blue-100 text-blue-600' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          onClick={() => onViewModeChange(ViewMode.TREE)}
          title="Tree View"
        >
          <FileTree size={16} />
        </button>
      </div>

      <button
        className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        onClick={onFormat}
        title="Format"
      >
        <Maximize size={16} />
      </button>
      <button
        className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        onClick={onCompact}
        title="Compact"
      >
        <Minimize size={16} />
      </button>
      <button
        className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        onClick={onCopy}
        title="Copy"
      >
        <Copy size={16} />
      </button>

      {!readOnly && (
        <div className="border-l border-slate-200 pl-1 ml-1">
          <button
            className={`p-1.5 rounded ${canUndo 
              ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700' 
              : 'text-slate-300 cursor-not-allowed'}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            className={`p-1.5 rounded ${canRedo 
              ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700' 
              : 'text-slate-300 cursor-not-allowed'}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>
      )}

      <div className="border-l border-slate-200 pl-1 ml-1">
        <button
          className={`p-1.5 rounded ${searchVisible 
            ? 'bg-blue-100 text-blue-600' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          onClick={toggleSearch}
          title="Search"
        >
          <Search size={16} />
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;