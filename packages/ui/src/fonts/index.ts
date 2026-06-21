/**
 * Font presets for Next.js apps.
 * Apps import these in layout.tsx via next/font.
 *
 * main: Noto Sans KR (Google Fonts — no manual download)
 * sub: Geist Mono (via npm geist package in apps)
 * display: add local woff2 to packages/ui/assets/fonts/ when needed
 */

export type FontPreset = {
  name: "main" | "sub" | "display";
  description: string;
  googleFont?: string;
  localPath?: string;
};

export const fontPresets: FontPreset[] = [
  {
    name: "main",
    description: "Primary UI font — Noto Sans KR via next/font/google",
    googleFont: "Noto_Sans_KR",
  },
  {
    name: "sub",
    description: "Monospace — Geist Mono via geist package",
    googleFont: "Geist_Mono",
  },
  {
    name: "display",
    description: "Custom display font — place woff2 in packages/ui/assets/fonts/",
    localPath: "../assets/fonts/display.woff2",
  },
];

export const getFontClassName = (preset: FontPreset["name"]): string => {
  const map: Record<FontPreset["name"], string> = {
    main: "font-sans",
    sub: "font-mono",
    display: "font-display",
  };
  return map[preset];
};
