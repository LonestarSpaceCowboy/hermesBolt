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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          home_address: string | null
          work_address: string | null
          timezone: string
          auto_accept: boolean
          email_retention: '3m' | '6m' | '1y'
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          home_address?: string | null
          work_address?: string | null
          timezone?: string
          auto_accept?: boolean
          email_retention?: '3m' | '6m' | '1y'
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          home_address?: string | null
          work_address?: string | null
          timezone?: string
          auto_accept?: boolean
          email_retention?: '3m' | '6m' | '1y'
        }
      }
      email_accounts: {
        Row: {
          id: string
          user_id: string
          provider: string
          email: string
          access_token: string
          refresh_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          email: string
          access_token: string
          refresh_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          email?: string
          access_token?: string
          refresh_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calendar_accounts: {
        Row: {
          id: string
          user_id: string
          provider: string
          name: string
          access_token: string
          refresh_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          name: string
          access_token: string
          refresh_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          name?: string
          access_token?: string
          refresh_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          is_remote: boolean
          category: string
          importance: 'low' | 'medium' | 'high'
          calendar_id: string | null
          calendar_event_id: string | null
          email_source_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          is_remote?: boolean
          category: string
          importance?: 'low' | 'medium' | 'high'
          calendar_id?: string | null
          calendar_event_id?: string | null
          email_source_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          is_remote?: boolean
          category?: string
          importance?: 'low' | 'medium' | 'high'
          calendar_id?: string | null
          calendar_event_id?: string | null
          email_source_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          importance: 'low' | 'medium' | 'high'
          completed: boolean
          email_source_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: string
          importance?: 'low' | 'medium' | 'high'
          completed?: boolean
          email_source_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          importance?: 'low' | 'medium' | 'high'
          completed?: boolean
          email_source_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      incoming_requests: {
        Row: {
          id: string
          user_id: string
          type: 'event' | 'task'
          title: string
          description: string | null
          start_time: string | null
          end_time: string | null
          location: string | null
          is_remote: boolean | null
          category: string
          importance: 'low' | 'medium' | 'high'
          status: 'pending' | 'accepted' | 'rejected'
          email_source_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'event' | 'task'
          title: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          is_remote?: boolean | null
          category: string
          importance?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'accepted' | 'rejected'
          email_source_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'event' | 'task'
          title?: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          is_remote?: boolean | null
          category?: string
          importance?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'accepted' | 'rejected'
          email_source_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      emails: {
        Row: {
          id: string
          user_id: string
          email_account_id: string
          external_id: string
          from: string
          to: string[]
          subject: string
          body_text: string
          body_html: string | null
          received_at: string
          processed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_account_id: string
          external_id: string
          from: string
          to: string[]
          subject: string
          body_text: string
          body_html?: string | null
          received_at: string
          processed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_account_id?: string
          external_id?: string
          from?: string
          to?: string[]
          subject?: string
          body_text?: string
          body_html?: string | null
          received_at?: string
          processed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      app_settings: {
        Row: {
          id: string
          hero_text: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_text: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_text?: string
          updated_at?: string
        }
      }
    }
  }
}