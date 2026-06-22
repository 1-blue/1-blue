import { createBrowserClient, type SchemaClient } from "@1-blue/database";
import { SCHEMA } from "@/lib/db";

let browserClient: SchemaClient<typeof SCHEMA> | null = null;

export const getSupabaseBrowser = () => {
  if (!browserClient) {
    browserClient = createBrowserClient({ schema: SCHEMA });
  }

  return browserClient;
};
