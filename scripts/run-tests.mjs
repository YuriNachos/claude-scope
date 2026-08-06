#!/usr/bin/env node

/**
 * Test runner - the single source of truth for which tests exist.
 *
 * Every test file under `tests/` is discovered by walking the directory, so a
 * new file runs the moment it is written. The npm scripts used to carry
 * hand-maintained path lists instead, and a file missing from those lists was
 * simply never executed - silently, with the suite still reporting green.
 *
 * Usage:
 *   node scripts/run-tests.mjs [subset] [options] [-- <tsx args>]
 *
 * Subsets:
 *   all           every test file (default)
 *   unit          tests/unit
 *   integration   tests/integration and tests/e2e
 *   e2e           tests/e2e
 *
 * Options:
 *   --list                print the resolved file list and exit
 *   --update-snapshots    rewrite stored snapshots instead of comparing
 *   --timeout=<ms>        per-test timeout (default 30000)
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TESTS_DIR = "tests";
const TEST_SUFFIX = ".test.ts";
const DEFAULT_TIMEOUT_MS = 30000;

/** Directory prefixes each subset selects from */
const SUBSETS = {
  all: [TESTS_DIR],
  unit: ["tests/unit"],
  // e2e runs alongside integration: both drive the assembled app rather than a
  // single unit, and the split matters only to whoever is waiting on it.
  integration: ["tests/integration", "tests/e2e"],
  e2e: ["tests/e2e"],
};

/**
 * Collect every test file below a directory
 *
 * @param {string} dir - Directory to walk, relative to the repo root
 * @returns {string[]} Repo-relative POSIX paths, unsorted
 */
function collectTests(dir) {
  const found = [];
  const absolute = join(REPO_ROOT, dir);

  if (!existsSync(absolute)) {
    // Routed through the same guard as an empty selection: a subset pointing
    // at a directory that no longer exists is the silent-skip bug, not a crash
    // to read a stack trace for.
    fail(`directory "${dir}" does not exist`);
  }

  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;

    if (entry.isDirectory()) {
      found.push(...collectTests(path));
    } else if (entry.name.endsWith(TEST_SUFFIX)) {
      found.push(path);
    }
  }

  return found;
}

/**
 * Parse the command line
 *
 * @param {string[]} argv - Arguments after the script name
 */
function parseArgs(argv) {
  const options = {
    subset: "",
    list: false,
    updateSnapshots: false,
    timeout: DEFAULT_TIMEOUT_MS,
    /** @type {string[]} */ passthrough: [],
  };

  const separator = argv.indexOf("--");
  if (separator !== -1) {
    options.passthrough = argv.slice(separator + 1);
    argv = argv.slice(0, separator);
  }

  for (const arg of argv) {
    if (arg === "--list") {
      options.list = true;
    } else if (arg === "--update-snapshots") {
      options.updateSnapshots = true;
    } else if (arg.startsWith("--timeout=")) {
      options.timeout = Number(arg.slice("--timeout=".length));
    } else if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`);
    } else if (options.subset) {
      // Silently keeping the last one would run a different selection than the
      // command line asks for - the exact class of mistake this runner exists
      // to make impossible.
      fail(`Only one subset can be given, got "${options.subset}" and "${arg}"`);
    } else {
      options.subset = arg;
    }
  }

  options.subset ||= "all";

  if (!(options.subset in SUBSETS)) {
    fail(`Unknown subset "${options.subset}". Expected one of: ${Object.keys(SUBSETS).join(", ")}`);
  }

  if (!Number.isFinite(options.timeout) || options.timeout <= 0) {
    fail("--timeout expects a positive number of milliseconds");
  }

  return options;
}

/**
 * Print a message and exit non-zero
 *
 * @param {string} message
 * @returns {never}
 */
function fail(message) {
  console.error(`run-tests: ${message}`);
  process.exit(1);
}

/**
 * Build the tsx argument list
 *
 * @param {ReturnType<typeof parseArgs>} options
 * @param {string[]} files
 */
function buildArgs(options, files) {
  const args = ["--test"];

  // These two are the hang protection, and Node rejects an unknown flag
  // outright - taking the whole run down before a single test loads. Neither
  // exists on 18, and their arrival is scattered across 20.x and 21.x, so each
  // is asked for rather than derived from a version range.
  if (nodeAccepts(`--test-timeout=${options.timeout}`)) {
    args.push(`--test-timeout=${options.timeout}`);
  } else {
    console.error(
      `run-tests: node ${process.versions.node} has no --test-timeout; ` +
        "a hung test will run until something outside this process stops it"
    );
  }

  // A test that leaves a handle open (a prompt reading stdin, a live server)
  // otherwise wedges the run after the reporter is already done.
  if (nodeAccepts("--test-force-exit")) {
    args.push("--test-force-exit");
  }

  return [...args, ...options.passthrough, ...files];
}

/**
 * Whether this Node build accepts a flag
 *
 * Asked rather than inferred: --test-timeout landed in 20.11 and 21.2,
 * --test-force-exit in 20.14 and 22.0, and a version comparison that gets
 * either boundary wrong fails in the loudest possible way - every test
 * invocation dying before it starts.
 *
 * @param {string} flag
 */
function nodeAccepts(flag) {
  return spawnSync(process.execPath, [flag, "-e", ""]).status === 0;
}

const options = parseArgs(process.argv.slice(2));

const files = SUBSETS[options.subset].flatMap(collectTests).sort();

if (files.length === 0) {
  // The bug this runner exists to prevent: a selection that matches nothing
  // must never be mistaken for a suite that passed.
  fail(`no test files found for subset "${options.subset}"`);
}

if (options.list) {
  console.log(files.join("\n"));
  process.exit(0);
}

// Spawned through the Node binary rather than the `tsx` shim so no shell is
// involved - cmd.exe expands neither globs nor VAR=value prefixes.
const tsxCli = createRequire(import.meta.url).resolve("tsx/cli");

const child = spawn(process.execPath, [tsxCli, ...buildArgs(options, files)], {
  cwd: REPO_ROOT,
  stdio: "inherit",
  env: options.updateSnapshots ? { ...process.env, SNAPSHOT_UPDATE: "true" } : process.env,
});

child.on("error", (error) => fail(`could not start tsx: ${error.message}`));

child.on("exit", (code, signal) => {
  // A killed child reports a null code; treating that as success would hide
  // exactly the timeouts and crashes worth seeing.
  process.exit(signal ? 1 : (code ?? 1));
});
