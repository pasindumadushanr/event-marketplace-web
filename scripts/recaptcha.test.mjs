import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/lib/recaptcha.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;

function harness(key = "test-public-key") {
  const scripts = [];
  const timers = new Map();
  const warnings = [];
  let now = 0,
    id = 0;
  const window = {
    setTimeout(fn, ms) {
      timers.set(++id, { fn, at: now + ms });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  const context = vm.createContext({
    exports: {},
    Error,
    Promise,
    window,
    process: {
      env: { NODE_ENV: "production", NEXT_PUBLIC_RECAPTCHA_SITE_KEY: key },
    },
    console: { warn: (...args) => warnings.push(args) },
    document: {
      createElement() {
        return {
          remove() {
            this.removed = true;
          },
        };
      },
      head: {
        appendChild(script) {
          scripts.push(script);
        },
      },
    },
  });
  vm.runInContext(source, context);
  return {
    api: context.exports,
    window,
    scripts,
    timers,
    warnings,
    async tick(ms) {
      now += ms;
      for (const [id, timer] of timers) {
        if (timer.at <= now) {
          timers.delete(id);
          timer.fn();
        }
      }
      for (let i = 0; i < 8; i++) await Promise.resolve();
    },
    initialize(
      execute = () => Promise.resolve("fresh-token"),
      ready = (cb) => cb(),
    ) {
      window.grecaptcha = { ready, execute };
      scripts.at(-1).onload();
    },
  };
}

test("allows initialization and execution beyond the old 12-second limit", async () => {
  const h = harness();
  let ready, execute;
  const result = h.api.recaptchaToken("register");
  h.initialize(
    () =>
      new Promise((resolve) => {
        execute = resolve;
      }),
    (cb) => {
      ready = cb;
    },
  );
  await h.tick(15000);
  ready();
  await h.tick(0);
  await h.tick(15000);
  execute("fresh-token");
  assert.equal(await result, "fresh-token");
  assert.equal(h.timers.size, 0);
});

test("retries a blocked script through the documented alternate host", async () => {
  const h = harness();
  const result = h.api.recaptchaToken("register");
  h.scripts[0].onerror();
  await h.tick(0);
  assert.match(h.scripts[1].src, /^https:\/\/www\.recaptcha\.net\//);
  assert.equal(h.scripts[0].removed, true);
  h.initialize();
  assert.equal(await result, "fresh-token");
});

test("reports configuration errors instead of blaming the connection", async () => {
  const h = harness();
  const result = h.api.recaptchaToken("register");
  h.initialize(() => {
    throw new Error("Invalid site key or not loaded in api.js: secret-detail");
  });
  await assert.rejects(result, (error) => {
    assert.equal(error.response.data.code, "recaptcha_configuration");
    assert.doesNotMatch(error.message, /secret-detail|connection/);
    return true;
  });
  assert.deepEqual(h.warnings, [
    ["reCAPTCHA verification failed:", "configuration"],
  ]);
  assert.equal(h.timers.size, 0);
});

test("an execution timeout fails closed and a user retry generates a new token", async () => {
  const h = harness();
  let attempts = 0;
  const result = h.api.recaptchaToken("register");
  const rejected = assert.rejects(
    result,
    (error) => error.response.data.code === "recaptcha_execute_timeout",
  );
  h.initialize(() =>
    ++attempts === 1 ? new Promise(() => {}) : Promise.resolve("retry-token"),
  );
  await h.tick(0);
  await h.tick(40000);
  await rejected;
  assert.equal(await h.api.recaptchaToken("register"), "retry-token");
  assert.equal(h.scripts.length, 1);
});

test("both script failures are bounded and the next submission can retry", async () => {
  const h = harness();
  const result = h.api.recaptchaToken("register");
  const rejected = assert.rejects(
    result,
    (error) => error.response.data.code === "recaptcha_script_load",
  );
  h.scripts[0].onerror();
  await h.tick(0);
  h.scripts[1].onerror();
  await rejected;
  const retry = h.api.recaptchaToken("register");
  h.initialize();
  assert.equal(await retry, "fresh-token");
  assert.equal(h.scripts.length, 3);
});

test("missing production key fails closed", async () => {
  const h = harness("");
  await assert.rejects(
    h.api.recaptchaToken("register"),
    (error) => error.response.data.code === "recaptcha_configuration",
  );
  assert.equal(h.scripts.length, 0);
});

test("empty token fails closed and synchronous exceptions clear the timer", async () => {
  const h = harness();
  const result = h.api.recaptchaToken("register");
  h.initialize(() => Promise.resolve(""));
  await assert.rejects(
    result,
    (error) => error.response.data.code === "recaptcha_execute_failed",
  );
  assert.equal(h.timers.size, 0);
});

test("late callbacks cannot revive a failed loading attempt", async () => {
  const h = harness();
  let ready;
  const result = h.api.recaptchaToken("register");
  h.initialize(undefined, (cb) => {
    ready = cb;
  });
  await h.tick(40000);
  ready();
  // The fallback reuses the initialized client, waiting for a fresh ready callback.
  ready();
  assert.equal(await result, "fresh-token");
  assert.equal(h.scripts.length, 1);
});
