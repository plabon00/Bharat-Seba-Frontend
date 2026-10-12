'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Sidebar } from './sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Automatically close sidebar when pathname changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Top Navigation Bar - Always visible across large and small screens */}
            <Header onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

            {/* Mobile Drawer (Only for small screens, hidden on large screens) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            <div 
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area - Full width on desktop */}
            <main className="flex-1 w-full min-h-[calc(100vh-64px)]">
                {children}
            </main>
        </div>
    );
}
