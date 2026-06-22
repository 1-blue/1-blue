import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/content.ts", "src/operator.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
