export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type SchemaTables = {
  Tables: Record<string, never>;
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
};

export type AppSchema = `app_${string}`;

export type Database = {
  public: SchemaTables;
} & Record<AppSchema, SchemaTables>;
