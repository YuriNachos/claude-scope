import type { StyleMap } from "../../core/style-types.js";
import type { DevServerRenderData } from "./types.js";

export const devServerStyles: StyleMap<DevServerRenderData> = {
  balanced: (data: DevServerRenderData) => {
    if (!data.server) return "";
    const { name, icon, isRunning, isBuilding } = data.server;
    const status = isRunning ? "running" : isBuilding ? "building" : "stopped";
    return `${icon} ${name} (${status})`;
  },
  compact: (data: DevServerRenderData) => {
    if (!data.server) return "";
    const { name, icon, isRunning, isBuilding } = data.server;
    const statusIcon = isRunning ? "🚀" : isBuilding ? "🔨" : "💤";
    return `${icon} ${name} ${statusIcon}`;
  },
  playful: (data: DevServerRenderData) => {
    if (!data.server) return "";
    const { name, isRunning, isBuilding } = data.server;
    const emoji = isRunning ? "🏃" : isBuilding ? "🔨" : "💤";
    return `${emoji} ${name}`;
  },
  verbose: (data: DevServerRenderData) => {
    if (!data.server) return "";
    const { name, isRunning, isBuilding } = data.server;
    const status = isRunning ? "running" : isBuilding ? "building" : "stopped";
    return `Dev Server: ${name} (${status})`;
  },
  labeled: (data: DevServerRenderData) => {
    if (!data.server) return "";
    const { name, icon, isRunning } = data.server;
    const status = isRunning ? "🟢" : "🔴";
    return `Server: ${icon} ${name} ${status}`;
  },
  indicator: (data: DevServerRenderData) => {
    if (!data.server) return "";
    const { name, icon } = data.server;
    return `● ${icon} ${name}`;
  },
};
