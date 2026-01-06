import { describe, it } from 'node:test';
import { expect } from 'chai';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

describe('CLI Entry Point', () => {
  describe('built distribution', () => {
    it('should have executable shebang', async () => {
      if (!existsSync('dist/index.js')) {
        console.log('Skipping: dist/index.js not found (run build first)');
        return;
      }

      const distIndex = await readFile('dist/index.js', 'utf-8');
      expect(distIndex).to.match(/^#!\/usr\/bin\/env node\n/);
    });
  });
});
