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
      cafe_owners: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          status: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          status: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          status?: string
          username?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          cafe_id: string
          cover_image: string | null
          created_at: string
          id: string
          logo_image: string | null
          name: string
          promo_images: Json | null
          short_id: string
        }
        Insert: {
          address: string
          cafe_id: string
          cover_image?: string | null
          created_at?: string
          id?: string
          logo_image?: string | null
          name: string
          promo_images?: Json | null
          short_id?: string
        }
        Update: {
          address?: string
          cafe_id?: string
          cover_image?: string | null
          created_at?: string
          id?: string
          logo_image?: string | null
          name?: string
          promo_images?: Json | null
          short_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafe_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          cafe_id: string
          created_at: string
          id: string
          name: string
          order: number
        }
        Insert: {
          cafe_id: string
          created_at?: string
          id?: string
          name: string
          order: number
        }
        Update: {
          cafe_id?: string
          created_at?: string
          id?: string
          name?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafe_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_options: {
        Row: {
          id: string
          menu_item_id: string
          multi_select: boolean
          name: string
          options: Json
          required: boolean
        }
        Insert: {
          id?: string
          menu_item_id: string
          multi_select?: boolean
          name: string
          options: Json
          required?: boolean
        }
        Update: {
          id?: string
          menu_item_id?: string
          multi_select?: boolean
          name?: string
          options?: Json
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_options_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          order: number
          price: number
          variants: Json | null
          weight: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          order?: number
          price: number
          variants?: Json | null
          weight?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          order?: number
          price?: number
          variants?: Json | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          location_id: string
          status: string
          table_id: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          location_id: string
          status: string
          table_id: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          location_id?: string
          status?: string
          table_id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          created_at: string
          id: string
          location_id: string
          name: string
          qr_code: string
          qr_code_url: string
          short_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          name: string
          qr_code: string
          qr_code_url: string
          short_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          name?: string
          qr_code?: string
          qr_code_url?: string
          short_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_menu_item_with_user_context: {
        Args: {
          p_user_id: string
          p_category_id: string
          p_name: string
          p_price: number
          p_description?: string
          p_weight?: string
          p_image_url?: string
        }
        Returns: {
          id: string
          category_id: string
          name: string
          description: string
          price: number
          weight: string
          image_url: string
          created_at: string
        }[]
      }
      set_current_user_id: {
        Args: { user_id: string }
        Returns: undefined
      }
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
