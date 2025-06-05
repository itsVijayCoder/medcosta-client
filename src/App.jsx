import "./App.css";
import { createContext, useState, useEffect } from "react";
import Routing from "./routing/Routing";

// Create AuthContext
export const AuthContext = createContext();

function App() {
   // Initialize token from tokenData if it exists and is valid
   const getInitialToken = () => {
      const tokenDataStr = localStorage.getItem("tokenData");
      if (tokenDataStr) {
         try {
            const tokenData = JSON.parse(tokenDataStr);
            // Check if token is valid (not expired)
            const expirationTime = 86400000; // 24 hours
            const now = Date.now();
            if (now - tokenData.timestamp < expirationTime) {
               return tokenData.token;
            }
         } catch (error) {
            console.error("Error parsing token data:", error);
         }
      }
      return null;
   };

   const [token, setToken] = useState(getInitialToken());
   const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialToken());

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
                  console.log("Session expired. Please login again.");
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
