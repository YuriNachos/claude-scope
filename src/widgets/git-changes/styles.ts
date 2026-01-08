/**
 * Functional style renderers for GitChangesWidget
 */

import { withLabel, withIndicator, withAngleBrackets } from "../../ui/utils/style-utils.js";
import type { GitChangesRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const gitChangesStyles: StyleMap<GitChangesRenderData> = {
  balanced: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions}`);
    if (data.deletions > 0) parts.push(`-${data.deletions}`);
    return parts.join(" ");
  },

  compact: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions}`);
    if (data.deletions > 0) parts.push(`-${data.deletions}`);
    return parts.join("/");
  },

  playful: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`⬆${data.insertions}`);
    if (data.deletions > 0) parts.push(`⬇${data.deletions}`);
    return parts.join(" ");
  },

  verbose: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions} insertions`);
    if (data.deletions > 0) parts.push(`-${data.deletions} deletions`);
    return parts.join(", ");
  },

  technical: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`${data.insertions}`);
    if (data.deletions > 0) parts.push(`${data.deletions}`);
    return parts.join("/");
  },

  symbolic: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`▲${data.insertions}`);
    if (data.deletions > 0) parts.push(`▼${data.deletions}`);
    return parts.join(" ");
  },

  labeled: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions}`);
    if (data.deletions > 0) parts.push(`-${data.deletions}`);
    const changes = parts.join(" ");
    return withLabel("Diff", changes);
  },

  indicator: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions}`);
    if (data.deletions > 0) parts.push(`-${data.deletions}`);
    const changes = parts.join(" ");
    return withIndicator(changes);
  },

  fancy: (data: GitChangesRenderData) => {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions}`);
    if (data.deletions > 0) parts.push(`-${data.deletions}`);
    const changes = parts.join("|");
    return withAngleBrackets(changes);
  },
};
