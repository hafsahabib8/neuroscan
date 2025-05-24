import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
   headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  auth: {
    // Configure redirects to handle password reset flow
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
     cookieOptions: {
      name: 'sb-session',
      domain: '.https://final-year-projectclone.vercel.app/', // <-- your Vercel domain!
      sameSite: 'Lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
});

export default supabase;
