# RELEASE-PROCESS.md - Release & CI/CD Documentation

## Overview

This document covers the complete release process, CI/CD workflows, and development conventions.

---

## CI/CD System Overview

The project uses GitHub Actions with two separate workflows:

| Workflow | Triggers | Purpose | Runtime |
|----------|----------|---------|---------|
| **CI** | Push to `main`, PRs to `main` | Fast feedback | ~30-60s |
| **Release** | Git tags `v*.*.*` | Automated publishing | ~1-2min |

---

## CI Workflow (`.github/workflows/ci.yml`)

### Triggers
- Push to `main` branch
- Pull requests to `main` branch

### Jobs
- Code Quality (Biome)
- Tests (unit, integration, e2e)

---

## Release Workflow (`.github/workflows/release.yml`)

### Triggers
- Git tags matching `v*.*.*` pattern

### Steps
1. Checkout
2. Setup Node.js 20
3. Cache npm
4. Install dependencies
5. Code Quality checks
6. Run tests
7. Build (prepack hook)
8. Publish to npm
9. Create GitHub Release
10. Verify installation

---

## Complete Release Process

### Prerequisites
- All tasks complete
- All tests pass
- Code committed to `main`
- Working directory clean

---

### Step 1: Version Bump

```bash
npm version patch   # Bug fixes (default)
npm version minor   # New features
npm version major   # Breaking changes
```

---

### Step 2: Push to GitHub

```bash
git push
git push --tags
```

**Do NOT build locally** - CI/CD will build `dist/` files.

---

### Step 3: Monitor CI/CD

```bash
gh run watch
```

---

### Step 4: Handle Failures

```bash
# Check logs
gh run view --log-failed

# For version conflicts:
git tag -d v0.8.15 && git push --delete origin v0.8.15
git reset --hard HEAD~1
npm version 0.8.16
git push --force && git push --force --tags
```

---

### Step 5: Verify Release

```bash
gh release view
npm view claude-scope version
npm install -g claude-scope@latest
```

---

## Version Management

### Semantic Versioning

| Type | Format | Example | When to Use |
|------|--------|---------|-------------|
| Patch | 0.8.14 → 0.8.15 | Bug fixes | Default |
| Minor | 0.8.14 → 0.9.0 | New features | Backward-compatible |
| Major | 0.8.14 → 1.0.0 | Breaking changes | Incompatible |

**Git Tag Format**: `v*.*.*` (e.g., `v0.8.14`)

---

## npm Publishing

**Package name**: `claude-scope`

**Files included**:
- `dist/claude-scope.cjs`
- `README.md`
- `LICENSE.md`

---

## GitHub CLI

```bash
gh repo view           # View status
gh release list        # List releases
gh release view        # View release
gh run watch           # Monitor workflow
```

---

## Development Workflow

### Commit Messages

**Format**: `<type>[optional scope]: <description>`

**Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Package.json Scripts

```bash
npm run build          # Compile TypeScript
npm test               # Run all tests
npm run lint           # Run Biome linter
npm run format         # Format code
npm run check          # Run all checks
```

---

## Contributing

```bash
git clone https://github.com/yuriichukhlib/claude-scope.git
cd claude-scope
npm ci
npm test
```
