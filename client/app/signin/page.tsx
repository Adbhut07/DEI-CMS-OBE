// "use client"

// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from "react"
// import Image from 'next/image'
// import login_img from '../../resources/login_img.jpg';
// import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
// import * as z from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { Loader2 } from 'lucide-react'
// import { setUser } from '@/lib/store/features/user/userSlice'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import Link from 'next/link'
// import { RootState } from '@/lib/store/store';

// const formSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(7, 'Password must be at least 7 characters'),
// })

// type FormValues = z.infer<typeof formSchema>

// export default function SignInPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()
//   const dispatch = useAppDispatch()

//   // const { isAuthenticated, role } = useAppSelector((state: RootState) => state.user);

//   // useEffect(() => {
//   //   // Check if the user is already logged in
//   //   if (isAuthenticated) {
//   //     // Redirect based on the user's role
//   //     switch (role) {
//   //       case "Student":
//   //         router.push("/student");
//   //         break;
//   //       case "Faculty":
//   //         router.push("/faculty");
//   //         break;
//   //       case "ADMIN":
//   //         router.push("/admin/course");
//   //         break;
//   //       default:
//   //         router.push("/Forbidden"); // Default dashboard
//   //     }
//   //   }
//   // }, [isAuthenticated, role, router]);


//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   })

//   async function onSubmit(values: FormValues) {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signin`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(values),
//       })

//       const responseData = await response.json()

//       if (!response.ok) {
//         throw new Error(responseData.message || 'Failed to sign in')
//       }

//       if (responseData.success) {
//         //console.log(responseData.data);
//         const { user, token } = responseData.data

//         // Store token
//         localStorage.setItem('token', token)

//         // Update Redux state
//         //console.log(user);
//         dispatch(
//           setUser({
//             id: user.id || null,
//             name: user.name || null,
//             email: user.email || null,
//             role: user.role || null,
//             isAuthenticated: true,
//             image: null
//           })
//         )

//         if(user.role === 'ADMIN'){
//           router.push('/admin/course')
//         }else if(user.role === 'Faculty'){
//           router.push('/faculty')
//         }else if(user.role === 'Student'){
//           router.push('/student')
//         }
//         else{
//           router.push('/admin/course')
//         }
//       } else {
//         throw new Error(responseData.message || 'Failed to sign in')
//       }
//     } catch (error: any) {
//       console.error('Login failed:', error.message)
//       setError(error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
//         <div className="mx-auto w-full max-w-sm lg:w-96">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Please enter your details
//               </p>
//             </div>

//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder="name@example.com"
//                           {...field}
//                           disabled={isLoading}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           {...field}
//                           disabled={isLoading}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="flex items-center justify-end">
//                   <Link
//                     href="/forgot-password"
//                     className="text-sm text-purple-600 hover:text-purple-500"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Signing in...
//                     </>
//                   ) : (
//                     'Sign in'
//                   )}
//                 </Button>
//               </form>
//             </Form>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-gray-50 text-muted-foreground">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <Button
//               variant="outline"
//               type="button"
//               className="w-full"
//               disabled={isLoading}
//             >
//               <svg
//                 className="mr-2 h-4 w-4"
//                 aria-hidden="true"
//                 focusable="false"
//                 data-prefix="fab"
//                 data-icon="google"
//                 role="img"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 488 512"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
//                 ></path>
//               </svg>
//               Sign in with Google
//             </Button>

//             <p className="text-center text-sm text-muted-foreground">
//               Don't have an account?{' '}
//               <Link
//                 href="/signup"
//                 className="font-medium text-purple-600 hover:text-purple-500"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="hidden lg:block relative w-0 flex-1 bg-purple-100">
//         <div className="absolute inset-0 flex items-center justify-center p-8">
//           <Image
//             src={login_img}
//             alt="Login illustration"
//             width={800}
//             height={800}
//             className="object-contain"
//             priority
//           />
//         </div>
//       </div>
//     </div>
//   )
// }









// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState } from "react";
// import { useAppDispatch } from "@/lib/store/hooks";
// import { setUser } from "@/lib/store/features/user/userSlice";

// // TypeScript interfaces for our form
// interface FormValues {
//   email: string;
//   password: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     user: {
//       id: string | null;
//       name: string | null;
//       email: string | null;
//       role: string | null;
//     };
//     token: string;
//   };
// }

// export default function SignIn() {
//   // State hooks
//   const [formValues, setFormValues] = useState<FormValues>({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Navigation and state management hooks
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors(null);

//     try {
//       // Validate form inputs
//       if (!formValues.email) {
//         throw new Error("Email is required");
//       }
//       if (!formValues.password) {
//         throw new Error("Password is required");
//       }

//       // API call to login
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signin`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(formValues),
//         }
//       );

//       const data: ApiResponse = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       if (data.success && data.data) {
//         const { user, token } = data.data;

//         // Save token to localStorage
//         window.localStorage.setItem("token", token);

//         // Update user state in Redux
//         dispatch(
//           setUser({
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             isAuthenticated: true,
//             image: null,
//           })
//         );

//         // Redirect based on user role
//         if (user.role === "ADMIN") {
//           router.push("/admin/course");
//         } else if (user.role === "Faculty") {
//           router.push("/faculty");
//         } else if (user.role === "Student") {
//           router.push("/student");
//         } else {
//           router.push("/admin/course");
//         }
//       } else {
//         throw new Error("Something went wrong");
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);
//       setErrors(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left side: Form */}
//       <div className="flex-1 flex items-center justify-center p-6 bg-white">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//               Sign in to your account
//             </h1>
//             <p className="mt-2 text-sm text-gray-600">
//               Enter your credentials to access your dashboard
//             </p>
//           </div>

//           {errors && (
//             <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
//               {errors}
//             </div>
//           )}

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formValues.email}
//                   onChange={handleInputChange}
//                   disabled={isSubmitting}
//                   className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formValues.password}
//                   onChange={handleInputChange}
//                   disabled={isSubmitting}
//                   className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 text-sm"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-end">
//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-purple-600 hover:text-purple-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="group relative flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Signing in..." : "Sign in"}
//               </button>
//             </div>

//             {/* <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-white px-2 text-gray-500">
//                   Or continue with
//                 </span>
//               </div>
//             </div> */}

//             {/* <button
//               type="button"
//               className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//             >
//               <svg
//                 className="mr-2 h-4 w-4"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 488 512"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
//                 />
//               </svg>
//               Sign in with Google
//             </button>

//             <p className="mt-3 text-center text-sm text-gray-600">
//               Don't have an account?{" "}
//               <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
//                 Sign up
//               </Link>
//             </p> */}
//           </form>
//         </div>
//       </div>

//       {/* Right side: Decorative background */}
//       <div className="hidden md:block md:flex-1 bg-gradient-to-br from-purple-600 to-indigo-700">
//         <div className="h-full flex flex-col items-center justify-center text-white p-12 text-center">
//           <div className="space-y-6 max-w-lg">
//             <h2 className="text-4xl font-bold tracking-tight">
//               Welcome to our Learning Platform
//             </h2>
//             <p className="text-xl">
//               Access your courses, assignments, and connect with instructors all in one place.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState } from "react";
// import { useAppDispatch } from "@/lib/store/hooks";
// import { setUser } from "@/lib/store/features/user/userSlice";

// // TypeScript interfaces for our form
// interface FormValues {
//   email: string;
//   password: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     user: {
//       id: string | null;
//       name: string | null;
//       email: string | null;
//       role: string | null;
//     };
//     token: string;
//   };
// }

// export default function SignIn() {
//   // State hooks
//   const [formValues, setFormValues] = useState<FormValues>({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Navigation and state management hooks
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors(null);

//     try {
//       // Validate form inputs
//       if (!formValues.email) {
//         throw new Error("Email is required");
//       }
//       if (!formValues.password) {
//         throw new Error("Password is required");
//       }

//       // API call to login
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signin`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(formValues),
//         }
//       );

