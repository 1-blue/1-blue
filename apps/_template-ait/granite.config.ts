import { defineConfig } from "@apps-in-toss/web-framework/config";

const devPort = 7000;

export default defineConfig({
  appName: "{{APP_NAME_GRANITE}}",
  brand: {
    displayName: "{{APP_NAME}}",
    primaryColor: "#3182F6",
    icon: "",
  },
  permissions: [],
  web: {
    commands: {
      build: "next build",
      dev: `next dev --port ${devPort}`,
    },
    host: "localhost",
    port: devPort,
  },
});
