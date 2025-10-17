import type { Context } from '@dotaislash/schemas';
import { BaseAdapter } from '../lib/base-adapter.js';
import type { AdapterOptions } from '../lib/types.js';
/**
 * Windsurf adapter - transforms VERSA configs to Windsurf JSON format
 *
 * Windsurf uses a JSON configuration in .windsurf/config.json
 */
export declare class WindsurfAdapter extends BaseAdapter<string> {
    name: string;
    tool: string;
    version: string;
    /**
     * Transform VERSA context to Windsurf config format
     */
    transform(context: Context, options?: AdapterOptions): string;
}
/** Singleton instance */
export declare const windsurfAdapter: WindsurfAdapter;
//# sourceMappingURL=windsurf.d.ts.map