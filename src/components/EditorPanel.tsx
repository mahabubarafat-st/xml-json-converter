import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import { ViewMode } from '../types';
import EditorToolbar from './EditorToolbar';
import SearchToolbar from './SearchToolbar';
import ErrorOverlay from './ErrorOverlay';
import TreeView from './TreeView';
import { formatContent } from '../services/formattingService';

// Import Ace editor modes and themes
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/ext-language_tools';

interface EditorPanelProps {
  title: string;
  content: string;
  onContentChange: (content: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  format: 'xml' | 'json';
  error?: string | null;
  readOnly?: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  title,
  content,
  onContentChange,
  viewMode,
  onViewModeChange,
  format,
  error = null,
  readOnly = false,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef<AceEditor>(null);

  // Update history when content changes significantly
  useEffect(() => {
    // Only add to history if it's a user change (not an undo/redo)
    if (history[historyIndex] !== content) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onContentChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onContentChange(history[newIndex]);
    }
  };

  const handleFormat = () => {
    try {
      const formatted = formatContent(content, format, false);
      onContentChange(formatted);
    } catch (e) {
      // Do nothing if formatting fails
    }
  };

  const handleCompact = () => {
    try {
      const compacted = formatContent(content, format, true);
      onContentChange(compacted);
    } catch (e) {
      // Do nothing if compacting fails
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).catch(err => {
      console.error('Failed to copy content: ', err);
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (editorRef.current && editorRef.current.editor) {
      const editor = editorRef.current.editor;
      const found = editor.findAll(term);
      setMatchCount(found || 0);
      setCurrentMatch(found ? 1 : 0);
    }
  };

  const handleNext = () => {
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.findNext();
      setCurrentMatch(prev => (prev < matchCount ? prev + 1 : 1));
    }
  };

  const handlePrevious = () => {
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.findPrevious();
      setCurrentMatch(prev => (prev > 1 ? prev - 1 : matchCount));
    }
  };

  const handleReplace = () => {
    if (editorRef.current && editorRef.current.editor && !readOnly) {
      editorRef.current.editor.replace(replaceTerm);
      // Update content after replace
      setTimeout(() => {
        if (editorRef.current && editorRef.current.editor) {
          onContentChange(editorRef.current.editor.getValue());
        }
      }, 0);
    }
  };

  const handleReplaceAll = () => {
    if (editorRef.current && editorRef.current.editor && !readOnly) {
      editorRef.current.editor.replaceAll(replaceTerm);
      // Update content after replace
      setTimeout(() => {
        if (editorRef.current && editorRef.current.editor) {
          onContentChange(editorRef.current.editor.getValue());
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <h2 className="font-medium text-slate-700">{title}</h2>
        <EditorToolbar
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onFormat={handleFormat}
          onCompact={handleCompact}
          onCopy={handleCopy}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          searchVisible={searchVisible}
          toggleSearch={() => setSearchVisible(!searchVisible)}
          readOnly={readOnly}
        />
      </div>

      {searchVisible && (
        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onReplace={handleReplace}
          onReplaceAll={handleReplaceAll}
          replaceTerm={replaceTerm}
          onReplaceTermChange={setReplaceTerm}
          matchCount={matchCount}
          currentMatch={currentMatch}
          readOnly={readOnly}
        />
      )}

      <div className="flex-1 relative">
        {viewMode === ViewMode.CODE ? (
          <AceEditor
            ref={editorRef}
            mode={format}
            theme="github"
            value={content}
            onChange={readOnly ? undefined : onContentChange}
            name={`editor-${title}`}
            width="100%"
            height="100%"
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            readOnly={readOnly}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        ) : (
          <TreeView
            content={content}
            format={format}
            onEdit={readOnly ? undefined : onContentChange}
          />
        )}

        {error && <ErrorOverlay message={error} />}
      </div>
    </div>
  );
};

export default EditorPanel;