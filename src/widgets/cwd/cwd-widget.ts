/**
 * CWD Widget
 *
 * Displays current working directory
 */
import type { StyleRendererFn, WidgetStyle } from "../../core/style-types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import type { RenderContext, StdinData } from "../../types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { ICwdColors, IThemeColors } from "../../ui/theme/types.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import { cwdStyles } from "./styles.js";
import type { CwdRenderData } from "./types.js";

export class CwdWidget extends StdinDataWidget {
  readonly id = "cwd";
  readonly metadata = createWidgetMetadata(
    "CWD",
    "Displays current working directory",
    "1.0.0",
    "claude-scope",
    0
  );

  private colors: IThemeColors;
  private styleFn: StyleRendererFn<CwdRenderData, ICwdColors> = cwdStyles.minimal!;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = "minimal"): void {
    const fn = cwdStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    if (!data.cwd) {
      return null;
    }

    const parts = data.cwd.split("/");
    const dirName = parts[parts.length - 1] || data.cwd;

    const renderData: CwdRenderData = {
      fullPath: data.cwd,
      dirName,
    };

    return this.styleFn(renderData, this.colors.cwd);
  }
}
