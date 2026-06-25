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

type DailyDoodleTables = {
  boards: {
    Row: {
      id: string;
      board_date: string;
      status: "open" | "closed";
      stroke_count: number;
      created_at: string;
      closed_at: string | null;
    };
    Insert: {
      id?: string;
      board_date: string;
      status?: "open" | "closed";
      stroke_count?: number;
      created_at?: string;
      closed_at?: string | null;
    };
    Update: {
      id?: string;
      board_date?: string;
      status?: "open" | "closed";
      stroke_count?: number;
      created_at?: string;
      closed_at?: string | null;
    };
    Relationships: [];
  };
  strokes: {
    Row: {
      id: string;
      board_id: string;
      session_id: string;
      nickname: string;
      tool: "pen" | "text";
      color: string;
      width: number | null;
      points: Json | null;
      text_content: string | null;
      font_family: string | null;
      x: number | null;
      y: number | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      board_id: string;
      session_id: string;
      nickname: string;
      tool: "pen" | "text";
      color: string;
      width?: number | null;
      points?: Json | null;
      text_content?: string | null;
      font_family?: string | null;
      x?: number | null;
      y?: number | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      board_id?: string;
      session_id?: string;
      nickname?: string;
      tool?: "pen" | "text";
      color?: string;
      width?: number | null;
      points?: Json | null;
      text_content?: string | null;
      font_family?: string | null;
      x?: number | null;
      y?: number | null;
      created_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "strokes_board_id_fkey";
        columns: ["board_id"];
        isOneToOne: false;
        referencedRelation: "boards";
        referencedColumns: ["id"];
      },
    ];
  };
  snapshots: {
    Row: {
      id: string;
      board_date: string;
      strokes: Json;
      participant_count: number;
      closed_at: string;
    };
    Insert: {
      id?: string;
      board_date: string;
      strokes?: Json;
      participant_count?: number;
      closed_at?: string;
    };
    Update: {
      id?: string;
      board_date?: string;
      strokes?: Json;
      participant_count?: number;
      closed_at?: string;
    };
    Relationships: [];
  };
};

type DailyDoodleSchema = {
  Tables: DailyDoodleTables;
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
};

type DailyDeductionTables = {
  puzzle_sets: {
    Row: {
      id: string;
      puzzle_date: string;
      set_type: "mystery" | "alibi" | "theft";
      title: string;
      premise: string;
      memory_minutes: number;
      created_at: string;
    };
    Insert: {
      id?: string;
      puzzle_date: string;
      set_type: "mystery" | "alibi" | "theft";
      title: string;
      premise: string;
      memory_minutes?: number;
      created_at?: string;
    };
    Update: {
      id?: string;
      puzzle_date?: string;
      set_type?: "mystery" | "alibi" | "theft";
      title?: string;
      premise?: string;
      memory_minutes?: number;
      created_at?: string;
    };
    Relationships: [];
  };
  clues: {
    Row: {
      id: string;
      puzzle_set_id: string;
      order_index: number;
      text: string;
      is_fake: boolean;
    };
    Insert: {
      id?: string;
      puzzle_set_id: string;
      order_index: number;
      text: string;
      is_fake?: boolean;
    };
    Update: {
      id?: string;
      puzzle_set_id?: string;
      order_index?: number;
      text?: string;
      is_fake?: boolean;
    };
    Relationships: [
      {
        foreignKeyName: "clues_puzzle_set_id_fkey";
        columns: ["puzzle_set_id"];
        isOneToOne: false;
        referencedRelation: "puzzle_sets";
        referencedColumns: ["id"];
      },
    ];
  };
  questions: {
    Row: {
      id: string;
      puzzle_set_id: string;
      order_index: number;
      prompt: string;
      options: Json;
      correct_option_index: number;
      explanation: string;
    };
    Insert: {
      id?: string;
      puzzle_set_id: string;
      order_index: number;
      prompt: string;
      options: Json;
      correct_option_index: number;
      explanation: string;
    };
    Update: {
      id?: string;
      puzzle_set_id?: string;
      order_index?: number;
      prompt?: string;
      options?: Json;
      correct_option_index?: number;
      explanation?: string;
    };
    Relationships: [
      {
        foreignKeyName: "questions_puzzle_set_id_fkey";
        columns: ["puzzle_set_id"];
        isOneToOne: false;
        referencedRelation: "puzzle_sets";
        referencedColumns: ["id"];
      },
    ];
  };
  puzzle_results: {
    Row: {
      id: string;
      puzzle_set_id: string;
      session_id: string;
      mode: "memory" | "open";
      wrong_count: number;
      time_seconds: number;
      answers: Json;
      player_name: string;
      player_label: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      puzzle_set_id: string;
      session_id: string;
      mode: "memory" | "open";
      wrong_count?: number;
      time_seconds?: number;
      answers?: Json;
      player_name?: string;
      player_label?: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      puzzle_set_id?: string;
      session_id?: string;
      mode?: "memory" | "open";
      wrong_count?: number;
      time_seconds?: number;
      answers?: Json;
      player_name?: string;
      player_label?: string;
      created_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "puzzle_results_puzzle_set_id_fkey";
        columns: ["puzzle_set_id"];
        isOneToOne: false;
        referencedRelation: "puzzle_sets";
        referencedColumns: ["id"];
      },
    ];
  };
};

