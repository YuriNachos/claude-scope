#!/usr/bin/env node

/**
 * Give a built file its executable bit.
 *
 * The build used to end in `chmod +x`, which does not exist under cmd.exe and
 * took the whole `npm run build` down with it on Windows. Written as a script
 * rather than an inline `node -e` so the npm script carries no nested quoting -
 * the same cross-shell trap in a different shape.
 *
 * Usage: node scripts/mark-executable.mjs <file>...
 */

import { chmodSync } from "node:fs";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("mark-executable: expected at least one file");
  process.exit(1);
}

for (const file of files) {
  // A no-op on Windows, where the concept does not exist; the `bin` entry needs
  // it everywhere else.
  chmodSync(file, 0o755);
}
