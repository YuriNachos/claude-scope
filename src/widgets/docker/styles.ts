import type { StyleMap } from "../../core/style-types.js";
import type { IDockerColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import type { DockerRenderData } from "./types.js";

export const dockerStyles: StyleMap<DockerRenderData, IDockerColors> = {
  balanced: (data: DockerRenderData, colors?: IDockerColors) => {
    const { running, total } = data.status;
    if (running === 0) return "";
    const status = running > 0 ? "🟢" : "⚪";
    const count = total > running ? `${running}/${total}` : `${running}`;
    const label = colors ? colorize("Docker:", colors.label) : "Docker:";
    const coloredCount = colors ? colorize(count, colors.count) : count;
    return `${label} ${coloredCount} ${status}`;
  },
  compact: (data: DockerRenderData, colors?: IDockerColors) => {
    const { running, total } = data.status;
    if (running === 0) return "";
    const count = total > running ? `${running}/${total}` : `${running}`;
    const coloredCount = colors ? colorize(count, colors.count) : count;
    return `🐳 ${coloredCount}`;
  },
  playful: (data: DockerRenderData, colors?: IDockerColors) => {
    const { running, total } = data.status;
    if (running === 0) return "🐳 Docker: 💤";
    const status = running > 0 ? "🟢" : "⚪";
    const count = total > running ? `${running}/${total}` : `${running}`;
    const label = colors ? colorize("Docker:", colors.label) : "Docker:";
    const coloredCount = colors ? colorize(count, colors.count) : count;
    return `🐳 ${label} ${coloredCount} ${status}`;
  },
  verbose: (data: DockerRenderData, colors?: IDockerColors) => {
    const { running, total } = data.status;
    if (running === 0) {
      const label = colors ? colorize("Docker:", colors.label) : "Docker:";
      return `${label} no containers running`;
    }
    const label = colors ? colorize("Docker:", colors.label) : "Docker:";
    const coloredRunning = colors ? colorize(String(running), colors.count) : String(running);
    return `${label} ${coloredRunning} running${total > running ? ` / ${total} total` : ""}`;
  },
  labeled: (data: DockerRenderData, colors?: IDockerColors) => {
    const { running, total } = data.status;
    if (running === 0) {
      const label = colors ? colorize("Docker:", colors.label) : "Docker:";
      return `${label} --`;
    }
    const count = total > running ? `${running}/${total}` : `${running}`;
    const label = colors ? colorize("Docker:", colors.label) : "Docker:";
    const coloredCount = colors ? colorize(count, colors.count) : count;
    return `${label} ${coloredCount}`;
  },
  indicator: (data: DockerRenderData, colors?: IDockerColors) => {
    const { running, total } = data.status;
    if (running === 0) {
      const label = colors ? colorize("Docker:", colors.label) : "Docker:";
      return `● ${label} --`;
    }
    const count = total > running ? `${running}/${total}` : `${running}`;
    const label = colors ? colorize("Docker:", colors.label) : "Docker:";
    const coloredCount = colors ? colorize(count, colors.count) : count;
    return `● ${label} ${coloredCount}`;
  },
};
