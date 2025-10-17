// File: dotaislash-adapters/vitest.config.ts
// What: Vitest configuration for adapter tests
// Why: Test transformations to tool-specific formats
// Related: tests/*.test.ts

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
