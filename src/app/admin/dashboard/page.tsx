'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { dashboardApi, AdminDashboardResponse } from '@/lib/api/dashboard-api';
import { adminApi } from '@/lib/api/admin-api';
import { CourseResponse } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
    const [pendingCourses, setPendingCourses] = useState<CourseResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsData, pendingData] = await Promise.all([
                    dashboardApi.getAdminDashboard(),
                    adminApi.getPendingCourses(0, 5)
                ]);
                setStats(statsData);
                setPendingCourses(pendingData.content);
            } catch (err) {
                console.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.role === 'ADMIN') {
            fetchDashboard();
        } else if (user && user.role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this course?')) return;
        try {
            await adminApi.approveCourse(id);
            setPendingCourses(prev => prev.filter(c => c.id !== id));
            if (stats) setStats({ ...stats, pendingCourses: stats.pendingCourses - 1 });
        } catch (err: any) {
            alert(err.message || 'Failed to approve');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Please enter a reason for rejection:');
        if (!reason) return;
        try {
            await adminApi.rejectCourse(id, reason);
            setPendingCourses(prev => prev.filter(c => c.id !== id));
            if (stats) setStats({ ...stats, pendingCourses: stats.pendingCourses - 1 });
        } catch (err: any) {
            alert(err.message || 'Failed to reject');
        }
    };

    if (isLoading) {
        return <div className="container mx-auto p-8 animate-pulse">Loading dashboard...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-heading mb-2">Admin Overview</h1>
            <p className="text-muted-foreground mb-8">Platform statistics and moderation tools.</p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-heading">{stats?.totalUsers || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                        <BookOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-heading">{stats?.totalCourses || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-heading text-warning">{stats?.pendingCourses || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Courses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-heading">Requires Attention</h2>
                </div>

                {pendingCourses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingCourses.map((course) => (
                            <Card key={course.id} className="flex flex-col sm:flex-row items-center overflow-hidden">
                                <CardContent className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-heading mb-1">{course.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span>By: {course.teacherName}</span>
                                            <span>Code: {course.courseCode}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" className="border-success text-success hover:bg-success/10" onClick={() => handleApprove(course.id)}>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                        </Button>
                                        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleReject(course.id)}>
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white border rounded-xl">
                        <CheckCircle className="w-16 h-16 text-success/50 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-heading mb-2">All Caught Up!</h3>
                        <p className="text-muted-foreground">There are no courses currently pending review.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
