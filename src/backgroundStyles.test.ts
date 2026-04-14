import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./index.css", import.meta.url), "utf8");

test("background styles include a breathing glow animation", () => {
  assert.match(css, /@keyframes\s+orbBreath/);
  assert.match(css, /\.orb-1\s*\{[\s\S]*animation:[^}]*orbBreath/);
  assert.match(css, /\.orb-6\s*\{[\s\S]*animation:[^}]*orbBreath/);
  assert.match(css, /opacity:\s*0\.28;/);
  assert.match(css, /opacity:\s*0\.96;/);
});

test("background motion uses larger travel distances", () => {
  assert.match(css, /translate3d\(12rem,\s*7rem,\s*0\)\s*scale\(1\.22\)/);
  assert.match(css, /translate3d\(-10rem,\s*9rem,\s*0\)\s*scale\(1\.24\)/);
});

test("background blur is reduced for clearer motion", () => {
  assert.match(css, /filter:\s*blur\(76px\)\s*saturate\(125%\)/);
  assert.match(css, /filter:\s*blur\(68px\)\s*saturate\(120%\)/);
});
