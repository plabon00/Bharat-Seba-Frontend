import { fetchApi } from './client';

export interface LearnerDashboardResponse {
    totalEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
}

export interface TeacherDashboardResponse {
    totalCourses: number;
    totalStudents: number;
    publishedCourses: number;
}

export interface AdminDashboardResponse {
    totalUsers: number;
    totalCourses: number;
    pendingCourses: number;
}

export const dashboardApi = {
    getLearnerDashboard: () => fetchApi<LearnerDashboardResponse>('/dashboard/me'),
    getTeacherDashboard: () => fetchApi<TeacherDashboardResponse>('/teacher/dashboard'),
    getAdminDashboard: () => fetchApi<AdminDashboardResponse>('/admin/dashboard')
};
