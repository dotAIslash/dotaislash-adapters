import type { Context } from '@dotaislash/schemas';
import type { Adapter, AdapterOptions, ValidationResult } from './types.js';
/**
 * Base adapter class providing common functionality
 */
export declare abstract class BaseAdapter<TOutput = string> implements Adapter<TOutput> {
    abstract name: string;
    abstract tool: string;
    abstract version: string;
    abstract transform(context: Context, options?: AdapterOptions): TOutput;
    /**
     * Merge rules into a single string
     */
    protected mergeRules(rules: string[]): string;
    /**
     * Format system prompt from rules and settings
     */
    protected formatSystemPrompt(context: Context): string;
    /**
     * Extract model settings
     */
    protected getModelSettings(context: Context): {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    };
    /**
     * Get file patterns for context
     */
    protected getFilePatterns(context: Context): string[];
    /**
     * Basic validation (can be overridden)
     */
    validate(output: TOutput): ValidationResult;
}
//# sourceMappingURL=base-adapter.d.ts.map