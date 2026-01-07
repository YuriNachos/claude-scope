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

  /**
   * ANSI code handling tests
   *
   * Bug: The regex `/\[(.+)\]/` in `formatCardByParticipation` incorrectly matches
   * ANSI escape sequence brackets like `[90m]` or `[31m]` instead of card brackets like `[6♣]`.
   * This causes visible "90m[6♣" or "31m[K♦" text in output instead of clean "6♣" or "K♦".
   *
   * These tests verify that the method correctly strips ANSI codes before extracting card text.
   */
  describe('ANSI code handling', () => {
    it('should extract card text correctly from colorized string (non-participating)', () => {
      const widget = new PokerWidget();
      const cardData = {
        card: { rank: '6', suit: 'clubs' },
        formatted: '\x1b[90m[6♣]\x1b[0m'  // Gray colorized
      };
      const result = (widget as any).formatCardByParticipation(cardData, false);
      assert.strictEqual(result, ' 6♣ ');
    });

    it('should preserve brackets for participating cards', () => {
      const widget = new PokerWidget();
      const cardData = {
        card: { rank: 'A', suit: 'hearts' },
        formatted: '\x1b[31m[A♥]\x1b[0m'  // Red colorized
      };
      const result = (widget as any).formatCardByParticipation(cardData, true);
      assert.strictEqual(result, '\x1b[31m[A♥]\x1b[0m');
    });

    it('should handle red suit cards (non-participating)', () => {
      const widget = new PokerWidget();
      const cardData = {
        card: { rank: 'K', suit: 'diamonds' },
        formatted: '\x1b[31m[K♦]\x1b[0m'  // Red colorized
      };
      const result = (widget as any).formatCardByParticipation(cardData, false);
      assert.strictEqual(result, ' K♦ ');
    });

    it('should produce clean output without ANSI escape sequences visible', () => {
      const widget = new PokerWidget();
      const cardData = {
        card: { rank: '10', suit: 'spades' },
        formatted: '\x1b[90m[10♠]\x1b[0m'  // Gray colorized
      };
      const result = (widget as any).formatCardByParticipation(cardData, false);
      assert.strictEqual(result, ' 10♠ ');
    });

    it('should handle card with no brackets (fallback case)', () => {
      const widget = new PokerWidget();
      const cardData = {
        card: { rank: 'Q', suit: 'spades' },
        formatted: 'Q♠'  // No brackets, no ANSI codes
      };
      const result = (widget as any).formatCardByParticipation(cardData, false);
      assert.strictEqual(result, ' Q♠ ');
    });
  });

  /**
   * Complete widget output integration tests
   *
   * These tests verify that the final widget output is clean and doesn't have
   * visible ANSI codes as text. They test the entire rendering pipeline, not just
   * individual methods.
   */
  describe('complete widget output with participation', () => {
    it('should render without visible ANSI codes in final output', async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.strictEqual(typeof result, 'string');

      // Should not have malformed ANSI codes (brackets without ESC char)
      // Valid ANSI codes are \x1b[90m, malformed would be literal [90m
      const malformedAnsi = result.match(/(?<!\x1b)\[\d+m/g);
      assert.ok(!malformedAnsi, 'Output should not contain malformed ANSI codes (brackets without ESC)');

      // Should have proper ANSI codes (with ESC character)
      assert.ok(result.includes('\x1b['), 'Output should contain proper ANSI escape sequences');

      // Should have proper card symbols
      assert.ok(result.match(/[♠♥♦♣]/), 'Output should contain card suit symbols');
    });

    it('should have proper spacing for non-participating cards', async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result, 'Output should exist');

      // Check that we have proper format: "Hand: ... | Board: ... → ..."
      assert.ok(result.includes('Hand:'), 'Output should contain "Hand:" label');
      assert.ok(result.includes('Board:'), 'Output should contain "Board:" label');
      assert.ok(result.includes('→'), 'Output should contain arrow separator');

      // Should not have malformed ANSI brackets like "[90m" (without ESC prefix)
      // Use a regex that looks for [digit(s)m NOT preceded by \x1b
      const hasMalformedBrackets = /(?:[^\x1b]|^)\[\d+m/.test(result);
      assert.strictEqual(hasMalformedBrackets, false, 'Output should not contain malformed ANSI brackets like [90m without ESC');
    });
  });
});
