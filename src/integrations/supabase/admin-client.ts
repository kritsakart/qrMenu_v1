// This file contains a special Supabase client with admin rights
// Use this client only for operations that require bypassing RLS
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ldldqkzshbfrahwhxxfh.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkbGRxa3pzaGJmcmFod2h4eGZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY0MzEwNCwiZXhwIjoyMDYzMjE5MTA0fQ.KjoNiIM7voAFeAH4JlkwDDpdgsoIzzSiqzTchuLQSU0";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase URL or service role key!");
}

// Create admin client with full configuration to ensure proper setup
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test the connection on load - this will help identify connection issues
console.log("Admin client initialized with URL:", SUPABASE_URL);
supabaseAdmin.from('cafe_owners').select('count', { count: 'exact', head: true })
  .then(response => {
    if (response.error) {
      console.error("Admin client test query failed:", response.error);
    } else {
      console.log("Admin client test query succeeded. Available rows:", response.count);
    }
  });
