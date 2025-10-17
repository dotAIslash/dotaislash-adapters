import type { Context } from '@dotaislash/schemas';
import { BaseAdapter } from '../lib/base-adapter.js';
import type { AdapterOptions } from '../lib/types.js';
/**
 * Cursor adapter - transforms VERSA configs to .cursorrules format
 *
 * Cursor uses a markdown-based .cursorrules file in the project root
 * that provides instructions to the AI assistant.
 */
export declare class CursorAdapter extends BaseAdapter<string> {
    name: string;
    tool: string;
    version: string;
    /**
     * Transform VERSA context to Cursor .cursorrules format
     */
    transform(context: Context, options?: AdapterOptions): string;
    /**
     * Remove YAML front matter from markdown
     */
    private removeFrontMatter;
}
/** Singleton instance */
export declare const cursorAdapter: CursorAdapter;
//# sourceMappingURL=cursor.d.ts.map