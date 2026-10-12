'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Lock, RefreshCw } from 'lucide-react';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') || searchParams.get('oobCode') || searchParams.get('email') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.resetPassword(token, data.password);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2500);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-primary/10">
            {!isSuccess ? (
                <>
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                            <Lock className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Please choose a strong new password for your account.
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
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min 8 characters"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repeat new password"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Updating Password...
                                    </span>
                                ) : (
                                    'Reset Password'
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
                        <CardTitle className="text-2xl font-bold text-foreground">Password Updated!</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Your password has been changed successfully. Redirecting you to sign in...
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center border-t py-4">
                        <Link
                            href="/login"
                            className="text-sm text-primary hover:underline flex items-center gap-1.5 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" /> Sign in now
                        </Link>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-muted/40 py-12 px-4">
            <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
