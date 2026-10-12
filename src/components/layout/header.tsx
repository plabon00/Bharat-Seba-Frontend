'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/auth-provider';
import { Button, buttonVariants } from '../ui/button';
import { BookOpen, User, LogOut, Settings, Menu, Globe } from 'lucide-react';

export function Header({ onToggleSidebar, hideToggle = false }: { onToggleSidebar?: () => void, hideToggle?: boolean }) {
    const { user, logout, isLoading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const [isMounted, setIsMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        // Read initial language from cookie
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match) {
            setLanguage(match[1]);
        }
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        setLanguage(lang);
        if (lang === 'en') {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname};`;
        } else {
            document.cookie = `googtrans=/en/${lang}; path=/;`;
            document.cookie = `googtrans=/en/${lang}; path=/; domain=${location.hostname};`;
        }
        window.location.reload();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                    {!hideToggle && (
                        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-1 lg:hidden">
                            <Menu className="w-5 h-5 text-slate-700" />
                        </Button>
                    )}
                    <Link href="/" className="flex items-center">
                        <img 
                            src="/Bharat Seva.png" 
                            alt="Bharat Seva" 
                            className="h-16 w-auto object-contain"
                        />
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-6 ml-4 text-sm font-medium">
                        <Link href="/courses" className="text-slate-600 hover:text-primary transition-colors">
                            Courses
                        </Link>
                        <Link href="/about" className="text-slate-600 hover:text-primary transition-colors">
                            Who We Are
                        </Link>
                        <Link href="/teacher/courses" className="text-slate-600 hover:text-primary transition-colors">
                            Course Studio
                        </Link>
                    </nav>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Language Selector */}
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 mr-2 hover:bg-slate-100 transition-colors">
                        <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                        <select 
                            value={language} 
                            onChange={handleLanguageChange}
                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 outline-none cursor-pointer pl-1 pr-6 py-1 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                        </select>
                    </div>

                    {!isMounted ? (
                        <div className="w-32 h-9" />
                    ) : !isLoading && !user ? (
                        <>
                            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                Sign In
                            </Link>
                            <Link href="/register" className={buttonVariants({ size: "sm" })}>
                                Sign Up
                            </Link>
                        </>
                    ) : null}
                    
                    {isMounted && !isLoading && user && (
                        <div className="flex items-center gap-2 md:gap-4 relative" ref={menuRef}>
                            <Link href={
                                user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'
                            } className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden md:flex" })}>
                                Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
