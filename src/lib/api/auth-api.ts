import { fetchApi } from './client';
import { JwtResponse, UserResponse } from './types';

export const authApi = {
    login: (data: any) => fetchApi<JwtResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    register: (data: any) => fetchApi<void>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getMe: () => fetchApi<UserResponse>('/users/me'),
    
    updateProfile: (data: any) => fetchApi<UserResponse>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    deleteAccount: () => fetchApi<void>('/users/me', {
        method: 'DELETE'
    }),
    
    firebaseLogin: (idToken: string, displayName?: string | null, photoUrl?: string | null) => fetchApi<JwtResponse>('/auth/firebase-login', {
        method: 'POST',
        body: JSON.stringify({ idToken, displayName, photoUrl })
    })
};
