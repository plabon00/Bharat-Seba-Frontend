'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth-api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { auth, googleProvider } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useAuth } from '@/components/providers/auth-provider';
import { 
    User, Mail, Lock, Eye, EyeOff, AlertCircle, 
    CheckCircle2, ArrowRight, Loader2, Sparkles, LogIn
} from 'lucide-react';

const registerSchema = z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');

    const [error, setError] = useState<string | null>(null);
    const [existingAccountEmail, setExistingAccountEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    const handleAuthResponse = async (idToken: string, displayName: string | null, photoUrl: string | null) => {
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

    // On-blur check to alert users immediately if the email is already registered in Postgres
    const handleEmailBlur = async () => {
        const email = getValues('email')?.trim().toLowerCase();
        if (!email || !email.includes('@') || !email.includes('.')) return;

        setIsCheckingEmail(true);
        try {
            const check = await authApi.checkEmail(email);
            if (check.exists) {
                setExistingAccountEmail(email);
                setError(null);
            } else {
                setExistingAccountEmail(null);
            }
        } catch {
            // Ignore background check failure
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        setExistingAccountEmail(null);
        const normalizedEmail = data.email.trim().toLowerCase();
        const normalizedName = data.fullName.trim();

        try {
            // 1. First check PostgreSQL database to see if email already exists
            const emailCheck = await authApi.checkEmail(normalizedEmail);
            if (emailCheck.exists) {
                setExistingAccountEmail(normalizedEmail);
                setIsLoading(false);
                return;
            }

            // 2. Register user in Backend PostgreSQL database
            try {
                await authApi.register({
                    fullName: normalizedName,
                    email: normalizedEmail,
                    password: data.password
                });
            } catch (regErr: any) {
                // If backend throws duplicate email or conflict
                if (regErr?.message?.toLowerCase().includes('already in use') || 
                    regErr?.message?.toLowerCase().includes('already exists')) {
                    setExistingAccountEmail(normalizedEmail);
                    setIsLoading(false);
                    return;
                }
                throw regErr;
            }

            // 3. Register with Firebase for client authentication sync
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, data.password);
                await updateProfile(userCredential.user, { displayName: normalizedName });
                const idToken = await userCredential.user.getIdToken(true);
                await handleAuthResponse(idToken, normalizedName, userCredential.user.photoURL);
                return;
            } catch (fbErr: any) {
                // If Firebase user already existed or Firebase fails, attempt direct backend login
                try {
                    const loginRes = await authApi.login({ email: normalizedEmail, password: data.password });
                    if (loginRes && loginRes.token) {
                        localStorage.setItem('token', loginRes.token);
                        const userRes = await authApi.getMe().catch(() => ({
                            id: loginRes.id,
                            email: loginRes.email,
                            fullName: loginRes.fullName,
                            role: loginRes.role,
                            accountStatus: 'ACTIVE',
                            createdAt: new Date().toISOString()
                        } as any));

                        login(loginRes.token, userRes);
                        if (loginRes.role === 'ADMIN') router.push('/admin/dashboard');
                        else router.push('/dashboard');
                        return;
                    }
                } catch {
                    // Fallthrough to standard redirect
                }
            }

            // Successfully registered! Redirect to login with confirmation
            router.push(`/login?registered=true&email=${encodeURIComponent(normalizedEmail)}`);
        } catch (err: any) {
            let message = 'Failed to register. Please check your information and try again.';
            if (err.code === 'auth/email-already-in-use' || 
                err.message?.toLowerCase().includes('already in use') ||
                err.message?.toLowerCase().includes('already exists')) {
                setExistingAccountEmail(normalizedEmail);
                setIsLoading(false);
                return;
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
        setExistingAccountEmail(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken(true);
            await handleAuthResponse(idToken, result.user.displayName, result.user.photoURL);
        } catch (err: any) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(err.message || 'Google sign-up failed.');
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
                        <Sparkles className="w-3.5 h-3.5" /> 100% Free Education Portal
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Create Your Free Account
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Join over 50,000 citizens learning with certified instructors.
                    </p>
                </div>

                {/* Account Already Exists Alert Banner */}
                {existingAccountEmail && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-3 animate-in fade-in">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-amber-950">
                                    Account Already Exists
                                </h4>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    An account registered with <strong>{existingAccountEmail}</strong> was found in our database. Please log in to continue learning.
                                </p>
                            </div>
                        </div>
                        <Link 
                            href={`/login?email=${encodeURIComponent(existingAccountEmail)}&existing=true`}
                            className="block"
                        >
                            <button 
                                type="button"
                                className="w-full h-10 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                            >
                                <LogIn className="w-4 h-4" /> Log In to Your Account <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </Link>
                    </div>
                )}

                {/* General Error Alert */}
                {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="fullName" className="text-xs font-bold text-slate-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input 
                                id="fullName"
                                type="text"
                                placeholder="e.g. Rahul Sharma"
                                {...register('fullName')}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-xs text-red-600 font-medium">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email Address with onBlur duplicate check */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="email" className="text-xs font-bold text-slate-700">
                                Email Address
                            </label>
                            {isCheckingEmail && (
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> checking...
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input 
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register('email', { onBlur: handleEmailBlur })}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password with Show/Hide toggle */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-xs font-bold text-slate-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input 
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
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
                        <p className="text-[11px] text-slate-500">Must be at least 8 characters long.</p>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-11 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Creating your account...
                            </>
                        ) : (
                            <>
                                Create Free Student Account <ArrowRight className="w-4 h-4" />
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
                            Or sign up with
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

                {/* Footer link to Login */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link 
                            href={existingAccountEmail ? `/login?email=${encodeURIComponent(existingAccountEmail)}&existing=true` : '/login'} 
                            className="font-bold text-[#0056D2] hover:underline"
                        >
                            Log in here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-sm text-slate-500">Loading registration...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
