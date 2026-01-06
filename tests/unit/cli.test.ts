import { describe, it } from 'node:test';
import { expect } from 'chai';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { main } from '#/index.js';

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

  describe('main export', () => {
    it('should export main function', async () => {
      expect(main).to.be.a('function');
    });

    it('should return Promise<string>', async () => {
      const result = main();
      expect(result).to.be.a('promise');
      expect(await result).to.be.a('string');
    });
  });
});
