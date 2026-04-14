import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");

test("app imports the cat mascot asset", () => {
  assert.match(appSource, /import\s+catMascot\s+from\s+"\.\/images\/cat\.png";/);
});

test("app renders the mascot layered on the card edge", () => {
  assert.match(appSource, /mascot-cat/);
  assert.match(appSource, /-top-\[2\.5rem\]/);
  assert.match(appSource, /md:-top-\[4rem\]/);
  assert.match(appSource, /absolute[^"\n]*left-/);
});
