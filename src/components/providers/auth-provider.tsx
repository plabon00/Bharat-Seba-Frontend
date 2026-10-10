'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserResponse } from '@/lib/api/types';
import { authApi } from '@/lib/api/auth-api';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { signOut } from 'firebase/auth';

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    login: (token: string, user: UserResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => {},
    logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authApi.getMe()
                .then(userData => {
                    setUser(userData);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (token: string, userData: UserResponse) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Firebase signout error", error);
        }
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
