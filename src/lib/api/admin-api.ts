import { fetchApi } from './client';
import { CourseResponse, UserResponse, PaginatedResponse, CategoryResponse, AdminCoursePreviewResponse } from './types';

export const adminApi = {
    // Courses
    getCourses: (page = 0, size = 50) => fetchApi<PaginatedResponse<CourseResponse>>(`/admin/courses?page=${page}&size=${size}`),
    
    getPendingCourses: (page = 0, size = 50) => fetchApi<PaginatedResponse<CourseResponse>>(`/admin/courses/pending?page=${page}&size=${size}`),
    
    getCoursePreview: (id: string) => fetchApi<AdminCoursePreviewResponse>(`/admin/courses/${id}/preview`),

    approveCourse: (id: string) => fetchApi<void>(`/admin/courses/${id}/approve`, {
        method: 'POST'
    }),
    
    rejectCourse: (id: string, reason: string) => fetchApi<void>(`/admin/courses/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
    }),

    requestChanges: (id: string, reason: string) => fetchApi<void>(`/admin/courses/${id}/request-changes`, {
        method: 'POST',
        body: JSON.stringify({ reason })
    }),
    
    unpublishCourse: (id: string) => fetchApi<void>(`/admin/courses/${id}/unpublish`, {
        method: 'POST'
    }),

    hideCourse: (id: string) => fetchApi<void>(`/admin/courses/${id}/hide`, {
        method: 'POST'
    }),

    deleteCourse: (id: string) => fetchApi<void>(`/admin/courses/${id}`, {
        method: 'DELETE'
    }),

    // Users
    getUsers: (page = 0, size = 50) => fetchApi<PaginatedResponse<UserResponse>>(`/admin/users?page=${page}&size=${size}`),
    
    updateUserStatus: (id: string, status: string) => fetchApi<void>(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    }),
    
    updateUserRole: (id: string, role: string) => fetchApi<void>(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
    }),

    deleteUser: (id: string) => fetchApi<void>(`/admin/users/${id}`, {
        method: 'DELETE'
    }),

    // Categories
    createCategory: (data: any) => fetchApi<CategoryResponse>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    updateCategory: (id: string, data: any) => fetchApi<CategoryResponse>(`/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })
};
