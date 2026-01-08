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

  describe("style renderers", () => {
    const testCost = 0.42;

    const createCostData = (cost: number) => ({
      cost: {
        total_cost_usd: cost,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0,
      },
    });

    describe("balanced style", () => {
      it("should render formatted cost", async () => {
        const widget = new CostWidget();
        widget.setStyle("balanced");
        await widget.update(createMockStdinData(createCostData(testCost)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("$0.42");
      });
    });

    describe("compact style", () => {
      it("should render formatted cost (same as balanced)", async () => {
        const widget = new CostWidget();
        widget.setStyle("compact");
        await widget.update(createMockStdinData(createCostData(testCost)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("$0.42");
      });
    });

    describe("playful style", () => {
      it("should render with money bag emoji", async () => {
        const widget = new CostWidget();
        widget.setStyle("playful");
        await widget.update(createMockStdinData(createCostData(testCost)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("💰 $0.42");
      });
    });

    describe("labeled style", () => {
      it("should render with label prefix", async () => {
        const widget = new CostWidget();
        widget.setStyle("labeled");
        await widget.update(createMockStdinData(createCostData(testCost)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Cost: $0.42");
      });
    });

    describe("indicator style", () => {
      it("should render with bullet indicator", async () => {
        const widget = new CostWidget();
        widget.setStyle("indicator");
        await widget.update(createMockStdinData(createCostData(testCost)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("● $0.42");
      });
    });

    describe("fancy style", () => {
      it("should render with french quotes", async () => {
        const widget = new CostWidget();
        widget.setStyle("fancy");
        await widget.update(createMockStdinData(createCostData(testCost)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("«$0.42»");
      });
    });

    describe("style switching", () => {
      it("should switch between styles dynamically", async () => {
        const widget = new CostWidget();
        await widget.update(createMockStdinData(createCostData(testCost)));

        widget.setStyle("balanced");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("$0.42");

        widget.setStyle("playful");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("💰 $0.42");

        widget.setStyle("fancy");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("«$0.42»");
      });

      it("should default to balanced for unknown styles", async () => {
        const widget = new CostWidget();
        await widget.update(createMockStdinData(createCostData(testCost)));

        // @ts-expect-error - testing invalid style
        widget.setStyle("unknown" as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("$0.42");
      });
    });
  });
});
