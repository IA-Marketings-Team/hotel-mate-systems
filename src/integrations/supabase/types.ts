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
      bookings: {
        Row: {
          amount: number
          check_in: string
          check_out: string
          client_id: string | null
          created_at: string
          created_by: string
          guest_name: string
          id: string
          room_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          check_in: string
          check_out: string
          client_id?: string | null
          created_at?: string
          created_by?: string
          guest_name: string
          id?: string
          room_id: string
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          check_in?: string
          check_out?: string
          client_id?: string | null
          created_at?: string
          created_by?: string
          guest_name?: string
          id?: string
          room_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          capacity: number
          cleaning_status: boolean | null
          created_at: string
          current_guest: string | null
          features: string[]
          floor: number
          id: string
          last_cleaned: string | null
          maintenance_status: boolean | null
          notes: string | null
          number: string
          price_per_night: number
          status: string
          type: string
          updated_at: string
          view: string
        }
        Insert: {
          capacity: number
          cleaning_status?: boolean | null
          created_at?: string
          current_guest?: string | null
          features?: string[]
          floor: number
          id?: string
          last_cleaned?: string | null
          maintenance_status?: boolean | null
          notes?: string | null
          number: string
          price_per_night: number
          status: string
          type: string
          updated_at?: string
          view: string
        }
        Update: {
          capacity?: number
          cleaning_status?: boolean | null
          created_at?: string
          current_guest?: string | null
          features?: string[]
          floor?: number
          id?: string
          last_cleaned?: string | null
          maintenance_status?: boolean | null
          notes?: string | null
          number?: string
          price_per_night?: number
          status?: string
          type?: string
          updated_at?: string
          view?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          register_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          register_type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          register_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_items: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_available: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          available: boolean
          category: string
          created_at: string
          description: string
          duration: number | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          available?: boolean
          category: string
          created_at?: string
          description: string
          duration?: number | null
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string
          duration?: number | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          contact_number: string
          created_at: string
          email: string
          id: string
          is_available: boolean
          name: string
          role: string
          shift: string
          updated_at: string
        }
        Insert: {
          contact_number: string
          created_at?: string
          email: string
          id?: string
          is_available?: boolean
          name: string
          role: string
          shift: string
          updated_at?: string
        }
        Update: {
          contact_number?: string
          created_at?: string
          email?: string
          id?: string
          is_available?: boolean
          name?: string
          role?: string
          shift?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          client_id: string | null
          created_at: string
          date: string
          description: string
          id: string
          method: string
          register_type: string
          staff_id: string | null
          subcategory: string | null
          type: string
        }
        Insert: {
          amount: number
          category?: string | null
          client_id?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          method: string
          register_type: string
          staff_id?: string | null
          subcategory?: string | null
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          client_id?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          method?: string
          register_type?: string
          staff_id?: string | null
          subcategory?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      transactions_summary: {
        Row: {
          balance: number | null
          register_type: string | null
          total_payments: number | null
          total_refunds: number | null
          transaction_count: number | null
          transaction_date: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
