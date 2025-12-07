/**
 * Tool registry - central registry for all available tools
 */

import type { Tool } from '../types/index.js';
import { searchTool } from './search.js';
import { calculateTool } from './calculate.js';
import { analyzeDataTool } from './analyze-data.js';
import { formatTool } from './format.js';
import { validateTool } from './validate.js';
import { dateTimeTool } from './date-time.js';

/**
 * Tool registry containing all available tools as a key-value map
 */
export const toolRegistry: Record<string, Tool> = {
  search: searchTool,
  calculate: calculateTool,
  analyzeData: analyzeDataTool,
  format: formatTool,
  validate: validateTool,
  dateTime: dateTimeTool,
};

/**
 * Get tool by name
 */
export function getToolByName(name: string): Tool | undefined {
  return toolRegistry[name];
}

/**
 * Get all tool names
 */
export function getToolNames(): string[] {
  return Object.keys(toolRegistry);
}

/**
 * Get all tools as array
 */
export function getAllTools(): Tool[] {
  return Object.values(toolRegistry);
}
