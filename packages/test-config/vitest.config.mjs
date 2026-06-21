import { defineConfig } from "vitest/config";

/** @param {string} name */
export const createVitestConfig = (name) =>
  defineConfig({
    test: {
      name,
      globals: false,
      environment: "node",
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  });

export default createVitestConfig("default");
