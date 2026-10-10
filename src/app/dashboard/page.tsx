'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { dashboardApi, LearnerDashboardResponse } from '@/lib/api/dashboard-api';
import { enrollmentApi } from '@/lib/api/enrollment-api';
import { EnrollmentResponse } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<LearnerDashboardResponse | null>(null);
    const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsData, enrollmentsData] = await Promise.all([
                    dashboardApi.getLearnerDashboard(),
                    enrollmentApi.getMyEnrollments(0, 10)
                ]);
                setStats(statsData);
                setEnrollments(enrollmentsData.content);
            } catch (err) {
                console.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboard();
        }
    }, [user]);

    if (isLoading) {
        return <div className="container mx-auto p-8 animate-pulse">Loading dashboard...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-heading mb-2">Welcome back, {user?.fullName.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mb-8">Here's an overview of your learning journey.</p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
                        <BookOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-heading">{stats?.totalEnrollments || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                        <Clock className="w-4 h-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-heading">{stats?.inProgressCourses || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                        <CheckCircle className="w-4 h-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-heading">{stats?.completedCourses || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Enrollments */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-heading">Continue Learning</h2>
                    <Link href="/courses">
                        <Button variant="outline">Browse More Courses</Button>
                    </Link>
                </div>

                {enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <Card key={enrollment.id} className="flex flex-col overflow-hidden">
                                <div className="aspect-video bg-muted relative">
                                    {enrollment.courseThumbnailUrl ? (
                                        <img src={enrollment.courseThumbnailUrl} alt={enrollment.courseTitle} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Link href={`/learn/${enrollment.id}`}>
                                            <Button variant="secondary" className="gap-2">
                                                <PlayCircle className="w-4 h-4" /> Continue
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-lg text-heading mb-2 line-clamp-1">{enrollment.courseTitle}</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            enrollment.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                                        }`}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white border rounded-xl">
                        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-heading mb-2">No courses yet</h3>
                        <p className="text-muted-foreground mb-6">You haven't enrolled in any courses. Start your learning journey today!</p>
                        <Link href="/courses">
                            <Button>Explore Catalog</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
