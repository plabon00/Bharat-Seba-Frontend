'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth-api';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { auth, googleProvider } from '@/lib/firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { 
    Mail, Lock, Eye, EyeOff, AlertCircle, 
    CheckCircle2, ArrowRight, Loader2, Sparkles, LogIn
} from 'lucide-react';

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const emailParam = searchParams.get('email') || '';
    const isExistingUser = searchParams.get('existing') === 'true';
    const isNewlyRegistered = searchParams.get('registered') === 'true';

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: emailParam,
            password: ''
        }
    });

    useEffect(() => {
        if (emailParam) {
            setValue('email', emailParam);
        }
    }, [emailParam, setValue]);

    const handleAuthResponse = async (idToken: string, displayName?: string | null, photoUrl?: string | null) => {
        const response = await authApi.firebaseLogin(idToken, displayName, photoUrl);
        localStorage.setItem('token', response.token);
        
        const userResponse = await authApi.getMe().catch(() => ({
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            role: response.role,
            accountStatus: 'ACTIVE',
            createdAt: new Date().toISOString()
        } as any));

        login(response.token, userResponse);
        
        if (response.role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/dashboard');
    };

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        const normalizedEmail = data.email.trim().toLowerCase();

        try {
            // 1. First attempt direct backend authentication (supports seeded accounts & direct database users)
            try {
                const backendRes = await authApi.login({ email: normalizedEmail, password: data.password });
                if (backendRes && backendRes.token) {
                    localStorage.setItem('token', backendRes.token);
                    const userResponse = await authApi.getMe().catch(() => ({
                        id: backendRes.id,
                        email: backendRes.email,
                        fullName: backendRes.fullName,
                        role: backendRes.role,
                        accountStatus: 'ACTIVE',
                        createdAt: new Date().toISOString()
                    } as any));

                    login(backendRes.token, userResponse);

                    if (backendRes.role === 'ADMIN') router.push('/admin/dashboard');
                    else router.push('/dashboard');
                    return;
                }
            } catch (backendErr: any) {
                // If backend rejected password or not found, try Firebase fallback below
            }

            // 2. Fallback to Firebase email/password login
            const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, data.password);
            const idToken = await userCredential.user.getIdToken(true);
            await handleAuthResponse(idToken, userCredential.user.displayName, userCredential.user.photoURL);
        } catch (err: any) {
            let message = 'Invalid email or password. Please check your credentials.';
            if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email. Would you like to create one?';
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                message = 'Incorrect password. Please verify and try again.';
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken(true);
            await handleAuthResponse(idToken, result.user.displayName, result.user.photoURL);
        } catch (err: any) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(err.message || 'Google sign-in failed.');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-[#F8FAFC]">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                
                {/* Header */}
                <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0056D2] text-xs font-semibold">
                        <LogIn className="w-3.5 h-3.5" /> Welcome Back
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Sign In to Bharat Seva
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Continue your free learning journey and access saved courses.
                    </p>
                </div>

                {/* Friendly Notice for Existing User redirected from Register */}
                {isExistingUser && (
                    <div className="mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#0056D2] shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block">Account already registered</span>
                            <span>We found your existing account. Please enter your password to sign in.</span>
                        </div>
                    </div>
                )}

                {/* Success Banner if redirected from successful registration */}
                {isNewlyRegistered && (
                    <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block">Account Created Successfully!</span>
                            <span>Please enter your password to log in and start learning.</span>
                        </div>
                    </div>
                )}

                {/* General Error Banner */}
                {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input 
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register('email')}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field with Show/Hide toggle */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-xs font-bold text-slate-700">
                                Password
                            </label>
                            <Link 
                                href="/forgot-password" 
                                className="text-xs text-[#0056D2] hover:underline font-semibold"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input 
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                {...register('password')}
                                className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-11 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                            </>
                        ) : (
                            <>
                                Sign In with Email <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google Sign-in */}
                <button 
                    type="button" 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full h-11 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 shadow-2xs"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Footer link to Register */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                        Don&apos;t have an account yet?{' '}
                        <Link 
                            href="/register" 
                            className="font-bold text-[#0056D2] hover:underline"
                        >
                            Create a free account
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-sm text-slate-500">Loading sign-in...</div>}>
            <LoginForm />
        </Suspense>
    );
}
