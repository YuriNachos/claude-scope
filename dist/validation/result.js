export function success(data) {
    return { success: true, data };
}
export function failure(path, message, value) {
    return { success: false, error: { path, message, value } };
}
export function formatError(error) {
    const path = error.path.length > 0 ? error.path.join('.') : 'root';
    return `${path}: ${error.message}`;
}
//# sourceMappingURL=result.js.map