# CHANGELOG.md - Version History & Bug Fixes

## Version History

### v0.8.14 (2026-01-12) - Current Stable

**Latest version**: v0.8.14

**Recent commits:**
- Enhanced port+process detection for dev server widget
- Unified shared types for dev server detectors
- Process detector extraction for better maintainability

---

### Recent Versions

| Version | Date | Key Changes |
|---------|------|-------------|
| v0.8.13 | 2026-01-12 | Dev server detection improvements |
| v0.8.12 | 2026-01-12 | Dev server bug fixes |
| v0.8.11 | 2026-01-12 | DevServerWidget and DockerWidget registration |
| v0.8.10 | 2026-01-12 | DevServer & Docker widgets implementation |
| v0.8.8 | 2026-01-12 | CI/CD improvements |
| v0.8.7 | 2026-01-12 | Config-driven refactor with WidgetFactory |
| v0.8.6 | 2026-01-12 | Widget line assignment from config |
| v0.8.5 | 2026-01-11 | Config-based line assignment |
| v0.8.4 | 2026-01-11 | Mock providers, theme color support |
| v0.8.0 | 2026-01-11 | Quick-config with live preview |
| v0.7.0 | 2026-01-11 | Session cache |
| v0.6.17 | 2026-01-09 | ActiveToolsWidget sorting by usage |
| v0.6.11 | 2026-01-09 | CacheMetricsWidget, ActiveToolsWidget |
| v0.6.2 | 2026-01-09 | 17-theme implementation |
| v0.6.0 | 2026-01-09 | Widget Style System |

---

## All Bug Fixes with Details

### v0.8.14 - Current
- Enhanced port+process detection for dev server widget
- Unified shared types for dev server detectors
- Process detector extraction for better maintainability

### v0.8.13
- Fixed false positives from shell history in dev server detection
- Improved port detection patterns

### v0.8.12
- Enhanced dev server detection patterns
- Better process identification

### v0.8.9 - Critical Cache Bug Fix

**Issue**: Cache hit rate showing >100% (e.g., 520059%)

**Root Cause**: The `input_tokens` field only contains NEW (non-cached) tokens, not total input tokens

**Solution**: Corrected formula:
```
cache_hit_rate = cache_read_tokens / (cache_read_tokens + cache_write_tokens + input_tokens) * 100
```

**Impact**: Cache percentage now accurately represents true cache hit rate (0-100%)

**Affected Widget**: CacheMetricsWidget

### v0.8.8 - CI/CD Improvements
- Added build step before tests in release workflow
- Improved CI reliability

### v0.8.4
- Theme color support for ConfigCountWidget
- CacheMetricsWidget emoji removal from balanced style

### v0.8.1
- Emoji test compatibility with CI

### v0.7.0
- Session change detection and cache reset functionality

### v0.6.15
- Theme system migration
- CacheMetricsWidget style updates

### v0.6.10
- Poker widget emoji rendering fixes for CI
- Wheel straight detection fix

### v0.6.8
- CI test compatibility for emoji rendering

### v0.6.7
- CI test fixes for poker widget

### v0.6.6
- Coverage threshold adjustments

### v0.6.4
- Coverage threshold implementation

### v0.6.3
- Widget feature flags for easy disabling

---

## Feature Timeline

### Core Architecture
- **v0.6.0**: Widget Style System with functional renderers
- **v0.6.1**: Unified theme system migration started
- **v0.6.2**: Complete 17-theme implementation
- **v0.6.17**: ActiveToolsWidget with sorting
- **v0.8.0**: Three-stage quick-config with live preview

### Widget Implementations
- **v0.5.5**: GitWidget with changes display
- **v0.6.11**: ActiveToolsWidget and CacheMetricsWidget
- **v0.8.10**: DevServerWidget and DockerWidget

### Theme System
- **v0.6.1**: Theme system foundation
- **v0.6.2**: 17 themes implemented
- **v0.6.15**: Default theme changed to Monokai
- **v0.6.17**: Tool and cache colors added

### Configuration
- **v0.6.3**: Widget feature flags
- **v0.6.7**: Config-driven refactor
- **v0.6.17**: WidgetFactory for centralized instantiation
- **v0.8.0**: Quick-config with live preview

---

## Breaking Changes and Migrations

### v0.6.0 - Style System Migration
- **Change**: Removed old renderer class pattern
- **Migration**: Functional style renderers replaced class-based approach
- **Impact**: All widgets refactored to use new style system

### v0.6.1 - Theme System Migration
- **Change**: Unified theme system with IThemeColors interface
- **Migration**: All widgets migrated to use single theme object
- **Impact**: Consistent theming across all widgets

### v0.6.15 - Default Theme Change
- **Change**: Default theme changed from VSCode Dark+ to Monokai
- **Migration**: Users expecting VSCode colors may need to explicitly set theme

### v0.6.17 - Style System Changes
- **Change**: Removed fancy style from all widgets
- **Migration**: Updated documentation and tests

### v0.8.0 - Quick-Config Introduction
- **Change**: Three-stage interactive configuration
- **Migration**: Configuration now interactive with live preview

---

## Planned Features / Roadmap

### High Priority
- **JSON Config Parser** - Full configuration file format
- **Widget Presets** - compact.json, detailed.json, minimal.json
- **Theme Customization** - Custom color themes via configuration

### Medium Priority
- **SQLite-based Persistence** - Session history and analytics
- **Session Store** - Track session duration, model, tokens
- **Analytics Store** - Aggregate statistics and trends

### Low Priority
- **Session Widget** - Session duration and analytics
- **Agents Widget** - Running agents display
- **Todos Widget** - Task progress tracking
- **Analytics Widget** - Session insights and trends

---

## Known Issues

### CI/CD
- **Emoji Rendering**: Some emoji styles fail on CI due to Node 20 rendering
- **Status**: Tests are skipped on CI
- **Workaround**: Disable emoji tests in CI environment

### Theme System
- **Default Theme**: Changed from VSCode Dark+ to Monokai in v0.6.15
- **Impact**: Users expecting VSCode colors need to explicitly set theme
- **Status**: Documented and intentional

### Widget System
- **Feature Flags**: Widget can be disabled via configuration
- **Status**: Working as intended

---

## Git Tags Reference

All versions follow semantic versioning:
- `v0.8.14` - Current stable (2026-01-12)
- `v0.8.10` - DevServer & Docker widgets (2026-01-12)
- `v0.8.0` - Quick-config (2026-01-11)
- `v0.6.17` - ActiveTools sorting (2026-01-09)
- `v0.6.11` - New widgets (2026-01-09)
- `v0.6.9` - Critical cache fix (2026-01-09)
- `v0.6.2` - Theme system (2026-01-09)
- `v0.6.0` - Style system (2026-01-09)
- `v0.5.5` - Git changes (2026-01-09)

---

## Release Process Summary

1. Version bump via `npm version patch/minor/major`
2. Automatic git tag creation
3. CI/CD pipeline handles:
   - Code quality checks (Biome)
   - Test execution
   - Build compilation
   - npm publishing
   - GitHub release creation

All releases are automated and require no manual intervention after the version bump.
