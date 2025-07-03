// Authentication service for Supabase
import { supabase, handleSupabaseError } from "../lib/supabaseClient";

export const authService = {
   /**
    * Sign in with email and password
    */
   async signIn(email, password) {
      try {
         const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
         });

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Sign up new user
    */
   async signUp(email, password, userData = {}) {
      try {
         const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
               data: userData,
            },
         });

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Sign out current user
    */
   async signOut() {
      try {
         const { error } = await supabase.auth.signOut();
         if (error) throw error;

         return { error: null };
      } catch (error) {
         return { error: handleSupabaseError(error) };
      }
   },

   /**
    * Get current user
    */
   async getCurrentUser() {
      try {
         const {
            data: { user },
            error,
         } = await supabase.auth.getUser();
         if (error) throw error;

         return { user, error: null };
      } catch (error) {
         return { user: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get user profile
    */
   async getProfile(userId) {
      try {
         const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update user profile
    */
   async updateProfile(userId, updates) {
      try {
         const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Reset password
    */
   async resetPassword(email) {
      try {
         const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
               redirectTo: `${window.location.origin}/reset-password`,
            }
         );

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update password
    */
   async updatePassword(newPassword) {
      try {
         const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
         });

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Listen to auth state changes
    */
   onAuthStateChange(callback) {
      return supabase.auth.onAuthStateChange(callback);
   },
};
