"use client"

import { useRouter } from 'next/navigation'
import { useState } from "react"
import Image from 'next/image'
import login_img from '../../resources/login_img.jpg';
import { useAppDispatch } from '@/lib/store/hooks'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { setUser } from '@/lib/store/features/user/userSlice'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(7, 'Password must be at least 7 characters'),
})

type FormValues = z.infer<typeof formSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to sign in')
      }

      if (responseData.success) {
        console.log(responseData.data);
        const { user, token } = responseData.data

        // Store token
        localStorage.setItem('token', token)

        // Update Redux state
        console.log(user);
        dispatch(
          setUser({
            id: user.id || null,
            name: user.name || null,
            email: user.email || null,
            role: user.role || null,
            isAuthenticated: true,
            image: null
          })
        )

        if(user.role === 'ADMIN'){
          router.push('/admin/course')
        }else if(user.role === 'Faculty'){
          router.push('/faculty')
        }
        else{
          router.push('/admin/course')
        }

        // Role-based navigation
        // switch (user.role) {
        //   case 'CANDIDATE':
        //     router.push('/course-management')
        //     break
        //   case 'ADMIN':
        //     router.push('/dashboard-admin')
        //     break
        //   default:
        //     router.push('/course-management')
        // }
      } else {
        throw new Error(responseData.message || 'Failed to sign in')
      }
    } catch (error: any) {
      console.error('Login failed:', error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please enter your details
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-500"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={isLoading}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 bg-purple-100">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <Image
            src={login_img}
            alt="Login illustration"
            width={800}
            height={800}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}









// "use client"
// import { useRouter } from 'next/navigation'
// import { ChangeEventHandler, useState } from "react";
// import Image from 'next/image';
// import login_img from '../../resources/login_img.jpg';
// import { useAppDispatch } from '@/lib/store/hooks';
// import * as z from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { Loader2 } from 'lucide-react';
// import { setUser } from '@/lib/store/features/user/userSlice'


// const formSchema = z.object({
//     email: z.string().email('Invalid email address'),
//     password: z.string().min(7, 'Password must be at least 7 characters'),
// })


// export default function page() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsLoading(true);
//     setErrorMessage(null);
  
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signin`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(values),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to sign in');
//       }
  
//       const responseData = await response.json();
//       console.log('Response Data:', responseData);
//       console.log('User Data:', responseData.data.user);

  
//       if (responseData.success) {
//         const { user, token } = responseData.data;
  
//         // Store token
//         localStorage.setItem('token', token);
  
//         // Update Redux state
//         dispatch(
//           setUser({
//             id: user.id || null,
//             name: user.name || null,
//             email: user.email || null,
//             role: user.role || null,
//             isAuthenticated: true,
//             image:null
//           })
//         );
        
//         // Verify state update
//         console.log('User state updated:', user);
  
//         // Navigate after ensuring state is updated
       
//           if (user.role === 'CANDIDATE') {
//             router.push('/dashboard-candidate');
//           } else if (user.role==='ADMIN') {
//             router.push('/dashboard-admin');
//           }
//           else{
//             router.push('/dashboard-interviewer');
//           }
        
//       } else {
//         throw new Error(responseData.message || 'Failed to sign in');
//       }
//     } catch (error: any) {
//       console.error('Login failed:', error.message);
//       setErrorMessage(error.message);
//     } finally {
//       setIsLoading(false);
//     }
// }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md md:w-full lg:max-w-xl">
//         <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
//         <p className="text-sm text-gray-600">Please enter your details</p>

//         <form className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               required
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               required
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             {/* <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 className="text-purple-500 rounded focus:ring-0"
//               />
//               <span className="ml-2 text-sm text-gray-600">
//                 Remember for 30 days
//               </span>
//             </label> */}
//             <a href="#" className="text-sm text-purple-600 hover:underline">
//               Forgot password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//           >
//             Sign in
//           </button>

//           <button
//             type="button"
//             className="w-full py-2 mt-4 border border-gray-300 rounded-md shadow-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//           >
//             <span className="mr-2">🔵</span> Sign in with Google
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <a href="#" className="text-purple-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>

//       <div className="hidden w-full bg-purple-100 md:block md:w-full lg:w-full">
//         <div className="flex items-center justify-center h-full">
//           <div className="p-8">
//             <Image src={login_img} alt="Illustration" className='w-full' />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
        

// function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
//     return <div>
//         <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
//         <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
//     </div>
// }

// interface LabelledInputType {
//     label: string;
//     placeholder: string;
//     type?: string;
//     onChange: ChangeEventHandler<HTMLInputElement>
// }
