import { describe, it } from "node:test";
import { expect } from "chai";
import type { IContextColors, ILinesColors, ITheme } from "../../../../src/ui/theme/types.js";

describe("IContextColors", () => {
  it("should accept valid color configuration", () => {
    const colors: IContextColors = {
      low: "\x1b[32m",
      medium: "\x1b[33m",
      high: "\x1b[31m",
      bar: "\x1b[36m",
    };
    expect(colors.low).to.be.a("string");
    expect(colors.medium).to.be.a("string");
    expect(colors.high).to.be.a("string");
    expect(colors.bar).to.be.a("string");
  });

  it("should accept gray colors for all states", () => {
    const colors: IContextColors = {
      low: "\x1b[90m",
      medium: "\x1b[90m",
      high: "\x1b[90m",
      bar: "\x1b[90m",
    };
    expect(colors.low).to.equal("\x1b[90m");
    expect(colors.medium).to.equal("\x1b[90m");
    expect(colors.high).to.equal("\x1b[90m");
    expect(colors.bar).to.equal("\x1b[90m");
  });
});

describe("ILinesColors", () => {
  it("should accept valid color configuration", () => {
    const colors: ILinesColors = {
      added: "\x1b[32m",
      removed: "\x1b[31m",
    };
    expect(colors.added).to.be.a("string");
    expect(colors.removed).to.be.a("string");
  });

  it("should accept gray colors for added/removed", () => {
    const colors: ILinesColors = {
      added: "\x1b[90m",
      removed: "\x1b[90m",
    };
    expect(colors.added).to.equal("\x1b[90m");
    expect(colors.removed).to.equal("\x1b[90m");
  });
});

describe("ITheme", () => {
  it("should accept partial theme with context colors", () => {
    const partialTheme: Partial<ITheme> = {
      colors: {
        context: {
          low: "\x1b[90m",
          medium: "\x1b[90m",
          high: "\x1b[90m",
          bar: "\x1b[90m",
        },
      } as any,
    };
    expect(partialTheme.colors).to.exist;
    expect(partialTheme.colors?.context?.low).to.equal("\x1b[90m");
  });

  it("should accept partial theme with lines colors", () => {
    const partialTheme: Partial<ITheme> = {
      colors: {
        lines: {
          added: "\x1b[90m",
          removed: "\x1b[90m",
        },
      } as any,
    };
    expect(partialTheme.colors).to.exist;
    expect(partialTheme.colors?.lines?.added).to.equal("\x1b[90m");
  });

  it("should accept empty partial theme", () => {
    const partialTheme: Partial<ITheme> = {};
    expect(Object.keys(partialTheme).length).to.equal(0);
  });
});
