/**
 * DevServerWidget - Detects running dev server processes
 */

// Export shared detector types for polymorphic usage
export type { DetectedServer, ExecFileFn } from "./detector-types.js";
export { DevServerWidget } from "./dev-server-widget.js";
export type { DevServerRenderData, DevServerStatus, ProcessPattern } from "./types.js";
