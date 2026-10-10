import { fetchApi } from './client';
import { EnrollmentResponse, ProgressResponse, LessonResponse } from './types';

export const enrollmentApi = {
    enroll: (courseCode: string) => fetchApi<EnrollmentResponse>(`/courses/${courseCode}/enroll`, {
        method: 'POST'
    }),
    
    getMyEnrollments: (page = 0, size = 20) => fetchApi<any>(`/enrollments/me?page=${page}&size=${size}`),
    
    getEnrollmentLessons: (enrollmentId: string) => fetchApi<LessonResponse[]>(`/enrollments/${enrollmentId}/lessons`),
    
    getEnrollmentProgress: (enrollmentId: string) => fetchApi<ProgressResponse[]>(`/enrollments/${enrollmentId}/progress`),
    
    updateProgress: (enrollmentId: string, lessonId: string, positionSeconds: number) => fetchApi<ProgressResponse>(`/enrollments/${enrollmentId}/lessons/${lessonId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ positionSeconds })
    }),
    
    completeLesson: (enrollmentId: string, lessonId: string) => fetchApi<ProgressResponse>(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, {
        method: 'POST'
    })
};
