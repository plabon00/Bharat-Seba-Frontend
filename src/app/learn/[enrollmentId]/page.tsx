'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { enrollmentApi } from '@/lib/api/enrollment-api';
import { LessonResponse, ProgressResponse } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, PlayCircle, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function LearningRoomPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-64px)]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <LearningRoomContent />
        </Suspense>
    );
}

function LearningRoomContent() {
    const params = useParams();
    const router = useRouter();
    const enrollmentId = params.enrollmentId as string;

    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [progress, setProgress] = useState<ProgressResponse[]>([]);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLearningData = async () => {
            try {
                const [lessonsData, progressData] = await Promise.all([
                    enrollmentApi.getEnrollmentLessons(enrollmentId),
                    enrollmentApi.getEnrollmentProgress(enrollmentId)
                ]);
                setLessons(lessonsData);
                setProgress(progressData);
                if (lessonsData.length > 0) {
                    setActiveLessonId(lessonsData[0].id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLearningData();
    }, [enrollmentId]);

    const activeLesson = lessons.find(l => l.id === activeLessonId);
    const activeLessonIndex = lessons.findIndex(l => l.id === activeLessonId);
    const lessonProgress = progress.find(p => p.lessonId === activeLessonId);

    const handleMarkComplete = async () => {
        if (!activeLessonId) return;
        try {
            const updated = await enrollmentApi.completeLesson(enrollmentId, activeLessonId);
            setProgress(prev => {
                const existing = prev.findIndex(p => p.lessonId === activeLessonId);
                if (existing >= 0) {
                    const newArr = [...prev];
                    newArr[existing] = updated;
                    return newArr;
                }
                return [...prev, updated];
            });
            
            // Auto-advance
            if (activeLessonIndex < lessons.length - 1) {
                setActiveLessonId(lessons[activeLessonIndex + 1].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (lessons.length === 0) {
        return (
            <div className="container mx-auto p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">No Content Available</h2>
                <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-[#F7F9FC]">
            {/* Sidebar */}
            <div className="w-full md:w-80 bg-white border-r overflow-y-auto flex-shrink-0">
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-heading">Course Curriculum</h2>
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                                className="bg-success h-2 rounded-full" 
                                style={{ width: `${(progress.filter(p => p.status === 'COMPLETED').length / lessons.length) * 100}%` }}
                            />
                        </div>
                        <span className="whitespace-nowrap">{progress.filter(p => p.status === 'COMPLETED').length} / {lessons.length}</span>
                    </div>
                </div>
                <div className="p-2 space-y-1">
                    {lessons.map((lesson, idx) => {
                        const isCompleted = progress.some(p => p.lessonId === lesson.id && p.status === 'COMPLETED');
                        const isActive = activeLessonId === lesson.id;
                        
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => setActiveLessonId(lesson.id)}
                                className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-slate-700'
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                ) : (
                                    <Circle className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-primary' : 'text-slate-300'}`} />
                                )}
                                <div>
                                    <div className="text-xs font-semibold mb-1 opacity-70">
                                        Lesson {idx + 1}
                                    </div>
                                    <div className="text-sm font-medium line-clamp-2">
                                        {lesson.title}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                                        {lesson.lessonType === 'VIDEO' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                        <span>{lesson.lessonType === 'VIDEO' ? 'Video' : 'Reading'}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {activeLesson ? (
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold text-heading mb-6">{activeLesson.title}</h1>
                            
                            {activeLesson.lessonType === 'VIDEO' && activeLesson.videoUrl && (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8">
                                    {/* Simple iframe for YouTube - in a real app, handle different providers robustly */}
                                    <iframe 
                                        src={activeLesson.videoUrl.replace('watch?v=', 'embed/')} 
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            )}

                            {activeLesson.lessonType === 'TEXT' && activeLesson.contentText && (
                                <div className="prose prose-slate max-w-none bg-slate-50 p-8 rounded-xl border mb-8">
                                    <p className="whitespace-pre-line text-slate-700 leading-relaxed">
                                        {activeLesson.contentText}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Select a lesson to begin
                        </div>
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="border-t bg-white p-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Button 
                            variant="outline" 
                            disabled={activeLessonIndex <= 0}
                            onClick={() => setActiveLessonId(lessons[activeLessonIndex - 1]?.id)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>

                        <Button 
                            onClick={handleMarkComplete}
                            disabled={lessonProgress?.status === 'COMPLETED'}
                            className={lessonProgress?.status === 'COMPLETED' ? 'bg-success text-white' : ''}
                        >
                            {lessonProgress?.status === 'COMPLETED' ? (
                                <><CheckCircle className="w-4 h-4 mr-2" /> Completed</>
                            ) : (
                                'Mark as Complete'
                            )}
                        </Button>

                        <Button 
                            variant="outline"
                            disabled={activeLessonIndex >= lessons.length - 1}
                            onClick={() => setActiveLessonId(lessons[activeLessonIndex + 1]?.id)}
                        >
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
