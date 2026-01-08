/**
 * Types for GitWidget
 */
export interface GitChanges {
    files: number;
    insertions: number;
    deletions: number;
}
export interface GitRenderData {
    branch: string;
    changes?: GitChanges;
}
//# sourceMappingURL=types.d.ts.map