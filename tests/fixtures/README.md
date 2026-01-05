# Test Fixtures

This directory contains reusable test data fixtures for unit and integration tests.

## Fixture Files

### stdin-sample.json

Sample stdin data matching the `StdinData` interface from `src/types.ts`.

**Schema:**
```typescript
interface StdinData {
  session_id: string;
  cwd: string;
  model: {
    id: string;
    display_name: string;
  };
}
```

**Usage Example:**
```typescript
import sampleData from './fixtures/stdin-sample.json' with { type: 'json' };

// Use in tests
const mockStdinData: StdinData = sampleData;
```

### git-data.json

Sample git branch data matching the return type of `IGit.branch()` from `src/providers/git-provider.ts`.

**Schema:**
```typescript
interface GitBranchData {
  current: string | null;
  all: string[];
}
```

**Usage Example:**
```typescript
import gitData from './fixtures/git-data.json' with { type: 'json' };

// Mock IGit.branch() return value
vi.mocked(git.branch).mockResolvedValue(gitData);
```

## Guidelines

- Keep fixtures minimal and realistic
- Update fixture schemas when type definitions change
- Use import assertions (`with { type: 'json' }`) when importing in TypeScript
- Document any non-obvious values or edge cases in this README
