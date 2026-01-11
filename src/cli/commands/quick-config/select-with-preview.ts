/**
 * Custom select prompt with live preview panel
 * Built on @inquirer/core hooks for navigation and rendering
 */

import {
  createPrompt,
  isDownKey,
  isEnterKey,
  isUpKey,
  useEffect,
  useKeypress,
  usePagination,
  useState,
} from "@inquirer/core";
import type { QuickConfigStyle, ScopeConfig } from "./config-schema.js";
import { renderPreviewFromConfig } from "./layout-preview.js";

/**
 * Choice with preview generation capability
 */
export interface PreviewChoice<T> {
  name: string;
  description?: string;
  value: T;
  getConfig: (style: QuickConfigStyle, themeName: string) => ScopeConfig;
}

/**
 * Config for selectWithPreview prompt
 * previews: Array of pre-rendered preview strings (must be generated before prompt is shown)
 */
export interface SelectWithPreviewConfig<T> {
  message: string;
  choices: PreviewChoice<T>[];
  pageSize?: number;
  style: QuickConfigStyle;
  themeName: string;
  previews: string[];
}

/**
 * Helper: Generate all previews upfront before showing the prompt
 * Call this before passing config to selectWithPreview
 */
export async function generatePreviews<T>(
  choices: PreviewChoice<T>[],
  style: QuickConfigStyle,
  themeName: string
): Promise<string[]> {
  const previews: string[] = [];

  // Detect if this is a style selection stage (all choices are styles)
  // Stage 2 always has exactly 3 style choices (balanced, playful, compact)
  const isStyleSelection = choices.length >= 3 && choices.every((c) => isQuickConfigStyle(c.value));

  for (const choice of choices) {
    try {
      // For style selection stage, each choice uses its own value as the style
      // For other stages, use the provided style parameter
      const previewStyle = isStyleSelection ? (choice.value as QuickConfigStyle) : style;

      const preview = await renderPreviewFromConfig(
        choice.getConfig(previewStyle, themeName),
        previewStyle,
        themeName
      );
      previews.push(preview);
    } catch (error) {
      const errorMsg = `⚠ Preview error: ${error instanceof Error ? error.message : "Unknown error"}`;
      previews.push(errorMsg);
    }
  }
  return previews;
}

/**
 * Helper: Check if a value is a valid QuickConfigStyle
 * Used to detect style choices in generatePreviews
 */
function isQuickConfigStyle(value: unknown): boolean {
  return typeof value === "string" && ["balanced", "playful", "compact"].includes(value);
}

/**
 * Custom select prompt with live preview panel.
 *
 * Features:
 * - Arrow key navigation (↑↓) with vim/emacs bindings
 * - Live preview of selected option using actual widget rendering
 * - Preview caching for smooth navigation (previews are pre-generated)
 * - Error handling for render failures
 *
 * Returns tuple: [selectUI, previewUI]
 * Second element renders under the prompt with live widget output
 *
 * Note: Previews must be pre-generated using generatePreviews() before
 * passing the config to this prompt.
 */
function selectWithPreviewImpl<T>(
  config: SelectWithPreviewConfig<T>,
  done: (value: T) => void
): [string, string] {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "done">("idle");

  // Validation: ensure choices exist
  useEffect(() => {
    if (config.choices.length === 0) {
      throw new Error("selectWithPreview requires at least one choice");
    }
  }, []);

  // Handle keyboard navigation
  useKeypress((key) => {
    if (isEnterKey(key)) {
      setStatus("done");
      done(config.choices[active].value);
    } else if (isUpKey(key)) {
      const newIndex = active > 0 ? active - 1 : config.choices.length - 1;
      setActive(newIndex);
    } else if (isDownKey(key)) {
      const newIndex = active < config.choices.length - 1 ? active + 1 : 0;
      setActive(newIndex);
    }
  });

  // Render select options with pagination
  const choices = config.choices.map((c) => c.name);
  const page = usePagination({
    items: choices,
    active,
    pageSize: config.pageSize ?? 7,
    loop: true,
    renderItem: ({ item, index, isActive }) => {
      const prefix = isActive ? "❯" : " ";
      const choice = config.choices[index];
      const desc = choice.description ? `\x1b[90m - ${choice.description}\x1b[0m` : "";
      return `${prefix} ${item}${desc}`;
    },
  });

  // Get pre-rendered preview for currently active choice
  const preview = config.previews[active];
  const activeChoice = config.choices[active];

  if (status === "done") {
    // Show only selected answer (no preview)
    return [`${config.message} ${activeChoice.name}`, ""];
  }

  // Return tuple: [select UI, preview UI]
  const line = "\x1b[1;37m" + "─".repeat(60) + "\x1b[0m";
  const previewBox =
    `${line}\n` + "\x1b[1;37mLive Preview\x1b[0m\n" + `\n${preview}\n` + `\n${line}`;

  return [config.message, `${page}\n\n${previewBox}`];
}

export const selectWithPreview = createPrompt(selectWithPreviewImpl);
