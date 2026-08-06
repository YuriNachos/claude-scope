/**
 * Config validation
 *
 * Splits a loaded config into what is usable and what is wrong with it, so a
 * single bad entry costs the user that entry rather than their whole layout.
 *
 * Two outcomes matter to the caller:
 * - `unrecoverable` - nothing usable survived; the file should be quarantined
 *   and replaced with a default.
 * - `repaired` - some entries were dropped; the file is left alone and the
 *   problems are reported.
 */

import { DEFAULT_WIDGET_STYLE, WIDGET_STYLES } from "../core/style-types.js";
import { AVAILABLE_THEMES, findTheme } from "../ui/theme/index.js";
import { object } from "../validation/combinators.js";
import type { ValidationError } from "../validation/core.js";
import { oneOf, string } from "../validation/validators.js";
import type { LoadedConfig, LoadedWidgetConfig } from "./config-loader.js";

/**
 * A single thing wrong with the config
 *
 * Structurally identical to `ValidationError`, so `formatError()` renders both.
 */
export type ConfigProblem = ValidationError;

/**
 * Result of validating a raw config value
 */
export interface ConfigValidation {
  /** `valid` - use as is; `repaired` - usable after dropping entries; `unrecoverable` - nothing usable */
  outcome: "valid" | "repaired" | "unrecoverable";
  /** Config with every invalid entry removed (empty when unrecoverable) */
  config: LoadedConfig;
  /** Every problem found, in the order encountered */
  problems: ConfigProblem[];
}

/** Line keys are stringified line numbers: "0", "1", "2" */
const LINE_KEY_PATTERN = /^\d+$/;

/** Names of every built-in theme, hoisted out of the per-render path */
const THEME_NAMES = AVAILABLE_THEMES.map((theme) => theme.name);

/** Style validator, built once rather than once per widget entry */
const styleValidator = oneOf(WIDGET_STYLES);

/** Theme validator, sharing the message format of every other enum check */
const themeValidator = oneOf(THEME_NAMES);

/** Shape a widget entry must have before its values are checked */
const widgetEntryShape = object({
  id: string(),
});

/**
 * Validate a raw parsed config
 *
 * @param raw - Whatever `JSON.parse` produced
 * @param knownWidgetIds - Widget ids the factory can actually build
 */
export function validateConfig(raw: unknown, knownWidgetIds: readonly string[]): ConfigValidation {
  const problems: ConfigProblem[] = [];

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    problems.push({ path: [], message: "Expected a config object", value: raw });
    return unrecoverable(problems);
  }

  const source = raw as { lines?: unknown; theme?: unknown };

  if (!source.lines || typeof source.lines !== "object" || Array.isArray(source.lines)) {
    problems.push({ path: ["lines"], message: "Expected an object of lines", value: source.lines });
    return unrecoverable(problems);
  }

  const lines: Record<string, LoadedWidgetConfig[]> = {};
  let widgetCount = 0;

  for (const [lineKey, lineValue] of Object.entries(source.lines as Record<string, unknown>)) {
    if (!LINE_KEY_PATTERN.test(lineKey)) {
      problems.push({
        path: ["lines", lineKey],
        message: "Expected a line number",
        value: lineKey,
      });
      continue;
    }

    if (!Array.isArray(lineValue)) {
      problems.push({
        path: ["lines", lineKey],
        message: "Expected an array of widgets",
        value: lineValue,
      });
      continue;
    }

    const widgets: LoadedWidgetConfig[] = [];

    lineValue.forEach((entry, index) => {
      const widget = validateWidgetEntry(
        entry,
        ["lines", lineKey, String(index)],
        knownWidgetIds,
        problems
      );
      if (widget) {
        widgets.push(widget);
      }
    });

    if (widgets.length > 0) {
      lines[lineKey] = widgets;
      widgetCount += widgets.length;
    }
  }

  if (widgetCount === 0) {
    problems.push({ path: ["lines"], message: "No usable widgets", value: source.lines });
    return unrecoverable(problems);
  }

  const theme = validateTheme(source.theme, problems);

  return {
    outcome: problems.length === 0 ? "valid" : "repaired",
    config: theme ? { lines, theme } : { lines },
    problems,
  };
}

/**
 * Validate a single widget entry, recording any problem it has
 *
 * @returns The usable entry, or `null` if it must be dropped
 */
function validateWidgetEntry(
  entry: unknown,
  path: string[],
  knownWidgetIds: readonly string[],
  problems: ConfigProblem[]
): LoadedWidgetConfig | null {
  const result = widgetEntryShape.validate(entry);

  if (!result.success) {
    problems.push({ ...result.error, path: [...path, ...result.error.path] });
    return null;
  }

  const { id } = result.data;

  // Checked separately from the shape: an unknown id is a different problem
  // from a malformed entry, and deserves its own message.
  if (!knownWidgetIds.includes(id)) {
    problems.push({ path: [...path, "id"], message: "Unknown widget", value: id });
    return null;
  }

  const style = validateStyle((entry as { style?: unknown }).style, [...path, "style"], problems);
  const colors = (entry as { colors?: unknown }).colors;

  return {
    id,
    style,
    colors: isColorMap(colors) ? colors : {},
  };
}

/**
 * Validate a widget's style, recording a problem for an unknown one
 *
 * An unusable style costs the entry its styling, never the widget itself: a
 * typo here should not make a configured widget disappear.
 *
 * @returns The style to use, falling back to the default
 */
function validateStyle(style: unknown, path: string[], problems: ConfigProblem[]): string {
  if (style === undefined) {
    return DEFAULT_WIDGET_STYLE;
  }

  const result = styleValidator.validate(style);
  if (result.success) {
    return result.data;
  }

  problems.push({ ...result.error, path });
  return DEFAULT_WIDGET_STYLE;
}

/**
 * Validate the theme name, recording a problem for an unknown one
 *
 * @returns The theme name, or `undefined` to fall back to the default
 */
function validateTheme(theme: unknown, problems: ConfigProblem[]): string | undefined {
  if (theme === undefined) {
    return undefined;
  }

  // getThemeByName() falls back to monokai silently, so the lookup that does
  // signal is used here and the problem is reported.
  if (typeof theme === "string" && findTheme(theme)) {
    return theme;
  }

  const result = themeValidator.validate(theme);
  if (!result.success) {
    problems.push({ ...result.error, path: ["theme"] });
  }
  return undefined;
}

/**
 * Narrow an unknown value to a color map
 */
function isColorMap(value: unknown): value is Record<string, string> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value).every((v) => typeof v === "string")
  );
}

/**
 * Build the unrecoverable result
 */
function unrecoverable(problems: ConfigProblem[]): ConfigValidation {
  return { outcome: "unrecoverable", config: { lines: {} }, problems };
}
