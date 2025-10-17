// File: dotaislash-adapters/tests/windsurf.test.ts
// What: Tests for Windsurf adapter
// Why: Ensure correct transformation to Windsurf JSON format
// Related: src/adapters/windsurf.ts

import { describe, test, expect } from 'vitest';
import { windsurfAdapter } from '../src/adapters/windsurf.js';
import type { Context } from '@dotaislash/schemas';

describe('Windsurf Adapter', () => {
  test('transforms minimal context', () => {
    const context: Context = {
      version: '1.0'
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.version).toBe('1.0');
  });

  test('includes metadata', () => {
    const context: Context = {
      version: '1.0',
      metadata: {
        name: 'Test Project',
        description: 'A test project'
      }
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.name).toBe('Test Project');
    expect(config.description).toBe('A test project');
  });

  test('includes model settings', () => {
    const context: Context = {
      version: '1.0',
      settings: {
        model: 'claude-sonnet-4',
        temperature: 0.7,
        maxTokens: 4096
      }
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.model).toBeDefined();
    expect(config.model.name).toBe('claude-sonnet-4');
    expect(config.model.temperature).toBe(0.7);
    expect(config.model.maxTokens).toBe(4096);
  });

  test('includes context files and rules', () => {
    const context: Context = {
      version: '1.0',
      context: ['src/**/*.ts', 'tests/**/*.test.ts'],
      rules: ['# Style Guide\n\nUse strict mode.']
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.context).toBeDefined();
    expect(config.context.files).toEqual(['src/**/*.ts', 'tests/**/*.test.ts']);
    expect(config.context.rules).toHaveLength(1);
    expect(config.context.rules[0]).toContain('Style Guide');
  });

  test('includes permissions', () => {
    const context: Context = {
      version: '1.0',
      permissions: {
        files: {
          write: ['src/**', 'docs/**'],
          deny: ['.env*', '*.key']
        },
        commands: {
          allow: ['npm test', 'npm run build'],
          deny: ['rm -rf', 'sudo']
        }
      }
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.permissions).toBeDefined();
    expect(config.permissions.allowedFiles).toEqual(['src/**', 'docs/**']);
    expect(config.permissions.deniedFiles).toEqual(['.env*', '*.key']);
    expect(config.permissions.allowedCommands).toEqual(['npm test', 'npm run build']);
    expect(config.permissions.deniedCommands).toEqual(['rm -rf', 'sudo']);
  });

  test('includes features from settings', () => {
    const context: Context = {
      version: '1.0',
      settings: {
        model: 'gpt-4',
        streaming: true,
        autocomplete: true,
        inlineEdit: false
      }
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.features).toBeDefined();
    expect(config.features.streaming).toBe(true);
    expect(config.features.autocomplete).toBe(true);
    expect(config.features.inlineEdit).toBe(false);
  });

  test('formats output when format option is true', () => {
    const context: Context = {
      version: '1.0',
      metadata: { name: 'Test' }
    };

    const formatted = windsurfAdapter.transform(context, { format: true });
    const compact = windsurfAdapter.transform(context, { format: false });
    
    expect(formatted).toContain('\n');
    expect(formatted).toContain('  ');
    expect(compact).not.toContain('\n  ');
  });

  test('handles full-featured context', () => {
    const context: Context = {
      version: '1.0',
      metadata: {
        name: 'Enterprise App',
        description: 'Production application'
      },
      settings: {
        model: 'claude-sonnet-4',
        temperature: 0.5,
        streaming: true
      },
      context: ['src/**/*.ts'],
      rules: ['# Security\n\nFollow best practices.'],
      permissions: {
        files: {
          write: ['src/**'],
          deny: ['.env*']
        }
      }
    };

    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.name).toBe('Enterprise App');
    expect(config.model.name).toBe('claude-sonnet-4');
    expect(config.context.files).toEqual(['src/**/*.ts']);
    expect(config.permissions.deniedFiles).toEqual(['.env*']);
    expect(config.features.streaming).toBe(true);
  });

  test('produces valid JSON', () => {
    const context: Context = {
      version: '1.0',
      metadata: { name: 'Test' },
      settings: { model: 'gpt-4' }
    };

    const result = windsurfAdapter.transform(context);
    
    expect(() => JSON.parse(result)).not.toThrow();
  });

  test('validates non-empty output', () => {
    const result = windsurfAdapter.validate('{"version":"1.0"}');
    expect(result.valid).toBe(true);
  });

  test('validates empty output as invalid', () => {
    const result = windsurfAdapter.validate('');
    expect(result.valid).toBe(false);
  });
});
