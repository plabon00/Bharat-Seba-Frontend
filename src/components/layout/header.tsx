'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { Button, buttonVariants } from '../ui/button';
import { BookOpen, User, LogOut, Settings, Menu, Globe, ShieldAlert, Sparkles, Home, Compass, Users } from 'lucide-react';

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const [isMounted, setIsMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
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

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'How to Publish', href: '/how-to-publish' },
        { name: 'Course Studio', href: '/teacher/courses' },
        { name: 'About Us', href: '/about' },
    ];

    if (user?.role === 'ADMIN') {
        navLinks.push({ name: 'Admin Panel', href: '/admin/dashboard' });
    }

    return (
        <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <div className="container mx-auto px-4 max-w-[1240px] h-full flex items-center justify-between">
                {/* Left: Mobile Menu Trigger + Brand Logo + Desktop Nav */}
                <div className="flex items-center gap-3 md:gap-6">
                    {/* Mobile Menu Button */}
                    <button 
                        type="button"
                        onClick={onToggleSidebar} 
                        className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img 
                            src="/Bharat Seva.png" 
                            alt="Bharat Seva" 
                            className="h-10 sm:h-11 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-6 ml-4">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            const isAdmin = link.href.includes('/admin');
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-[14px] font-semibold transition-all flex items-center gap-1.5 h-16 relative ${
                                        isActive 
                                            ? 'text-[#0056D2] border-b-2 border-[#0056D2]' 
                                            : 'text-slate-600 hover:text-[#0056D2]'
                                    }`}
                                >
                                    {isAdmin && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                                    {link.name}
                                    {isAdmin && (
                                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full uppercase">
                                            Admin
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                {/* Right: Language Selector + Auth Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Language Selector */}
                    <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-200/70 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <select 
                            value={language} 
                            onChange={handleLanguageChange}
                            className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer pl-1 pr-4 py-0 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                        >
                            <option value="en">Eng</option>
                            <option value="hi">हिंदी</option>
                            <option value="bn">বাংলা</option>
                        </select>
                    </div>

                    {!isMounted ? (
                        <div className="w-24 h-8" />
                    ) : !isLoading && !user ? (
                        <div className="flex items-center gap-2">
                            <Link 
                                href="/login" 
                                className="h-10 px-4 rounded-lg font-semibold text-sm text-slate-700 hover:text-[#0056D2] hover:bg-slate-100 transition-all flex items-center justify-center"
                            >
                                Log In
                            </Link>
                            <Link 
                                href="/register" 
                                className="h-10 px-4 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold text-sm flex items-center justify-center shadow-sm hover:shadow transition-all"
                            >
                                Join for Free
                            </Link>
                        </div>
                    ) : null}
                    
                    {isMounted && !isLoading && user && (
                        <div className="flex items-center gap-2 relative" ref={menuRef}>
                            <Link 
                                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} 
                                className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden sm:inline-flex text-xs font-semibold" })}
                            >
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 p-1 rounded-[10px] hover:bg-[#F4F1EC] transition-colors"
                                aria-label="User account menu"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#002D72]/10 border border-[#002D72]/20 flex items-center justify-center text-[#002D72] font-bold text-sm">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="hidden sm:inline-block text-[12px] font-bold uppercase tracking-[0.1em] text-[#002D72] max-w-[120px] truncate">
                                    {user.fullName?.split(' ')[0] || 'CITIZEN'}
                                </span>
                            </button>

                            {/* Dropdown User Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-13 w-56 bg-white border border-[#E0DDD6] rounded-[16px] shadow-lg py-2 z-50 text-xs">
                                    <div className="px-4 py-2 border-b border-[#E0DDD6]">
                                        <p className="font-bold text-[#002D72] truncate">{user.fullName}</p>
                                        <p className="text-[#666666] text-[11px] truncate">{user.email}</p>
                                        <div className="mt-1">
                                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                user.role === 'ADMIN' ? 'bg-[#F9A825]/20 text-[#002D72]' : 'bg-[#002D72]/10 text-[#002D72]'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    {user.role === 'ADMIN' && (
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-50 font-semibold"
                                        >
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            Admin Panel
                                        </Link>
                                    )}

                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                    >
                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                        My Dashboard
                                    </Link>

                                    <Link
                                        href="/teacher/courses"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                    >
                                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                        Course Studio
                                    </Link>

                                    <Link
                                        href="/settings"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                    >
                                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                                        Settings
                                    </Link>

                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
