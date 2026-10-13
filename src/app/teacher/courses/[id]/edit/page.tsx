'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { teacherApi } from '@/lib/api/teacher-api';
import { publicApi } from '@/lib/api/public-api';
import { CourseResponse, LessonResponse, CategoryResponse } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    CheckCircle, AlertCircle, AlertTriangle, Edit, PlusCircle, Trash2, Video, FileText, 
    BookOpen, X, Loader2, ArrowLeft, Upload, ImageIcon, Eye, ExternalLink 
} from 'lucide-react';
import { Suspense } from 'react';

export default function EditCoursePage() {
    return (
        <Suspense fallback={<div className="container p-8">Loading course studio...</div>}>
            <EditCourseContent />
        </Suspense>
    );
}

function EditCourseContent() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [course, setCourse] = useState<CourseResponse | null>(null);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Lesson state
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [isSavingLesson, setIsSavingLesson] = useState(false);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        lessonType: 'VIDEO',
        videoProvider: 'YOUTUBE',
        videoUrl: '',
        contentText: '',
        isPreview: false
    });

    // Edit Course Details modal state
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [isSavingDetails, setIsSavingDetails] = useState(false);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [thumbnailUploadError, setThumbnailUploadError] = useState<string | null>(null);
    const [detailsForm, setDetailsForm] = useState({
        title: '',
        description: '',
        categoryId: '',
        difficulty: 'ALL_LEVELS',
        thumbnailUrl: ''
    });

    const fetchCourseData = async () => {
        setIsLoading(true);
        try {
            const [c, l, cats] = await Promise.all([
                teacherApi.getCourse(courseId),
                teacherApi.getLessons(courseId),
                publicApi.getCategories().catch(() => [])
            ]);
            setCourse(c);
            setLessons(l || []);
            setCategories(cats || []);
            if (c) {
                setDetailsForm({
                    title: c.title || '',
                    description: c.description || '',
                    categoryId: (c as any).categoryId || cats?.find((k: any) => k.name === c.categoryName || k.slug === c.categorySlug)?.id || '',
                    difficulty: c.difficulty || 'ALL_LEVELS',
                    thumbnailUrl: c.thumbnailUrl || ''
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load course');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    const handleSubmitCourse = async () => {
        if (!confirm('Are you sure you want to submit this course for review? You will not be able to edit it while it is pending review.')) return;
        
        setIsSubmitting(true);
        try {
            await teacherApi.submitCourse(courseId);
            await fetchCourseData();
            alert('Course submitted for review successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to submit course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdrawCourse = async () => {
        if (!confirm('Withdraw course submission back to Draft?')) return;
        
        setIsSubmitting(true);
        try {
            await teacherApi.withdrawCourse(courseId);
            await fetchCourseData();
            alert('Course returned to Draft status.');
        } catch (err: any) {
            alert(err.message || 'Failed to withdraw course');
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

    const handleEditLesson = (lesson: LessonResponse) => {
        setEditingLessonId(lesson.id);
        setIsAddingLesson(true);
        setLessonForm({
            title: lesson.title,
            lessonType: lesson.lessonType || 'VIDEO',
            videoProvider: lesson.videoProvider || 'YOUTUBE',
            videoUrl: lesson.videoUrl || '',
            contentText: lesson.contentText || '',
            isPreview: !!lesson.isPreview
        });
    };

    const handleSaveLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonForm.title.trim()) {
            alert('Lesson title is required.');
            return;
        }

        setIsSavingLesson(true);
        try {
            if (editingLessonId) {
                const updated = await teacherApi.updateLesson(courseId, editingLessonId, lessonForm);
                setLessons(lessons.map(l => l.id === editingLessonId ? updated : l));
            } else {
                const newLesson = await teacherApi.addLesson(courseId, lessonForm);
                setLessons([...lessons, newLesson]);
            }
            setIsAddingLesson(false);
            setEditingLessonId(null);
            setLessonForm({ title: '', lessonType: 'VIDEO', videoProvider: 'YOUTUBE', videoUrl: '', contentText: '', isPreview: false });
        } catch (err: any) {
            alert(err.message || 'Failed to save lesson');
        } finally {
            setIsSavingLesson(false);
        }
    };

    // Thumbnail upload inside edit details modal
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setThumbnailUploadError('Please select a valid image file.');
            return;
        }

        setIsUploadingThumbnail(true);
        setThumbnailUploadError(null);

        try {
            const res = await teacherApi.uploadThumbnail(file);
            if (res?.url) {
                setDetailsForm(prev => ({ ...prev, thumbnailUrl: res.url }));
            }
        } catch (err: any) {
            console.error('Thumbnail upload failed:', err);
            setThumbnailUploadError(err.message || 'Failed to upload image to ImgBB.');
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingDetails(true);
        try {
            const payload = {
                title: detailsForm.title.trim(),
                description: detailsForm.description.trim(),
                categoryId: detailsForm.categoryId || undefined,
                difficulty: detailsForm.difficulty,
                thumbnailUrl: detailsForm.thumbnailUrl?.trim() ? detailsForm.thumbnailUrl.trim() : null
            };

            const updated = await teacherApi.updateCourse(courseId, payload);
            setCourse(updated);
            setIsEditingDetails(false);
        } catch (err: any) {
            alert(err.message || 'Failed to update course details');
        } finally {
            setIsSavingDetails(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
                <p className="text-muted-foreground text-sm">Loading course studio...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="container mx-auto p-12 max-w-lg text-center">
                <div className="p-8 bg-white border rounded-2xl shadow-sm">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
                    <h2 className="text-xl font-bold mb-2">Error Loading Course</h2>
                    <p className="text-sm text-muted-foreground mb-4">{error || 'Course not found'}</p>
                    <Link href="/teacher/courses">
                        <Button variant="outline">Back to Course Studio</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const canEdit = course.status === 'DRAFT' || course.status === 'REJECTED' || course.status === 'CHANGES_REQUESTED';
    const canSubmit = canEdit;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <Link href="/teacher/courses" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Courses
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-heading flex items-center gap-3">
                        <span className="line-clamp-1">{course.title}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                            course.status === 'PUBLISHED' ? 'bg-emerald-600 text-white' : 
                            course.status === 'PENDING_REVIEW' ? 'bg-amber-500 text-white' :
                            course.status === 'CHANGES_REQUESTED' ? 'bg-amber-600 text-white font-bold' :
                            course.status === 'REJECTED' ? 'bg-red-600 text-white' :
                            'bg-slate-700 text-white'
                        }`}>
                            {course.status === 'CHANGES_REQUESTED' ? 'CHANGES REQUESTED' : course.status}
                        </span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-2">
                    {course.status === 'PUBLISHED' && (
                        <Link href={`/courses/${course.courseCode}`}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Eye className="w-4 h-4" /> View Public Page
                            </Button>
                        </Link>
                    )}
                    {course.status === 'PENDING_REVIEW' && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleWithdrawCourse}
                            disabled={isSubmitting}
                        >
                            Withdraw Submission
                        </Button>
                    )}
                    {canEdit && (
                        <Button 
                            onClick={handleSubmitCourse} 
                            disabled={!canSubmit || isSubmitting}
                            size="sm"
                            className={canSubmit ? 'bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5' : 'gap-1.5'}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" /> {course.status === 'CHANGES_REQUESTED' ? 'Re-Submit for Review' : 'Submit for Review'}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* CHANGES REQUESTED Notification Banner */}
            {course.status === 'CHANGES_REQUESTED' && (
                <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-5 rounded-2xl mb-6 shadow-xs flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                                Admin Requested Edits Before Approval
                                <span className="text-[11px] font-semibold bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                                    Action Required
                                </span>
                            </h4>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            The administrator has reviewed this course and requested the following changes:
                        </p>
                        <div className="bg-white/95 border border-amber-200 p-3.5 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap shadow-2xs">
                            {course.rejectionReason || 'Please review your course details and lessons, apply the necessary updates, and re-submit for review.'}
                        </div>
                        <p className="text-[11px] text-amber-700 font-medium">
                            💡 You can edit course information and curriculum lessons below. After making the necessary updates, click <strong>"Re-Submit for Review"</strong> above to send the course back to the admin.
                        </p>
                    </div>
                </div>
            )}

            {/* Notification Banners */}
            {course.status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-sm">Course Needs Revision</h4>
                        {course.rejectionReason && (
                            <p className="text-xs font-mono bg-white/70 p-2 rounded border border-red-100 text-slate-800">
                                {course.rejectionReason}
                            </p>
                        )}
                        <p className="text-xs mt-0.5">Please review your curriculum, adjust lessons or details, and re-submit for review.</p>
                    </div>
                </div>
            )}

            {course.status === 'PENDING_REVIEW' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                        <h4 className="font-semibold text-sm">Under Review</h4>
                        <p className="text-xs mt-0.5">Your course is currently being reviewed by administrators. You cannot edit lessons while review is pending.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Curriculum & Lessons (2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <CardTitle className="text-lg">Curriculum & Lessons</CardTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">Organize videos and tutorials for students.</p>
                            </div>
                            {canEdit && !isAddingLesson && (
                                <Button size="sm" onClick={() => { setIsAddingLesson(true); setEditingLessonId(null); setLessonForm({ title: '', lessonType: 'VIDEO', videoProvider: 'YOUTUBE', videoUrl: '', contentText: '', isPreview: false }); }} className="gap-1.5">
                                    <PlusCircle className="w-4 h-4" /> Add Lesson
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="pt-4">
                            {/* Lesson Add/Edit Form */}
                            {isAddingLesson && (
                                <div className="p-4 border rounded-xl bg-slate-50/70 mb-6 space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h4 className="font-bold text-sm text-heading">
                                            {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
                                        </h4>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => { setIsAddingLesson(false); setEditingLessonId(null); }}
                                            className="h-8 w-8"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <form onSubmit={handleSaveLesson} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lessonTitle" className="text-xs font-semibold">Lesson Title *</Label>
                                            <Input 
                                                id="lessonTitle" 
                                                value={lessonForm.title} 
                                                onChange={e => setLessonForm({...lessonForm, title: e.target.value})} 
                                                placeholder="e.g., Module 1: Introduction to Components"
                                                className="h-9 text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="lessonType" className="text-xs font-semibold">Lesson Format</Label>
                                            <select 
                                                id="lessonType"
                                                value={lessonForm.lessonType}
                                                onChange={e => setLessonForm({...lessonForm, lessonType: e.target.value})}
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            >
                                                <option value="VIDEO">Video Lesson</option>
                                                <option value="TEXT">Text Tutorial</option>
                                            </select>
                                        </div>
                                        
                                        {lessonForm.lessonType === 'VIDEO' ? (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="videoUrl" className="text-xs font-semibold">Video URL (YouTube / MP4)</Label>
                                                <Input 
                                                    id="videoUrl" 
                                                    value={lessonForm.videoUrl} 
                                                    onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})} 
                                                    placeholder="https://youtube.com/watch?v=..."
                                                    className="h-9 text-sm font-mono"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="contentText" className="text-xs font-semibold">Tutorial Text Content</Label>
                                                <textarea 
                                                    id="contentText" 
                                                    rows={5}
                                                    value={lessonForm.contentText} 
                                                    onChange={e => setLessonForm({...lessonForm, contentText: e.target.value})} 
                                                    placeholder="Write lesson notes, markdown explanations, or code examples..."
                                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-1">
                                            <input 
                                                type="checkbox"
                                                id="isPreview"
                                                checked={lessonForm.isPreview}
                                                onChange={e => setLessonForm({...lessonForm, isPreview: e.target.checked})}
                                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                            />
                                            <Label htmlFor="isPreview" className="text-xs text-slate-700 cursor-pointer">
                                                Allow Free Preview (accessible to non-enrolled students)
                                            </Label>
                                        </div>
                                        
                                        <div className="flex justify-end gap-2 pt-2 border-t">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => { setIsAddingLesson(false); setEditingLessonId(null); }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" size="sm" disabled={isSavingLesson} className="gap-1.5">
                                                {isSavingLesson ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                {editingLessonId ? 'Update Lesson' : 'Save Lesson'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Lesson List */}
                            {lessons.length > 0 ? (
                                <div className="space-y-2.5">
                                    {lessons.map((lesson, idx) => (
                                        <div key={lesson.id} className="flex items-center justify-between p-3.5 border rounded-xl bg-white hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                    {lesson.lessonType === 'VIDEO' ? (
                                                        <Video className="w-4 h-4 text-primary" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-amber-500" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-sm text-heading truncate">{lesson.title}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                        <span>{lesson.lessonType === 'VIDEO' ? 'Video' : 'Text'}</span>
                                                        {lesson.isPreview && (
                                                            <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                                                                Free Preview
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {canEdit && (
                                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditLesson(lesson)}>
                                                        <Edit className="w-3.5 h-3.5 text-slate-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteLesson(lesson.id)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                                    <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <h3 className="font-bold text-heading text-sm mb-1">No lessons added yet</h3>
                                    <p className="text-xs text-muted-foreground mb-4">Add your video or text lessons, or submit the curriculum outline for review.</p>
                                    {canEdit && !isAddingLesson && (
                                        <Button size="sm" className="gap-1.5" onClick={() => setIsAddingLesson(true)}>
                                            <PlusCircle className="w-4 h-4" /> Add First Lesson
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Course Metadata & Thumbnail Sidebar (1 Column) */}
                <div className="space-y-6">
                    <Card className="border border-slate-200 shadow-sm overflow-hidden">
                        {/* Course Thumbnail Display */}
                        <div className="w-full h-44 bg-slate-100 flex items-center justify-center relative border-b overflow-hidden">
                            {course.thumbnailUrl ? (
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon className="w-10 h-10 mb-1 opacity-40" />
                                    <span className="text-xs font-medium">No Thumbnail</span>
                                </div>
                            )}
                        </div>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-muted-foreground block text-[11px] mb-0.5">Course Code</span>
                                <span className="font-mono font-bold text-sm text-heading">{course.courseCode}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px] mb-0.5">Category</span>
                                <span className="font-medium text-slate-800">{course.categoryName || 'Unassigned'}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px] mb-0.5">Difficulty</span>
                                <span className="font-medium text-slate-800">{course.difficulty}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px] mb-0.5">Description</span>
                                <p className="text-slate-600 line-clamp-3">{course.description}</p>
                            </div>

                            {canEdit && (
                                <Button 
                                    variant="outline" 
                                    className="w-full mt-3 gap-1.5" 
                                    size="sm"
                                    onClick={() => setIsEditingDetails(true)}
                                >
                                    <Edit className="w-3.5 h-3.5" /> Edit Details & Thumbnail
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Course Details Modal */}
            {isEditingDetails && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border">
                        <div className="flex items-center justify-between pb-3 border-b mb-4">
                            <h3 className="font-bold text-lg text-heading">Edit Course Details</h3>
                            <button onClick={() => setIsEditingDetails(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDetails} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="editTitle" className="text-xs font-semibold">Title *</Label>
                                <Input 
                                    id="editTitle" 
                                    value={detailsForm.title} 
                                    onChange={e => setDetailsForm({...detailsForm, title: e.target.value})} 
                                    className="h-9 text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="editDesc" className="text-xs font-semibold">Description *</Label>
                                <textarea 
                                    id="editDesc" 
                                    rows={3}
                                    value={detailsForm.description} 
                                    onChange={e => setDetailsForm({...detailsForm, description: e.target.value})} 
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="editCat" className="text-xs font-semibold">Category</Label>
                                    <select 
                                        id="editCat"
                                        value={detailsForm.categoryId} 
                                        onChange={e => setDetailsForm({...detailsForm, categoryId: e.target.value})} 
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="editDiff" className="text-xs font-semibold">Difficulty</Label>
                                    <select 
                                        id="editDiff"
                                        value={detailsForm.difficulty} 
                                        onChange={e => setDetailsForm({...detailsForm, difficulty: e.target.value})} 
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                                    >
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                        <option value="ALL_LEVELS">All Levels</option>
                                    </select>
                                </div>
                            </div>

                            {/* Thumbnail Upload section in Modal */}
                            <div className="space-y-2 pt-2 border-t">
                                <Label className="text-xs font-semibold flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5 text-primary" /> Thumbnail Image (ImgBB)
                                </Label>

                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleThumbnailUpload} 
                                    className="hidden" 
                                />

                                {detailsForm.thumbnailUrl ? (
                                    <div className="flex items-center gap-3 p-2.5 bg-slate-50 border rounded-lg">
                                        <img 
                                            src={detailsForm.thumbnailUrl} 
                                            alt="Preview" 
                                            className="w-16 h-12 object-cover rounded border shrink-0" 
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-mono text-muted-foreground truncate">{detailsForm.thumbnailUrl}</p>
                                            <div className="flex gap-2 mt-1">
                                                <Button 
                                                    type="button" 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="h-7 text-xs px-2"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploadingThumbnail}
                                                >
                                                    Change Image
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-7 text-xs px-2 text-destructive"
                                                    onClick={() => setDetailsForm(prev => ({ ...prev, thumbnailUrl: '' }))}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full text-xs gap-1.5 h-9"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploadingThumbnail}
                                    >
                                        {isUploadingThumbnail ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to ImgBB...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-3.5 h-3.5" /> Upload Image File to ImgBB
                                            </>
                                        )}
                                    </Button>
                                )}

                                {thumbnailUploadError && (
                                    <p className="text-[11px] text-destructive">{thumbnailUploadError}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t">
                                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingDetails(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm" disabled={isSavingDetails} className="gap-1.5">
                                    {isSavingDetails ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
