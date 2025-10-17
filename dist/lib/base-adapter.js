// File: dotaislash-adapters/src/lib/base-adapter.ts
// What: Base adapter class with common functionality
// Why: Reduce duplication across adapters, provide helper methods
// Related: adapters/*.ts, types.ts
/**
 * Base adapter class providing common functionality
 */
export class BaseAdapter {
    /**
     * Merge rules into a single string
     */
    mergeRules(rules) {
        return rules.join('\n\n---\n\n');
    }
    /**
     * Format system prompt from rules and settings
     */
    formatSystemPrompt(context) {
        const parts = [];
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
    getModelSettings(context) {
        return {
            model: context.settings?.model,
            temperature: context.settings?.temperature,
            maxTokens: context.settings?.maxTokens
        };
    }
    /**
     * Get file patterns for context
     */
    getFilePatterns(context) {
        return context.context || [];
    }
    /**
     * Basic validation (can be overridden)
     */
    validate(output) {
        if (!output) {
            return {
                valid: false,
                errors: ['Output is empty']
            };
        }
        return { valid: true };
    }
}
//# sourceMappingURL=base-adapter.js.map