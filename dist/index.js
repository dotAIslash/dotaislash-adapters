// File: dotaislash-adapters/src/index.ts
// What: Main entry point for adapters package
// Why: Export all adapters and utilities
// Related: adapters/*.ts, lib/*.ts
export { BaseAdapter } from './lib/base-adapter.js';
export { CursorAdapter, cursorAdapter } from './adapters/cursor.js';
export { WindsurfAdapter, windsurfAdapter } from './adapters/windsurf.js';
/**
 * Registry of all available adapters
 */
import { cursorAdapter } from './adapters/cursor.js';
import { windsurfAdapter } from './adapters/windsurf.js';
export const adapters = {
    cursor: cursorAdapter,
    windsurf: windsurfAdapter
};
/**
 * Get adapter by tool name
 */
export function getAdapter(tool) {
    return adapters[tool.toLowerCase()];
}
/**
 * List all available adapters
 */
export function listAdapters() {
    return Object.keys(adapters);
}
//# sourceMappingURL=index.js.map