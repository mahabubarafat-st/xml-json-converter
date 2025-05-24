import React, { useState, useRef } from 'react';
import { TREE_COLORS } from '../constants';
import { parseContent } from '../services/parsingService';
import TreeContextMenu from './TreeContextMenu';

interface TreeViewProps {
  content: string;
  format: 'xml' | 'json';
  onEdit?: (newContent: string) => void;
}

interface TreeNodeProps {
  path: string[];
  name: string;
  data: any;
  isExpanded?: boolean;
  depth: number;
  onToggle: (path: string[]) => void;
  onContextMenu: (e: React.MouseEvent, path: string[]) => void;
  onEdit?: (path: string[], value: any) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  path,
  name,
  data,
  isExpanded = true,
  depth,
  onToggle,
  onContextMenu,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine node type and icon
  let nodeType = 'value';
  let nodeColor = TREE_COLORS.value;
  let nodeIcon = '📄';

  if (Array.isArray(data)) {
    nodeType = 'array';
    nodeColor = TREE_COLORS.array;
    nodeIcon = '📚';
  } else if (data !== null && typeof data === 'object') {
    nodeType = 'object';
    nodeColor = TREE_COLORS.object;
    nodeIcon = '📁';
  }

  // Handle node clicks
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(path);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, path);
  };

  // Handle editing
  const startEditing = (e: React.MouseEvent) => {
    if (onEdit && nodeType === 'value') {
      e.stopPropagation();
      setEditValue(String(data));
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEdit) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const finishEditing = () => {
    if (onEdit) {
      // Try to convert value based on type
      let parsedValue = editValue;
      if (editValue === 'true') parsedValue = true;
      else if (editValue === 'false') parsedValue = false;
      else if (!isNaN(Number(editValue)) && editValue.trim() !== '') {
        parsedValue = Number(editValue);
      }
      
      onEdit(path, parsedValue);
    }
    setIsEditing(false);
  };

  // Render different node types
  const renderValue = () => {
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleEditKeyDown}
          className="px-1 py-0.5 border border-blue-400 rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    if (typeof data === 'string') {
      return <span className="text-green-600">"{data}"</span>;
    } else if (typeof data === 'number') {
      return <span className="text-amber-600">{data}</span>;
    } else if (typeof data === 'boolean') {
      return <span className="text-blue-600">{data ? 'true' : 'false'}</span>;
    } else if (data === null) {
      return <span className="text-slate-400 italic">null</span>;
    } else {
      return <span className="text-slate-400 italic">undefined</span>;
    }
  };

  // Render children for object or array
  const renderChildren = () => {
    if (!isExpanded || (nodeType !== 'object' && nodeType !== 'array')) {
      return null;
    }

    if (nodeType === 'array') {
      return (
        <div className="pl-6 border-l border-slate-200">
          {Array.isArray(data) && data.map((item, index) => (
            <TreeNode
              key={`${path.join('-')}-${index}`}
              path={[...path, index.toString()]}
              name={`[${index}]`}
              data={item}
              depth={depth + 1}
              onToggle={onToggle}
              onContextMenu={onContextMenu}
              onEdit={onEdit}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="pl-6 border-l border-slate-200">
        {Object.entries(data).map(([key, value]) => (
          <TreeNode
            key={`${path.join('-')}-${key}`}
            path={[...path, key]}
            name={key}
            data={value}
            depth={depth + 1}
            onToggle={onToggle}
            onContextMenu={onContextMenu}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  };

  // Calculate left padding based on depth
  const paddingLeft = depth * 8;

  return (
    <div className="my-1">
      <div
        className={`flex items-center py-1 px-2 rounded hover:bg-slate-50 cursor-pointer group ${isEditing ? 'bg-blue-50' : ''}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
        onContextMenu={handleContextMenu}
        onDoubleClick={startEditing}
      >
        {(nodeType === 'object' || nodeType === 'array') && (
          <span 
            className="mr-1 transition-transform duration-200 text-slate-400"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ▶
          </span>
        )}
        <span className="mr-1.5">{nodeIcon}</span>
        <span 
          className="font-medium mr-1.5"
          style={{ color: TREE_COLORS.key }}
        >
          {name}:
        </span>
        {nodeType === 'value' ? (
          renderValue()
        ) : (
          <span style={{ color: nodeColor }}>
            {nodeType === 'array' ? (
              <>Array[{Array.isArray(data) ? data.length : 0}]</>
            ) : (
              <>Object{isExpanded ? '' : `{${Object.keys(data).length}}`}</>
            )}
          </span>
        )}
      </div>
      {renderChildren()}
    </div>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ content, format, onEdit }) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    path: string[];
  } | null>(null);

  // Parse content to data structure
  let parsedData;
  try {
    parsedData = parseContent(content, format);
  } catch (e) {
    return (
      <div className="p-4 text-red-500">
        Failed to parse content. Please check for syntax errors.
      </div>
    );
  }

  // Handle node expansion toggle
  const handleToggle = (path: string[]) => {
    const pathKey = path.join('-');
    setExpandedNodes(prev => ({
      ...prev,
      [pathKey]: !prev[pathKey]
    }));
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, path: string[]) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      path
    });
  };

  // Handle editing nodes
  const handleEdit = (path: string[], value: any) => {
    if (!onEdit) return;

    let result = JSON.parse(JSON.stringify(parsedData)); // Deep clone
    let current = result;
    
    // Navigate to parent
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] === undefined) return;
      current = current[path[i]];
    }
    
    // Update value
    const lastKey = path[path.length - 1];
    current[lastKey] = value;
    
    // Convert back to string and update
    try {
      if (format === 'json') {
        onEdit(JSON.stringify(result, null, 2));
      } else {
        // This is simplified - in a real app, you'd use xml-js to convert back
        onEdit(JSON.stringify(result));
      }
    } catch (e) {
      console.error('Failed to update content', e);
    }
  };

  // Context menu actions
  const handleAddNode = () => {
    if (!contextMenu || !onEdit) return;
    setContextMenu(null);
    
    // Implementation would add a new node at the specified path
    // This is a placeholder for the actual implementation
  };

  const handleRemoveNode = () => {
    if (!contextMenu || !onEdit) return;
    
    let result = JSON.parse(JSON.stringify(parsedData)); // Deep clone
    let current = result;
    const path = contextMenu.path;
    
    // Navigate to parent
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] === undefined) return;
      current = current[path[i]];
    }
    
    // Remove the node
    const lastKey = path[path.length - 1];
    if (Array.isArray(current)) {
      current.splice(parseInt(lastKey), 1);
    } else {
      delete current[lastKey];
    }
    
    // Update the content
    try {
      if (format === 'json') {
        onEdit(JSON.stringify(result, null, 2));
      } else {
        // Simplified conversion for example
        onEdit(JSON.stringify(result));
      }
    } catch (e) {
      console.error('Failed to update content', e);
    }
    
    setContextMenu(null);
  };

  const handleDuplicateNode = () => {
    if (!contextMenu || !onEdit) return;
    setContextMenu(null);
    
    // Implementation would duplicate the node at the specified path
    // This is a placeholder for the actual implementation
  };

  return (
    <div className="overflow-auto h-full p-2 bg-white" style={{ maxHeight: 'calc(100vh - 12rem)', overflowY: 'auto' }}>
      {Object.keys(parsedData).map(key => (
        <TreeNode
          key={key}
          path={[key]}
          name={key}
          data={parsedData[key]}
          isExpanded={expandedNodes[key] !== false}
          depth={0}
          onToggle={handleToggle}
          onContextMenu={handleContextMenu}
          onEdit={onEdit}
        />
      ))}
      <div className="py-4"></div>
      
      {contextMenu && contextMenu.visible && (
        <TreeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAddNode={handleAddNode}
          onRemoveNode={handleRemoveNode}
          onDuplicateNode={handleDuplicateNode}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default TreeView;