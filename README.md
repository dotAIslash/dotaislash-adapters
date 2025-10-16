<div align="center">

# 🔌 VERSA Adapters

### Transform VERSA configs to native tool formats

[![npm](https://img.shields.io/npm/v/@dotaislash/adapters?style=for-the-badge&logo=npm&color=violet)](https://www.npmjs.com/package/@dotaislash/adapters)
[![License](https://img.shields.io/badge/License-MIT-cyan?style=for-the-badge)](LICENSE)
[![Discussions](https://img.shields.io/github/discussions/dotAIslash/dotaislash-adapters?style=for-the-badge&logo=github&color=lime)](https://github.com/dotAIslash/dotaislash-adapters/discussions)

[**Supported Tools**](#-supported-tools) · [**VERSA Spec**](https://github.com/dotAIslash/dotaislash-spec) · [**Build an Adapter**](#-build-your-own-adapter)

</div>

---

## 🎯 What are Adapters?

**Adapters transform** your portable `.ai/` folder into native configuration formats for specific AI coding tools.

```
.ai/ folder  →  Adapter  →  Tool-specific config

VERSA        →  Cursor   →  .cursorrules + workspace.json
VERSA        →  Windsurf →  .windsurf/config.json
VERSA        →  Aider    →  .aider.conf.yml
```

**Write once, run everywhere.**

---

## ✨ Why Adapters?

### Without Adapters
```
your-project/
├── .cursorrules              # Cursor config
├── .aider.conf.yml           # Aider config
├── .windsurf/config.json     # Windsurf config
└── claude-project.json       # Claude config
```
😫 **4 different files, 4 different formats, constant sync issues**

### With VERSA + Adapters
```
your-project/
└── .ai/
    ├── context.json          # One source of truth
    └── profiles/
        ├── cursor.json       # Minimal overrides
        └── windsurf.json     # Minimal overrides
```
✨ **One folder, automatic transformation, always in sync**

---

## 🚀 Supported Tools

<table>
<tr>
<td width="50%">

### ✅ **Production Ready**

- 🟣 **Cursor** - `.cursorrules` + workspace settings
- 🔵 **Windsurf** - Native configuration
- 🟢 **Claude Projects** - Context + instructions
- 🟡 **Aider** - YAML configuration

</td>
<td width="50%">

### ⏳ **Coming Soon**

- ⚪ **GitHub Copilot** - Settings + context
- ⚪ **Cody** - Sourcegraph integration
- ⚪ **Tabnine** - Configuration
- ⚪ **Cline** - VSCode extension

</td>
</tr>
</table>

---

## 📦 Installation

```bash
# npm
npm install @dotaislash/adapters

# yarn
yarn add @dotaislash/adapters

# pnpm
pnpm add @dotaislash/adapters
```

---

## 🔧 Usage

### CLI Usage

```bash
# Transform for all tools
versa adapt

# Transform for specific tool
versa adapt --tool cursor
versa adapt --tool windsurf
versa adapt --tool aider

# Preview without writing
versa adapt --tool cursor --dry-run

# Custom output location
versa adapt --tool cursor --output ./config/cursor
```

### Programmatic Usage

```typescript
import { CursorAdapter, WindsurfAdapter } from '@dotaislash/adapters';
import { readVersaConfig } from '@dotaislash/cli';

// Read VERSA config
const versaConfig = await readVersaConfig('.ai');

// Transform to Cursor format
const cursorAdapter = new CursorAdapter();
const cursorConfig = await cursorAdapter.transform(versaConfig);

// Write to Cursor files
await cursorConfig.writeTo('.cursorrules');

// Transform to Windsurf format
const windsurfAdapter = new WindsurfAdapter();
const windsurfConfig = await windsurfAdapter.transform(versaConfig);
await windsurfConfig.writeTo('.windsurf/config.json');
```

---

## 🎨 Adapter Details

### Cursor Adapter

Transforms VERSA config to Cursor's `.cursorrules` and workspace settings.

**Output:**
```
project/
├── .cursorrules              # Rules as plain text
└── .vscode/
    └── settings.json         # Cursor-specific settings
```

**Example:**
```typescript
import { CursorAdapter } from '@dotaislash/adapters';

const adapter = new CursorAdapter({
  rulesFormat: 'markdown',    // or 'plaintext'
  includeWorkspace: true,
  mergeExisting: true
});

const result = await adapter.transform(versaConfig);
```

---

### Windsurf Adapter

Transforms VERSA config to Windsurf's native JSON format.

**Output:**
```
project/
└── .windsurf/
    ├── config.json
    └── agents/
        └── *.json
```

**Example:**
```typescript
import { WindsurfAdapter } from '@dotaislash/adapters';

const adapter = new WindsurfAdapter({
  version: '2.0',
  prettify: true
});

const result = await adapter.transform(versaConfig);
```

---

### Aider Adapter

Transforms VERSA config to Aider's YAML configuration.

**Output:**
```
project/
└── .aider.conf.yml
```

**Example:**
```typescript
import { AiderAdapter } from '@dotaislash/adapters';

const adapter = new AiderAdapter({
  model: 'gpt-4',
  autoCommit: false
});

const result = await adapter.transform(versaConfig);
```

---

### Claude Adapter

Transforms VERSA config to Claude Projects format.

**Output:**
```
project/
└── .claude/
    ├── project.json
    └── instructions.md
```

**Example:**
```typescript
import { ClaudeAdapter } from '@dotaislash/adapters';

const adapter = new ClaudeAdapter({
  projectName: 'My Project',
  includeInstructions: true
});

const result = await adapter.transform(versaConfig);
```

---

## 🎯 Mapping Reference

### How VERSA maps to each tool

| VERSA Concept | Cursor | Windsurf | Aider | Claude |
|---------------|--------|----------|-------|--------|
| Rules | `.cursorrules` | `rules/*.md` | Comments | Instructions |
| Settings | Workspace | `config.json` | `.aider.conf.yml` | `project.json` |
| Agents | N/A | `agents/*.json` | N/A | N/A |
| Tools | N/A | MCP servers | N/A | N/A |
| Permissions | Workspace | `config.json` | CLI flags | N/A |

---

## 🧪 Testing Your Adapter

```bash
# Test transformation
pnpm test:adapter cursor

# Validate output
pnpm test:validate cursor-output

# Compare with expected
pnpm test:compare cursor
```

---

## 🛠️ Build Your Own Adapter

### 1. Extend BaseAdapter

```typescript
import { BaseAdapter, AdapterResult } from '@dotaislash/adapters';
import { VersaConfig } from '@dotaislash/schemas';

export class MyToolAdapter extends BaseAdapter {
  async transform(config: VersaConfig): Promise<AdapterResult> {
    // Transform logic here
    const output = {
      tool_config: {
        rules: config.rules,
        settings: this.mapSettings(config.settings)
      }
    };

    return {
      files: [
        {
          path: '.mytool/config.json',
          content: JSON.stringify(output, null, 2)
        }
      ],
      warnings: [],
      metadata: {
        adapter: 'mytool',
        version: '1.0.0'
      }
    };
  }

  private mapSettings(settings: any) {
    // Map VERSA settings to tool format
    return {
      model: settings.model,
      temperature: settings.temperature
    };
  }
}
```

### 2. Add Tests

```typescript
import { MyToolAdapter } from './mytool-adapter';

describe('MyToolAdapter', () => {
  it('transforms VERSA config correctly', async () => {
    const adapter = new MyToolAdapter();
    const result = await adapter.transform(mockVersaConfig);
    
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('.mytool/config.json');
  });
});
```

### 3. Register Adapter

```typescript
// src/index.ts
export { MyToolAdapter } from './adapters/mytool-adapter';
```

### 4. Submit PR

```bash
git add .
git commit -m "feat: add MyTool adapter"
gh pr create --title "Add MyTool adapter"
```

---

## 📚 Adapter API

### BaseAdapter

Base class for all adapters:

```typescript
abstract class BaseAdapter {
  abstract transform(config: VersaConfig): Promise<AdapterResult>;
  
  validate(config: VersaConfig): ValidationResult;
  preview(config: VersaConfig): string;
  supports(feature: string): boolean;
}
```

### AdapterResult

```typescript
interface AdapterResult {
  files: Array<{
    path: string;
    content: string;
  }>;
  warnings: string[];
  metadata: {
    adapter: string;
    version: string;
    timestamp?: string;
  };
}
```

---

## 🎓 Examples

### Transform for CI/CD

```yaml
# .github/workflows/transform.yml
name: Transform VERSA Config

on: [push]

jobs:
  transform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @dotaislash/cli @dotaislash/adapters
      - run: versa adapt --tool cursor --tool windsurf
      - run: git add .cursorrules .windsurf/
      - run: git commit -m "chore: update tool configs" || true
```

### Transform on File Change

```typescript
import { watch } from 'fs';
import { CursorAdapter } from '@dotaislash/adapters';

watch('.ai', async (event, filename) => {
  console.log(`${filename} changed, regenerating configs...`);
  
  const adapter = new CursorAdapter();
  const config = await readVersaConfig('.ai');
  const result = await adapter.transform(config);
  
  await result.writeTo('.');
  console.log('Configs updated!');
});
```

---

## 📊 Status

| Adapter | Status | Version | Maintainer |
|---------|--------|---------|------------|
| Cursor | 🟡 Beta | 0.1.0 | [@dotAIslash](https://github.com/dotAIslash) |
| Windsurf | 🟡 Beta | 0.1.0 | [@dotAIslash](https://github.com/dotAIslash) |
| Aider | 🔴 Planned | - | Looking for maintainer |
| Claude | 🔴 Planned | - | Looking for maintainer |

---

## 🤝 Contributing

We need your help building adapters!

### Priority List

1. 🔴 Aider adapter
2. 🔴 Claude Projects adapter
3. 🔴 GitHub Copilot adapter
4. 🔴 Cody adapter

### How to Help

- 🔧 **Build an adapter** for your favorite tool
- 🐛 **Report bugs** in existing adapters
- 📝 **Improve documentation**
- 🧪 **Add test cases**

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © [dotAIslash](https://github.com/dotAIslash)

---

<div align="center">

**Making VERSA work everywhere**

[Spec](https://github.com/dotAIslash/dotaislash-spec) · [CLI](https://github.com/dotAIslash/dotaislash-cli) · [Schemas](https://github.com/dotAIslash/dotaislash-schemas) · [Examples](https://github.com/dotAIslash/dotaislash-examples)

[⭐ Star us on GitHub](https://github.com/dotAIslash/dotaislash-adapters) · [💬 Discussions](https://github.com/dotAIslash/dotaislash-adapters/discussions)

</div>
