import assert from "node:assert";
import { describe, it } from "node:test";
import { validateConfig } from "../../../src/config/config-validator.js";
import { DEFAULT_WIDGET_STYLE } from "../../../src/core/style-types.js";

const KNOWN_WIDGET_IDS = ["model", "context", "git-tag"];

describe("validateConfig", () => {
  it("accepts a fully valid config as 'valid', with zero problems", () => {
    const raw = {
      lines: {
        "0": [{ id: "model", style: "balanced", colors: { name: "x" } }],
      },
      theme: "monokai",
    };

    const result = validateConfig(raw, KNOWN_WIDGET_IDS);

    assert.strictEqual(result.outcome, "valid");
    assert.strictEqual(result.problems.length, 0);
    assert.strictEqual(result.config.theme, "monokai");
    assert.strictEqual(result.config.lines["0"][0].id, "model");
  });

  it("repairs a config with one bad entry of each kind: keeps every good widget, keeps the bad-style widget with the default style, and reports exactly four problems", () => {
    const raw = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "totally-unknown-widget", style: "balanced" },
          { id: "context", style: "not-a-real-style" },
        ],
        "not-a-line-number": [{ id: "model" }],
      },
      theme: "not-a-real-theme",
    };

    const result = validateConfig(raw, KNOWN_WIDGET_IDS);

    assert.strictEqual(result.outcome, "repaired");
    assert.strictEqual(result.problems.length, 4);

    // Every good widget survives, dropped-id widget does not.
    const line0Ids = result.config.lines["0"].map((w) => w.id).sort();
    assert.deepStrictEqual(line0Ids, ["context", "model"]);

    // The non-numeric line key is dropped entirely.
    assert.strictEqual(result.config.lines["not-a-line-number"], undefined);

    // The unknown-style widget is kept, just with the default style.
    const contextWidget = result.config.lines["0"].find((w) => w.id === "context");
    assert.strictEqual(contextWidget?.style, DEFAULT_WIDGET_STYLE);

    // The unknown theme falls back to the default (undefined = "use default").
    assert.strictEqual(result.config.theme, undefined);

    const paths = result.problems.map((p) => p.path.join("."));
    assert.ok(paths.includes("lines.0.1.id"), "unknown widget id should be reported");
    assert.ok(paths.includes("lines.0.2.style"), "unknown style should be reported");
    assert.ok(paths.includes("theme"), "unknown theme should be reported");
    assert.ok(paths.includes("lines.not-a-line-number"), "non-numeric line key should be reported");
  });

  it("is repaired, not unrecoverable, at the boundary of exactly one surviving widget", () => {
    const raw = { lines: { "0": [{ id: "model" }, { id: "unknown-widget" }] } };

    const result = validateConfig(raw, KNOWN_WIDGET_IDS);

    assert.notStrictEqual(result.outcome, "unrecoverable");
    assert.strictEqual(result.config.lines["0"].length, 1);
  });

  it("is unrecoverable when the raw value is not an object", () => {
    const result = validateConfig("not-an-object", KNOWN_WIDGET_IDS);

    assert.strictEqual(result.outcome, "unrecoverable");
    assert.deepStrictEqual(result.config, { lines: {} });
    assert.strictEqual(result.problems[0]?.message, "Expected a config object");
  });

  it("is unrecoverable when there is no lines object", () => {
    const result = validateConfig({ theme: "monokai" }, KNOWN_WIDGET_IDS);

    assert.strictEqual(result.outcome, "unrecoverable");
    assert.strictEqual(result.problems[0]?.message, "Expected an object of lines");
  });

  it("is unrecoverable when every widget is invalid, even though 'lines' itself is well-formed", () => {
    const raw = {
      lines: {
        "0": [{ id: "unknown-a" }, { id: "unknown-b" }],
      },
    };

    const result = validateConfig(raw, KNOWN_WIDGET_IDS);

    assert.strictEqual(result.outcome, "unrecoverable");
    assert.deepStrictEqual(result.config.lines, {});
  });
});
