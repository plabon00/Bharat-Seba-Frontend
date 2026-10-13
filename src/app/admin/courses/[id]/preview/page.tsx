'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin-api';
import { AdminCoursePreviewResponse, LessonResponse } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, BookOpen, 
    Video, FileText, User, Tag, Award, ExternalLink, Play, Check, Loader2, Sparkles
} from 'lucide-react';
import { Suspense } from 'react';

export default function AdminCoursePreviewPage() {
    return (
        <Suspense fallback={<div className="container p-12 text-center text-slate-500">Loading course preview...</div>}>
            <AdminCoursePreviewContent />
        </Suspense>
    );
}

function AdminCoursePreviewContent() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<AdminCoursePreviewResponse | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Modal state for Request Changes
    const [showChangesModal, setShowChangesModal] = useState(false);
    const [feedbackNotes, setFeedbackNotes] = useState('');

    // Modal state for Rejection
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const fetchPreview = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const data = await adminApi.getCoursePreview(courseId);
            setCourse(data);
            if (data.lessons && data.lessons.length > 0) {
                setSelectedLesson(data.lessons[0]);
            }
        } catch (err: any) {
            console.error('Failed to load course preview:', err);
            setErrorMessage(err.message || 'Failed to load course preview.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchPreview();
        }
    }, [courseId]);

    const handleApprove = async () => {
        if (!confirm(`Are you sure you want to approve and publish "${course?.title}"?`)) return;
        setActionLoading(true);
        try {
            await adminApi.approveCourse(courseId);
            alert('Course approved and published successfully!');
            router.push('/admin/dashboard');
        } catch (err: any) {
            alert('Failed to approve course: ' + (err.message || 'Server error'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackNotes.trim()) {
            alert('Please specify the edits or feedback needed.');
            return;
        }

        setActionLoading(true);
        try {
            await adminApi.requestChanges(courseId, feedbackNotes.trim());
            alert('Change request sent to instructor. The course status is now CHANGES_REQUESTED.');
            setShowChangesModal(false);
            router.push('/admin/dashboard');
        } catch (err: any) {
            alert('Failed to submit change request: ' + (err.message || 'Server error'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectReason.trim()) {
            alert('Please provide a rejection reason.');
            return;
        }

        setActionLoading(true);
        try {
            await adminApi.rejectCourse(courseId, rejectReason.trim());
            alert('Course has been rejected.');
            setShowRejectModal(false);
            router.push('/admin/dashboard');
        } catch (err: any) {
            alert('Failed to reject course: ' + (err.message || 'Server error'));
        } finally {
            setActionLoading(false);
        }
    };

    const getEmbedUrl = (url?: string) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) {
            const id = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-slate-600 font-medium">Loading Course Preview for Admin Review...</p>
            </div>
        );
    }

    if (errorMessage || !course) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-lg text-center">
                <div className="p-8 bg-white border border-red-200 rounded-2xl shadow-sm">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-heading mb-2">Failed to Load Course</h2>
                    <p className="text-sm text-slate-600 mb-6">{errorMessage || 'Course not found.'}</p>
                    <Link href="/admin/dashboard">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            {/* Top Moderation Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
                <div className="container mx-auto px-4 py-3.5 max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600 hover:text-slate-900">
                                <ArrowLeft className="w-4 h-4" /> Admin Dashboard
                            </Button>
                        </Link>
                        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                                {course.courseCode}
                            </span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                course.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                course.status === 'CHANGES_REQUESTED' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                                {course.status === 'PENDING_REVIEW' ? 'AWAITING APPROVAL' : course.status}
                            </span>
                        </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold text-xs gap-1.5"
                            onClick={() => {
                                setFeedbackNotes(course.rejectionReason || '');
                                setShowChangesModal(true);
                            }}
                            disabled={actionLoading}
                        >
                            <AlertTriangle className="w-4 h-4 text-amber-600" /> Suggest Edits / Request Changes
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-bold text-xs gap-1.5"
                            onClick={() => {
                                setRejectReason(course.rejectionReason || '');
                                setShowRejectModal(true);
                            }}
                            disabled={actionLoading}
                        >
                            <XCircle className="w-4 h-4 text-red-600" /> Reject Course
                        </Button>
                        <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                            onClick={handleApprove}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Approve & Publish Course
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Changes Requested / Rejection Notes Banner (if any) */}
                {course.rejectionReason && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 shadow-2xs flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm text-amber-900 mb-1">Current Review Notes / Feedback</h4>
                            <p className="text-xs font-mono bg-white/80 p-2.5 rounded-lg border border-amber-200 text-slate-800 whitespace-pre-wrap">
                                {course.rejectionReason}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Course Details & Instructor Info */}
                    <div className="space-y-6">
                        {/* Course Card */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden border-b border-slate-200">
                                {course.thumbnailUrl ? (
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                        <BookOpen className="w-10 h-10 mb-2 opacity-50" />
                                        <span className="text-xs font-medium">No Thumbnail Provided</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h1 className="text-xl font-bold text-heading leading-snug">{course.title}</h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                                            {course.categoryName}
                                        </span>
                                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
                                            {course.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Submitted At:</span>
                                        <span className="font-semibold text-slate-800">
                                            {course.submittedAt ? new Date(course.submittedAt).toLocaleString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Total Lessons:</span>
                                        <span className="font-semibold text-slate-800">{course.lessons?.length || 0} lessons</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructor Profile Card */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                            <h3 className="text-sm font-bold text-heading mb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> Instructor Account
                            </h3>
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                                    {course.teacherName?.charAt(0) || 'I'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-sm text-slate-800 truncate">{course.teacherName}</div>
                                    <div className="text-xs text-slate-500 font-mono truncate">{course.teacherEmail || 'No email registered'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Course Description */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                            <h3 className="text-sm font-bold text-heading mb-3">Course Description</h3>
                            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {course.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Curriculum & Lesson Inspector */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Interactive Lesson Previewer */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-bold text-heading">
                                        Lesson Content Inspector: <span className="text-primary font-semibold">{selectedLesson?.title || 'None Selected'}</span>
                                    </h3>
                                </div>
                                {selectedLesson && (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                        {selectedLesson.lessonType}
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                {selectedLesson ? (
                                    <div className="space-y-4">
                                        {selectedLesson.lessonType === 'VIDEO' ? (
                                            <div>
                                                {selectedLesson.videoUrl ? (
                                                    selectedLesson.videoUrl.includes('youtube.com') || selectedLesson.videoUrl.includes('youtu.be') ? (
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-sm">
                                                            <iframe
                                                                src={getEmbedUrl(selectedLesson.videoUrl) || ''}
                                                                className="w-full h-full"
                                                                title={selectedLesson.title}
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                                                            <video
                                                                src={selectedLesson.videoUrl}
                                                                controls
                                                                className="w-full h-full max-h-96"
                                                            />
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                                                        No video URL attached to this lesson.
                                                    </div>
                                                )}
                                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                                    <span>Video URL: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">{selectedLesson.videoUrl || 'N/A'}</code></span>
                                                    <span>Duration: {selectedLesson.durationSeconds ? `${Math.floor(selectedLesson.durationSeconds / 60)}m ${selectedLesson.durationSeconds % 60}s` : 'Not specified'}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans min-h-[160px]">
                                                    {selectedLesson.contentText || 'No text content provided for this lesson.'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Select a lesson from the curriculum below to inspect its contents.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Curriculum Lesson List */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-heading flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-slate-500" />
                                    Course Curriculum ({course.lessons?.length || 0} Lessons)
                                </h3>
                                <span className="text-xs text-slate-500">Click any lesson to preview</span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {course.lessons && course.lessons.length > 0 ? (
                                    course.lessons.map((lesson, idx) => {
                                        const isSelected = selectedLesson?.id === lesson.id;
                                        return (
                                            <button
                                                key={lesson.id}
                                                type="button"
                                                onClick={() => setSelectedLesson(lesson)}
                                                className={`w-full text-left p-4 flex items-center justify-between transition-colors ${
                                                    isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <div className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-heading'}`}>
                                                            {lesson.title}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                {lesson.lessonType === 'VIDEO' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                                {lesson.lessonType}
                                                            </span>
                                                            {lesson.durationSeconds ? (
                                                                <span>• {Math.floor(lesson.durationSeconds / 60)}m</span>
                                                            ) : null}
                                                            {lesson.isPreview && (
                                                                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded border border-emerald-200 font-medium">
                                                                    Free Preview
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-slate-400 font-medium shrink-0 ml-2">
                                                    {isSelected ? (
                                                        <span className="text-primary font-bold flex items-center gap-1">
                                                            <Check className="w-3.5 h-3.5" /> Selected
                                                        </span>
                                                    ) : (
                                                        'Inspect'
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        No lessons uploaded for this course yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Request Changes / Suggest Edits */}
            {showChangesModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-heading">Request Edits from Instructor</h3>
                                <p className="text-xs text-slate-500">Suggest changes or required updates before this course can be approved.</p>
                            </div>
                        </div>

                        <form onSubmit={handleRequestChanges} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Feedback & Edit Instructions for Instructor:
                                </label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl p-3 text-xs min-h-[120px] focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-sans"
                                    placeholder="Explain clearly what needs to be changed (e.g. Please update thumbnail with higher resolution, re-upload lesson 2 audio, or add missing course description)..."
                                    value={feedbackNotes}
                                    onChange={e => setFeedbackNotes(e.target.value)}
                                    required
                                />
                                <p className="text-[11px] text-slate-500 mt-1">
                                    The instructor will receive this note in their Course Studio with instructions to revise and re-submit.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowChangesModal(false)}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold gap-1.5"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                    Send Change Request
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Reject Course */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center font-bold shrink-0">
                                <XCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-heading">Reject Course Submission</h3>
                                <p className="text-xs text-slate-500">Provide a mandatory reason for rejecting this course submission.</p>
                            </div>
                        </div>

                        <form onSubmit={handleReject} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Rejection Reason:
                                </label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl p-3 text-xs min-h-[100px] focus:outline-hidden focus:ring-2 focus:ring-red-500 font-sans"
                                    placeholder="Explain why this course cannot be approved..."
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowRejectModal(false)}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                    Confirm Rejection
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
