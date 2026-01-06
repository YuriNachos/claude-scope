/**
 * Unit tests for StdinProvider with Zod validation
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { StdinProvider, StdinParseError, StdinValidationError } from '../../../src/providers/stdin-provider.js';

describe('StdinProvider', () => {
  const validInput = JSON.stringify({
    hook_event_name: 'Status',
    session_id: 'test-123',
    transcript_path: '/test/transcript.json',
    cwd: '/test/project',
    model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
    workspace: { current_dir: '/test/project', project_dir: '/test/project' },
    version: '1.0.0',
    output_style: { name: 'default' },
    context_window: {
      total_input_tokens: 1000,
      total_output_tokens: 500,
      context_window_size: 200000,
      current_usage: null
    }
  });

  describe('parse', () => {
    it('should parse valid stdin data', async () => {
      const provider = new StdinProvider();
      const result = await provider.parse(validInput);

      expect(result.session_id).to.equal('test-123');
      expect(result.model.display_name).to.equal('Opus 4.5');
      expect(result.cwd).to.equal('/test/project');
    });

    it('should parse valid stdin data with cost info', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        hook_event_name: 'Status',
        session_id: 'test-123',
        transcript_path: '/test/transcript.json',
        cwd: '/test/project',
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
        workspace: { current_dir: '/test/project', project_dir: '/test/project' },
        version: '1.0.0',
        output_style: { name: 'default' },
        cost: {
          total_cost_usd: 0.01
        },
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: null
        }
      });

      const result = await provider.parse(input);

      expect(result.cost?.total_cost_usd).to.equal(0.01);
    });

    it('should parse valid stdin data with current_usage', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        hook_event_name: 'Status',
        session_id: 'test-123',
        transcript_path: '/test/transcript.json',
        cwd: '/test/project',
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
        workspace: { current_dir: '/test/project', project_dir: '/test/project' },
        version: '1.0.0',
        output_style: { name: 'default' },
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 500,
            output_tokens: 200,
            cache_creation_input_tokens: 100,
            cache_read_input_tokens: 50
          }
        }
      });

      const result = await provider.parse(input);

      expect(result.context_window.current_usage).to.not.be.null;
      expect(result.context_window.current_usage?.input_tokens).to.equal(500);
    });

    it('should handle valid JSON with extra fields (Zod strips unknown)', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        hook_event_name: 'Status',
        session_id: 'test-123',
        transcript_path: '/test/transcript.json',
        cwd: '/test/project',
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
        workspace: { current_dir: '/test/project', project_dir: '/test/project' },
        version: '1.0.0',
        output_style: { name: 'default' },
        extra_field: 'some value',  // Extra field
        another_field: 123,
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: null
        }
      });

      const result = await provider.parse(input);

      expect(result.session_id).to.equal('test-123');
      // Zod strips unknown fields by default
      expect(result).to.not.have.property('extra_field');
    });

    it('should throw StdinParseError on empty input', async () => {
      const provider = new StdinProvider();

      await expect(provider.parse(''))
        .to.be.rejectedWith(StdinParseError, 'stdin data is empty');
    });

    it('should throw StdinParseError on whitespace-only input', async () => {
      const provider = new StdinProvider();

      await expect(provider.parse('   '))
        .to.be.rejectedWith(StdinParseError, 'stdin data is empty');
    });

    it('should throw StdinParseError on invalid JSON', async () => {
      const provider = new StdinProvider();

      await expect(provider.parse('invalid json'))
        .to.be.rejectedWith(StdinParseError, 'Invalid JSON');
    });

    it('should throw StdinValidationError on missing required fields', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        session_id: 'test-123'
        // Missing: hook_event_name, cwd, model, etc.
      });

      await expect(provider.parse(input))
        .to.be.rejectedWith(StdinValidationError, 'Validation failed');
    });

    it('should throw StdinValidationError with detailed path on missing field', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        hook_event_name: 'Status',
        session_id: 'test-123',
        transcript_path: '/test/transcript.json',
        // Missing: cwd
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
        workspace: { current_dir: '/test/project', project_dir: '/test/project' },
        version: '1.0.0',
        output_style: { name: 'default' },
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: null
        }
      });

      await expect(provider.parse(input))
        .to.be.rejectedWith(StdinValidationError)
        .and.to.eventually.include('cwd');
    });

    it('should throw StdinValidationError on wrong hook_event_name literal', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        hook_event_name: 'WrongEvent',
        session_id: 'test-123',
        transcript_path: '/test/transcript.json',
        cwd: '/test/project',
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
        workspace: { current_dir: '/test/project', project_dir: '/test/project' },
        version: '1.0.0',
        output_style: { name: 'default' },
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: null
        }
      });

      await expect(provider.parse(input))
        .to.be.rejectedWith(StdinValidationError);
    });

    it('should throw StdinValidationError on invalid model.id type', async () => {
      const provider = new StdinProvider();
      const input = JSON.stringify({
        hook_event_name: 'Status',
        session_id: 'test-123',
        transcript_path: '/test/transcript.json',
        cwd: '/test/project',
        model: { id: 123, display_name: 'Opus 4.5' },  // id should be string
        workspace: { current_dir: '/test/project', project_dir: '/test/project' },
        version: '1.0.0',
        output_style: { name: 'default' },
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: null
        }
      });

      await expect(provider.parse(input))
        .to.be.rejectedWith(StdinValidationError);
    });
  });

  describe('safeParse', () => {
    it('should return success result for valid input', async () => {
      const provider = new StdinProvider();
      const result = await provider.safeParse(validInput);

      expect(result.success).to.be.true;
      if (result.success) {
        expect(result.data.session_id).to.equal('test-123');
      }
    });

    it('should return error result for invalid input', async () => {
      const provider = new StdinProvider();
      const result = await provider.safeParse('invalid');

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error).to.be.a('string');
        expect(result.error).to.include('Invalid JSON');
      }
    });

    it('should return error result for empty input', async () => {
      const provider = new StdinProvider();
      const result = await provider.safeParse('');

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error).to.include('stdin data is empty');
      }
    });
  });
});
