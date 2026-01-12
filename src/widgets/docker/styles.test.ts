import { describe, it } from "node:test";
import { expect } from "chai";
import { dockerStyles } from "./styles.js";
import type { DockerRenderData } from "./types.js";

describe("DockerWidget Styles", () => {
  const runningData: DockerRenderData = {
    status: { running: 3, total: 5, isAvailable: true },
  };
  const emptyData: DockerRenderData = {
    status: { running: 0, total: 0, isAvailable: true },
  };

  describe("balanced", () => {
    it("should show Docker label with count and status", () => {
      const result = dockerStyles.balanced?.(runningData);
      expect(result).to.equal("Docker: 3/5 🟢");
    });
    it("should show only count when total equals running", () => {
      const data: DockerRenderData = {
        status: { running: 3, total: 3, isAvailable: true },
      };
      const result = dockerStyles.balanced?.(data);
      expect(result).to.equal("Docker: 3 🟢");
    });
    it("should return empty string when no containers running", () => {
      const result = dockerStyles.balanced?.(emptyData);
      expect(result).to.equal("");
    });
  });
  describe("compact", () => {
    it("should show whale emoji with count", () => {
      const result = dockerStyles.compact?.(runningData);
      expect(result).to.equal("🐳 3/5");
    });
    it("should return empty string when no containers", () => {
      const result = dockerStyles.compact?.(emptyData);
      expect(result).to.equal("");
    });
  });
  describe("playful", () => {
    it("should show whale, label, count, and status", () => {
      const result = dockerStyles.playful?.(runningData);
      expect(result).to.equal("🐳 Docker: 3/5 🟢");
    });
    it("should show sleeping emoji when no containers", () => {
      const result = dockerStyles.playful?.(emptyData);
      expect(result).to.equal("🐳 Docker: 💤");
    });
  });
  describe("verbose", () => {
    it("should show full description", () => {
      const result = dockerStyles.verbose?.(runningData);
      expect(result).to.equal("Docker: 3 running / 5 total");
    });
    it("should show message when no containers", () => {
      const result = dockerStyles.verbose?.(emptyData);
      expect(result).to.equal("Docker: no containers running");
    });
  });
  describe("labeled", () => {
    it("should show Docker label with count", () => {
      const result = dockerStyles.labeled?.(runningData);
      expect(result).to.equal("Docker: 3/5");
    });
    it("should show dashes when no containers", () => {
      const result = dockerStyles.labeled?.(emptyData);
      expect(result).to.equal("Docker: --");
    });
  });
  describe("indicator", () => {
    it("should show bullet with label and count", () => {
      const result = dockerStyles.indicator?.(runningData);
      expect(result).to.equal("● Docker: 3/5");
    });
    it("should show bullet with dashes when empty", () => {
      const result = dockerStyles.indicator?.(emptyData);
      expect(result).to.equal("● Docker: --");
    });
  });
});
