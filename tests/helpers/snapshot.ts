/**
 * Simple snapshot testing helper for Node.js test runner
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

const SNAPSHOTS_DIR = 'tests/snapshots';

export interface SnapshotOptions {
  /**
   * Update snapshot instead of comparing
   */
  update?: boolean;
}

/**
 * Match a value against a stored snapshot
 */
export async function matchSnapshot(
  testName: string,
  actual: unknown,
  options: SnapshotOptions = {}
): Promise<void> {
  const { update = process.env.SNAPSHOT_UPDATE === 'true' } = options;

  // Sanitize test name for filename
  const filename = testName
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
  const filepath = join(SNAPSHOTS_DIR, `${filename}.json`);

  if (update || !existsSync(filepath)) {
    // Create snapshot directory if needed
    if (!existsSync(SNAPSHOTS_DIR)) {
      await mkdir(SNAPSHOTS_DIR, { recursive: true });
    }

    // Write snapshot
    await writeFile(filepath, JSON.stringify(actual, null, 2) + '\n');
    console.log(`✓ Snapshot created: ${filename}.json`);
    return;
  }

  // Compare with existing snapshot
  const snapshotContent = await readFile(filepath, 'utf-8');
  const expected = JSON.parse(snapshotContent);

  const actualStr = JSON.stringify(actual, null, 2);
  const expectedStr = JSON.stringify(expected, null, 2);

  if (actualStr !== expectedStr) {
    throw new Error(
      `Snapshot mismatch for ${testName}\n` +
      `Expected:\n${expectedStr}\n\n` +
      `Received:\n${actualStr}\n\n` +
      `Run with SNAPSHOT_UPDATE=true to update`
    );
  }
}

/**
 * Remove ANSI color codes from string for consistent snapshots
 */
export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}
