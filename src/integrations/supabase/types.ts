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
      announcements: {
        Row: {
          content: string
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_materials: {
        Row: {
          course_id: number | null
          created_at: string | null
          id: string
          professor_id: string | null
          title: string
          type: string
          url: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          professor_id?: string | null
          title: string
          type: string
          url: string
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          professor_id?: string | null
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_materials_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          course_id: number | null
          created_at: string | null
          id: string
          professor_id: string | null
          title: string
          video_url: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          professor_id?: string | null
          title: string
          video_url: string
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          professor_id?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_videos_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          description: string | null
          duration: number
          id: number
          instructor: string
          professor_id: string | null
          schedule: string | null
          title: string
        }
        Insert: {
          description?: string | null
          duration: number
          id?: never
          instructor: string
          professor_id?: string | null
          schedule?: string | null
          title: string
        }
        Update: {
          description?: string | null
          duration?: number
          id?: never
          instructor?: string
          professor_id?: string | null
          schedule?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: number | null
          created_at: string | null
          id: string
          status: string
          student_id: string | null
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          status?: string
          student_id?: string | null
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          price: number
          seller_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price: number
          seller_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          seller_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          created_at: string | null
          hourly_rate: number
          id: string
          name: string
          staff_id: string
          user_id: string | null
          zoom_link: string | null
        }
        Insert: {
          created_at?: string | null
          hourly_rate: number
          id?: string
          name: string
          staff_id: string
          user_id?: string | null
          zoom_link?: string | null
        }
        Update: {
          created_at?: string | null
          hourly_rate?: number
          id?: string
          name?: string
          staff_id?: string
          user_id?: string | null
          zoom_link?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: number
          name: string
          type: string
          url: string
        }
        Insert: {
          id?: never
          name: string
          type: string
          url: string
        }
        Update: {
          id?: never
          name?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string | null
          id: string
          index_number: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          index_number: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          index_number?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
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
