import React, { useContext } from "react";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";

const AuthStatus = () => {
   const { isAuthenticated, token, logout } = useContext(AuthContext);

   return (
      <div className='p-4 border rounded bg-gray-50 mb-4'>
         <div className='mb-2'>
            <strong>Authentication Status:</strong>{" "}
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
         </div>
         {isAuthenticated && (
            <div className='mb-2'>
               <strong>Token:</strong>{" "}
               {token ? token.substring(0, 20) + "..." : "No token"}
            </div>
         )}
         <Button
            onClick={() => {
               // For debugging only - display token info
               const tokenData = localStorage.getItem("tokenData");
               if (tokenData) {
                  try {
                     const parsed = JSON.parse(tokenData);
                     const expires = new Date(parsed.timestamp + 86400000);
                     alert(
                        `Token info:\nCreated: ${new Date(
                           parsed.timestamp
                        ).toLocaleString()}\nExpires: ${expires.toLocaleString()}`
                     );
                  } catch (e) {
                     alert("Error parsing token data");
                  }
               } else {
                  alert("No token data found");
               }
            }}
            variant='outline'
         >
            Check Token Info
         </Button>
      </div>
   );
};

export default AuthStatus;
