'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseResponse } from '@/lib/api/types';
import { publicApi } from '@/lib/api/public-api';
import { enrollmentApi } from '@/lib/api/enrollment-api';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Tag, PlayCircle, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function CourseDetailsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <CourseDetailsContent />
        </Suspense>
    );
}

function CourseDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    
    const [course, setCourse] = useState<CourseResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    
    const courseCode = params.courseCode as string;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await publicApi.getCourseByCode(courseCode);
                setCourse(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load course details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseCode]);

    const handleEnroll = async () => {
        if (!user) {
            router.push(`/login?redirect=/courses/${courseCode}`);
            return;
        }

        setIsEnrolling(true);
        try {
            const enrollment = await enrollmentApi.enroll(courseCode);
            // On success, redirect to the learning room
            router.push(`/learn/${enrollment.id}`);
        } catch (err: any) {
            // Already enrolled or error
            if (err.status === 400 && err.message.includes('Already enrolled')) {
                // If we had a way to fetch enrollmentId, we could redirect. For now, redirect to dashboard.
                router.push('/dashboard');
            } else {
                alert(err.message || 'Failed to enroll');
            }
        } finally {
            setIsEnrolling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-heading mb-4">Course Not Found</h2>
                <p className="text-muted-foreground mb-6">{error || 'The course you are looking for does not exist.'}</p>
                <Button onClick={() => router.push('/courses')}>Back to Courses</Button>
            </div>
        );
    }

    return (
        <div>
            {/* Header / Hero */}
            <div className="bg-[#14213D] text-white py-16">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-300 mb-4">
                            <Tag className="w-4 h-4" />
                            <span>{course.categoryName}</span>
                            <span className="opacity-50">•</span>
                            <span>{course.difficulty}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 max-w-3xl">
                            {course.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-slate-400" />
                                <span>Created by <span className="font-semibold text-white">{course.teacherName}</span></span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Action Card */}
                    <div className="md:w-1/3 md:-mt-8">
                        <div className="bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden sticky top-24">
                            <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                                {course.thumbnailUrl ? (
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <PlayCircle className="w-16 h-16 text-slate-300" />
                                )}
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold mb-6">Free</div>
                                <Button 
                                    size="lg" 
                                    className="w-full text-lg mb-4" 
                                    onClick={handleEnroll}
                                    disabled={isEnrolling || authLoading}
                                >
                                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                                </Button>
                                <p className="text-xs text-center text-slate-500">
                                    Full lifetime access. Start learning immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content Details */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-heading mb-6">About this course</h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="whitespace-pre-line text-slate-600">
                            {course.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
