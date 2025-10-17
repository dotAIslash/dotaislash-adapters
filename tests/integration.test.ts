// File: dotaislash-adapters/tests/integration.test.ts
// What: Integration tests for adapters with real examples
// Why: Verify adapters work with actual VERSA configurations
// Related: cursor.test.ts, windsurf.test.ts

import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cursorAdapter, windsurfAdapter, getAdapter, listAdapters } from '../src/index.js';
import type { Context } from '@dotaislash/schemas';

const EXAMPLES_DIR = '/var/www/dotAIslash/dotaislash-examples/examples';

describe('Adapter Integration', () => {
  test('getAdapter returns correct adapter', () => {
    const cursor = getAdapter('cursor');
    const windsurf = getAdapter('windsurf');
    
    expect(cursor).toBe(cursorAdapter);
    expect(windsurf).toBe(windsurfAdapter);
  });

  test('getAdapter is case-insensitive', () => {
    expect(getAdapter('CURSOR')).toBe(cursorAdapter);
    expect(getAdapter('Windsurf')).toBe(windsurfAdapter);
  });

  test('getAdapter returns undefined for unknown tool', () => {
    expect(getAdapter('unknown-tool')).toBeUndefined();
  });

  test('listAdapters returns all adapters', () => {
    const adapters = listAdapters();
    
    expect(adapters).toContain('cursor');
    expect(adapters).toContain('windsurf');
    expect(adapters).toHaveLength(2);
  });
});

describe('Real Example Integration', () => {
  const loadExampleContext = (exampleName: string): Context | null => {
    const contextPath = join(EXAMPLES_DIR, exampleName, '.ai', 'context.json');
    
    if (!existsSync(contextPath)) {
      return null;
    }
    
    const content = readFileSync(contextPath, 'utf-8');
    return JSON.parse(content);
  };

  test('transforms minimal example to Cursor', () => {
    const context = loadExampleContext('minimal');
    if (!context) return;
    
    const result = cursorAdapter.transform(context);
    
    expect(result).toBeTruthy();
    expect(result).toContain('Generated from VERSA');
  });

  test('transforms typescript-project to Cursor', () => {
    const context = loadExampleContext('typescript-project');
    if (!context) return;
    
    const result = cursorAdapter.transform(context);
    
    expect(result).toContain('TypeScript');
    expect(result.length).toBeGreaterThan(100);
  });

  test('transforms typescript-project to Windsurf', () => {
    const context = loadExampleContext('typescript-project');
    if (!context) return;
    
    const result = windsurfAdapter.transform(context);
    const config = JSON.parse(result);
    
    expect(config.version).toBe('1.0');
    expect(config.name).toBeTruthy();
  });

  test('transforms enterprise example with permissions', () => {
    const context = loadExampleContext('enterprise');
    if (!context) return;
    
    // Cursor output
    const cursorOutput = cursorAdapter.transform(context);
    expect(cursorOutput).toContain('Permissions');
    
    // Windsurf output
    const windsurfOutput = windsurfAdapter.transform(context);
    const config = JSON.parse(windsurfOutput);
    expect(config.permissions).toBeDefined();
  });

  test('all adapters produce non-empty output for minimal context', () => {
    const context: Context = { version: '1.0' };
    
    const adapters = listAdapters();
    for (const adapterName of adapters) {
      const adapter = getAdapter(adapterName);
      if (!adapter) continue;
      
      const output = adapter.transform(context);
      expect(output.length).toBeGreaterThan(0);
    }
  });
});

describe('Adapter Metadata', () => {
  test('cursor adapter has correct metadata', () => {
    expect(cursorAdapter.name).toBe('cursor-adapter');
    expect(cursorAdapter.tool).toBe('cursor');
    expect(cursorAdapter.version).toBe('1.0.0');
  });

  test('windsurf adapter has correct metadata', () => {
    expect(windsurfAdapter.name).toBe('windsurf-adapter');
    expect(windsurfAdapter.tool).toBe('windsurf');
    expect(windsurfAdapter.version).toBe('1.0.0');
  });
});
