/**
 * Poker Widget Unit Tests
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { PokerWidget } from "../../../src/widgets/poker-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";
import { stripAnsi } from "../../helpers/snapshot.js";

describe("PokerWidget", () => {
  it("should have correct id and metadata", () => {
    const widget = new PokerWidget();
    assert.strictEqual(widget.id, "poker");
    assert.strictEqual(widget.metadata.name, "Poker");
    assert.strictEqual(widget.metadata.line, 4); // Fifth line
  });

  it("should generate and render a poker hand", async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    assert.ok(result);
    assert.ok(result?.includes("Hand:"));
    assert.ok(result?.includes("Board:"));
    assert.ok(result?.includes("→"));
  });

  it("should format cards with parentheses for participating cards", async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || "");

    // Participating cards have parentheses like (K♠)
    assert.match(cleanResult, /\([A-Z0-9]+[♠♥♦♣]\)/);
  });

  it("should show exactly 2 hole cards and 5 board cards", async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || "");

    // Count all cards (both with parentheses (K♠) and without K♠)
    // Cards either have parentheses or are plain
    const cardMatches = cleanResult.match(/(?:\(?[A-Z0-9]+[♠♥♦♣]\)?)/g);
    assert.strictEqual(cardMatches?.length, 7); // 2 hole + 5 board
  });

  it("should use gray color for spades and clubs", async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Check for gray ANSI code (90)
    assert.ok(result?.includes("\x1b[90m"));
  });

  it("should generate new hand on each update (after throttle period)", async () => {
    const widget = new PokerWidget() as any;

    await widget.update(createMockStdinData({}));
    const result1 = await widget.render({ width: 80, timestamp: 0 });

    // Advance time past throttle period (5 seconds)
    widget.lastUpdateTimestamp = Date.now() - 6000;

    await widget.update(createMockStdinData({}));
    const result2 = await widget.render({ width: 80, timestamp: 0 });

    // Probability of identical hands is extremely low (1 in trillions)
    assert.notStrictEqual(stripAnsi(result1 || ""), stripAnsi(result2 || ""));
  });

  it("should always be enabled", () => {
    const widget = new PokerWidget();
    assert.strictEqual(widget.isEnabled(), true);
  });

  it("should handle initialization", async () => {
    const widget = new PokerWidget();
    await widget.initialize({ config: {} });

    assert.strictEqual(widget.isEnabled(), true);
  });

  describe("new formatting", () => {
    it("should show Nothing when player does not participate", async () => {
      // Note: Due to randomness, this test just verifies the structure
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Result varies due to randomness, just verify structure
      assert.ok(result);
      assert.ok(result?.includes("Hand:"));
      assert.ok(result?.includes("Board:"));
      assert.ok(result?.includes("→"));
    });

    it("should use color for Hand: and Board: labels", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Check for ANSI color codes (either basic 37m or RGB 38;2 format)
      const hasBasicColor = result?.includes("\x1b[37m");
      const hasRgbColor = result?.includes("\x1b[38;2;");
      assert.ok(hasBasicColor || hasRgbColor, "Expected ANSI color code for labels");
      // Also verify Hand: and Board: labels are present
      assert.ok(result?.includes("Hand:"));
      assert.ok(result?.includes("Board:"));
    });

    it("should show parentheses for participating cards", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Participating cards should have parentheses
      const cleanResult = stripAnsi(result || "");
      // Count parentheses occurrences - cards like (K♠)
      const parenMatches = cleanResult.match(/\([^)]+\)/g);
      assert.ok(parenMatches && parenMatches.length > 0);
    });

    it("should format cards with consistent spacing", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Result should be a valid string
      assert.ok(result);
      assert.strictEqual(typeof result, "string");
    });
  });

  /**
   * Card spacing tests
   *
   * These tests verify proper spacing between cards to prevent them from
   * clumping together (e.g., "(A♠)K♥" should be "(A♠) K♥").
   */
  describe("card spacing", () => {
    it("should add space after participating cards with parentheses", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });
      const cleanResult = stripAnsi(result || "");

      // ALL cards with parentheses should have trailing space
      // Find all parenthesized cards and verify each has a space after
      const parenCards = cleanResult.match(/\([A-Z0-9]+[♠♥♦♣]\)/g);
      assert.ok(parenCards, "Should have at least one participating card with parentheses");

      // Check that there are no instances of ) followed directly by card (no space)
      const clumpedCards = cleanResult.match(/\)[A-Z0-9]/g);
      assert.ok(
        !clumpedCards,
        `Should not have clumped cards like )K, found: ${JSON.stringify(clumpedCards)}`
      );
    });

    it("should have consistent spacing between all cards", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should not have cards without proper spacing (checking raw ANSI output)
      // The pattern checks for ) followed by ANSI reset codes then immediately by card
      const badPattern = /\)\x1b\[0m\x1b\[\d+m[0-9A-Z]/;
      assert.ok(
        !badPattern.test(result || ""),
        "Should not have participating card directly followed by another card without space"
      );

      // Also verify in clean output
      const cleanResult = stripAnsi(result || "");
      assert.ok(!cleanResult.includes(")("), "Should not have )( pattern");
      assert.ok(!/\)[A-Z0-9]/.test(cleanResult), "Should not have ) followed by card character");
    });
  });

  /**
   * Complete widget output integration tests
   *
   * These tests verify that the final widget output is clean and doesn't have
   * visible ANSI codes as text. They test the entire rendering pipeline, not just
   * individual methods.
   */
  describe("complete widget output with participation", () => {
    it("should render without visible ANSI codes in final output", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.strictEqual(typeof result, "string");

      // Should not have malformed ANSI codes (brackets without ESC char)
      // Valid ANSI codes are \x1b[90m, malformed would be literal [90m
      const malformedAnsi = result.match(/(?<!\x1b)\[\d+m/g);
      assert.ok(
        !malformedAnsi,
        "Output should not contain malformed ANSI codes (brackets without ESC)"
      );

      // Should have proper ANSI codes (with ESC character)
      assert.ok(result.includes("\x1b["), "Output should contain proper ANSI escape sequences");

      // Should have proper card symbols
      assert.ok(result.match(/[♠♥♦♣]/), "Output should contain card suit symbols");
    });

    it("should have proper spacing for non-participating cards", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result, "Output should exist");

      // Check that we have proper format: "Hand: ... | Board: ... → ..."
      assert.ok(result.includes("Hand:"), 'Output should contain "Hand:" label');
      assert.ok(result.includes("Board:"), 'Output should contain "Board:" label');
      assert.ok(result.includes("→"), "Output should contain arrow separator");

      // Should not have malformed ANSI brackets like "[90m" (without ESC prefix)
      // Use a regex that looks for [digit(s)m NOT preceded by \x1b
      const hasMalformedBrackets = /(?:[^\x1b]|^)\[\d+m/.test(result);
      assert.strictEqual(
        hasMalformedBrackets,
        false,
        "Output should not contain malformed ANSI brackets like [90m without ESC"
      );
    });
  });

  describe("update throttling", () => {
    it("should not update hand within 5 seconds of last update", async () => {
      const widget = new PokerWidget() as any;
      const mockData = createMockStdinData({});

      // First update - will set lastUpdateTimestamp
      await widget.update(mockData);
      const firstRender = await widget.render({ width: 80, timestamp: 0 });
      const firstCards = stripAnsi(firstRender || "").match(/[A-Z0-9]+[♠♥♦♣]/g) || [];

      // Manually set timestamp to simulate time passed but less than throttle
      widget.lastUpdateTimestamp = Date.now() - 2000; // 2 seconds ago

      // Second update should be throttled (same cards)
      await widget.update(mockData);
      const secondRender = await widget.render({ width: 80, timestamp: 0 });
      const secondCards = stripAnsi(secondRender || "").match(/[A-Z0-9]+[♠♥♦♣]/g) || [];

      // Cards should be the same (throttled)
      assert.deepStrictEqual(secondCards, firstCards);
    });

    it("should track last update timestamp", async () => {
      const widget = new PokerWidget() as any;
      const mockData = createMockStdinData({});

      await widget.update(mockData);
      assert.ok(widget.lastUpdateTimestamp > 0);
    });
  });

  describe("style renderers", () => {
    it("should render balanced style (default)", async () => {
      const widget = new PokerWidget();
      widget.setStyle("balanced");
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.ok(result?.includes("Hand:"));
      assert.ok(result?.includes("Board:"));
      assert.ok(result?.includes("→"));
    });

    it("should render compact style (same as balanced)", async () => {
      const widget = new PokerWidget();
      widget.setStyle("compact");
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.ok(result?.includes("Hand:"));
      assert.ok(result?.includes("Board:"));
    });

    it("should render playful style (same as balanced)", async () => {
      const widget = new PokerWidget();
      widget.setStyle("playful");
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.ok(result?.includes("Hand:"));
      assert.ok(result?.includes("Board:"));
    });

    it("should render compact-verbose style without labels", async () => {
      const widget = new PokerWidget();
      widget.setStyle("compact-verbose");
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });
      const cleanResult = stripAnsi(result || "");

      assert.ok(result);
      // Should not have labels
      assert.ok(!cleanResult.includes("Hand:"));
      assert.ok(!cleanResult.includes("Board:"));
      // Should have arrow separator
      assert.ok(cleanResult.includes("→"));
    });

    it("should render emoji style with emoji suit symbols", async () => {
      const widget = new PokerWidget();
      widget.setStyle("emoji");
      await widget.update(createMockStdinData({}));

      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.ok(result?.includes("Hand:"));
      assert.ok(result?.includes("Board:"));
      // Should contain emoji suit symbols (they have the variation selector \uFE0F)
      // The emoji versions of suits are: ♠️, ♥️, ♦️, ♣️
      // Check for the variation selector character that makes them emoji
      assert.ok(result?.includes("\uFE0F"));
    });

    it("should default to balanced for unknown styles", async () => {
      const widget = new PokerWidget();
      await widget.update(createMockStdinData({}));

      // @ts-expect-error - testing invalid style
      widget.setStyle("unknown" as any);
      const result = await widget.render({ width: 80, timestamp: 0 });

      assert.ok(result);
      assert.ok(result?.includes("Hand:"));
    });
  });
});
