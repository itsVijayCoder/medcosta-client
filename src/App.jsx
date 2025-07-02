import "./App.css";
import { createContext, useState, useEffect } from "react";
import Routing from "./routing/Routing";
import { prefetchCommonRoutes } from "./utils/route-prefetch.js";
import { supabase } from "./lib/supabaseClient";

// Create AuthContext
export const AuthContext = createContext();

function App() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setIsAuthenticated(!!session?.user);
         setLoading(false);
      });

      // Listen for auth changes
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
         setUser(session?.user ?? null);
         setIsAuthenticated(!!session?.user);
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
            isAuthenticated,
            loading,
            login,
            logout,
         }}
      >
         <Routing />
      </AuthContext.Provider>
   );
}

export default App;
