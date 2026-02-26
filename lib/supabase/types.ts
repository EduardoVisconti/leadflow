export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          website: string | null
          industry: string | null
          size: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          website?: string | null
          industry?: string | null
          size?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          website?: string | null
          industry?: string | null
          size?: string | null
          created_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          company_id: string | null
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          role: string | null
          avatar_url: string | null
          notes: string | null
          channel: string | null
          instagram_handle: string | null
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id?: string | null
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          role?: string | null
          avatar_url?: string | null
          notes?: string | null
          channel?: string | null
          instagram_handle?: string | null
          whatsapp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string | null
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          role?: string | null
          avatar_url?: string | null
          notes?: string | null
          channel?: string | null
          instagram_handle?: string | null
          whatsapp?: string | null
          created_at?: string
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          id: string
          user_id: string
          name: string
          position: number
          color: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          position: number
          color?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          position?: number
          color?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          id: string
          user_id: string
          contact_id: string | null
          company_id: string | null
          stage_id: string | null
          title: string
          value: number | null
          currency: string
          priority: string
          expected_close_date: string | null
          position: number
          notes: string | null
          source: string | null
          product_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id?: string | null
          company_id?: string | null
          stage_id?: string | null
          title: string
          value?: number | null
          currency?: string
          priority?: string
          expected_close_date?: string | null
          position?: number
          notes?: string | null
          source?: string | null
          product_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string | null
          company_id?: string | null
          stage_id?: string | null
          title?: string
          value?: number | null
          currency?: string
          priority?: string
          expected_close_date?: string | null
          position?: number
          notes?: string | null
          source?: string | null
          product_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          id: string
          user_id: string
          deal_id: string
          contact_id: string | null
          type: string
          title: string
          body: string | null
          due_date: string | null
          done: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deal_id: string
          contact_id?: string | null
          type: string
          title: string
          body?: string | null
          due_date?: string | null
          done?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deal_id?: string
          contact_id?: string | null
          type?: string
          title?: string
          body?: string | null
          due_date?: string | null
          done?: boolean
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          brand: string | null
          category: string | null
          price: number | null
          stock: number
          description: string | null
          sku: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          brand?: string | null
          category?: string | null
          price?: number | null
          stock?: number
          description?: string | null
          sku?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          brand?: string | null
          category?: string | null
          price?: number | null
          stock?: number
          description?: string | null
          sku?: string | null
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          deal_id: string | null
          contact_id: string | null
          title: string
          description: string | null
          due_date: string | null
          done: boolean
          priority: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deal_id?: string | null
          contact_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          done?: boolean
          priority?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deal_id?: string | null
          contact_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          done?: boolean
          priority?: string
          created_at?: string
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
