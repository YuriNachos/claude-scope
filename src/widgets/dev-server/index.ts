/**
 * DevServerWidget - Detects running dev server processes using hybrid detection
 */

// Export shared detector types for polymorphic usage
export type { DetectedServer, ExecFileFn, ProcessPattern } from "./detector-types.js";
export { DevServerWidget } from "./dev-server-widget.js";
export { PortDetector } from "./port-detector.js";
export { ProcessDetector } from "./process-detector.js";
export type { DevServerRenderData, DevServerStatus } from "./types.js";
