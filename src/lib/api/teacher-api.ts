import { fetchApi } from './client';
import { CourseResponse, LessonResponse, PaginatedResponse } from './types';

export const teacherApi = {
    uploadThumbnail: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetchApi<{ url: string }>('/upload/image', {
            method: 'POST',
            body: formData,
        });
    },

    getMyCourses: (page = 0, size = 20) => fetchApi<PaginatedResponse<CourseResponse>>(`/teacher/courses?page=${page}&size=${size}`),
    
    getCourse: (id: string) => fetchApi<CourseResponse>(`/teacher/courses/${id}`),
    
    createCourse: (data: any) => fetchApi<CourseResponse>('/teacher/courses', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    updateCourse: (id: string, data: any) => fetchApi<CourseResponse>(`/teacher/courses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    
    submitCourse: (id: string) => fetchApi<void>(`/teacher/courses/${id}/submit`, {
        method: 'POST'
    }),
    
    withdrawCourse: (id: string) => fetchApi<void>(`/teacher/courses/${id}/withdraw`, {
        method: 'POST'
    }),
    
    archiveCourse: (id: string) => fetchApi<void>(`/teacher/courses/${id}/archive`, {
        method: 'POST'
    }),

    // Lessons
    getLessons: (courseId: string) => fetchApi<LessonResponse[]>(`/teacher/courses/${courseId}/lessons`),
    
    addLesson: (courseId: string, data: any) => fetchApi<LessonResponse>(`/teacher/courses/${courseId}/lessons`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    updateLesson: (courseId: string, lessonId: string, data: any) => fetchApi<LessonResponse>(`/teacher/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    
    deleteLesson: (courseId: string, lessonId: string) => fetchApi<void>(`/teacher/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE'
    })
};
