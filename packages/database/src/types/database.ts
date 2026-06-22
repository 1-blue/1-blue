export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type PaperLotteryTables = {
  boards: {
    Row: {
      id: string;
      short_code: string;
      admin_token: string;
      title: string;
      slot_count: number;
      prize_config: Json;
      status: "active" | "closed";
      revealed_at: string | null;
      expires_at: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      short_code: string;
      admin_token: string;
      title?: string;
      slot_count: number;
      prize_config?: Json;
      status?: "active" | "closed";
      revealed_at?: string | null;
      expires_at?: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      short_code?: string;
      admin_token?: string;
      title?: string;
      slot_count?: number;
      prize_config?: Json;
      status?: "active" | "closed";
      revealed_at?: string | null;
      expires_at?: string;
      created_at?: string;
    };
    Relationships: [];
  };
  participants: {
    Row: {
      id: string;
      board_id: string;
      token: string;
      display_name: string;
      pick_quota: number;
      picks_used: number;
      created_at: string;
    };
    Insert: {
      id?: string;
      board_id: string;
      token: string;
      display_name: string;
      pick_quota: number;
      picks_used?: number;
      created_at?: string;
    };
    Update: {
      id?: string;
      board_id?: string;
      token?: string;
      display_name?: string;
      pick_quota?: number;
      picks_used?: number;
      created_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "participants_board_id_fkey";
        columns: ["board_id"];
        isOneToOne: false;
        referencedRelation: "boards";
        referencedColumns: ["id"];
      },
    ];
  };
  slots: {
    Row: {
      id: string;
      board_id: string;
      slot_index: number;
      prize_label: string;
      picked_by: string | null;
      picked_at: string | null;
    };
    Insert: {
      id?: string;
      board_id: string;
      slot_index: number;
      prize_label: string;
      picked_by?: string | null;
      picked_at?: string | null;
    };
    Update: {
      id?: string;
      board_id?: string;
      slot_index?: number;
      prize_label?: string;
      picked_by?: string | null;
      picked_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "slots_board_id_fkey";
        columns: ["board_id"];
        isOneToOne: false;
        referencedRelation: "boards";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "slots_picked_by_fkey";
        columns: ["picked_by"];
        isOneToOne: false;
        referencedRelation: "participants";
        referencedColumns: ["id"];
      },
    ];
  };
  picks: {
    Row: {
      id: string;
      participant_id: string;
      slot_id: string;
      prize_label: string;
      picked_at: string;
    };
    Insert: {
      id?: string;
      participant_id: string;
      slot_id: string;
      prize_label: string;
      picked_at?: string;
    };
    Update: {
      id?: string;
      participant_id?: string;
      slot_id?: string;
      prize_label?: string;
      picked_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "picks_participant_id_fkey";
        columns: ["participant_id"];
        isOneToOne: false;
        referencedRelation: "participants";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "picks_slot_id_fkey";
        columns: ["slot_id"];
        isOneToOne: false;
        referencedRelation: "slots";
        referencedColumns: ["id"];
      },
    ];
  };
};

type PaperLotterySchema = {
  Tables: PaperLotteryTables;
  Views: Record<string, never>;
  Functions: {
    pick_slot: {
      Args: {
        p_participant_token: string;
        p_slot_index: number;
      };
      Returns: {
        prize_label: string;
        revealed: boolean;
      }[];
    };
  };
  Enums: Record<string, never>;
};

type EmptySchema = {
  Tables: Record<string, never>;
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
};

export type AppSchema = "app_paper_lottery";

export type Database = {
  public: EmptySchema;
  app_paper_lottery: PaperLotterySchema;
};
