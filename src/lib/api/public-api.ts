import { fetchApi } from './client';
import { CourseResponse, CategoryResponse, PaginatedResponse } from './types';

export const publicApi = {
    getCategories: () => fetchApi<CategoryResponse[]>('/categories'),
    
    getCourses: (page = 0, size = 20) => 
        fetchApi<PaginatedResponse<CourseResponse>>(`/courses?page=${page}&size=${size}`),
        
    getCourseByCode: (code: string) => 
        fetchApi<CourseResponse>(`/courses/${code}`),
        
    searchCourses: (query: string, page = 0, size = 20) => 
        fetchApi<PaginatedResponse<CourseResponse>>(`/courses/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`),
        
    getFeaturedCourses: () => fetchApi<PaginatedResponse<CourseResponse>>('/courses/featured?size=4'),
    
    getPopularCourses: () => fetchApi<PaginatedResponse<CourseResponse>>('/courses/popular?size=4'),
    
    getCoursesByCategory: (slug: string, page = 0, size = 20) => 
        fetchApi<PaginatedResponse<CourseResponse>>(`/categories/${slug}/courses?page=${page}&size=${size}`),
};
