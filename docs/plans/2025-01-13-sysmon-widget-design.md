# SysmonWidget Design Document

**Date:** 2025-01-13
**Status:** Design Approved
**Author:** Claude + User Collaboration

## Overview

SysmonWidget is a system monitoring widget that displays real-time system metrics (CPU, RAM, Disk, Network) in the terminal statusline. Unlike other widgets that receive data from Claude Code via stdin, SysmonWidget directly polls the system using an external provider.

## Key Requirements

- **Metrics:** CPU usage, RAM usage, Disk usage, Network speed
- **Update Interval:** Every 2-3 seconds
- **Data Source:** `systeminformation` npm package (cross-platform)
- **Zero Runtime Dependencies Exception:** Adding `systeminformation` as the only external runtime dependency
- **Styles:** balanced, compact, playful, verbose

## Architecture

### Widget Type

SysmonWidget implements `IWidget` directly (NOT `StdinDataWidget`) because it does not depend on Claude Code stdin data.

### Data Flow

```
SystemProvider (background)
       │
       ▼ (every 2-3 sec)
SystemMetrics { cpu, memory, disk, network }
       │
       ▼
SysmonWidget.render()
       │
       ▼
Styled output to terminal
```

### Components

```
src/
├── widgets/
│   └── sysmon/
│       ├── types.ts      # SystemMetrics interface
│       ├── styles.ts     # Style functions
│       └── index.ts      # Re-exports
├── widgets/
│   └── sysmon-widget.ts  # Main widget class
├── providers/
│   ├── system-provider.ts         # ISystemProvider + SystemProvider
│   └── mock-system-provider.ts    # Testing mock
└── ui/theme/
    └── types.ts        # Add ISysmonColors interface
```

## Data Structures

### SystemMetrics

```typescript
interface SystemMetrics {
  cpu: {
    percent: number;        // 0-100
  };
  memory: {
    used: number;           // GB
    total: number;          // GB
    percent: number;        // 0-100
  };
  disk: {
    used: number;           // GB
    total: number;          // GB
    percent: number;        // 0-100
  };
  network: {
    rx_sec: number;         // MB/s received
    tx_sec: number;         // MB/s sent
  };
}
```

### ISysmonColors (Theme)

```typescript
interface ISysmonColors {
  cpu: string;
  ram: string;
  disk: string;
  network: string;
  separator: string;
}
```

## Styles

### balanced

```
CPU 45% | RAM 8.2GB | Disk 60% | Net ↓2.1MB/s
```

### compact

```
CPU45% RAM8.2GB D60% ↓2.1MB/s
```

### playful

```
🖥️ 45% | 💾 8.2GB | 💿 60% | 🌐 ↓2.1MB/s
```

### verbose

```
CPU: 45% | RAM: 8.2GB/16GB | Disk: 120GB/200GB | Net: ↓2.1MB/s ↑0.5MB/s
```

## ISystemProvider Interface

```typescript
interface ISystemProvider {
  getMetrics(): Promise<SystemMetrics | null>;
  startUpdate(intervalMs: number, callback: (metrics: SystemMetrics) => void): void;
  stopUpdate(): void;
}
```

## Error Handling

| Situation | Behavior |
|-----------|----------|
| Library not installed | `isEnabled()` returns `false` |
| Error fetching metrics | `render()` returns `null` |
| First network poll | Shows `↓0MB/s` |
| No active network interface | Shows `Net N/A` |

### Error Logging

Errors are logged with throttling (max once per minute) to avoid console spam.

## Implementation Phases

1. **Provider Layer** - SystemProvider with systeminformation
2. **Type Definitions** - SystemMetrics, ISysmonColors
3. **Widget Class** - SysmonWidget implementing IWidget
4. **Style Functions** - All 4 styles with proper formatting
5. **Theme Integration** - Add colors to all 17 themes
6. **WidgetFactory Registration** - Add "sysmon" case
7. **Tests** - Unit tests for provider, widget, and styles

## Testing Requirements

| Component | Target Coverage |
|-----------|-----------------|
| SystemProvider | >70% |
| SysmonWidget | >80% |
| Styles | 100% (pure functions) |

### Test Scenarios

- Valid metrics returned correctly
- Null returned on error
- Style output format validation
- Start/stop update cycle
- First network poll returns 0 speed

## Dependencies

**New Runtime Dependency:**
- `systeminformation` - Cross-platform system information library

**Why systeminformation?**
- Active maintenance
- Cross-platform (macOS, Linux, Windows)
- Comprehensive metrics
- Promise-based API

## Configuration Example

```json
{
  "lines": {
    "2": [
      {
        "id": "sysmon",
        "style": "balanced",
        "colors": {
          "cpu": "#ff6b6b",
          "ram": "#4ecdc4",
          "disk": "#ffe66d",
          "network": "#95e1d3",
          "separator": "#6c757d"
        }
      }
    ]
  }
}
```

## Future Enhancements (Out of Scope)

- Temperature monitoring (CPU, GPU)
- Process-specific resource usage
- Historical data / sparklines
- Configurable metrics selection
- Alert thresholds (e.g., CPU > 90%)
