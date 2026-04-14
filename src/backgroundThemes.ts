export type BackgroundThemeId =
  | "cool-tech"
  | "rainbow-jelly"
  | "sunset-neon";

export type BackgroundTheme = {
  id: BackgroundThemeId;
  label: string;
  shellClassName: string;
  previewClassName: string;
};

export const BACKGROUND_THEMES: BackgroundTheme[] = [
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
];

export const DEFAULT_BACKGROUND_THEME: BackgroundThemeId =
  BACKGROUND_THEMES[0].id;

export function getBackgroundTheme(id: BackgroundThemeId): BackgroundTheme {
  return BACKGROUND_THEMES.find((theme) => theme.id === id) ?? BACKGROUND_THEMES[0];
}
