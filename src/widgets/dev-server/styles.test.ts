import { describe, it } from "node:test";
import { expect } from "chai";
import { devServerStyles } from "./styles.js";
import type { DevServerRenderData } from "./types.js";

describe("DevServerWidget Styles", () => {
  describe("balanced", () => {
    it("should show server name with running status", () => {
      const data: DevServerRenderData = {
        server: { name: "Nuxt", icon: "⚡", isRunning: true, isBuilding: false },
      };
      const result = devServerStyles.balanced?.(data);
      expect(result).to.equal("⚡ Nuxt (running)");
    });
    it("should show server name with building status", () => {
      const data: DevServerRenderData = {
        server: { name: "Vite", icon: "⚡", isRunning: false, isBuilding: true },
      };
      const result = devServerStyles.balanced?.(data);
      expect(result).to.equal("⚡ Vite (building)");
    });
    it("should show server name with stopped status", () => {
      const data: DevServerRenderData = {
        server: { name: "Next.js", icon: "▲", isRunning: false, isBuilding: false },
      };
      const result = devServerStyles.balanced?.(data);
      expect(result).to.equal("▲ Next.js (stopped)");
    });
    it("should return empty string when no server detected", () => {
      const data: DevServerRenderData = { server: null };
      const result = devServerStyles.balanced?.(data);
      expect(result).to.equal("");
    });
  });
  describe("compact", () => {
    it("should show name with rocket icon when running", () => {
      const data: DevServerRenderData = {
        server: { name: "Nuxt", icon: "⚡", isRunning: true, isBuilding: false },
      };
      const result = devServerStyles.compact?.(data);
      expect(result).to.equal("⚡ Nuxt 🚀");
    });
    it("should show name with hammer icon when building", () => {
      const data: DevServerRenderData = {
        server: { name: "Remix", icon: "💿", isRunning: false, isBuilding: true },
      };
      const result = devServerStyles.compact?.(data);
      expect(result).to.equal("💿 Remix 🔨");
    });
  });
  describe("playful", () => {
    it("should show running emoji with server name", () => {
      const data: DevServerRenderData = {
        server: { name: "Svelte", icon: "🔥", isRunning: true, isBuilding: false },
      };
      const result = devServerStyles.playful?.(data);
      expect(result).to.equal("🏃 Svelte");
    });
  });
  describe("verbose", () => {
    it("should show full label with status", () => {
      const data: DevServerRenderData = {
        server: { name: "Astro", icon: "🚀", isRunning: true, isBuilding: false },
      };
      const result = devServerStyles.verbose?.(data);
      expect(result).to.equal("Dev Server: Astro (running)");
    });
  });
  describe("labeled", () => {
    it("should show Server label with colored status", () => {
      const data: DevServerRenderData = {
        server: { name: "Vite", icon: "⚡", isRunning: true, isBuilding: false },
      };
      const result = devServerStyles.labeled?.(data);
      expect(result).to.equal("Server: ⚡ Vite 🟢");
    });
  });
  describe("indicator", () => {
    it("should show bullet point with server", () => {
      const data: DevServerRenderData = {
        server: { name: "Nuxt", icon: "⚡", isRunning: true, isBuilding: false },
      };
      const result = devServerStyles.indicator?.(data);
      expect(result).to.equal("● ⚡ Nuxt");
    });
  });
});
