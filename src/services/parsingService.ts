import { xml2js } from 'xml-js';

/**
 * Parse content based on the specified format
 * @param content The content to parse
 * @param format The format ('json' or 'xml')
 * @returns The parsed data structure
 */
export const parseContent = (content: string, format: 'json' | 'xml'): unknown => {
  if (!content.trim()) {
    return {};
  }

  try {
    if (format === 'json') {
      // Parse JSON content
      const parsed = JSON.parse(content);
      return parsed;
    } else {
      // For XML, convert to JSON using xml-js
      try {
        const jsonObj = xml2js(content, {
          compact: true,
          alwaysChildren: false,
          ignoreComment: true,
          ignoreDeclaration: true,
        });
        return jsonObj;
      } catch (xmlError) {
        // If XML parsing fails, try parsing as JSON in case it's already been converted
        try {
          return JSON.parse(content);
        } catch {
          throw new Error(`Invalid XML format: ${xmlError instanceof Error ? xmlError.message : String(xmlError)}`);
        }
      }
    }
  } catch (error) {
    throw new Error(`Parsing error: ${error instanceof Error ? error.message : String(error)}`);
  }
};