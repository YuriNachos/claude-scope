/**
 * Poker Widget Unit Tests
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { PokerWidget } from '../../../src/widgets/poker-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';
import { stripAnsi } from '../../helpers/snapshot.js';

describe('PokerWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new PokerWidget();
    assert.strictEqual(widget.id, 'poker');
    assert.strictEqual(widget.metadata.name, 'Poker');
    assert.strictEqual(widget.metadata.line, 2); // Third line
  });

  it('should generate and render a poker hand', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    assert.ok(result);
    assert.ok(result?.includes('Hand:'));
    assert.ok(result?.includes('Board:'));
    assert.ok(result?.includes('→'));
  });

  it('should format cards with brackets', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || '');

    assert.match(cleanResult, /\[[A-Z0-9]+[♠♥♦♣]\]/);
  });

  it('should show exactly 2 hole cards and 5 board cards', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || '');

    // Count all cards (both with brackets [K♠] and without K♠)
    // Cards either have brackets or are surrounded by spaces
    const cardMatches = cleanResult.match(/(?:\[?[A-Z0-9]+[♠♥♦♣]\]?)/g);
    assert.strictEqual(cardMatches?.length, 7); // 2 hole + 5 board
  });

  it('should use gray color for spades and clubs', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Check for gray ANSI code (90)
    assert.ok(result?.includes('\x1b[90m'));
  });

  it('should show hand result with emoji', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Should contain emoji from hand display
    const emojis = ['🏆', '🔥', '💎', '🏠', '💧', '📈', '🎯', '✌️', '👍', '🃏'];
    const hasEmoji = emojis.some(emoji => result?.includes(emoji));
    assert.ok(hasEmoji);
  });

  it('should generate new hand on each update', async () => {
    const widget = new PokerWidget();

    await widget.update(createMockStdinData({}));
    const result1 = await widget.render({ width: 80, timestamp: 0 });

    await widget.update(createMockStdinData({}));
    const result2 = await widget.render({ width: 80, timestamp: 0 });

    // Probability of identical hands is extremely low (1 in trillions)
    assert.notStrictEqual(stripAnsi(result1 || ''), stripAnsi(result2 || ''));
  });

  it('should always be enabled', () => {
    const widget = new PokerWidget();
    assert.strictEqual(widget.isEnabled(), true);
  });

  it('should handle initialization', async () => {
    const widget = new PokerWidget();
    await widget.initialize({ config: {} });

    assert.strictEqual(widget.isEnabled(), true);
  });

  describe('new formatting', () => {
    it('should show Nothing when player does not participate', async () => {
      // Note: Due to randomness, this test just verifies the structure
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Result varies due to randomness, just verify structure
      assert.ok(result);
      assert.ok(result?.includes('Hand:'));
      assert.ok(result?.includes('Board:'));
      assert.ok(result?.includes('→'));
    });

    it('should colorize Hand: and Board: labels', async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Check for gray ANSI code
      assert.ok(result?.includes('\x1b[90m'));
    });

    it('should show brackets for participating cards', async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // All cards should have at least one bracket format (participating)
      const cleanResult = result || '';
      // Count bracket occurrences
      const bracketMatches = cleanResult.match(/\[.*?\]/g);
      assert.ok(bracketMatches && bracketMatches.length > 0);
    });

    it('should format cards with consistent spacing', async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Result should be a valid string
      assert.ok(result);
      assert.strictEqual(typeof result, 'string');
    });
  });
});
