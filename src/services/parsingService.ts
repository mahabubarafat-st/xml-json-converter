/**
 * Parse content based on the specified format
 * @param content The content to parse
 * @param format The format ('json' or 'xml')
 * @returns The parsed data structure
 */
export const parseContent = (content: string, format: 'json' | 'xml'): any => {
  if (!content.trim()) {
    return {};
  }

  try {
    if (format === 'json') {
      // Parse JSON content
      return JSON.parse(content);
    } else {
      // For XML, convert to JSON first (simplified implementation)
      // In a real application, you would use xml-js properly here
      // This is just a placeholder for demo purposes
      try {
        // Try to parse as JSON in case it's already been converted
        return JSON.parse(content);
      } catch {
        // If it fails, return a dummy object
        return {
          "xml": "This is a placeholder for XML parsing in the TreeView"
        };
      }
    }
  } catch (error) {
    throw new Error(`Parsing error: ${error instanceof Error ? error.message : String(error)}`);
  }
};