type DailyDeductionSchema = {
  Tables: DailyDeductionTables;
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
};

type SiheomformTables = {
  cbts: {
    Row: {
      id: string;
      title: string;
      description: string | null;
      cover_image_url: string | null;
      admin_token: string;
      public_id: string;
      time_limit_minutes: number | null;
      shuffle_questions: boolean;
      shuffle_choices: boolean;
      show_explanation: boolean;
      passing_score: number;
      is_public: boolean;
      total_points: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      title: string;
      description?: string | null;
      cover_image_url?: string | null;
      admin_token: string;
      public_id: string;
      time_limit_minutes?: number | null;
      shuffle_questions?: boolean;
      shuffle_choices?: boolean;
      show_explanation?: boolean;
      passing_score?: number;
      is_public?: boolean;
      total_points?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      title?: string;
      description?: string | null;
      cover_image_url?: string | null;
      admin_token?: string;
      public_id?: string;
      time_limit_minutes?: number | null;
      shuffle_questions?: boolean;
      shuffle_choices?: boolean;
      show_explanation?: boolean;
      passing_score?: number;
      is_public?: boolean;
      total_points?: number;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [];
  };
  questions: {
    Row: {
      id: string;
      cbt_id: string;
      order_index: number;
      content: string;
      image_url: string | null;
      correct_choice_id: string | null;
      explanation: string | null;
      explanation_image_url: string | null;
      points: number | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      cbt_id: string;
      order_index: number;
      content?: string;
      image_url?: string | null;
      correct_choice_id?: string | null;
      explanation?: string | null;
      explanation_image_url?: string | null;
      points?: number | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      cbt_id?: string;
      order_index?: number;
      content?: string;
      image_url?: string | null;
      correct_choice_id?: string | null;
      explanation?: string | null;
      explanation_image_url?: string | null;
      points?: number | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "questions_cbt_id_fkey";
        columns: ["cbt_id"];
        isOneToOne: false;
        referencedRelation: "cbts";
        referencedColumns: ["id"];
      },
    ];
  };
  choices: {
    Row: {
      id: string;
      question_id: string;
      order_index: number;
      content: string;
      image_url: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      question_id: string;
      order_index: number;
      content?: string;
      image_url?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      question_id?: string;
      order_index?: number;
      content?: string;
      image_url?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "choices_question_id_fkey";
        columns: ["question_id"];
        isOneToOne: false;
        referencedRelation: "questions";
        referencedColumns: ["id"];
      },
    ];
  };
  attempts: {
    Row: {
      id: string;
      cbt_id: string;
      nickname: string;
      score: number | null;
      total_questions: number | null;
      started_at: string;
      submitted_at: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      cbt_id: string;
      nickname: string;
      score?: number | null;
      total_questions?: number | null;
      started_at?: string;
      submitted_at?: string | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      cbt_id?: string;
      nickname?: string;
      score?: number | null;
      total_questions?: number | null;
      started_at?: string;
      submitted_at?: string | null;
      created_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "attempts_cbt_id_fkey";
        columns: ["cbt_id"];
        isOneToOne: false;
        referencedRelation: "cbts";
        referencedColumns: ["id"];
      },
    ];
  };
  answers: {
    Row: {
      id: string;
      attempt_id: string;
      question_id: string;
      selected_choice_id: string | null;
      is_correct: boolean | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      attempt_id: string;
      question_id: string;
      selected_choice_id?: string | null;
      is_correct?: boolean | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      attempt_id?: string;
      question_id?: string;
      selected_choice_id?: string | null;
      is_correct?: boolean | null;
      created_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "answers_attempt_id_fkey";
        columns: ["attempt_id"];
        isOneToOne: false;
        referencedRelation: "attempts";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "answers_question_id_fkey";
        columns: ["question_id"];
        isOneToOne: false;
        referencedRelation: "questions";
        referencedColumns: ["id"];
      },
    ];
  };
  cbt_comments: {
    Row: {
      id: string;
      cbt_id: string;
      attempt_id: string;
      content: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      cbt_id: string;
      attempt_id: string;
      content: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      cbt_id?: string;
      attempt_id?: string;
      content?: string;
      created_at?: string;
    };
    Relationships: [];
  };
  cbt_likes: {
    Row: {
      id: string;
      cbt_id: string;
      attempt_id: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      cbt_id: string;
      attempt_id: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      cbt_id?: string;
      attempt_id?: string;
      created_at?: string;
    };
    Relationships: [];
  };
  comment_likes: {
    Row: {
      comment_id: string;
      attempt_id: string;
      created_at: string;
    };
    Insert: {
      comment_id: string;
      attempt_id: string;
      created_at?: string;
    };
    Update: {
      comment_id?: string;
      attempt_id?: string;
      created_at?: string;
    };
    Relationships: [];
  };
};

type SiheomformSchema = {
  Tables: SiheomformTables;
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
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

export type AppSchema = "app_paper_lottery" | "app_daily_doodle" | "app_daily_deduction" | "app_siheomform";

export type Database = {
  public: EmptySchema;
  app_paper_lottery: PaperLotterySchema;
  app_daily_doodle: DailyDoodleSchema;
  app_daily_deduction: DailyDeductionSchema;
  app_siheomform: SiheomformSchema;
};
