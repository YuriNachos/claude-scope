/**
 * Unit tests for CostWidget
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { CostWidget } from "../../../src/widgets/cost-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";

describe("CostWidget", () => {
  it("should have correct id and metadata", () => {
    const widget = new CostWidget();
    expect(widget.id).to.equal("cost");
    expect(widget.metadata.name).to.equal("Cost");
  });

  it("should format small cost (< $0.01)", async () => {
    const widget = new CostWidget();
    await widget.update(
      createMockStdinData({
        cost: {
          total_cost_usd: 0.0012,
          total_duration_ms: 0,
          total_api_duration_ms: 0,
          total_lines_added: 0,
          total_lines_removed: 0,
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal("$0.00");
  });

  it("should format normal cost ($0.01 - $100)", async () => {
    const widget = new CostWidget();
    await widget.update(
      createMockStdinData({
        cost: {
          total_cost_usd: 1.23,
          total_duration_ms: 0,
          total_api_duration_ms: 0,
          total_lines_added: 0,
          total_lines_removed: 0,
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal("$1.23");
  });

  it("should format large cost (>= $100)", async () => {
    const widget = new CostWidget();
    await widget.update(
      createMockStdinData({
        cost: {
          total_cost_usd: 123.45,
          total_duration_ms: 0,
          total_api_duration_ms: 0,
          total_lines_added: 0,
          total_lines_removed: 0,
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal("$123.45");
  });

  it("should handle zero cost", async () => {
    const widget = new CostWidget();
    await widget.update(
      createMockStdinData({
        cost: {
          total_cost_usd: 0,
          total_duration_ms: 0,
          total_api_duration_ms: 0,
          total_lines_added: 0,
          total_lines_removed: 0,
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal("$0.00");
  });
});
