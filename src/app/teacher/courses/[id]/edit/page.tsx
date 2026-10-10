'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teacherApi } from '@/lib/api/teacher-api';
import { CourseResponse, LessonResponse } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Edit, PlusCircle, Trash2, Video, FileText, BookOpen, X, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function EditCoursePage() {
    return (
        <Suspense fallback={<div className="container p-8">Loading...</div>}>
            <EditCourseContent />
        </Suspense>
    );
}

function EditCourseContent() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const [course, setCourse] = useState<CourseResponse | null>(null);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [isSavingLesson, setIsSavingLesson] = useState(false);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        lessonType: 'VIDEO',
        videoProvider: 'YOUTUBE',
        videoUrl: '',
        contentText: '',
        isPreview: false
    });

    const fetchCourseData = async () => {
        setIsLoading(true);
        try {
            const [c, l] = await Promise.all([
                teacherApi.getCourse(courseId),
                teacherApi.getLessons(courseId)
            ]);
            setCourse(c);
            setLessons(l);
        } catch (err: any) {
            setError(err.message || 'Failed to load course');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const handleSubmitCourse = async () => {
        if (!confirm('Are you sure you want to submit this course for review? You will not be able to edit it while it is pending review.')) return;
        
        setIsSubmitting(true);
        try {
            await teacherApi.submitCourse(courseId);
            await fetchCourseData();
            alert('Course submitted successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to submit course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;
        
        try {
            await teacherApi.deleteLesson(courseId, lessonId);
            setLessons(lessons.filter(l => l.id !== lessonId));
        } catch (err: any) {
            alert(err.message || 'Failed to delete lesson');
        }
    };

    const handleSaveLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonForm.title) {
            alert('Title is required.');
            return;
        }

        setIsSavingLesson(true);
        try {
            const newLesson = await teacherApi.addLesson(courseId, lessonForm);
            setLessons([...lessons, newLesson]);
            setIsAddingLesson(false);
            setLessonForm({ title: '', lessonType: 'VIDEO', videoProvider: 'YOUTUBE', videoUrl: '', contentText: '', isPreview: false });
        } catch (err: any) {
            alert(err.message || 'Failed to add lesson');
        } finally {
            setIsSavingLesson(false);
        }
    };

    if (isLoading) return <div className="container p-8">Loading...</div>;
    if (error || !course) return <div className="container p-8 text-destructive">{error || 'Course not found'}</div>;

    const canEdit = course.status === 'DRAFT' || course.status === 'REJECTED';
    const canSubmit = canEdit && lessons.length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-heading flex items-center gap-3">
                        {course.title}
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            course.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 
                            course.status === 'PENDING_REVIEW' ? 'bg-warning/10 text-warning' :
                            course.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                            'bg-slate-200 text-slate-700'
                        }`}>
                            {course.status}
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your course content and settings.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {course.status === 'PUBLISHED' && (
                        <Link href={`/courses/${course.courseCode}`}>
                            <Button variant="outline">View Public Page</Button>
                        </Link>
                    )}
                    {canEdit && (
                        <Button 
                            onClick={handleSubmitCourse} 
                            disabled={!canSubmit || isSubmitting}
                            className={canSubmit ? 'bg-success hover:bg-success/90' : ''}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                        </Button>
                    )}
                </div>
            </div>

            {course.status === 'REJECTED' && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-8 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold">Course Rejected</h3>
                        <p className="text-sm mt-1">Please fix the issues and submit again.</p>
                        {/* Note: backend would normally return rejectionReason here, add it if API supports */}
                    </div>
                </div>
            )}

            {!canSubmit && canEdit && lessons.length === 0 && (
                <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg mb-8 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">You must add at least one lesson before you can submit this course for review.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Curriculum</CardTitle>
                            {canEdit && !isAddingLesson && (
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsAddingLesson(true)}>
                                    <PlusCircle className="w-4 h-4" /> Add Lesson
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isAddingLesson && (
                                <div className="mb-6 p-4 border rounded-lg bg-slate-50 border-primary/20">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Add New Lesson</h3>
                                        <Button variant="ghost" size="icon" onClick={() => setIsAddingLesson(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <form onSubmit={handleSaveLesson} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="lessonTitle">Lesson Title</Label>
                                            <Input 
                                                id="lessonTitle" 
                                                value={lessonForm.title} 
                                                onChange={e => setLessonForm({...lessonForm, title: e.target.value})} 
                                                placeholder="e.g. Introduction to the course"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lessonType">Lesson Type</Label>
                                            <select 
                                                id="lessonType"
                                                value={lessonForm.lessonType}
                                                onChange={e => setLessonForm({...lessonForm, lessonType: e.target.value})}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            >
                                                <option value="VIDEO">Video Lesson</option>
                                                <option value="TEXT">Text Tutorial</option>
                                            </select>
                                        </div>
                                        
                                        {lessonForm.lessonType === 'VIDEO' ? (
                                            <div className="space-y-2">
                                                <Label htmlFor="videoUrl">Video URL</Label>
                                                <Input 
                                                    id="videoUrl" 
                                                    value={lessonForm.videoUrl} 
                                                    onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})} 
                                                    placeholder="https://youtube.com/..."
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label htmlFor="contentText">Text Content</Label>
                                                <textarea 
                                                    id="contentText" 
                                                    rows={4}
                                                    value={lessonForm.contentText} 
                                                    onChange={e => setLessonForm({...lessonForm, contentText: e.target.value})} 
                                                    placeholder="Write your text lesson here..."
                                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" disabled={isSavingLesson} className="gap-2">
                                                {isSavingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Save Lesson
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {lessons.length > 0 ? (
                                <div className="space-y-3">
                                    {lessons.map((lesson, idx) => (
                                        <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="text-muted-foreground font-medium w-6">{idx + 1}.</div>
                                                {lesson.lessonType === 'VIDEO' ? <Video className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-warning" />}
                                                <div>
                                                    <h4 className="font-semibold text-heading">{lesson.title}</h4>
                                                    <span className="text-xs text-muted-foreground">{lesson.lessonType === 'VIDEO' ? 'Video Lesson' : 'Text Tutorial'}</span>
                                                </div>
                                            </div>
                                            {canEdit && (
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="font-bold text-heading mb-1">No lessons yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Start building your course curriculum.</p>
                                    {canEdit && !isAddingLesson && (
                                        <Button className="gap-2" onClick={() => setIsAddingLesson(true)}>
                                            <PlusCircle className="w-4 h-4" /> Add First Lesson
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block text-xs mb-1">Course Code</span>
                                <span className="font-mono font-medium">{course.courseCode}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs mb-1">Category</span>
                                <span className="font-medium">{course.categoryName}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs mb-1">Difficulty</span>
                                <span className="font-medium">{course.difficulty}</span>
                            </div>
                            {canEdit && (
                                <Button variant="outline" className="w-full mt-4">Edit Details</Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
