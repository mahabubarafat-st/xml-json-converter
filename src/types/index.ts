export enum ConversionMode {
  XML_TO_JSON = 'XML_TO_JSON',
  JSON_TO_XML = 'JSON_TO_XML'
}

export enum ViewMode {
  TREE = 'TREE',
  CODE = 'CODE'
}

export interface EditorToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFormat: () => void;
  onCompact: () => void;
  onCopy: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  searchVisible: boolean;
  toggleSearch: () => void;
  readOnly: boolean;
}

export interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  replaceTerm: string;
  onReplaceTermChange: (term: string) => void;
  matchCount: number;
  currentMatch: number;
  readOnly: boolean;
}

export interface TreeContextMenuProps {
  x: number;
  y: number;
  onAddNode: () => void;
  onRemoveNode: () => void;
  onDuplicateNode: () => void;
  onClose: () => void;
}

export interface ErrorOverlayProps {
  message: string;
  position?: {
    line: number;
    column: number;
  };
  onDismiss?: () => void;
}