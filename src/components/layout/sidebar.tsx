'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { BookOpen, Compass, Tags, LayoutDashboard, Settings, User, ChevronDown, ChevronRight, LogOut, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/api/public-api';
import { CategoryResponse } from '@/lib/api/types';

export function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        publicApi.getCategories().then(cats => setCategories(cats)).catch(console.error);
        
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

    // Hide sidebar entirely on completely public pages FOR DESKTOP
    // But since it's the only nav on mobile, we must render it if open.
    // The main-layout hides it via CSS on desktop for public pages.

    const navItems = [
        { name: 'Dashboard', href: user ? '/dashboard' : '/login', icon: LayoutDashboard },
        { name: 'All Courses', href: '/courses', icon: Compass },
    ];

    if (user) {
        navItems.push({ name: 'Course Studio', href: '/teacher/courses', icon: BookOpen });
    }

    const bottomItems = [
        { name: 'Profile', href: '/settings', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <aside className="flex flex-col w-full border-r bg-white/95 backdrop-blur-md min-h-screen lg:min-h-[calc(100vh-64px)] h-full sticky top-0 lg:top-16 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50">
            {/* Mobile Header in Sidebar */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center" onClick={onClose}>
                    <img src="/Bharat Seva.png" alt="Bharat Seva" className="h-10 w-auto object-contain" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-100 transition-colors">
                        <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                        <select 
                            value={language} 
                            onChange={handleLanguageChange}
                            className="bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 outline-none cursor-pointer pl-1 pr-6 py-1 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                        >
                            <option value="en">Eng</option>
                            <option value="hi">हिंदी</option>
                            <option value="bn">বাংলা</option>
                        </select>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                                    isActive 
                                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Expandable Categories Section */}
                    <div className="pt-6 mt-6 border-t border-slate-100">
                        <button 
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors group"
                        >
                            <div className="flex items-center gap-3 font-semibold uppercase tracking-wider text-xs">
                                <Tags className="w-4 h-4" />
                                <span>Categories</span>
                            </div>
                            <div className="bg-slate-100 p-1 rounded-md group-hover:bg-slate-200 transition-colors">
                                {isCategoriesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCategoriesOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-4 ml-3 border-l-2 border-slate-100 space-y-1 py-1">
                                {categories.slice(0, 4).map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/courses?category=${cat.slug}`}
                                        className="block px-4 py-2 text-sm text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/categories"
                                    className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-all mt-1"
                                >
                                    View All &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions (Settings & Profile/Auth) */}
            <div className="p-4 border-t border-slate-100 bg-white/50">
                <Link 
                    href={user ? "/settings" : "/login"} 
                    onClick={onClose} 
                    className="flex items-center gap-3 px-4 py-2.5 mb-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium w-full"
                >
                    <Settings className="w-5 h-5 text-slate-400" />
                    Settings
                </Link>

                {user ? (
                    <div className="border rounded-2xl bg-gradient-to-b from-slate-50 to-white shadow-sm overflow-hidden">
                        <div className="p-3">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px] shrink-0">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
                                    <p className="text-xs text-slate-500 truncate font-medium">{user.email}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    logout();
                                    if (onClose) onClose();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="lg:hidden space-y-2">
                        <Link href="/login" onClick={onClose} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" onClick={onClose} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}
