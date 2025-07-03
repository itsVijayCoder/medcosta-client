import "./App.css";
import { createContext, useState, useEffect } from "react";
import Routing from "./routing/Routing";
import { prefetchCommonRoutes } from "./utils/route-prefetch.js";
import { supabase } from "./lib/supabaseClient";

// Create AuthContext
export const AuthContext = createContext();

function App() {
   const [user, setUser] = useState(null);
   const [userProfile, setUserProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Fetch user profile data
   const fetchUserProfile = async (userId) => {
      if (!userId) return;

      try {
         const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

         if (error) {
            console.error("Error fetching user profile:", error);
            return;
         }

         setUserProfile(profile);
         console.log("User profile loaded:", profile);
      } catch (error) {
         console.error("Error fetching profile:", error);
      }
   };

   useEffect(() => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setIsAuthenticated(!!session?.user);

         if (session?.user) {
            fetchUserProfile(session.user.id);
         }

         setLoading(false);
      });

      // Listen for auth changes
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
         setUser(session?.user ?? null);
         setIsAuthenticated(!!session?.user);

         if (session?.user) {
            fetchUserProfile(session.user.id);
         } else {
            setUserProfile(null);
         }

         setLoading(false);
      });

      return () => subscription?.unsubscribe();
   }, []);

   // Legacy authentication functions for backward compatibility
   const login = (userToken) => {
      // This is kept for backward compatibility but shouldn't be used
      // Use supabase.auth.signIn instead
      console.warn("Legacy login function called. Use Supabase auth instead.");
   };

   const logout = async () => {
      await supabase.auth.signOut();
   };

   // Prefetch common routes when the user is authenticated
   useEffect(() => {
      if (isAuthenticated) {
         prefetchCommonRoutes();
      }
   }, [isAuthenticated]);

   if (loading) {
      return (
         <div className='flex items-center justify-center min-h-screen'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
         </div>
      );
   }

   return (
      <AuthContext.Provider
         value={{
            user,
            userProfile,
            isAuthenticated,
            loading,
            login,
            logout,
         }}
      >
         <main className='bg-primary/20 min-h-screen text-foreground'>
            <Routing />
         </main>
      </AuthContext.Provider>
   );
}

export default App;
