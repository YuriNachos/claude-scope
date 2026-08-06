#!/usr/bin/env node

/**
 * Install the `scope` skill into the user's Claude Code skills directory.
 *
 * Runs from the postinstall hook. It used to be a bash script invoked as
 * `bash scripts/install-skill.sh 2>/dev/null || true`, which npm hands to
 * cmd.exe on Windows - and cmd understands neither `2>/dev/null` nor `true`,
 * so the line meant to make the step unconditionally safe was itself what made
 * `npm install` exit 1 on every Windows machine.
 *
 * Installing a skill is a convenience, never a reason to fail an install, so
 * every failure here is reported and swallowed.
 */

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "scope";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(packageRoot, ".claude", "skills", SKILL_NAME);
const target = join(homedir(), ".claude", "skills", SKILL_NAME);

try {
  // Absent during development and in any install that excludes the skill from
  // the published files; both are normal.
  if (!existsSync(join(source, "SKILL.md"))) {
    console.log(`Note: no skill to install at ${source}, skipping.`);
    process.exit(0);
  }

  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });

  console.log(`[+] Skill installed to ${target}`);
  console.log("    Use /scope in Claude Code to configure widgets.");
} catch (error) {
  console.log(`Note: could not install the skill (${error.message}), skipping.`);
}
