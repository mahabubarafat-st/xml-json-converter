// Initial XML content
export const initialXmlContent = `<root>
  <item type="object">
    <name>Sample</name>
  </item>
</root>`;

// Initial JSON content
export const initialJsonContent = `{
  "root": {
    "item": {
      "@type": "object",
      "name": "Sample"
    }
  }
}`;

// Editor theme colors
export const EDITOR_THEME = {
  background: '#ffffff',
  text: '#1e293b',
  syntax: {
    keyword: '#7c3aed',
    string: '#16a34a',
    number: '#f59e0b',
    boolean: '#0ea5e9',
    operator: '#64748b',
    comment: '#94a3b8'
  }
};

// Tree view node colors
export const TREE_COLORS = {
  object: '#f97316', // orange
  array: '#3b82f6',  // blue
  value: '#22c55e',  // green
  key: '#64748b',    // slate
  error: '#ef4444'   // red
};

// Max file size (10MB in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;