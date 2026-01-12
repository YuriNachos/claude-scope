import type { StyleMap } from "../../core/style-types.js";
import type { IDevServerColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import type { DevServerRenderData } from "./types.js";

export const devServerStyles: StyleMap<DevServerRenderData, IDevServerColors> = {
  balanced: (data: DevServerRenderData, colors?: IDevServerColors) => {
    if (!data.server) return "";
    const { name, icon, isRunning, isBuilding } = data.server;
    const status = isRunning ? "running" : isBuilding ? "building" : "stopped";
    const coloredName = colors ? colorize(name, colors.name) : name;
    const coloredStatus = colors ? colorize(`(${status})`, colors.status) : `(${status})`;
    return `${icon} ${coloredName} ${coloredStatus}`;
  },
  compact: (data: DevServerRenderData, colors?: IDevServerColors) => {
    if (!data.server) return "";
    const { name, icon, isRunning, isBuilding } = data.server;
    const statusIcon = isRunning ? "🚀" : isBuilding ? "🔨" : "💤";
    const coloredName = colors ? colorize(name, colors.name) : name;
    return `${icon} ${coloredName} ${statusIcon}`;
  },
  playful: (data: DevServerRenderData, colors?: IDevServerColors) => {
    if (!data.server) return "";
    const { name, isRunning, isBuilding } = data.server;
    const emoji = isRunning ? "🏃" : isBuilding ? "🔨" : "💤";
    const coloredName = colors ? colorize(name, colors.name) : name;
    return `${emoji} ${coloredName}`;
  },
  verbose: (data: DevServerRenderData, colors?: IDevServerColors) => {
    if (!data.server) return "";
    const { name, isRunning, isBuilding } = data.server;
    const status = isRunning ? "running" : isBuilding ? "building" : "stopped";
    const label = colors ? colorize("Dev Server:", colors.label) : "Dev Server:";
    const coloredName = colors ? colorize(name, colors.name) : name;
    const coloredStatus = colors ? colorize(`(${status})`, colors.status) : `(${status})`;
    return `${label} ${coloredName} ${coloredStatus}`;
  },
  labeled: (data: DevServerRenderData, colors?: IDevServerColors) => {
    if (!data.server) return "";
    const { name, icon, isRunning } = data.server;
    const status = isRunning ? "🟢" : "🔴";
    const label = colors ? colorize("Server:", colors.label) : "Server:";
    const coloredName = colors ? colorize(name, colors.name) : name;
    return `${label} ${icon} ${coloredName} ${status}`;
  },
  indicator: (data: DevServerRenderData, colors?: IDevServerColors) => {
    if (!data.server) return "";
    const { name, icon } = data.server;
    const coloredName = colors ? colorize(name, colors.name) : name;
    return `● ${icon} ${coloredName}`;
  },
};
