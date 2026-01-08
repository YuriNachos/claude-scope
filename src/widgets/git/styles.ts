/**
 * Functional style renderers for GitWidget
 */

import { withLabel, withIndicator } from "../../ui/utils/style-utils.js";
import type { GitRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const gitStyles: StyleMap<GitRenderData> = {
  minimal: (data: GitRenderData) => {
    return data.branch;
  },

  balanced: (data: GitRenderData) => {
    if (data.changes && data.changes.files > 0) {
      const parts: string[] = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        return `${data.branch} [${parts.join(" ")}]`;
      }
    }
    return data.branch;
  },

  compact: (data: GitRenderData) => {
    if (data.changes && data.changes.files > 0) {
      const parts: string[] = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        return `${data.branch} ${parts.join("/")}`;
      }
    }
    return data.branch;
  },

  playful: (data: GitRenderData) => {
    if (data.changes && data.changes.files > 0) {
      const parts: string[] = [];
      if (data.changes.insertions > 0) parts.push(`⬆${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`⬇${data.changes.deletions}`);
      if (parts.length > 0) {
        return `🔀 ${data.branch} ${parts.join(" ")}`;
      }
    }
    return `🔀 ${data.branch}`;
  },

  verbose: (data: GitRenderData) => {
    if (data.changes && data.changes.files > 0) {
      const parts: string[] = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions} insertions`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions} deletions`);
      if (parts.length > 0) {
        return `branch: ${data.branch} [${parts.join(", ")}]`;
      }
    }
    return `branch: ${data.branch} (HEAD)`;
  },

  labeled: (data: GitRenderData) => {
    if (data.changes && data.changes.files > 0) {
      const parts: string[] = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        const changes = `${data.changes.files} files: ${parts.join("/")}`;
        return `Git: ${data.branch} [${changes}]`;
      }
    }
    return `Git: ${data.branch}`;
  },

  indicator: (data: GitRenderData) => {
    return withIndicator(data.branch);
  },

};
