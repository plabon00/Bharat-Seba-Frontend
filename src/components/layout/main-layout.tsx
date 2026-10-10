'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Menu } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default hidden on mobile

    // Automatically hide sidebar on navigation on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    // Don't show sidebar wrapper logic on pure public pages FOR DESKTOP
    const isPublicPage = pathname === '/login' || pathname === '/register' || pathname === '/';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Desktop Header */}
            <div className="hidden lg:block">
                <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} hideToggle={isPublicPage} />
            </div>

            {/* Mobile Floating Menu Button */}
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200/50 text-slate-700 active:scale-95 transition-all"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex flex-1 relative overflow-hidden">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                
                <div 
                    className={`
                        fixed inset-y-0 left-0 z-50 lg:z-40 lg:relative
                        transform transition-all duration-300 ease-in-out bg-white overflow-hidden
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        ${isPublicPage ? 'lg:hidden' : 'lg:translate-x-0 lg:w-56'}
                        w-64 sm:w-72
                    `}
                >
                    <div className="w-full h-full">
                        <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
                
                <main className="flex-1 overflow-y-auto min-h-[calc(100vh-64px)] w-full relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
