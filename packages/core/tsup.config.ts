import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/date/index.ts",
    "src/geo/index.ts",
    "src/paper-lottery/index.ts",
    "src/daily-doodle/index.ts",
    "src/daily-deduction/index.ts",
    "src/siheomform/index.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
});
