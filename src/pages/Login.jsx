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
import logo from "@/assets/medcosta-login.jpg";

export default function Login() {
   const [formData, setFormData] = useState({
      username: "",
      password: "",
   });

   const navigate = useNavigate();
   const location = useLocation();
   const { login } = useContext(AuthContext);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(location.state?.message || "");

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
         {/* Left column with image - full background */}
         <div className='hidden lg:flex w-1/2 relative overflow-hidden'>
            {/* Background image covering the entire left side */}
            <div className='absolute inset-0 z-0'>
               <img
                  src={logo}
                  alt='MedCosta Login'
                  className='w-full h-full object-cover'
               />
               {/* Overlay to ensure text remains visible */}
               {/* <div className='absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30'></div> */}
            </div>

            {/* Content positioned on top of the background */}
            <div className='relative z-10 w-full h-full flex items-start justify-center p-10'>
               <div className='relative w-full max-w-lg'>
                  {/* Background decorative elements */}
                  <div className='absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
                  <div className='absolute top-0 -right-4 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
                  <div className='absolute -bottom-8 left-20 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>

                  {/* Text content */}
                  <div className='relative mb-32 backdrop-blur-md bg-black/0 p-8 rounded-lg shadow-lg'>
                     <h2 className='text-4xl font-bold text-primary mb-2'>
                        WorkNoFault
                     </h2>
                     <p className='text-xl text-white/80'>
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
                     className='h-16 mx-auto mb-4 rounded-lg shadow-md'
                  />
                  <h2 className='text-2xl font-bold text-primary'>MedCosta</h2>
                  <p className='text-sm text-muted-foreground'>
                     Healthcare Management System
                  </p>
               </div>

               <Card className='w-full backdrop-blur-sm bg-white/95 shadow-xl border-0 rounded-xl overflow-hidden'>
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
                           <div className='p-3 rounded-md bg-red-50 dark:bg-red-900/30 mt-2'>
                              <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                                 <span className='inline-flex mr-1'>
                                    <svg
                                       xmlns='http://www.w3.org/2000/svg'
                                       className='h-5 w-5'
                                       viewBox='0 0 20 20'
                                       fill='currentColor'
                                    >
                                       <path
                                          fillRule='evenodd'
                                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z'
                                          clipRule='evenodd'
                                       />
                                    </svg>
                                 </span>
                                 {error}
                              </p>
                           </div>
                        )}
                        <Button
                           type='submit'
                           className='w-full py-2.5 bg-primary text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/50'
                           disabled={isLoading}
                        >
                           {isLoading ? (
                              <span className='flex items-center justify-center'>
                                 <svg
                                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                 >
                                    <circle
                                       className='opacity-25'
                                       cx='12'
                                       cy='12'
                                       r='10'
                                       stroke='currentColor'
                                       strokeWidth='4'
                                    ></circle>
                                    <path
                                       className='opacity-75'
                                       fill='currentColor'
                                       d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    ></path>
                                 </svg>
                                 Signing in...
                              </span>
                           ) : (
                              "Sign in"
                           )}
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
