import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
}

export interface AdminNote {
  id: string;
  lead_id: string;
  user_id: string;
  note: string;
  created_at: string;
}

export interface ServiceAnalytics {
  id: string;
  service_name: string;
  views: number;
  requests: number;
  date: string;
  created_at: string;
}
