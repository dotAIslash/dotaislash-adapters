// File: dotaislash-adapters/tests/cursor.test.ts
// What: Tests for Cursor adapter
// Why: Ensure correct transformation to .cursorrules format
// Related: src/adapters/cursor.ts

import { describe, test, expect } from 'vitest';
import { cursorAdapter } from '../src/adapters/cursor.js';
import type { Context } from '@dotaislash/schemas';

describe('Cursor Adapter', () => {
  test('transforms minimal context', () => {
    const context: Context = {
      version: '1.0'
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('Generated from VERSA');
    expect(result).toBeTruthy();
  });

  test('includes project name and description', () => {
    const context: Context = {
      version: '1.0',
      metadata: {
        name: 'Test Project',
        description: 'A test project for VERSA'
      }
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('# Test Project');
    expect(result).toContain('A test project for VERSA');
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

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('AI Assistant Configuration');
    expect(result).toContain('claude-sonnet-4');
    expect(result).toContain('0.7');
    expect(result).toContain('4096');
  });

  test('includes rules content', () => {
    const context: Context = {
      version: '1.0',
      rules: [
        '# Style Guide\n\nUse TypeScript strict mode.',
        '# Testing\n\nWrite comprehensive tests.'
      ]
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('## Guidelines');
    expect(result).toContain('Style Guide');
    expect(result).toContain('TypeScript strict mode');
    expect(result).toContain('Testing');
    expect(result).toContain('comprehensive tests');
  });

  test('removes YAML front matter from rules', () => {
    const context: Context = {
      version: '1.0',
      rules: [
        '---\nai:meta\n  priority: high\n---\n\n# Style Guide\n\nContent here.'
      ]
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('Style Guide');
    expect(result).not.toContain('ai:meta');
    expect(result).not.toContain('priority: high');
  });

  test('includes file patterns', () => {
    const context: Context = {
      version: '1.0',
      context: [
        'src/**/*.ts',
        'tests/**/*.test.ts',
        '*.config.ts'
      ]
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('## Relevant Files');
    expect(result).toContain('`src/**/*.ts`');
    expect(result).toContain('`tests/**/*.test.ts`');
    expect(result).toContain('`*.config.ts`');
  });

  test('includes file permissions', () => {
    const context: Context = {
      version: '1.0',
      permissions: {
        files: {
          write: ['src/**', 'docs/**'],
          deny: ['.env*', '*.key', 'node_modules/**']
        }
      }
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('## Permissions & Constraints');
    expect(result).toContain('**Can modify:**');
    expect(result).toContain('`src/**`');
    expect(result).toContain('**Never modify:**');
    expect(result).toContain('`.env*`');
    expect(result).toContain('`node_modules/**`');
  });

  test('includes command restrictions', () => {
    const context: Context = {
      version: '1.0',
      permissions: {
        commands: {
          deny: ['rm -rf', 'sudo', 'dd']
        }
      }
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('**Forbidden commands:**');
    expect(result).toContain('`rm -rf`');
    expect(result).toContain('`sudo`');
  });

  test('handles full-featured context', () => {
    const context: Context = {
      version: '1.0',
      metadata: {
        name: 'Enterprise App',
        description: 'Production application'
      },
      rules: ['# Security\n\nFollow OWASP guidelines.'],
      context: ['src/**/*.ts'],
      settings: {
        model: 'claude-sonnet-4',
        temperature: 0.5
      },
      permissions: {
        files: {
          write: ['src/**'],
          deny: ['.env*']
        }
      }
    };

    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('Enterprise App');
    expect(result).toContain('Production application');
    expect(result).toContain('claude-sonnet-4');
    expect(result).toContain('OWASP');
    expect(result).toContain('src/**/*.ts');
    expect(result).toContain('.env*');
  });

  test('respects comments option', () => {
    const context: Context = { version: '1.0' };

    const withComments = cursorAdapter.transform(context, { comments: true });
    const withoutComments = cursorAdapter.transform(context, { comments: false });
    
    expect(withComments).toContain('Generated from VERSA');
    expect(withoutComments).not.toContain('Generated from VERSA');
  });

  test('validates non-empty output', () => {
    const result = cursorAdapter.validate('some content');
    expect(result.valid).toBe(true);
  });

  test('validates empty output as invalid', () => {
    const result = cursorAdapter.validate('');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
