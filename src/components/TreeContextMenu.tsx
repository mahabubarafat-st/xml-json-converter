import React, { useEffect, useRef } from 'react';
import { TreeContextMenuProps } from '../types';
import { Plus, Trash, Copy } from 'lucide-react';

const TreeContextMenu: React.FC<TreeContextMenuProps> = ({
  x,
  y,
  onAddNode,
  onRemoveNode,
  onDuplicateNode,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Adjust position to keep menu in viewport
  const adjustedX = Math.min(x, window.innerWidth - 180); // 180px is approximate menu width
  const adjustedY = Math.min(y, window.innerHeight - 150); // 150px is approximate menu height

  return (
    <div
      ref={menuRef}
      className="absolute bg-white rounded-md shadow-lg border border-slate-200 z-50 w-44"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`
      }}
    >
      <div className="py-1">
        <button
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
          onClick={onAddNode}
        >
          <Plus size={14} className="mr-2 text-green-500" />
          Add node
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
          onClick={onRemoveNode}
        >
          <Trash size={14} className="mr-2 text-red-500" />
          Remove node
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
          onClick={onDuplicateNode}
        >
          <Copy size={14} className="mr-2 text-blue-500" />
          Duplicate node
        </button>
      </div>
    </div>
  );
};

export default TreeContextMenu;