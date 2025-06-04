import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import { AuthContext } from "@/App";
import logo from "@/assets/logo.png";

export default function Login() {
   const [formData, setFormData] = useState({
      username: "",
      password: "",
   });

   const navigate = useNavigate();
   const location = useLocation();
   const { login } = useContext(AuthContext);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   // Get the redirect path from location state or default to dashboard
   const from = location.state?.from?.pathname || "/";

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         // TODO: Replace with actual API authentication
         console.log("Logging in with:", formData);

         // Simulate API call delay
         await new Promise((resolve) => setTimeout(resolve, 1000));

         // For demo purposes
         if (formData.username && formData.password) {
            // Generate a mock token - in a real app, this would come from your backend
            // Using a proper format for the token that our system can parse
            const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IiR7Zm9ybURhdGEudXNlcm5hbWV9IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.${Date.now()}`;
            // Use the login function from AuthContext
            login(mockToken);

            // Redirect to the original path the user was trying to access (or dashboard if direct login)
            navigate(from, { replace: true });
         } else {
            throw new Error("Please enter both username and password");
         }
      } catch (err) {
         setError(err.message || "Invalid username or password");
         console.error("Login error:", err);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className='min-h-screen flex w-full bg-gradient-to-br from-background to-secondary/10'>
         {/* Left column with image */}
         <div className='hidden lg:flex w-1/2 bg-primary/5 items-center justify-center p-10'>
            <div className='relative w-full max-w-lg'>
               {/* Background decorative elements */}
               <div className='absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
               <div className='absolute top-0 -right-4 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
               <div className='absolute -bottom-8 left-20 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>

               {/* Logo or login image */}
               <div className='relative'>
                  <div className='relative flex items-center justify-center'>
                     <img
                        src={logo}
                        alt='MedCosta Login'
                        className='max-w-full max-h-[400px] object-contain drop-shadow-xl'
                     />
                  </div>
                  <div className='mt-8 text-center'>
                     <h2 className='text-3xl font-bold text-primary'>
                        MedCosta
                     </h2>
                     <p className='mt-2 text-muted-foreground'>
                        Healthcare Management System
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Right column with login form */}
         <div className='w-full lg:w-1/2 flex flex-col items-center justify-center p-8'>
            <div className='w-full max-w-md'>
               <div className='mb-8 lg:hidden text-center'>
                  <img
                     src={logo}
                     alt='MedCosta'
                     className='h-16 mx-auto mb-4'
                  />
                  <h2 className='text-2xl font-bold text-primary'>MedCosta</h2>
                  <p className='text-sm text-muted-foreground'>
                     Healthcare Management System
                  </p>
               </div>

               <Card className='w-full'>
                  <CardHeader className='space-y-1'>
                     <CardTitle className='text-2xl font-bold text-center'>
                        Sign in
                     </CardTitle>
                     <CardDescription className='text-center'>
                        Enter your credentials to access your account
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                           <Label htmlFor='username'>Username</Label>
                           <Input
                              id='username'
                              name='username'
                              placeholder='Enter your username'
                              type='text'
                              value={formData.username}
                              onChange={handleInputChange}
                              required
                           />
                        </div>
                        <div className='space-y-2'>
                           <Label htmlFor='password'>Password</Label>
                           <Input
                              id='password'
                              name='password'
                              placeholder='Enter your password'
                              type='password'
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                           />
                        </div>
                        <div className='flex items-center justify-between'>
                           <div className='flex items-center space-x-2'>
                              <input
                                 type='checkbox'
                                 id='remember'
                                 className='rounded border-gray-300 text-primary focus:ring-primary'
                              />
                              <Label
                                 htmlFor='remember'
                                 className='text-sm cursor-pointer'
                              >
                                 Remember me
                              </Label>
                           </div>
                           <a
                              href='#'
                              className='text-sm font-medium text-primary hover:text-primary/80'
                           >
                              Forgot password?
                           </a>
                        </div>
                        {error && (
                           <div className='text-sm font-medium text-destructive'>
                              {error}
                           </div>
                        )}
                        <Button
                           type='submit'
                           className='w-full'
                           disabled={isLoading}
                        >
                           {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                     </form>
                  </CardContent>
                  <CardFooter className='flex justify-center'>
                     <p className='text-sm text-muted-foreground'>
                        Don't have an account? Contact your administrator
                     </p>
                  </CardFooter>
               </Card>
            </div>
         </div>
      </div>
   );
}
