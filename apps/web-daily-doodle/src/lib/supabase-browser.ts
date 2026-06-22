import { createBrowserClient } from "@1-blue/database";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseBrowser = () => {
  if (!browserClient) {
    browserClient = createBrowserClient();
  }

  return browserClient;
};
