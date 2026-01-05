import { describe, it, mock, before } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';

describe('CLI Entry Point', () => {
  it('should be executable', async () => {
    const distIndex = await readFile('dist/index.js', 'utf-8');
    assert.match(distIndex, /^#!/);
    assert.match(distIndex, /node/);
  });

  it('should export main function', async () => {
    const { main } = await import('../../src/index.js');
    assert.strictEqual(typeof main, 'function');
  });
});
