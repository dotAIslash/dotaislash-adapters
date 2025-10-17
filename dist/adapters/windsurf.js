// File: dotaislash-adapters/src/adapters/windsurf.ts
// What: Windsurf adapter - transforms VERSA to Windsurf config format
// Why: Enable Windsurf editor to use VERSA configurations
// Related: base-adapter.ts, types.ts
import { BaseAdapter } from '../lib/base-adapter.js';
/**
 * Windsurf adapter - transforms VERSA configs to Windsurf JSON format
 *
 * Windsurf uses a JSON configuration in .windsurf/config.json
 */
export class WindsurfAdapter extends BaseAdapter {
    name = 'windsurf-adapter';
    tool = 'windsurf';
    version = '1.0.0';
    /**
     * Transform VERSA context to Windsurf config format
     */
    transform(context, options) {
        const config = {
            version: '1.0'
        };
        // Metadata
        if (context.metadata) {
            config.name = context.metadata.name;
            config.description = context.metadata.description;
        }
        // Model settings
        const settings = this.getModelSettings(context);
        if (settings.model || settings.temperature || settings.maxTokens) {
            config.model = {
                name: settings.model,
                temperature: settings.temperature,
                maxTokens: settings.maxTokens
            };
        }
        // Context
        const filePatterns = this.getFilePatterns(context);
        if (filePatterns.length > 0 || context.rules) {
            config.context = {};
            if (filePatterns.length > 0) {
                config.context.files = filePatterns;
            }
            if (context.rules && context.rules.length > 0) {
                config.context.rules = context.rules;
            }
        }
        // Permissions
        if (context.permissions) {
            config.permissions = {};
            if (context.permissions.files) {
                if (context.permissions.files.write) {
                    config.permissions.allowedFiles = context.permissions.files.write;
                }
                if (context.permissions.files.deny) {
                    config.permissions.deniedFiles = context.permissions.files.deny;
                }
            }
            if (context.permissions.commands) {
                if (context.permissions.commands.allow) {
                    config.permissions.allowedCommands = context.permissions.commands.allow;
                }
                if (context.permissions.commands.deny) {
                    config.permissions.deniedCommands = context.permissions.commands.deny;
                }
            }
        }
        // Features (from settings if present)
        if (context.settings) {
            const features = {};
            // Check for Windsurf-specific settings
            if ('streaming' in context.settings) {
                features.streaming = context.settings.streaming;
            }
            if ('autocomplete' in context.settings) {
                features.autocomplete = context.settings.autocomplete;
            }
            if ('inlineEdit' in context.settings) {
                features.inlineEdit = context.settings.inlineEdit;
            }
            if (Object.keys(features).length > 0) {
                config.features = features;
            }
        }
        // Format output
        const indent = options?.format !== false ? 2 : 0;
        return JSON.stringify(config, null, indent);
    }
}
/** Singleton instance */
export const windsurfAdapter = new WindsurfAdapter();
//# sourceMappingURL=windsurf.js.map