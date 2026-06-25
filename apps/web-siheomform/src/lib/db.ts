import { createServerClient } from "@1-blue/database/server";

export const SCHEMA = "app_siheomform" as const;

export const getDb = () => createServerClient(SCHEMA);
