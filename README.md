# @dotaislash/adapters

**Transform VERSA configurations to tool-specific formats**

Version: 1.0.0

---

## Overview

Adapters convert VERSA `.ai/` configurations into formats that specific AI coding tools understand.

**v1.0.0 Supported Tools:**
- ✅ **Cursor** - Transforms to `.cursorrules` markdown format
- ✅ **Windsurf** - Transforms to `.windsurf/config.json` format

**Planned v1.1:**
- 🔴 **Cline** - `.clinerules` support
- 🔴 **Aider** - `.aider.conf.yml` support
- 🔴 **Continue** - `.continue/config.yaml` support

---

## Installation

```bash
bun add @dotaislash/adapters
```

---

## Usage

### Cursor Adapter

Transform VERSA config to Cursor `.cursorrules`:

```typescript
import { cursorAdapter } from '@dotaislash/adapters/cursor';
import { loadContext } from '@dotaislash/cli';

const context = loadContext('.ai');
const cursorrules = cursorAdapter.transform(context);

// Write to .cursorrules file
import { writeFileSync } from 'fs';
writeFileSync('.cursorrules', cursorrules);
```

**Output Format:**
```markdown
<!-- Generated from VERSA configuration -->

# My Project

Project description here

## AI Assistant Configuration

**Model:** claude-sonnet-4
**Temperature:** 0.7

## Guidelines

[Your rules here]

## Relevant Files

- `src/**/*.ts`
- `tests/**/*.test.ts`
```

---

### Windsurf Adapter

Transform VERSA config to Windsurf JSON:

```typescript
import { windsurfAdapter } from '@dotaislash/adapters/windsurf';
import { loadContext } from '@dotaislash/cli';

const context = loadContext('.ai');
const config = windsurfAdapter.transform(context, { format: true });

// Write to .windsurf/config.json
import { mkdirSync, writeFileSync } from 'fs';
mkdirSync('.windsurf', { recursive: true });
writeFileSync('.windsurf/config.json', config);
```

**Output Format:**
```json
{
  "version": "1.0",
  "name": "My Project",
  "model": {
    "name": "claude-sonnet-4",
    "temperature": 0.7
  },
  "context": {
    "files": ["src/**/*.ts"],
    "rules": ["...rule content..."]
  },
  "permissions": {
    "allowedFiles": ["src/**"],
    "deniedFiles": [".env*"]
  }
}
```

---

## API

### `getAdapter(tool: string)`

Get adapter by tool name:

```typescript
import { getAdapter } from '@dotaislash/adapters';

const adapter = getAdapter('cursor');
if (adapter) {
  const output = adapter.transform(context);
}
```

### `listAdapters()`

List all available adapters:

```typescript
import { listAdapters } from '@dotaislash/adapters';

const tools = listAdapters();
// ['cursor', 'windsurf']
```

---

## Adapter Interface

All adapters implement:

```typescript
interface Adapter<TOutput = string> {
  name: string;
  tool: string;
  version: string;
  
  transform(
    context: Context,
    options?: AdapterOptions
  ): TOutput;
  
  validate?(output: TOutput): ValidationResult;
}
```

### Options

```typescript
interface AdapterOptions {
  comments?: boolean;   // Include comments (default: true)
  format?: boolean;     // Pretty print (default: true)
  formatOptions?: Record<string, unknown>;
}
```

---

## Creating Custom Adapters

Extend `BaseAdapter` to create your own:

```typescript
import { BaseAdapter } from '@dotaislash/adapters';
import type { Context, AdapterOptions } from '@dotaislash/adapters';

export class MyToolAdapter extends BaseAdapter<string> {
  name = 'mytool-adapter';
  tool = 'mytool';
  version = '1.0.0';

  transform(context: Context, options?: AdapterOptions): string {
    // Transform logic here
    const settings = this.getModelSettings(context);
    const files = this.getFilePatterns(context);
    
    return `Config for MyTool\nModel: ${settings.model}`;
  }
}
```

---

## Examples

### Convert All Examples

```typescript
import { readdirSync } from 'fs';
import { cursorAdapter, windsurfAdapter } from '@dotaislash/adapters';
import { loadContext } from '@dotaislash/cli';

const examples = readdirSync('examples');

for (const example of examples) {
  const context = loadContext(`examples/${example}/.ai`);
  
  // Generate Cursor config
  const cursor = cursorAdapter.transform(context);
  writeFileSync(
    `examples/${example}/.cursorrules`,
    cursor
  );
  
  // Generate Windsurf config
  const windsurf = windsurfAdapter.transform(context);
  mkdirSync(`examples/${example}/.windsurf`, { recursive: true });
  writeFileSync(
    `examples/${example}/.windsurf/config.json`,
    windsurf
  );
}
```

---

## Testing

```bash
bun test
```

Tests cover:
- Transformation accuracy
- Option handling
- Edge cases
- Integration with CLI

---

## Supported Tools

| Tool | Format | Status | Adapter |
|------|--------|--------|---------|
| Cursor | Markdown (.cursorrules) | ✅ v1.0 | `cursorAdapter` |
| Windsurf | JSON (.windsurf/config.json) | ✅ v1.0 | `windsurfAdapter` |
| Cline | TBD | 🔜 Planned | - |
| Aider | TBD | 🔜 Planned | - |
| Continue | TBD | 🔜 Planned | - |

---

## Contributing

To add a new adapter:

1. Create `src/adapters/mytool.ts`
2. Extend `BaseAdapter`
3. Implement `transform()` method
4. Add tests in `tests/mytool.test.ts`
5. Export from `src/index.ts`

---

## License

MIT © dotAIslash

---

## Links

- [VERSA Specification](https://github.com/dotAIslash/dotaislash-spec)
- [CLI Tool](https://github.com/dotAIslash/dotaislash-cli)
- [Examples](https://github.com/dotAIslash/dotaislash-examples)
