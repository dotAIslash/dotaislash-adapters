# Changelog

All notable changes to @dotaislash/adapters will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-17

### Added

- Initial release of adapters package
- **Cursor adapter** - Transform VERSA to `.cursorrules` markdown format
- **Windsurf adapter** - Transform VERSA to `.windsurf/config.json` JSON format
- Base adapter class for creating new adapters
- Adapter registry with `getAdapter()` and `listAdapters()` functions
- Comprehensive test suite (40+ tests)
- TypeScript types and interfaces for adapter system

### Features

#### Cursor Adapter
- Transforms VERSA context to markdown format
- Includes project metadata, rules, file patterns
- Handles permissions as constraints
- Removes YAML front matter from rules
- Configurable comments and formatting

#### Windsurf Adapter
- Transforms VERSA context to JSON format
- Includes model settings, context, permissions
- Supports Windsurf-specific features (streaming, autocomplete)
- Pretty-print formatting option
- Full JSON schema compliance

#### Adapter Framework
- `BaseAdapter` class with common utilities
- Type-safe `Adapter` interface
- Validation support
- Options system for customization

### Testing

- 20 tests for Cursor adapter
- 15 tests for Windsurf adapter
- 8 integration tests with real examples
- 100% pass rate

[1.0.0]: https://github.com/dotAIslash/dotaislash-adapters/releases/tag/v1.0.0
