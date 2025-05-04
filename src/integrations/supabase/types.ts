export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
  settings: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_settings: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          industry: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          country: string | null;
          tax_id: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string | null;
          industry?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          tax_id?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string | null;
          industry?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          tax_id?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      billing_settings: {
        Row: {
          id: string;
          user_id: string;
          billing_name: string | null;
          billing_email: string | null;
          subscription_plan: string;
          subscription_status: string;
          subscription_renewal_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          billing_name?: string | null;
          billing_email?: string | null;
          subscription_plan?: string;
          subscription_status?: string;
          subscription_renewal_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          billing_name?: string | null;
          billing_email?: string | null;
          subscription_plan?: string;
          subscription_status?: string;
          subscription_renewal_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          payment_type: string;
          provider: string;
          last_four: string | null;
          expiry_date: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          payment_type: string;
          provider: string;
          last_four?: string | null;
          expiry_date?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          payment_type?: string;
          provider?: string;
          last_four?: string | null;
          expiry_date?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_preferences: {
        Row: {
          id: string;
          user_id: string;
          invoice_notifications: boolean;
          client_activity: boolean;
          project_updates: boolean;
          marketing_tips: boolean;
          email_frequency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_notifications?: boolean;
          client_activity?: boolean;
          project_updates?: boolean;
          marketing_tips?: boolean;
          email_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_notifications?: boolean;
          client_activity?: boolean;
          project_updates?: boolean;
          marketing_tips?: boolean;
          email_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      security_settings: {
        Row: {
          id: string;
          user_id: string;
          two_factor_enabled: boolean;
          last_password_change: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          two_factor_enabled?: boolean;
          last_password_change?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          two_factor_enabled?: boolean;
          last_password_change?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      session_history: {
        Row: {
          id: string;
          user_id: string;
          device: string | null;
          browser: string | null;
          os: string | null;
          ip_address: string | null;
          location: string | null;
          login_at: string;
          logout_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          device?: string | null;
          browser?: string | null;
          os?: string | null;
          ip_address?: string | null;
          location?: string | null;
          login_at?: string;
          logout_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          device?: string | null;
          browser?: string | null;
          os?: string | null;
          ip_address?: string | null;
          location?: string | null;
          login_at?: string;
          logout_at?: string | null;
        };
      };
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
type SettingsSchema = Database[Extract<keyof Database, "settings">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
  settings: {
    Enums: {},
  },
} as const;
