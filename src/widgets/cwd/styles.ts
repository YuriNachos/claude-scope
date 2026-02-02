/**
 * Style renderers for CWD widget
 */
import type { StyleMap } from "../../core/style-types.js";
import type { ICwdColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { CwdRenderData } from "./types.js";

/**
 * Shorten path by replacing home with ~ and abbreviating middle components
 * /Users/demo/projects/claude-scope -> ~/p/claude-scope
 */
function shortenPath(path: string): string {
  const home = process.env.HOME || "";
  const result = home && path.startsWith(home) ? `~${path.slice(home.length)}` : path;

  const parts = result.split("/").filter(Boolean);
  if (parts.length <= 2) return result;

  // Shorten all but last component to first char
  const shortened = parts.map((p, i) => (i === parts.length - 1 ? p : p[0] || p));

  const prefix = result.startsWith("~") ? "~/" : result.startsWith("/") ? "/" : "";
  const startIndex = result.startsWith("~") ? 1 : 0;

  return prefix + shortened.slice(startIndex).join("/");
}

export const cwdStyles: StyleMap<CwdRenderData, ICwdColors> = {
  /**
   * Minimal style (default): shortened path with ~
   * /Users/demo/projects/claude-scope -> ~/p/claude-scope
   */
  minimal: (data: CwdRenderData, colors?: ICwdColors) => {
    const short = shortenPath(data.fullPath);
    return colors ? colorize(short, colors.name) : short;
  },

  /**
   * Balanced style: directory name only
   * /Users/demo/projects/claude-scope -> claude-scope
   */
  balanced: (data: CwdRenderData, colors?: ICwdColors) => {
    return colors ? colorize(data.dirName, colors.name) : data.dirName;
  },

  /**
   * Compact style: same as balanced (directory name only)
   * /Users/demo/projects/claude-scope -> claude-scope
   */
  compact: (data: CwdRenderData, colors?: ICwdColors) => {
    return colors ? colorize(data.dirName, colors.name) : data.dirName;
  },

  /**
   * Playful style: with folder emoji
   * /Users/demo/projects/claude-scope -> 📁 claude-scope
   */
  playful: (data: CwdRenderData, colors?: ICwdColors) => {
    const colored = colors ? colorize(data.dirName, colors.name) : data.dirName;
    return `📁 ${colored}`;
  },

  /**
   * Technical style: full path with colored separators
   * /Users/demo/projects/claude-scope -> /Users/demo/projects/claude-scope
   */
  technical: (data: CwdRenderData, colors?: ICwdColors) => {
    if (!colors) return data.fullPath;

    const parts = data.fullPath.split("/");
    return parts
      .map((p, i) => {
        if (p === "") return "";
        const color = i === parts.length - 1 ? colors.name : colors.separator;
        return colorize(p, color);
      })
      .join(colorize("/", colors.separator));
  },

  /**
   * Symbolic style: with diamond symbol
   * /Users/demo/projects/claude-scope -> ◆ claude-scope
   */
  symbolic: (data: CwdRenderData, colors?: ICwdColors) => {
    const colored = colors ? colorize(data.dirName, colors.name) : data.dirName;
    return `◆ ${colored}`;
  },

  /**
   * Labeled style: with Dir: prefix
   * /Users/demo/projects/claude-scope -> Dir: claude-scope
   */
  labeled: (data: CwdRenderData, colors?: ICwdColors) => {
    const colored = colors ? colorize(data.dirName, colors.name) : data.dirName;
    return withLabel("Dir", colored);
  },

  /**
   * Indicator style: with bullet indicator
   * /Users/demo/projects/claude-scope -> ● claude-scope
   */
  indicator: (data: CwdRenderData, colors?: ICwdColors) => {
    const colored = colors ? colorize(data.dirName, colors.name) : data.dirName;
    return withIndicator(colored);
  },
};
