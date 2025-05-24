/**
 * Format content based on the specified format
 * @param content The content to format
 * @param format The format ('json' or 'xml')
 * @param compact Whether to compact the output
 * @returns The formatted content
 */
export const formatContent = (content: string, format: 'json' | 'xml', compact: boolean): string => {
  if (!content.trim()) {
    return '';
  }

  try {
    if (format === 'json') {
      // Parse and stringify JSON
      const jsonObj = JSON.parse(content);
      return JSON.stringify(jsonObj, null, compact ? 0 : 2);
    } else {
      // Format XML (simplified implementation)
      // In a real application, you'd use a proper XML formatter
      if (compact) {
        // Remove whitespace between tags
        return content
          .replace(/>\s+</g, '><')
          .replace(/\s+</g, '<')
          .replace(/>\s+/g, '>')
          .trim();
      } else {
        // Simple indentation for XML (this is a basic implementation)
        let formatted = '';
        let indent = '';
        const lines = content.trim().split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          
          // Check if this line is a closing tag
          if (trimmedLine.startsWith('</')) {
            indent = indent.slice(2); // Reduce indentation
          }
          
          formatted += indent + trimmedLine + '\n';
          
          // Check if this line contains an opening tag without a closing tag
          const isOpeningTag = trimmedLine.includes('<') && 
                              !trimmedLine.includes('/>') && 
                              !trimmedLine.includes('</');
          
          if (isOpeningTag) {
            indent += '  '; // Increase indentation
          }
        }
        
        return formatted.trim();
      }
    }
  } catch (error) {
    throw new Error(`Formatting error: ${error instanceof Error ? error.message : String(error)}`);
  }
};