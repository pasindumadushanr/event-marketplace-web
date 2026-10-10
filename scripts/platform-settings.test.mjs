import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PLATFORM,
  analyticsId,
  isPlatformSettings,
} from "../src/lib/platform-settings.ts";
test("accepts the public settings contract and rejects incomplete responses", () => {
  assert.equal(isPlatformSettings(DEFAULT_PLATFORM), true);
  for (const value of [
    null,
    {},
    [],
    { ...DEFAULT_PLATFORM, social: {} },
    { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: 42 } },
  ])
    assert.equal(isPlatformSettings(value), false);
});
test("saved GA4 ID overrides the Vercel fallback", () => {
  assert.equal(
    analyticsId(
      { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "G-12345ABCDE" } },
      "G-45Z4GT318V",
    ),
    "G-12345ABCDE",
  );
});
test("explicitly empty ID disables analytics while missing ID preserves deployment fallback", () => {
  assert.equal(
    analyticsId(
      { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
      "G-45Z4GT318V",
    ),
    "",
  );
  assert.equal(analyticsId(DEFAULT_PLATFORM, "G-45Z4GT318V"), "G-45Z4GT318V");
});
test("invalid stored and environment IDs cannot inject a script", () => {
  assert.equal(
    analyticsId({
      ...DEFAULT_PLATFORM,
      analytics: { googleAnalyticsId: "G-12345');alert(1)//" },
    }),
    "",
  );
  assert.equal(analyticsId(DEFAULT_PLATFORM, "<script>bad</script>"), "");
});