//       const data: ApiResponse = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       if (data.success && data.data) {
//         const { user, token } = data.data;

//         // Save token to localStorage
//         window.localStorage.setItem("token", token);

//         // Update user state in Redux
//         dispatch(
//           setUser({
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             isAuthenticated: true,
//             image: null,
//           })
//         );

//         // Redirect based on user role
//         if (user.role === "ADMIN") {
//           router.push("/admin/course");
//         } else if (user.role === "Faculty") {
//           router.push("/faculty");
//         } else if (user.role === "Student") {
//           router.push("/student");
//         } else {
//           router.push("/admin/course");
//         }
//       } else {
//         throw new Error("Something went wrong");
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);
//       setErrors(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left side: Form */}
//       <div className="flex-1 flex items-center justify-center p-6 bg-white">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//               Sign in to your account
//             </h1>
//             <p className="mt-2 text-sm text-gray-600">
//               Enter your credentials to access your dashboard
//             </p>
//           </div>

//           {errors && (
//             <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
//               {errors}
//             </div>
//           )}

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formValues.email}
//                   onChange={handleInputChange}
//                   disabled={isSubmitting}
//                   className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-blue-600 text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formValues.password}
//                   onChange={handleInputChange}
//                   disabled={isSubmitting}
//                   className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-blue-600 text-sm"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-end">
//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Signing in..." : "Sign in"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Right side: Dark blue background matching homepage */}
//       <div className="hidden md:block md:flex-1 bg-[#101835]">
//         <div className="h-full flex flex-col items-center justify-center text-white p-12 text-center">
//           <div className="space-y-6 max-w-lg">
//             <h2 className="text-4xl font-bold tracking-tight">
//               Welcome to OutcomeMagic
//             </h2>
//             <p className="text-xl">
//               Access your courses, assignments, and track student outcomes with precision and ease.
//             </p>
//             <div className="flex flex-col space-y-2">
//               <div className="flex items-center space-x-2">
//                 <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Easy Integration</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Comprehensive Analytics</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Secure Data</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/features/user/userSlice";
import { RootState } from "@/lib/store/store";

// TypeScript interfaces for our form
interface FormValues {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string | null;
      name: string | null;
      email: string | null;
      role: string | null;
    };
    token: string;
  };
}

export default function SignIn() {
  // State hooks
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Navigation and state management hooks
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get authentication state from Redux
  const { isAuthenticated, role } = useAppSelector((state: RootState) => state.user);
  
  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on user role
      switch (role) {
        case "Student":
          router.push("/student");
          break;
        case "Faculty":
          router.push("/faculty");
          break;
        case "ADMIN":
          router.push("/admin/course");
          break;
        default:
          router.push("/admin/course"); // Default fallback
      }
    }
  }, [isAuthenticated, role, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      // Validate form inputs
      if (!formValues.email) {
        throw new Error("Email is required");
      }
      if (!formValues.password) {
        throw new Error("Password is required");
      }

      // API call to login
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formValues),
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success && data.data) {
        const { user, token } = data.data;

        // Save token to localStorage
        window.localStorage.setItem("token", token);

        // Update user state in Redux
        dispatch(
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAuthenticated: true,
            image: null,
          })
        );

        // Redirect based on user role
        if (user.role === "ADMIN") {
          router.push("/admin/course");
        } else if (user.role === "Faculty") {
          router.push("/faculty");
        } else if (user.role === "Student") {
          router.push("/student");
        } else {
          router.push("/admin/course");
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {errors && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
              {errors}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formValues.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-blue-600 text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formValues.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-blue-600 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: Dark blue background matching homepage */}
      <div className="hidden md:block md:flex-1 bg-[#101835]">
        <div className="h-full flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome to OutcomeMagic
            </h2>
            <p className="text-xl">
              Access your courses, assignments, and track student outcomes with precision and ease.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Easy Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Comprehensive Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}