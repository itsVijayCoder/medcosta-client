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
import { authService } from "@/services/authService";
import logo from "@/assets/WorknoFault.png";

export default function Login() {
   const [formData, setFormData] = useState({
      email: "",
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
         const { data, error: authError } = await authService.signIn(
            formData.email,
            formData.password
         );

         if (authError) {
            setError(authError);
            return;
         }

         // Redirect to the original path the user was trying to access (or dashboard if direct login)
         navigate(from, { replace: true });
      } catch (err) {
         setError(err.message || "An error occurred during login");
         console.error("Login error:", err);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className='min-h-screen flex flex-col bg-primary-gradient'>
         {/* Glassmorphism container */}
         <div className='flex flex-grow items-center justify-center p-4'>
            <div className='w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-5 overflow-hidden rounded-3xl shadow-2xl backdrop-blur-md'>
               {/* Left side - Brand */}
               <div className='lg:col-span-2 relative overflow-hidden bg-primary-gradient p-8 flex flex-col justify-between'>
                  {/* Decorative elements */}
                  <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2'></div>
                  <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2'></div>

                  {/* Content */}
                  <div className='z-10'>
                     <div className='flex items-center space-x-3 mb-12'>
                        <img
                           src={logo}
                           alt='WorkNoFault'
                           className='h-14 w-auto '
                        />
                     </div>
                     <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4'>
                        Welcome back to the Healthcare Management System
                     </h2>
                     <p className='text-primary-100 text-lg max-w-sm'>
                        Securely access your dashboard and manage your
                        healthcare services efficiently.
                     </p>
                  </div>

                  {/* Bottom text */}
                  <div className='z-10 mt-auto'>
                     <p className='text-sm text-primary-100 opacity-80'>
                        © {new Date().getFullYear()} WorkNoFault. All rights
                        reserved.
                     </p>
                  </div>
               </div>

               {/* Right side - Login form */}
               <div className='lg:col-span-3 bg-background p-8 md:p-12'>
                  <div className='w-full max-w-md mx-auto'>
                     <div className='mb-8'>
                        <h3 className='text-2xl font-bold text-foreground'>
                           Sign in
                        </h3>
                        <p className='text-muted-foreground mt-2'>
                           Please enter your credentials to continue
                        </p>
                     </div>

                     <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='space-y-2'>
                           <Label htmlFor='email' className='text-foreground'>
                              Email
                           </Label>
                           <div className='relative'>
                              <Input
                                 id='email'
                                 name='email'
                                 placeholder='Enter your email'
                                 type='email'
                                 value={formData.email}
                                 onChange={handleInputChange}
                                 required
                                 className='pl-10 py-2'
                              />
                              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                 <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-muted-foreground'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                 >
                                    <path
                                       fillRule='evenodd'
                                       d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                              </div>
                           </div>
                        </div>

                        <div className='space-y-2'>
                           <div className='flex items-center justify-between'>
                              <Label
                                 htmlFor='password'
                                 className='text-foreground'
                              >
                                 Password
                              </Label>
                              <a
                                 href='#'
                                 className='text-sm font-medium text-primary hover:text-primary/90'
                              >
                                 Forgot password?
                              </a>
                           </div>
                           <div className='relative'>
                              <Input
                                 id='password'
                                 name='password'
                                 placeholder='••••••••'
                                 type='password'
                                 value={formData.password}
                                 onChange={handleInputChange}
                                 required
                                 className='pl-10 py-2'
                              />
                              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                 <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-muted-foreground'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                 >
                                    <path
                                       fillRule='evenodd'
                                       d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                              </div>
                           </div>
                        </div>

                        <div className='flex items-center'>
                           <input
                              type='checkbox'
                              id='remember'
                              className='h-4 w-4 rounded border-border text-primary focus:ring-primary '
                           />
                           <Label
                              htmlFor='remember'
                              className='ml-2 block text-sm text-foreground'
                           >
                              Keep me signed in
                           </Label>
                        </div>

                        {error && (
                           <div className='p-3 rounded-md bg-destructive/10'>
                              <p className='text-sm font-medium text-destructive'>
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
                           className='w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:ring-4 focus:ring-primary/50'
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
                              "Sign in to your account"
                           )}
                        </Button>

                        {/* <div className='text-center pt-3'>
                           <p className='text-sm text-muted-foreground'>
                              Need an account?{" "}
                              <a
                                 href='#'
                                 className='font-medium text-primary hover:text-primary/90'
                              >
                                 Contact administrator
                              </a>
                           </p>
                        </div> */}
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
