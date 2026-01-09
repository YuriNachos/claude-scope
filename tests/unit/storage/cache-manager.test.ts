/**
 * CacheManager Unit Tests
 */

import assert from "node:assert";
import { existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { CacheManager } from "../../../src/storage/cache-manager.js";

describe("CacheManager", () => {
  const testCachePath = join(tmpdir(), `test-cache-${Date.now()}.json`);
  let manager: CacheManager;

  beforeEach(() => {
    // Create fresh manager for each test
    manager = new CacheManager({ cachePath: testCachePath });
  });

  afterEach(() => {
    // Clean up test cache file
    if (existsSync(testCachePath)) {
      try {
        unlinkSync(testCachePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe("getCachedUsage", () => {
    it("should return null for non-existent session", () => {
      const result = manager.getCachedUsage("non-existent");
      assert.strictEqual(result, null);
    });

    it("should return cached usage for valid session", () => {
      const sessionId = "test-session";
      const usage = {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      };

      manager.setCachedUsage(sessionId, usage);
      const result = manager.getCachedUsage(sessionId);

      assert.notStrictEqual(result, null);
      assert.strictEqual(result?.usage.input_tokens, 100);
      assert.strictEqual(result?.usage.cache_read_input_tokens, 1000);
    });

    it("should return null for expired cache", () => {
      const sessionId = "test-session";
      const usage = {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      };

      // Create manager with very short expiry
      const shortExpiryManager = new CacheManager({
        cachePath: testCachePath,
        expiryMs: 10, // 10ms expiry
      });

      shortExpiryManager.setCachedUsage(sessionId, usage);

      // Wait for expiry
      const startTime = Date.now();
      while (Date.now() - startTime < 20) {
        // Busy wait for 20ms
      }

      const result = shortExpiryManager.getCachedUsage(sessionId);
      assert.strictEqual(result, null);
    });
  });

  describe("setCachedUsage", () => {
    it("should store usage data with timestamp", () => {
      const sessionId = "test-session";
      const usage = {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      };

      const beforeTimestamp = Date.now();
      manager.setCachedUsage(sessionId, usage);
      const afterTimestamp = Date.now();

      const result = manager.getCachedUsage(sessionId);

      assert.notStrictEqual(result, null);
      assert.ok(result?.timestamp >= beforeTimestamp);
      assert.ok(result?.timestamp <= afterTimestamp);
    });

    it("should overwrite existing cache for same session", () => {
      const sessionId = "test-session";

      manager.setCachedUsage(sessionId, {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      });

      manager.setCachedUsage(sessionId, {
        input_tokens: 200, // Different value
        output_tokens: 75,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 2000,
      });

      const result = manager.getCachedUsage(sessionId);
      assert.strictEqual(result?.usage.input_tokens, 200);
      assert.strictEqual(result?.usage.cache_read_input_tokens, 2000);
    });
  });

  describe("clearCache", () => {
    it("should remove all cached sessions", () => {
      manager.setCachedUsage("session-1", {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      });

      manager.setCachedUsage("session-2", {
        input_tokens: 200,
        output_tokens: 75,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 2000,
      });

      manager.clearCache();

      assert.strictEqual(manager.getCachedUsage("session-1"), null);
      assert.strictEqual(manager.getCachedUsage("session-2"), null);
    });
  });

  describe("cleanupExpired", () => {
    it("should remove only expired sessions", () => {
      const shortExpiryManager = new CacheManager({
        cachePath: testCachePath,
        expiryMs: 100,
      });

      shortExpiryManager.setCachedUsage("old-session", {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      });

      // Wait for expiry
      const startTime = Date.now();
      while (Date.now() - startTime < 150) {
        // Busy wait for 150ms
      }

      shortExpiryManager.setCachedUsage("new-session", {
        input_tokens: 200,
        output_tokens: 75,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 2000,
      });

      shortExpiryManager.cleanupExpired();

      assert.strictEqual(shortExpiryManager.getCachedUsage("old-session"), null);
      assert.notStrictEqual(shortExpiryManager.getCachedUsage("new-session"), null);
    });
  });
});
