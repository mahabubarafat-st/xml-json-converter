import React, { useState } from 'react';
import ConverterTabs from './components/ConverterTabs';
import EditorPanel from './components/EditorPanel';
import { ConversionMode, ViewMode } from './types';
import { convertContent } from './services/conversionService';
import { initialXmlContent, initialJsonContent } from './constants';
import { FileText, RefreshCw } from 'lucide-react';

function App() {
  const [conversionMode, setConversionMode] = useState<ConversionMode>(ConversionMode.XML_TO_JSON);
  const [sourceContent, setSourceContent] = useState<string>(
    conversionMode === ConversionMode.XML_TO_JSON ? initialXmlContent : initialJsonContent
  );
  const [outputContent, setOutputContent] = useState<string>('');
  const [sourceViewMode, setSourceViewMode] = useState<ViewMode>(ViewMode.CODE);
  const [outputViewMode, setOutputViewMode] = useState<ViewMode>(ViewMode.TREE);
  const [error, setError] = useState<string | null>(null);

  // Handle source content change
  const handleSourceChange = (content: string) => {
    setSourceContent(content);
    setError(null);
  };

  // Handle conversion
  const handleConvert = () => {
    try {
      const result = convertContent(sourceContent, conversionMode);
      setOutputContent(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Handle new document
  const handleNew = () => {
    const newContent = conversionMode === ConversionMode.XML_TO_JSON ? initialXmlContent : initialJsonContent;
    setSourceContent(newContent);
    setOutputContent('');
    setError(null);
  };

  // Switch conversion mode
  const handleModeSwitch = (mode: ConversionMode) => {
    setConversionMode(mode);
    // Reset content based on new mode
    const newSourceContent = mode === ConversionMode.XML_TO_JSON ? initialXmlContent : initialJsonContent;
    setSourceContent(newSourceContent);
    setOutputContent('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">XML</span>
            <span className="text-slate-400">/</span>
            <span className="text-orange-500">JSON</span>
            <span className="text-slate-800">Converter</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleNew}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-1.5"
              >
                <FileText size={16} />
                New
              </button>
              <button
                onClick={handleConvert}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5"
              >
                <RefreshCw size={16} />
                Convert
              </button>
            </div>
            <ConverterTabs
              activeMode={conversionMode}
              onModeChange={handleModeSwitch}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
          <EditorPanel
            title={conversionMode === ConversionMode.XML_TO_JSON ? "XML Input" : "JSON Input"}
            content={sourceContent}
            onContentChange={handleSourceChange}
            viewMode={sourceViewMode}
            onViewModeChange={setSourceViewMode}
            format={conversionMode === ConversionMode.XML_TO_JSON ? "xml" : "json"}
            error={error}
            readOnly={false}
          />
          <EditorPanel
            title={conversionMode === ConversionMode.XML_TO_JSON ? "JSON Output" : "XML Output"}
            content={outputContent}
            onContentChange={() => {}} // Read-only
            viewMode={outputViewMode}
            onViewModeChange={setOutputViewMode}
            format={conversionMode === ConversionMode.XML_TO_JSON ? "json" : "xml"}
            readOnly={true}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          XML/JSON Converter — Built with React & TypeScript — {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;