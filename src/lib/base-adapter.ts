// File: dotaislash-adapters/src/lib/base-adapter.ts
// What: Base adapter class with common functionality
// Why: Reduce duplication across adapters, provide helper methods
// Related: adapters/*.ts, types.ts

import type { Context } from '@dotaislash/schemas';
import type { Adapter, AdapterOptions, ValidationResult } from './types.js';

/**
 * Base adapter class providing common functionality
 */
export abstract class BaseAdapter<TOutput = string> implements Adapter<TOutput> {
  abstract name: string;
  abstract tool: string;
  abstract version: string;

  abstract transform(context: Context, options?: AdapterOptions): TOutput;

  /**
   * Merge rules into a single string
   */
  protected mergeRules(rules: string[]): string {
    return rules.join('\n\n---\n\n');
  }

  /**
   * Format system prompt from rules and settings
   */
  protected formatSystemPrompt(context: Context): string {
    const parts: string[] = [];

    // Add metadata description if present
    if (context.metadata?.description) {
      parts.push(context.metadata.description);
      parts.push('');
    }

    // Add rules (rules are already loaded content, not file paths)
    if (context.rules && context.rules.length > 0) {
      parts.push('## Rules\n');
      parts.push(this.mergeRules(context.rules));
    }

    return parts.join('\n');
  }

  /**
   * Extract model settings
   */
  protected getModelSettings(context: Context): {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } {
    return {
      model: context.settings?.model,
      temperature: context.settings?.temperature,
      maxTokens: context.settings?.maxTokens
    };
  }

  /**
   * Get file patterns for context
   */
  protected getFilePatterns(context: Context): string[] {
    return context.context || [];
  }

  /**
   * Basic validation (can be overridden)
   */
  validate(output: TOutput): ValidationResult {
    if (!output) {
      return {
        valid: false,
        errors: ['Output is empty']
      };
    }
    return { valid: true };
  }
}
