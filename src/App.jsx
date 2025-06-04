import "./App.css";
import { createContext, useState, useEffect } from "react";
import Routing from "./routing/Routing";

// Create AuthContext
export const AuthContext = createContext();

function App() {
   const [token, setToken] = useState(localStorage.getItem("token") || null);
   const [isAuthenticated, setIsAuthenticated] = useState(
      !!localStorage.getItem("token")
   );

   // Authentication functions
   const login = (userToken) => {
      // Store token with timestamp
      const tokenData = {
         token: userToken,
         timestamp: Date.now(),
      };
      localStorage.setItem("tokenData", JSON.stringify(tokenData));
      setToken(userToken);
      setIsAuthenticated(true);
   };

   const logout = () => {
      localStorage.removeItem("tokenData");
      setToken(null);
      setIsAuthenticated(false);
   };

   // Check if token is valid (not expired)
   const isTokenValid = (tokenData) => {
      if (!tokenData) return false;

      // Token expires after 24 hours (86400000 ms)
      const expirationTime = 86400000;
      const now = Date.now();
      return now - tokenData.timestamp < expirationTime;
   };

   // Check token on startup and periodically for expiration
   useEffect(() => {
      // Define logout function for use inside this effect
      const handleLogout = () => {
         localStorage.removeItem("tokenData");
         setToken(null);
         setIsAuthenticated(false);
      };

      const checkToken = () => {
         const storedTokenData = localStorage.getItem("tokenData");
         if (storedTokenData) {
            try {
               const parsedTokenData = JSON.parse(storedTokenData);

               if (isTokenValid(parsedTokenData)) {
                  setToken(parsedTokenData.token);
                  setIsAuthenticated(true);
               } else {
                  // Token expired, clear it
                  handleLogout();
               }
            } catch (error) {
               // Invalid token format, clear it
               console.error("Invalid token format:", error);
               handleLogout();
            }
         }
      };

      // Check on component mount
      checkToken();

      // And then check periodically (every 5 minutes)
      const interval = setInterval(checkToken, 5 * 60 * 1000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
   }, []);

   return (
      <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
         <Routing />
      </AuthContext.Provider>
   );
}

export default App;
