import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/server/index.ts", "src/types/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["@supabase/supabase-js"],
});
