// Gerado a partir do banco do Supabase (projeto chicos-gym). Ao mudar o
// banco, gere de novo em vez de editar à mão.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          accepted_terms_at: string
          created_at: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          accepted_terms_at?: string
          created_at?: string
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          accepted_terms_at?: string
          created_at?: string
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
