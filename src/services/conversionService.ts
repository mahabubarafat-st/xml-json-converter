import { ConversionMode } from '../types';
import { formatContent } from './formattingService';
import { xml2js, js2xml } from 'xml-js';

/**
 * Convert content based on the selected mode
 * @param content The source content to convert
 * @param mode The conversion mode (XML_TO_JSON or JSON_TO_XML)
 * @returns The converted content
 */
export const convertContent = (content: string, mode: ConversionMode): string => {
  if (!content.trim()) {
    return '';
  }

  try {
    if (mode === ConversionMode.XML_TO_JSON) {
      // Convert XML to JSON
      const jsonStr = xml2js(content, {
        compact: true,
        alwaysChildren: false,
        ignoreComment: true,
        ignoreDeclaration: true,
      });
      
      // Format the JSON for better readability
      return formatContent(JSON.stringify(jsonStr), 'json', false);
    } else {
      // Convert JSON to XML
      try {
        // Parse the JSON to validate it first
        const jsonObj = JSON.parse(content);
        
        // Convert to XML
        const xmlStr = js2xml(jsonObj, {
          compact: true,
          fullTagEmptyElement: true,
        });
        
        // Format the XML for better readability
        return formatContent(xmlStr, 'xml', false);
      } catch (parseError) {
        throw new Error(`Invalid JSON format: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    }
  } catch (error) {
    throw new Error(`Conversion error: ${error instanceof Error ? error.message : String(error)}`);
  }
}