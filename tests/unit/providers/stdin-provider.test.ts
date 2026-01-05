import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import { StdinProvider } from '../../../src/providers/stdin-provider.js';
import type { StdinData } from '../../../src/types.js';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('StdinProvider', () => {
  describe('parse', () => {
    it('should parse valid JSON from stdin', async () => {
      const mockStdin = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      };

      const provider = new StdinProvider();
      const result = await provider.parse(JSON.stringify(mockStdin));

      expect(result).to.deep.equal(mockStdin);
    });

    it('should parse valid JSON from fixture file', async () => {
      const fixturePath = join(process.cwd(), 'tests/fixtures/stdin-sample.json');
      const fixtureData = readFileSync(fixturePath, 'utf-8');

      const provider = new StdinProvider();
      const result = await provider.parse(fixtureData);

      expect(result.session_id).to.equal('session_20250105_123045');
      expect(result.cwd).to.equal('/Users/user/project');
      expect(result.model.id).to.equal('claude-opus-4-5-20251101');
      expect(result.model.display_name).to.equal('Claude Opus 4.5');
    });

    it('should throw error on malformed JSON', async () => {
      const provider = new StdinProvider();

      try {
        await provider.parse('{ invalid json }');
        throw new Error('Expected parse to throw StdinParseError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('Failed to parse stdin data');
      }
    });

    it('should throw error when session_id is missing', async () => {
      const invalidData = {
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      };

      const provider = new StdinProvider();

      try {
        await provider.parse(JSON.stringify(invalidData));
        throw new Error('Expected parse to throw StdinValidationError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('validation');
      }
    });

    it('should throw error when cwd is missing', async () => {
      const invalidData = {
        session_id: 'session_20250105_123045',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      };

      const provider = new StdinProvider();

      try {
        await provider.parse(JSON.stringify(invalidData));
        throw new Error('Expected parse to throw StdinValidationError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('validation');
      }
    });

    it('should throw error when model is missing', async () => {
      const invalidData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project'
      };

      const provider = new StdinProvider();

      try {
        await provider.parse(JSON.stringify(invalidData));
        throw new Error('Expected parse to throw StdinValidationError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('validation');
      }
    });

    it('should throw error when model.id is missing', async () => {
      const invalidData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          display_name: 'Claude Opus 4.5'
        }
      };

      const provider = new StdinProvider();

      try {
        await provider.parse(JSON.stringify(invalidData));
        throw new Error('Expected parse to throw StdinValidationError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('validation');
      }
    });

    it('should throw error when model.display_name is missing', async () => {
      const invalidData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101'
        }
      };

      const provider = new StdinProvider();

      try {
        await provider.parse(JSON.stringify(invalidData));
        throw new Error('Expected parse to throw StdinValidationError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('validation');
      }
    });

    it('should throw error on empty input', async () => {
      const provider = new StdinProvider();

      try {
        await provider.parse('');
        throw new Error('Expected parse to throw StdinParseError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('stdin data is empty');
      }
    });

    it('should throw error on whitespace-only input', async () => {
      const provider = new StdinProvider();

      try {
        await provider.parse('   ');
        throw new Error('Expected parse to throw StdinParseError');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('stdin data is empty');
      }
    });

    it('should handle valid JSON with extra fields', async () => {
      const mockStdin = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        },
        extra_field: 'some value',
        another_field: 123
      };

      const provider = new StdinProvider();
      const result = await provider.parse(JSON.stringify(mockStdin));

      expect(result.session_id).to.equal('session_20250105_123045');
      expect(result.cwd).to.equal('/Users/user/project');
      expect(result.model.id).to.equal('claude-opus-4-5-20251101');
      expect(result.model.display_name).to.equal('Claude Opus 4.5');
    });
  });

  describe('validate', () => {
    it('should return true for valid data', () => {
      const provider = new StdinProvider();
      const validData: StdinData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      };

      expect(provider.validate(validData)).to.be.true;
    });

    it('should return false when session_id is missing', () => {
      const provider = new StdinProvider();
      const invalidData = {
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      } as any;

      expect(provider.validate(invalidData)).to.be.false;
    });

    it('should return false when cwd is missing', () => {
      const provider = new StdinProvider();
      const invalidData = {
        session_id: 'session_20250105_123045',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      } as any;

      expect(provider.validate(invalidData)).to.be.false;
    });

    it('should return false when model is missing', () => {
      const provider = new StdinProvider();
      const invalidData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project'
      } as any;

      expect(provider.validate(invalidData)).to.be.false;
    });

    it('should return false when model.id is missing', () => {
      const provider = new StdinProvider();
      const invalidData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          display_name: 'Claude Opus 4.5'
        }
      } as any;

      expect(provider.validate(invalidData)).to.be.false;
    });

    it('should return false when model.display_name is missing', () => {
      const provider = new StdinProvider();
      const invalidData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101'
        }
      } as any;

      expect(provider.validate(invalidData)).to.be.false;
    });
  });
});
