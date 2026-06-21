import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/custom-fetch.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
