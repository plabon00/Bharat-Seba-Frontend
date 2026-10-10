'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { teacherApi } from '@/lib/api/teacher-api';
import { CourseResponse } from '@/lib/api/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle, Edit, Eye } from 'lucide-react';
import Link from 'next/link';

export default function MyCoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'TEACHER') {
            teacherApi.getMyCourses(0, 50)
                .then(data => {
                    setCourses(data.content);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch courses", err);
                    setIsLoading(false);
                });
        }
    }, [user]);

    if (isLoading) {
        return <div className="container mx-auto p-8 animate-pulse">Loading your courses...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-heading mb-2">My Courses (Teach)</h1>
                    <p className="text-muted-foreground">Manage all the courses you have created.</p>
                </div>
                <Link href="/teacher/courses/new">
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" /> Create New Course
                    </Button>
                </Link>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id} className="flex flex-col h-full overflow-hidden">
                            <div className="w-full h-40 bg-slate-100 flex items-center justify-center relative border-b">
                                {course.thumbnailUrl ? (
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <BookOpen className="w-12 h-12 text-slate-300" />
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${
                                        course.status === 'PUBLISHED' ? 'bg-success text-white' : 
                                        course.status === 'PENDING_REVIEW' ? 'bg-warning text-white' :
                                        course.status === 'REJECTED' ? 'bg-destructive text-white' :
                                        'bg-white text-slate-700'
                                    }`}>
                                        {course.status}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="flex-1 p-5 flex flex-col">
                                <h3 className="font-bold text-lg text-heading mb-2 line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                                    {course.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                    <span className="text-xs text-muted-foreground font-mono">{course.courseCode}</span>
                                    <div className="flex gap-2">
                                        {course.status === 'PUBLISHED' && (
                                            <Link href={`/courses/${course.courseCode}`}>
                                                <Button variant="ghost" size="icon" title="View Public">
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
                <div className="text-center py-16 bg-white border rounded-xl shadow-sm">
                    <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-heading mb-2">You haven't created any courses yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start sharing your knowledge by creating your first course. You can add lessons, videos, and publish it to the world.
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
