// File: dotaislash-adapters/src/adapters/cursor.ts
// What: Cursor adapter - transforms VERSA to .cursorrules format
// Why: Enable Cursor IDE to use VERSA configurations
// Related: base-adapter.ts, types.ts
import { BaseAdapter } from '../lib/base-adapter.js';
/**
 * Cursor adapter - transforms VERSA configs to .cursorrules format
 *
 * Cursor uses a markdown-based .cursorrules file in the project root
 * that provides instructions to the AI assistant.
 */
export class CursorAdapter extends BaseAdapter {
    name = 'cursor-adapter';
    tool = 'cursor';
    version = '1.0.0';
    /**
     * Transform VERSA context to Cursor .cursorrules format
     */
    transform(context, options) {
        const includeComments = options?.comments ?? true;
        const sections = [];
        // Header comment
        if (includeComments) {
            sections.push('<!-- Generated from VERSA configuration -->');
            sections.push('<!-- https://github.com/dotAIslash/versa -->');
            sections.push('');
        }
        // Project metadata
        if (context.metadata) {
            if (context.metadata.name) {
                sections.push(`# ${context.metadata.name}`);
                sections.push('');
            }
            if (context.metadata.description) {
                sections.push(context.metadata.description);
                sections.push('');
            }
        }
        // Model settings
        const settings = this.getModelSettings(context);
        if (settings.model || settings.temperature) {
            sections.push('## AI Assistant Configuration');
            sections.push('');
            if (settings.model) {
                sections.push(`**Model:** ${settings.model}`);
            }
            if (settings.temperature !== undefined) {
                sections.push(`**Temperature:** ${settings.temperature}`);
            }
            if (settings.maxTokens) {
                sections.push(`**Max Tokens:** ${settings.maxTokens}`);
            }
            sections.push('');
        }
        // Rules
        if (context.rules && context.rules.length > 0) {
            sections.push('## Guidelines');
            sections.push('');
            for (const rule of context.rules) {
                // Remove front matter if present
                const cleanRule = this.removeFrontMatter(rule);
                sections.push(cleanRule);
                sections.push('');
            }
        }
        // Context files
        const filePatterns = this.getFilePatterns(context);
        if (filePatterns.length > 0) {
            sections.push('## Relevant Files');
            sections.push('');
            sections.push('Focus on these files when providing assistance:');
            sections.push('');
            for (const pattern of filePatterns) {
                sections.push(`- \`${pattern}\``);
            }
            sections.push('');
        }
        // Permissions (as guidelines)
        if (context.permissions) {
            sections.push('## Permissions & Constraints');
            sections.push('');
            if (context.permissions.files) {
                if (context.permissions.files.write) {
                    sections.push('**Can modify:**');
                    context.permissions.files.write.forEach(p => {
                        sections.push(`- \`${p}\``);
                    });
                    sections.push('');
                }
                if (context.permissions.files.deny) {
                    sections.push('**Never modify:**');
                    context.permissions.files.deny.forEach(p => {
                        sections.push(`- \`${p}\``);
                    });
                    sections.push('');
                }
            }
            if (context.permissions.commands?.deny) {
                sections.push('**Forbidden commands:**');
                context.permissions.commands.deny.forEach(c => {
                    sections.push(`- \`${c}\``);
                });
                sections.push('');
            }
        }
        return sections.join('\n');
    }
    /**
     * Remove YAML front matter from markdown
     */
    removeFrontMatter(content) {
        const frontMatterRegex = /^---\n[\s\S]*?\n---\n/;
        return content.replace(frontMatterRegex, '').trim();
    }
}
/** Singleton instance */
export const cursorAdapter = new CursorAdapter();
//# sourceMappingURL=cursor.js.map