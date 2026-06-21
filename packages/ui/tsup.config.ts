import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/lib/index.ts", "src/fonts/index.ts", "src/providers/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
});
