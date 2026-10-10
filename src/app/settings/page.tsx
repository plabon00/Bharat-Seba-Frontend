'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { authApi } from '@/lib/api/auth-api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Monitor, Globe, Trash2, Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    
    const [theme, setTheme] = useState('system');
    const [language, setLanguage] = useState('en');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!user) {
        return <div className="container mx-auto p-8">Loading...</div>;
    }

    const handleSavePreferences = () => {
        setIsSaving(true);
        // Simulate saving to backend
        setTimeout(() => {
            setIsSaving(false);
            alert('Preferences saved successfully!');
        }, 1000);
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            await authApi.deleteAccount();
            alert('Account deleted successfully.');
            logout();
            router.push('/');
        } catch (err: any) {
            alert(err.message || 'Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-heading">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Preferences Section */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="w-5 h-5" /> Appearance & Theme
                            </CardTitle>
                            <CardDescription>Customize how Bharat Seva looks on your device.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme Preference</Label>
                                <select 
                                    id="theme"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <option value="light">Light Mode</option>
                                    <option value="dark">Dark Mode (Coming Soon)</option>
                                    <option value="system">System Default</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" /> Language & Region
                            </CardTitle>
                            <CardDescription>Select your preferred language for the portal.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">Display Language</Label>
                                <select 
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <option value="en">English (US)</option>
                                    <option value="bn">Bengali (বাংলা)</option>
                                    <option value="hi">Hindi (हिंदी)</option>
                                </select>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t justify-end">
                            <Button onClick={handleSavePreferences} disabled={isSaving} className="gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Preferences
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Danger Zone */}
                <div className="space-y-6">
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" /> Danger Zone
                            </CardTitle>
                            <CardDescription>Irreversible account actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-700 mb-4">
                                Once you delete your account, there is no going back. All your course progress, enrollments, and personal data will be permanently wiped.
                            </p>
                            <Button 
                                variant="destructive" 
                                className="w-full gap-2" 
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
