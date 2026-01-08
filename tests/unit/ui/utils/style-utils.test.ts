import assert from "node:assert";
import { describe, it } from "node:test";
import {
  formatTokens,
  progressBar,
  withAngleBrackets,
  withBrackets,
  withFancy,
  withIndicator,
  withLabel,
} from "../../../../src/ui/utils/style-utils.js";

describe("style-utils", () => {
  describe("withLabel", () => {
    it("should add label prefix to value", () => {
      assert.equal(withLabel("Model", "Opus 4.5"), "Model: Opus 4.5");
    });

    it("should handle empty prefix", () => {
      assert.equal(withLabel("", "Opus 4.5"), "Opus 4.5");
    });
  });

  describe("withIndicator", () => {
    it("should add indicator prefix to value", () => {
      assert.equal(withIndicator("Opus 4.5"), "● Opus 4.5");
    });
  });

  describe("withFancy", () => {
    it("should wrap value in french quotes", () => {
      assert.equal(withFancy("Opus 4.5"), "«Opus 4.5»");
    });
  });

  describe("withBrackets", () => {
    it("should wrap value in square brackets", () => {
      assert.equal(withBrackets("Opus 4.5"), "[Opus 4.5]");
    });
  });

  describe("withAngleBrackets", () => {
    it("should wrap value in angle brackets", () => {
      assert.equal(withAngleBrackets("71%"), "⟨71%⟩");
    });
  });

  describe("formatTokens", () => {
    it("should format thousands with K suffix", () => {
      assert.equal(formatTokens(142847), "142K");
      assert.equal(formatTokens(200000), "200K");
    });

    it("should format values below 1000 without suffix", () => {
      assert.equal(formatTokens(999), "999");
      assert.equal(formatTokens(0), "0");
    });

    it("should handle edge cases", () => {
      assert.equal(formatTokens(1000), "1K");
      assert.equal(formatTokens(999999), "999K"); // No M suffix for simplicity
    });
  });

  describe("progressBar", () => {
    it("should show correct progress at 0%", () => {
      assert.equal(progressBar(0, 10), "░░░░░░░░░░");
    });

    it("should show correct progress at 50%", () => {
      assert.equal(progressBar(50, 10), "█████░░░░░");
    });

    it("should show correct progress at 100%", () => {
      assert.equal(progressBar(100, 10), "██████████");
    });

    it("should clamp percentage to 0-100 range", () => {
      assert.equal(progressBar(-10, 10), "░░░░░░░░░░");
      assert.equal(progressBar(150, 10), "██████████");
    });

    it("should support custom width", () => {
      assert.equal(progressBar(50, 5), "███░░");
      assert.equal(progressBar(100, 20), "████████████████████");
    });

    it("should use default width of 10", () => {
      assert.equal(progressBar(30), "███░░░░░░░");
    });
  });
});
