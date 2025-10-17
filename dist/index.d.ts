export { BaseAdapter } from './lib/base-adapter.js';
export type { Adapter, AdapterOptions, ValidationResult, AdapterMetadata } from './lib/types.js';
export { CursorAdapter, cursorAdapter } from './adapters/cursor.js';
export { WindsurfAdapter, windsurfAdapter } from './adapters/windsurf.js';
import type { Adapter } from './lib/types.js';
export declare const adapters: Record<string, Adapter>;
/**
 * Get adapter by tool name
 */
export declare function getAdapter(tool: string): Adapter | undefined;
/**
 * List all available adapters
 */
export declare function listAdapters(): string[];
//# sourceMappingURL=index.d.ts.map