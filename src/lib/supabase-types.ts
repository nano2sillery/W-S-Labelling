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
      regulatory_mentions: {
        Row: {
          id: string
          label: string
          description: string | null
          content_type: 'text' | 'svg'
          content: string | null
          attributes: Json
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          label: string
          description?: string | null
          content_type: 'text' | 'svg'
          content?: string | null
          attributes?: Json
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          label?: string
          description?: string | null
          content_type?: 'text' | 'svg'
          content?: string | null
          attributes?: Json
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      tag_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      mention_tags: {
        Row: {
          mention_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          mention_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          mention_id?: string
          tag_id?: string
          created_at?: string
        }
      }
    }
  }
}