// Supabase client configuration
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
   throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
   auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
   },
   db: {
      schema: "public",
   },
   global: {
      headers: { "x-my-custom-header": "medcosta-app" },
   },
});

// Auth helpers
export const getCurrentUser = async () => {
   const {
      data: { user },
   } = await supabase.auth.getUser();
   return user;
};

export const getCurrentSession = async () => {
   const {
      data: { session },
   } = await supabase.auth.getSession();
   return session;
};

// Database helpers
export const handleSupabaseError = (error) => {
   console.error("Supabase Error:", error);

   if (error.code === "PGRST116") {
      return "No data found matching your criteria";
   }

   if (error.message.includes("duplicate key")) {
      return "A record with this information already exists";
   }

   if (error.message.includes("violates row-level security policy")) {
      return "You do not have permission to perform this action";
   }

   return "An unexpected error occurred. Please try again.";
};

export default supabase;
