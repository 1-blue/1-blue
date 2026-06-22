import { createServerClient } from "@1-blue/database/server";

export const SCHEMA = "app_daily_doodle" as const;

export const getDb = () => createServerClient(SCHEMA);
