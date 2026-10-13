'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { auth } from '@/lib/firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowLeft, CheckCircle2, KeyRound, Mail, RefreshCw } from 'lucide-react';

const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        setError(null);
        const normalizedEmail = data.email.trim().toLowerCase();
        try {
            // 1. Trigger Firebase Password Reset Email if applicable
            try {
                await sendPasswordResetEmail(auth, normalizedEmail);
            } catch (fbErr: any) {
                // If account is not in Firebase (e.g. backend-only user), we still notify backend
                console.warn('Firebase reset note:', fbErr.message);
            }

            // 2. Notify Backend of forgot password request
            try {
                await authApi.forgotPassword(normalizedEmail);
            } catch (beErr: any) {
                console.warn('Backend reset note:', beErr.message);
            }

            setSubmittedEmail(normalizedEmail);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-muted/40 py-12 px-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                {!isSubmitted ? (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                No worries, we will send you instructions to reset your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {error && (
                                    <div className="p-3 text-sm text-white bg-destructive rounded-md">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Your Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10"
                                            {...register('email')}
                                        />
                                        <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Sending Reset Link...
                                        </span>
                                    ) : (
                                        'Send Password Reset Link'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t py-4">
                            <Link
                                href="/login"
                                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Sign In
                            </Link>
                        </CardFooter>
                    </>
                ) : (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mb-2">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">Check Your Email</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Password reset instructions have been dispatched.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <div className="p-4 bg-muted/60 rounded-lg text-sm border space-y-1">
                                <p className="text-muted-foreground">We sent a reset link to:</p>
                                <p className="font-semibold text-foreground text-base">{submittedEmail}</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Please check your inbox and click the link to choose a new password. If you do not see it in a few minutes, remember to check your spam/junk folder.
                            </p>
                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full text-xs"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Didn't receive the email? Try another address
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center border-t py-4">
                            <Link
                                href="/login"
                                className="text-sm text-primary hover:underline flex items-center gap-1.5 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return to Sign In
                            </Link>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}
