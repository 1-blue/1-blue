import { createServerClient } from "@1-blue/database/server";

export const SCHEMA = "app_daily_deduction" as const;

export const getDb = () => createServerClient(SCHEMA);
