export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          amount: number | null
          bet_type: string | null
          created_at: string | null
          id: string
          message_id: string | null
          outcome: string | null
          profit: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          bet_type?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          outcome?: string | null
          profit?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          bet_type?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          outcome?: string | null
          profit?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bets_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "telegram_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_channels: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          messages_count: number | null
          name: string
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          messages_count?: number | null
          name: string
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          messages_count?: number | null
          name?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      telegram_messages: {
        Row: {
          action_taken: boolean | null
          channel_id: string | null
          content: string
          created_at: string | null
          has_action: boolean | null
          id: string
          sender: string | null
          timestamp: string | null
        }
        Insert: {
          action_taken?: boolean | null
          channel_id?: string | null
          content: string
          created_at?: string | null
          has_action?: boolean | null
          id?: string
          sender?: string | null
          timestamp?: string | null
        }
        Update: {
          action_taken?: boolean | null
          channel_id?: string | null
          content?: string
          created_at?: string | null
          has_action?: boolean | null
          id?: string
          sender?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "telegram_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auto_login: boolean | null
          bet_url: string | null
          created_at: string | null
          daily_limit: number | null
          default_bet: number | null
          delay_between_bets: number | null
          id: string
          max_bet_amount: number | null
          reset_on_win: boolean | null
          updated_at: string | null
          use_martingale: boolean | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          auto_login?: boolean | null
          bet_url?: string | null
          created_at?: string | null
          daily_limit?: number | null
          default_bet?: number | null
          delay_between_bets?: number | null
          id?: string
          max_bet_amount?: number | null
          reset_on_win?: boolean | null
          updated_at?: string | null
          use_martingale?: boolean | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          auto_login?: boolean | null
          bet_url?: string | null
          created_at?: string | null
          daily_limit?: number | null
          default_bet?: number | null
          delay_between_bets?: number | null
          id?: string
          max_bet_amount?: number | null
          reset_on_win?: boolean | null
          updated_at?: string | null
          use_martingale?: boolean | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
