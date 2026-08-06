/**
 * Node ESM loader hook that stubs "@inquirer/core" with a deterministic,
 * non-interactive prompt implementation.
 *
 * Production CLI flows built on `createPrompt` (see
 * `src/cli/commands/quick-config/select-with-preview.ts`) attach a real
 * readline interface to `process.stdin` and block until a keypress arrives.
 * There is no dependency-injection seam for the prompt engine, so a unit test
 * that imports the real module and calls the resulting prompt function hangs
 * forever under a test runner (no real terminal ever sends a keypress).
 *
 * This loader intercepts the bare specifier "@inquirer/core" and serves a
 * stub module instead: `createPrompt(fn)` returns a prompt function that
 * resolves immediately to the FIRST offered choice, without touching stdin.
 * Register it via `node:module`'s `register()` *before* dynamically
 * importing anything that (transitively) imports "@inquirer/core".
 */

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "@inquirer/core") {
    return { url: "mock-inquirer-core:stub", shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === "mock-inquirer-core:stub") {
    const source = `
export function createPrompt(_fn) {
  return async (config) => {
    if (config && Array.isArray(config.choices) && config.choices.length > 0) {
      return config.choices[0].value;
    }
    return undefined;
  };
}
export function isDownKey() { return false; }
export function isEnterKey() { return false; }
export function isUpKey() { return false; }
export function useEffect() {}
export function useKeypress() {}
export function usePagination() { return ""; }
export function useState(initial) { return [initial, () => {}]; }
`;
    return { format: "module", source, shortCircuit: true };
  }
  return nextLoad(url, context);
}
