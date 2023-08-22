import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetIcons,
} from "unocss";

export default defineConfig({
  exclude: [
    "node_modules",
    ".git",
    ".github",
    ".husky",
    ".vscode",
    "build",
    "dist",
    "mock",
    "public",
    "types",
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // icon图标：https://icones.js.org/collection/ri 和 https://icones.js.org/collection/mdi
      // 如需要用其他类别的图标，比如这个https://icones.js.org/collection/bi，直接运行npm install @iconify-json/bi -D即可
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
  shortcuts: [
    ["wh-full", "w-full h-full"],
    ["pointer", "cursor-pointer"],
    ["flex-col", "flex flex-col"],
    ["flex-end", "flex justify-end"],
    ["f-a", "flex justify-around"],
    ["f-b", "flex justify-between"],
    ["f-c", "flex items-center"],
    ["f-a-c", "f-a items-center"],
    ["f-b-c", "f-b items-center"],
    ["f-c-c", "f-c justify-center"],
  ],
  rules: [
    [
      /text-desc-(\d+)$/,
      ([, size]) => ({ "font-size": `${size}px`, opacity: 0.6 }),
    ],
  ],
  theme: {
    colors: {
      primary: "var(--primary-color)",
      link: "var(--link-color)",
      line: "#E6E9EB",
      light: "#f3f4f5",
    },
    breakpoints: {
      xxxs: "768px",
      xxs: "1024px",
      xs: "1280px",
      xl: "1440px",
      xxl: "1680px",
      xxxl: "1920px",
    },
    spacing: {
      tiny: "4px",
      small: "12px",
      medium: "20px",
      large: "28px",
    },
  },
});
