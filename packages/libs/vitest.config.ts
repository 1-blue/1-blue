import { mergeConfig } from "vitest/config";
import { createVitestConfig } from "@1-blue/test-config/vitest";

export default mergeConfig(createVitestConfig("@1-blue/libs"), {});
