import type { Context } from '@dotaislash/schemas';
/**
 * Base adapter interface that all adapters must implement
 */
export interface Adapter<TOutput = string> {
    /** Adapter name */
    name: string;
    /** Target tool/platform */
    tool: string;
    /** Adapter version */
    version: string;
    /** Transform VERSA config to tool-specific format */
    transform(context: Context, options?: AdapterOptions): TOutput;
    /** Validate that output is correct for target tool */
    validate?(output: TOutput): ValidationResult;
}
/**
 * Options that can be passed to adapters
 */
export interface AdapterOptions {
    /** Whether to include comments in output */
    comments?: boolean;
    /** Whether to format output (pretty print) */
    format?: boolean;
    /** Custom formatting options */
    formatOptions?: Record<string, unknown>;
    /** Additional tool-specific options */
    [key: string]: unknown;
}
/**
 * Result of adapter validation
 */
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
    warnings?: string[];
}
/**
 * Metadata about an adapter
 */
export interface AdapterMetadata {
    name: string;
    tool: string;
    version: string;
    description: string;
    outputFormat: string;
    supports: string[];
}
//# sourceMappingURL=types.d.ts.map