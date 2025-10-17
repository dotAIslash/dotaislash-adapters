// File: dotaislash-adapters/src/index.ts
// What: Main entry point for adapters package
// Why: Export all adapters and utilities
// Related: adapters/*.ts, lib/*.ts

export { BaseAdapter } from './lib/base-adapter.js';
export type {
  Adapter,
  AdapterOptions,
  ValidationResult,
  AdapterMetadata
} from './lib/types.js';

export { CursorAdapter, cursorAdapter } from './adapters/cursor.js';
export { WindsurfAdapter, windsurfAdapter } from './adapters/windsurf.js';

/**
 * Registry of all available adapters
 */
import { cursorAdapter } from './adapters/cursor.js';
import { windsurfAdapter } from './adapters/windsurf.js';
import type { Adapter } from './lib/types.js';

export const adapters: Record<string, Adapter> = {
  cursor: cursorAdapter,
  windsurf: windsurfAdapter
};

/**
 * Get adapter by tool name
 */
export function getAdapter(tool: string): Adapter | undefined {
  return adapters[tool.toLowerCase()];
}

/**
 * List all available adapters
 */
export function listAdapters(): string[] {
  return Object.keys(adapters);
}
