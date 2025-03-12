import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://luvlgwgjdpcnfaicxtoe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dmxnd2dqZHBjbmZhaWN4dG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjAzNzEsImV4cCI6MjA1NzMzNjM3MX0.NlkE_d56okndlJ3E7uuEerQm041HZgqkM3Xu7FghFdQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true, // ✅ Ensures session persists across reloads
      autoRefreshToken: true, // ✅ Automatically refreshes tokens
      detectSessionInUrl: true,
    },
  });

export default supabase;
