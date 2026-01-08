/**
 * Unit tests for formatter utilities
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import {
  formatDuration,
  formatCostUSD,
  progressBar,
  getContextColor,
} from "../../../src/ui/utils/formatters.js";

describe("formatDuration", () => {
  describe("seconds only", () => {
    it("should format zero milliseconds", () => {
      expect(formatDuration(0)).to.equal("0s");
    });

    it("should format milliseconds less than 1 second", () => {
      expect(formatDuration(999)).to.equal("0s");
    });

    it("should format 1 second", () => {
      expect(formatDuration(1000)).to.equal("1s");
    });

    it("should format 45 seconds", () => {
      expect(formatDuration(45000)).to.equal("45s");
    });

    it("should format 59 seconds", () => {
      expect(formatDuration(59000)).to.equal("59s");
    });
  });

  describe("minutes and seconds", () => {
    it("should format 1 minute", () => {
      expect(formatDuration(60000)).to.equal("1m 0s");
    });

    it("should format 1 minute 30 seconds", () => {
      expect(formatDuration(90000)).to.equal("1m 30s");
    });

    it("should format 5 minutes 30 seconds", () => {
      expect(formatDuration(330000)).to.equal("5m 30s");
    });

    it("should format 59 minutes 59 seconds", () => {
      expect(formatDuration(3599000)).to.equal("59m 59s");
    });
  });

  describe("hours, minutes, and seconds", () => {
    it("should format 1 hour", () => {
      expect(formatDuration(3600000)).to.equal("1h 0m 0s");
    });

    it("should format 1 hour 1 minute 5 seconds", () => {
      expect(formatDuration(3665000)).to.equal("1h 1m 5s");
    });

    it("should format 2 hours 15 minutes", () => {
      expect(formatDuration(8100000)).to.equal("2h 15m 0s");
    });

    it("should format 5 hours 30 minutes 15 seconds", () => {
      expect(formatDuration(19815000)).to.equal("5h 30m 15s");
    });
  });

  describe("edge cases", () => {
    it("should handle negative values as zero", () => {
      expect(formatDuration(-1000)).to.equal("0s");
    });

    it("should handle very large values", () => {
      expect(formatDuration(3661000000)).to.equal("1016h 56m 40s");
    });
  });
});

describe("formatCostUSD", () => {
  describe("very small values (< $0.01)", () => {
    it("should format 0 dollars", () => {
      expect(formatCostUSD(0)).to.equal("$0.00");
    });

    it("should format fractional cents with 2 decimals", () => {
      expect(formatCostUSD(0.00123)).to.equal("$0.00");
    });

    it("should format just below $0.01", () => {
      expect(formatCostUSD(0.00999)).to.equal("$0.01");
    });
  });

  describe("normal values ($0.01 - $100)", () => {
    it("should format $0.01", () => {
      expect(formatCostUSD(0.01)).to.equal("$0.01");
    });

    it("should format $1.234", () => {
      expect(formatCostUSD(1.234)).to.equal("$1.23");
    });

    it("should format $12.50", () => {
      expect(formatCostUSD(12.5)).to.equal("$12.50");
    });

    it("should format $99.99", () => {
      expect(formatCostUSD(99.99)).to.equal("$99.99");
    });
  });

  describe("large values (>= $100)", () => {
    it("should format $100", () => {
      expect(formatCostUSD(100)).to.equal("$100.00");
    });

    it("should format $123.45", () => {
      expect(formatCostUSD(123.45)).to.equal("$123.45");
    });

    it("should format $1000.99", () => {
      expect(formatCostUSD(1000.99)).to.equal("$1000.99");
    });
  });

  describe("edge cases", () => {
    it("should handle negative values", () => {
      expect(formatCostUSD(-1.23)).to.equal("$-1.23");
    });

    it("should handle very small values", () => {
      expect(formatCostUSD(0.000001)).to.equal("$0.00");
    });
  });
});

describe("progressBar", () => {
  describe("default width (20)", () => {
    it("should return empty bar for 0%", () => {
      expect(progressBar(0)).to.equal("░░░░░░░░░░░░░░░░░░░░");
    });

    it("should return full bar for 100%", () => {
      expect(progressBar(100)).to.equal("████████████████████");
    });

    it("should return half-filled bar for 50%", () => {
      expect(progressBar(50)).to.equal("██████████░░░░░░░░░░");
    });

    it("should return quarter-filled bar for 25%", () => {
      expect(progressBar(25)).to.equal("█████░░░░░░░░░░░░░░░");
    });

    it("should return three-quarter filled bar for 75%", () => {
      expect(progressBar(75)).to.equal("███████████████░░░░░");
    });
  });

  describe("custom width", () => {
    it("should handle width of 10", () => {
      expect(progressBar(50, 10)).to.equal("█████░░░░░");
    });

    it("should handle width of 30", () => {
      expect(progressBar(33, 30)).to.equal("██████████░░░░░░░░░░░░░░░░░░░░");
    });

    it("should handle width of 5", () => {
      expect(progressBar(40, 5)).to.equal("██░░░");
    });
  });

  describe("edge cases", () => {
    it("should clamp values above 100%", () => {
      expect(progressBar(150)).to.equal("████████████████████");
    });

    it("should clamp values below 0%", () => {
      expect(progressBar(-10)).to.equal("░░░░░░░░░░░░░░░░░░░░");
    });

    it("should handle floating point precision", () => {
      expect(progressBar(33.333)).to.have.lengthOf(20);
    });
  });
});

describe("getContextColor", () => {
  describe("low usage (< 50%)", () => {
    it("should return green for 0%", () => {
      expect(getContextColor(0)).to.equal("\x1b[32m");
    });

    it("should return green for 25%", () => {
      expect(getContextColor(25)).to.equal("\x1b[32m");
    });

    it("should return green for 49%", () => {
      expect(getContextColor(49)).to.equal("\x1b[32m");
    });
  });

  describe("medium usage (50-79%)", () => {
    it("should return yellow for 50%", () => {
      expect(getContextColor(50)).to.equal("\x1b[33m");
    });

    it("should return yellow for 65%", () => {
      expect(getContextColor(65)).to.equal("\x1b[33m");
    });

    it("should return yellow for 79%", () => {
      expect(getContextColor(79)).to.equal("\x1b[33m");
    });
  });

  describe("high usage (>= 80%)", () => {
    it("should return red for 80%", () => {
      expect(getContextColor(80)).to.equal("\x1b[31m");
    });

    it("should return red for 90%", () => {
      expect(getContextColor(90)).to.equal("\x1b[31m");
    });

    it("should return red for 100%", () => {
      expect(getContextColor(100)).to.equal("\x1b[31m");
    });
  });

  describe("edge cases", () => {
    it("should clamp values below 0%", () => {
      expect(getContextColor(-10)).to.equal("\x1b[32m");
    });

    it("should clamp values above 100%", () => {
      expect(getContextColor(150)).to.equal("\x1b[31m");
    });

    it("should return ANSI escape codes", () => {
      const color = getContextColor(50);
      expect(color).to.match(/^\x1b\[\d+m$/);
    });
  });
});
