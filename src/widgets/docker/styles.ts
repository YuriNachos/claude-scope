import type { StyleMap } from "../../core/style-types.js";
import type { DockerRenderData } from "./types.js";

export const dockerStyles: StyleMap<DockerRenderData> = {
  balanced: (data: DockerRenderData) => {
    const { running, total } = data.status;
    if (running === 0) return "";
    const status = running > 0 ? "🟢" : "⚪";
    const count = total > running ? `${running}/${total}` : `${running}`;
    return `Docker: ${count} ${status}`;
  },
  compact: (data: DockerRenderData) => {
    const { running, total } = data.status;
    if (running === 0) return "";
    const count = total > running ? `${running}/${total}` : `${running}`;
    return `🐳 ${count}`;
  },
  playful: (data: DockerRenderData) => {
    const { running, total } = data.status;
    if (running === 0) return "🐳 Docker: 💤";
    const status = running > 0 ? "🟢" : "⚪";
    const count = total > running ? `${running}/${total}` : `${running}`;
    return `🐳 Docker: ${count} ${status}`;
  },
  verbose: (data: DockerRenderData) => {
    const { running, total } = data.status;
    if (running === 0) return "Docker: no containers running";
    return `Docker: ${running} running${total > running ? ` / ${total} total` : ""}`;
  },
  labeled: (data: DockerRenderData) => {
    const { running, total } = data.status;
    if (running === 0) return "Docker: --";
    const count = total > running ? `${running}/${total}` : `${running}`;
    return `Docker: ${count}`;
  },
  indicator: (data: DockerRenderData) => {
    const { running, total } = data.status;
    if (running === 0) return "● Docker: --";
    const count = total > running ? `${running}/${total}` : `${running}`;
    return `● Docker: ${count}`;
  },
};
