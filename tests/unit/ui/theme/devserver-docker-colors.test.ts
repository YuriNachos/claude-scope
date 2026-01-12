/**
 * DevServer and Docker color types tests
 * Tests that new color interfaces exist and are properly typed
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import type {
  IDevServerColors,
  IDockerColors,
  IThemeColors,
} from "../../../../src/ui/theme/types.js";

describe("DevServer and Docker Color Types", () => {
  describe("IDevServerColors interface", () => {
    it("exists as a type", () => {
      // This test will fail if IDevServerColors is not exported
      const devServerColors: IDevServerColors = {
        name: "\x1b[38;2;136;192;208m",
        status: "\x1b[38;2;136;192;208m",
        label: "\x1b[38;2;136;192;208m",
      };

      expect(devServerColors).to.have.property("name");
      expect(devServerColors).to.have.property("status");
      expect(devServerColors).to.have.property("label");
    });

    it("has correct property types", () => {
      const devServerColors: IDevServerColors = {
        name: "test",
        status: "test",
        label: "test",
      };

      expect(typeof devServerColors.name).to.equal("string");
      expect(typeof devServerColors.status).to.equal("string");
      expect(typeof devServerColors.label).to.equal("string");
    });
  });

  describe("IDockerColors interface", () => {
    it("exists as a type", () => {
      // This test will fail if IDockerColors is not exported
      const dockerColors: IDockerColors = {
        label: "\x1b[38;2;136;192;208m",
        count: "\x1b[38;2;136;192;208m",
        running: "\x1b[38;2;136;192;208m",
        stopped: "\x1b[38;2;136;192;208m",
      };

      expect(dockerColors).to.have.property("label");
      expect(dockerColors).to.have.property("count");
      expect(dockerColors).to.have.property("running");
      expect(dockerColors).to.have.property("stopped");
    });

    it("has correct property types", () => {
      const dockerColors: IDockerColors = {
        label: "test",
        count: "test",
        running: "test",
        stopped: "test",
      };

      expect(typeof dockerColors.label).to.equal("string");
      expect(typeof dockerColors.count).to.equal("string");
      expect(typeof dockerColors.running).to.equal("string");
      expect(typeof dockerColors.stopped).to.equal("string");
    });
  });

  describe("IThemeColors includes new color sections", () => {
    it("includes devServer color section", () => {
      // This test verifies type-level compatibility
      // If IDevServerColors is not part of IThemeColors, this will fail at compile time
      const devServerColors: IDevServerColors = {
        name: "test",
        status: "test",
        label: "test",
      };

      const partialTheme: Partial<IThemeColors> = {
        devServer: devServerColors,
      };

      expect(partialTheme.devServer).to.exist;
      expect(partialTheme.devServer).to.have.property("name");
      expect(partialTheme.devServer).to.have.property("status");
      expect(partialTheme.devServer).to.have.property("label");
    });

    it("includes docker color section", () => {
      // This test verifies type-level compatibility
      // If IDockerColors is not part of IThemeColors, this will fail at compile time
      const dockerColors: IDockerColors = {
        label: "test",
        count: "test",
        running: "test",
        stopped: "test",
      };

      const partialTheme: Partial<IThemeColors> = {
        docker: dockerColors,
      };

      expect(partialTheme.docker).to.exist;
      expect(partialTheme.docker).to.have.property("label");
      expect(partialTheme.docker).to.have.property("count");
      expect(partialTheme.docker).to.have.property("running");
      expect(partialTheme.docker).to.have.property("stopped");
    });

    it("devServer has correct type structure", () => {
      const devServerColors: IDevServerColors = {
        name: "test",
        status: "test",
        label: "test",
      };

      // Verify the structure matches what IDevServerColors expects
      expect(devServerColors.name).to.be.a("string");
      expect(devServerColors.status).to.be.a("string");
      expect(devServerColors.label).to.be.a("string");
    });

    it("docker has correct type structure", () => {
      const dockerColors: IDockerColors = {
        label: "test",
        count: "test",
        running: "test",
        stopped: "test",
      };

      // Verify the structure matches what IDockerColors expects
      expect(dockerColors.label).to.be.a("string");
      expect(dockerColors.count).to.be.a("string");
      expect(dockerColors.running).to.be.a("string");
      expect(dockerColors.stopped).to.be.a("string");
    });
  });
});
