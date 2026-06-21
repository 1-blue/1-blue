import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/date/index.ts", "src/geo/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
});
