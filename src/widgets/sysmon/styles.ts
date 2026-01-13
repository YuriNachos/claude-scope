/**
 * Functional style renderers for SysmonWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { ISysmonColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import type { SysmonRenderData } from "./types.js";

function formatGB(gb: number): string {
  if (gb < 1) {
    return `${Math.round(gb * 1024)}MB`;
  }
  const formatted = gb.toFixed(1);
  return formatted.endsWith(".0") ? `${formatted.slice(0, -2)}GB` : `${formatted}GB`;
}

function formatMB(mb: number): string {
  if (mb < 0.1) {
    const kb = mb * 1024;
    const formatted = kb.toFixed(1);
    return formatted.endsWith(".0") ? `${formatted.slice(0, -2)}KB` : `${formatted}KB`;
  }
  const formatted = mb.toFixed(1);
  return formatted.endsWith(".0") ? `${formatted.slice(0, -2)}MB` : `${formatted}MB`;
}

export const sysmonStyles: StyleMap<SysmonRenderData, ISysmonColors> = {
  balanced: (data: SysmonRenderData, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`CPU ${data.cpu.percent}%`, colors.cpu)
      : `CPU ${data.cpu.percent}%`;
    const ram = colors
      ? colorize(`RAM ${formatGB(data.memory.used)}`, colors.ram)
      : `RAM ${formatGB(data.memory.used)}`;
    const disk = colors
      ? colorize(`Disk ${data.disk.percent}%`, colors.disk)
      : `Disk ${data.disk.percent}%`;
    const net = colors
      ? colorize(`Net ↓${formatMB(data.network.rxSec)}/s`, colors.network)
      : `Net ↓${formatMB(data.network.rxSec)}/s`;
    const sep = colors ? colorize("|", colors.separator) : "|";
    return `${cpu} ${sep} ${ram} ${sep} ${disk} ${sep} ${net}`;
  },

  compact: (data: SysmonRenderData, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`CPU${data.cpu.percent}%`, colors.cpu)
      : `CPU${data.cpu.percent}%`;
    const ram = colors
      ? colorize(`RAM${formatGB(data.memory.used)}`, colors.ram)
      : `RAM${formatGB(data.memory.used)}`;
    const disk = colors
      ? colorize(`D${data.disk.percent}%`, colors.disk)
      : `D${data.disk.percent}%`;
    const net = colors
      ? colorize(`↓${formatMB(data.network.rxSec)}/s`, colors.network)
      : `↓${formatMB(data.network.rxSec)}/s`;
    return `${cpu} ${ram} ${disk} ${net}`;
  },

  playful: (data: SysmonRenderData, colors?: ISysmonColors) => {
    const cpu = colors ? colorize(`${data.cpu.percent}%`, colors.cpu) : `${data.cpu.percent}%`;
    const ram = colors
      ? colorize(formatGB(data.memory.used), colors.ram)
      : formatGB(data.memory.used);
    const disk = colors ? colorize(`${data.disk.percent}%`, colors.disk) : `${data.disk.percent}%`;
    const net = colors
      ? colorize(`↓${formatMB(data.network.rxSec)}/s`, colors.network)
      : `↓${formatMB(data.network.rxSec)}/s`;
    const sep = colors ? colorize("|", colors.separator) : "|";
    return `🖥️ ${cpu} ${sep} 💾 ${ram} ${sep} 💿 ${disk} ${sep} 🌐 ${net}`;
  },

  verbose: (data: SysmonRenderData, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`CPU: ${data.cpu.percent}%`, colors.cpu)
      : `CPU: ${data.cpu.percent}%`;
    const ram = colors
      ? colorize(`RAM: ${formatGB(data.memory.used)}/${formatGB(data.memory.total)}`, colors.ram)
      : `RAM: ${formatGB(data.memory.used)}/${formatGB(data.memory.total)}`;
    const disk = colors
      ? colorize(`Disk: ${formatGB(data.disk.used)}/${formatGB(data.disk.total)}`, colors.disk)
      : `Disk: ${formatGB(data.disk.used)}/${formatGB(data.disk.total)}`;
    const net = colors
      ? colorize(
          `Net: ↓${formatMB(data.network.rxSec)}/s ↑${formatMB(data.network.txSec)}/s`,
          colors.network
        )
      : `Net: ↓${formatMB(data.network.rxSec)}/s ↑${formatMB(data.network.txSec)}/s`;
    return `${cpu} | ${ram} | ${disk} | ${net}`;
  },
};
