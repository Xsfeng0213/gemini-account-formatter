import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKGROUND_THEMES,
  DEFAULT_BACKGROUND_THEME,
  getBackgroundTheme,
} from "./backgroundThemes";

test("exposes the three expected background themes", () => {
  assert.deepEqual(
    BACKGROUND_THEMES.map((theme) => ({
      id: theme.id,
      label: theme.label,
      shellClassName: theme.shellClassName,
      previewClassName: theme.previewClassName,
    })),
    [
      {
        id: "cool-tech",
        label: "冷色科技感",
        shellClassName: "theme-cool-tech",
        previewClassName: "theme-preview-cool-tech",
      },
      {
        id: "rainbow-jelly",
        label: "彩虹果冻感",
        shellClassName: "theme-rainbow-jelly",
        previewClassName: "theme-preview-rainbow-jelly",
      },
      {
        id: "sunset-neon",
        label: "日落霓虹感",
        shellClassName: "theme-sunset-neon",
        previewClassName: "theme-preview-sunset-neon",
      },
    ],
  );
});

test("returns the first theme as the default background theme", () => {
  assert.equal(DEFAULT_BACKGROUND_THEME, "cool-tech");
  assert.equal(getBackgroundTheme(DEFAULT_BACKGROUND_THEME).label, "冷色科技感");
});
