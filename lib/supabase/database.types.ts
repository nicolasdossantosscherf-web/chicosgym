// Gerado a partir do banco do Supabase (projeto chicos-gym). Ao mudar o
// banco, gere de novo em vez de editar à mão.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      exercise_logs: {
        Row: {
          created_at: string
          exercise: string
          id: string
          load_kg: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exercise: string
          id?: string
          load_kg?: number | null
          session_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          exercise?: string
          id?: string
          load_kg?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          expires_on: string
          plan: string
          starts_on: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          expires_on: string
          plan: string
          starts_on: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          expires_on?: string
          plan?: string
          starts_on?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accepted_terms_at: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          accepted_terms_at?: string
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          accepted_terms_at?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_workouts: {
        Row: {
          experience: string | null
          frequency: number
          goal: string | null
          injury_note: string | null
          sex: string
          updated_at: string
          user_id: string
        }
        Insert: {
          experience?: string | null
          frequency: number
          goal?: string | null
          injury_note?: string | null
          sex: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          experience?: string | null
          frequency?: number
          goal?: string | null
          injury_note?: string | null
          sex?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          created_at: string
          day_focus: string
          day_index: number
          id: string
          plan_frequency: number
          plan_sex: string
          trained_on: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_focus: string
          day_index: number
          id?: string
          plan_frequency: number
          plan_sex: string
          trained_on: string
          user_id?: string
        }
        Update: {
          created_at?: string
          day_focus?: string
          day_index?: number
          id?: string
          plan_frequency?: number
          plan_sex?: string
          trained_on?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_my_account: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicTables = Database["public"]["Tables"]
export type Row<T extends keyof PublicTables> = PublicTables[T]["Row"]
