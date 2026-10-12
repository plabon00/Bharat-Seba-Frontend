'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { teacherApi } from '@/lib/api/teacher-api';
import { CourseResponse } from '@/lib/api/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle, Edit, Eye, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function MyCoursesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setIsLoading(false);
            return;
        }

        teacherApi.getMyCourses(0, 50)
            .then(data => {
                setCourses(data?.content || []);
            })
            .catch(err => {
                console.error('Failed to fetch courses:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-muted-foreground">Loading your course studio...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md text-center">
                <div className="p-8 bg-white border rounded-2xl shadow-sm">
                    <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-heading mb-2">Sign In Required</h2>
                    <p className="text-muted-foreground mb-6 text-sm">
                        Please sign in to access Course Studio and create or manage courses.
                    </p>
                    <Link href="/login">
                        <Button className="w-full">Sign In Now</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-emerald-600 text-white';
            case 'PENDING_REVIEW':
                return 'bg-amber-500 text-white';
            case 'REJECTED':
                return 'bg-red-600 text-white';
            default:
                return 'bg-slate-700 text-white';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-heading mb-1">Course Studio</h1>
                    <p className="text-muted-foreground text-sm">Create, edit, and publish your courses for learners.</p>
                </div>
                <Link href="/teacher/courses/new">
                    <Button className="gap-2 shadow-sm">
                        <PlusCircle className="w-4 h-4" /> Create New Course
                    </Button>
                </Link>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id} className="flex flex-col h-full overflow-hidden border border-slate-200/80 hover:shadow-md transition-shadow">
                            <div className="w-full h-44 bg-slate-100 flex items-center justify-center relative border-b overflow-hidden">
                                {course.thumbnailUrl ? (
                                    <img 
                                        src={course.thumbnailUrl} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <BookOpen className="w-10 h-10 mb-1 opacity-50" />
                                        <span className="text-xs font-medium">No Thumbnail</span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusBadgeClass(course.status)}`}>
                                        {course.status}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="flex-1 p-5 flex flex-col">
                                <div className="mb-2">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 mr-2">
                                        {course.categoryName}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">
                                        {course.difficulty}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-heading mb-2 line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                                    {course.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <span className="text-xs text-muted-foreground font-mono">{course.courseCode}</span>
                                    <div className="flex gap-2">
                                        {course.status === 'PUBLISHED' && (
                                            <Link href={`/courses/${course.courseCode}`}>
                                                <Button variant="ghost" size="icon" title="View Public Page">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={`/teacher/courses/${course.id}/edit`}>
                                            <Button variant="secondary" size="sm" className="gap-2">
                                                <Edit className="w-4 h-4" /> Manage
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-heading mb-2">You haven't created any courses yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                        Start sharing your knowledge by creating your first course. You can upload an image thumbnail, add lessons, videos, and submit it for publication.
                    </p>
                    <Link href="/teacher/courses/new">
                        <Button size="lg" className="gap-2">
                            <PlusCircle className="w-5 h-5" /> Create Your First Course
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
