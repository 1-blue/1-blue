export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  lol: {
    Tables: {
      champion_skins: {
        Row: {
          champion_id: string;
          champion_name: string;
          created_at: string | null;
          has_chromas: boolean;
          id: number;
          loading_image_url: string;
          skin_id: string;
          skin_name: string;
          skin_num: number;
          splash_image_url: string;
          square_image_url: string;
          version: string;
        };
        Insert: {
          champion_id: string;
          champion_name: string;
          created_at?: string | null;
          has_chromas?: boolean;
          id?: number;
          loading_image_url: string;
          skin_id: string;
          skin_name: string;
          skin_num: number;
          splash_image_url: string;
          square_image_url: string;
          version: string;
        };
        Update: {
          champion_id?: string;
          champion_name?: string;
          created_at?: string | null;
          has_chromas?: boolean;
          id?: number;
          loading_image_url?: string;
          skin_id?: string;
          skin_name?: string;
          skin_num?: number;
          splash_image_url?: string;
          square_image_url?: string;
          version?: string;
        };
        Relationships: [];
      };
      champions: {
        Row: {
          created_at: string | null;
          id: string;
          key: string;
          loading_image_url: string;
          name: string;
          splash_image_url: string;
          square_image_url: string;
          tags: string[];
          title: string;
          version: string;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          key: string;
          loading_image_url: string;
          name: string;
          splash_image_url: string;
          square_image_url: string;
          tags: string[];
          title: string;
          version: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          key?: string;
          loading_image_url?: string;
          name?: string;
          splash_image_url?: string;
          square_image_url?: string;
          tags?: string[];
          title?: string;
          version?: string;
        };
        Relationships: [];
      };
      rankings: {
        Row: {
          completion_time: number;
          created_at: string | null;
          id: string;
          nickname: string;
          password: string;
          quiz_type: Database["lol"]["Enums"]["quiz_type_enum"];
          score: number;
        };
        Insert: {
          completion_time: number;
          created_at?: string | null;
          id?: string;
          nickname: string;
          password: string;
          quiz_type?: Database["lol"]["Enums"]["quiz_type_enum"];
          score: number;
        };
        Update: {
          completion_time?: number;
          created_at?: string | null;
          id?: string;
          nickname?: string;
          password?: string;
          quiz_type?: Database["lol"]["Enums"]["quiz_type_enum"];
          score?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      quiz_type_enum: "multiple-choice" | "short-answer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  lol: {
    Enums: {
      quiz_type_enum: ["multiple-choice", "short-answer"],
    },
  },
  public: {
    Enums: {},
  },
} as const;
