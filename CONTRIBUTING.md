# Contributing

Thank you for your interest in contributing to claude-scope!

## Setting Up

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/claude-scope.git`
3. Install dependencies: `npm install`
4. Install husky hooks: `npx husky install` (or just `npm install` which runs prepare script)

## Development Workflow

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm test`
4. Run linter: `npm run lint` or `npm run lint:fix`
5. Commit your changes: `git commit -m "feat: your message"`
6. Push to your fork: `git push origin feature/your-feature`
7. Create a pull request

## Pull Request Checks

All pull requests must pass these checks before merging:

- **Code Quality** - Biome linter and formatter checks
- **Tests** - All unit and integration tests pass

These checks run automatically on every push to your PR. You'll see the results in the PR's "Checks" tab.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Local Pre-Commit Hooks

This project uses husky + lint-staged to automatically format and check staged files before commit. If the pre-commit hook finds issues, it will either:
- Auto-fix formatting issues and re-stage the files
- Report lint errors that need manual fixing

You can bypass with `git commit --no-verify`, but please don't push code that doesn't pass CI!

## Questions?

Open an issue for discussion before starting major work.
