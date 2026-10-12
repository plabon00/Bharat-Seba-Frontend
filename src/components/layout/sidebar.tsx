'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { 
    Home, Compass, BookOpen, Users, LayoutDashboard, 
    Settings, LogOut, X, ShieldAlert, User, LogIn, UserPlus 
} from 'lucide-react';

export function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Clean, structured order of items
    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'All Courses', href: '/courses', icon: Compass },
        { name: 'Course Studio', href: '/teacher/courses', icon: BookOpen },
        { name: 'Who We Are', href: '/about', icon: Users },
    ];

    if (user) {
        navItems.push({ name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard });
    }

    if (user?.role === 'ADMIN') {
        navItems.push({ name: 'Admin Panel', href: '/admin/dashboard', icon: ShieldAlert });
    }

    return (
        <aside className="flex flex-col w-full h-full bg-white border-r border-slate-200 select-none">
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <Link href="/" onClick={onClose} className="flex items-center gap-2">
                    <img 
                        src="/Bharat Seva.png" 
                        alt="Bharat Seva" 
                        className="h-10 w-auto object-contain"
                    />
                </Link>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav Items List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1.5">
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Menu
                </div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    const isAdmin = item.href.includes('/admin');
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                                isActive 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : isAdmin 
                                        ? 'text-amber-700 bg-amber-50/60 hover:bg-amber-100/80' 
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : isAdmin ? 'text-amber-600' : 'text-slate-500'}`} />
                                <span>{item.name}</span>
                            </div>
                            {isAdmin && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                    isActive ? 'bg-white text-primary' : 'bg-amber-200 text-amber-900'
                                }`}>
                                    Admin
                                </span>
                            )}
                        </Link>
                    );
                })}

                {user && (
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Account
                        </div>
                        <Link 
                            href="/settings"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                pathname === '/settings' 
                                    ? 'bg-primary text-white' 
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <Settings className="w-4 h-4 text-slate-500" />
                            Settings
                        </Link>
                    </div>
                )}
            </div>

            {/* Bottom User Profile or Login */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                {user ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
                                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                logout();
                                if (onClose) onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Link 
                            href="/login" 
                            onClick={onClose} 
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                            <LogIn className="w-3.5 h-3.5" /> Sign In
                        </Link>
                        <Link 
                            href="/register" 
                            onClick={onClose} 
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors shadow-xs"
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Create Account
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}
