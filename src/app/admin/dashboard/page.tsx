'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { dashboardApi, AdminDashboardResponse } from '@/lib/api/dashboard-api';
import { adminApi } from '@/lib/api/admin-api';
import { publicApi } from '@/lib/api/public-api';
import { CourseResponse, UserResponse, CategoryResponse, AdminCoursePreviewResponse, LessonResponse } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    BookOpen, Users, CheckCircle, AlertTriangle, ShieldAlert, 
    Trash2, Eye, EyeOff, Search, PlusCircle, Lock, ShieldCheck, 
    RefreshCw, Tag, XCircle, X, Check, ArrowUpRight, Clock, Mail,
    Video, FileText, Sparkles, ExternalLink, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'pending' | 'courses' | 'users' | 'categories'>('pending');
    const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
    const [pendingCourses, setPendingCourses] = useState<CourseResponse[]>([]);
    const [allCourses, setAllCourses] = useState<CourseResponse[]>([]);
    const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Search & Filter state
    const [pendingSearch, setPendingSearch] = useState('');
    const [pendingStatusFilter, setPendingStatusFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'CHANGES_REQUESTED'>('ALL');
    const [courseSearch, setCourseSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [courseStatusFilter, setCourseStatusFilter] = useState('ALL');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // In-App Course Preview Modal State
    const [previewCourseId, setPreviewCourseId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<AdminCoursePreviewResponse | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [selectedPreviewLesson, setSelectedPreviewLesson] = useState<LessonResponse | null>(null);

    // Request Changes Modal State
    const [requestChangesModal, setRequestChangesModal] = useState<{ id: string; title: string; currentNotes?: string } | null>(null);
    const [changeNotes, setChangeNotes] = useState('');
    const [isSubmittingChanges, setIsSubmittingChanges] = useState(false);

    // Reject Course Modal State
    const [rejectModal, setRejectModal] = useState<{ id: string; title: string; currentReason?: string } | null>(null);
    const [rejectNotes, setRejectNotes] = useState('');
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    // New Category Modal
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', displayOrder: 1 });

    const fetchAllData = async () => {
        setIsRefreshing(true);
        setErrorMessage(null);
        try {
            const [statsData, pendingData, coursesData, usersData, catsData] = await Promise.all([
                dashboardApi.getAdminDashboard().catch(err => {
                    console.error('Failed to load admin stats:', err);
                    return null;
                }),
                adminApi.getPendingCourses(0, 100).catch(err => {
                    console.error('Failed to load pending courses:', err);
                    setErrorMessage('Failed to load pending courses: ' + (err.message || 'Server error'));
                    return { content: [] };
                }),
                adminApi.getCourses(0, 100).catch(err => {
                    console.error('Failed to load all courses:', err);
                    return { content: [] };
                }),
                adminApi.getUsers(0, 100).catch(err => {
                    console.error('Failed to load users:', err);
                    return { content: [] };
                }),
                publicApi.getCategories().catch(err => {
                    console.error('Failed to load categories:', err);
                    return [];
                })
            ]);

            const pendingList = (pendingData as any)?.content || (Array.isArray(pendingData) ? pendingData : []);
            const coursesList = (coursesData as any)?.content || (Array.isArray(coursesData) ? coursesData : []);
            const usersList = (usersData as any)?.content || (Array.isArray(usersData) ? usersData : []);
            const catsList = Array.isArray(catsData) ? catsData : [];

            setStats(statsData);
            setPendingCourses(pendingList);
            setAllCourses(coursesList);
            setAllUsers(usersList);
            setCategories(catsList);
        } catch (err: any) {
            console.error('Failed to load admin data:', err);
            setErrorMessage(err.message || 'Failed to connect to backend server');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (user && user.role === 'ADMIN') {
            fetchAllData();
        } else {
            setIsLoading(false);
        }
    }, [user, authLoading]);

    // ACCESS CONTROL: ONLY ADMIN USER CAN ACCESS
    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-muted-foreground text-sm font-medium">Verifying admin credentials...</p>
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="container mx-auto px-4 py-20 max-w-lg text-center">
                <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-heading mb-2">Admin Credentials Required</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        Access to the Admin Panel is restricted. Only authorized administrator accounts with valid credentials can access moderation tools, user management, and course controls.
                    </p>
                    <div className="space-y-3">
                        <Link href="/login">
                            <Button className="w-full">Sign In with Admin Account</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full">Return to Homepage</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ACTIONS FOR COURSES & MODERATION
    const handleOpenPreview = async (id: string) => {
        setPreviewCourseId(id);
        setPreviewLoading(true);
        setPreviewData(null);
        setSelectedPreviewLesson(null);
        try {
            const data = await adminApi.getCoursePreview(id);
            setPreviewData(data);
            if (data.lessons && data.lessons.length > 0) {
                setSelectedPreviewLesson(data.lessons[0]);
            }
        } catch (err: any) {
            alert('Failed to load course preview: ' + (err.message || 'Server error'));
            setPreviewCourseId(null);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleApproveCourse = async (id: string, title: string) => {
        if (!confirm(`Approve and publish "${title}" to the public course catalog?`)) return;
        try {
            await adminApi.approveCourse(id);
            alert('Course approved and published successfully.');
            if (previewCourseId === id) setPreviewCourseId(null);
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to approve course');
        }
    };

    const handleSubmitRequestChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestChangesModal || !changeNotes.trim()) return;
        setIsSubmittingChanges(true);
        try {
            await adminApi.requestChanges(requestChangesModal.id, changeNotes.trim());
            alert(`Requested edits for "${requestChangesModal.title}". The instructor can now view your notes in Course Studio.`);
            setRequestChangesModal(null);
            setChangeNotes('');
            if (previewCourseId === requestChangesModal.id) setPreviewCourseId(null);
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to submit change request');
        } finally {
            setIsSubmittingChanges(false);
        }
    };

    const handleSubmitReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectModal || !rejectNotes.trim()) return;
        setIsSubmittingReject(true);
        try {
            await adminApi.rejectCourse(rejectModal.id, rejectNotes.trim());
            alert(`Course "${rejectModal.title}" rejected with reason.`);
            setRejectModal(null);
            setRejectNotes('');
            if (previewCourseId === rejectModal.id) setPreviewCourseId(null);
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to reject course');
        } finally {
            setIsSubmittingReject(false);
        }
    };

    const handleHideCourse = async (id: string, title: string) => {
        if (!confirm(`Hide "${title}" from the public course catalog?`)) return;
        try {
            await adminApi.hideCourse(id);
            alert('Course has been hidden/archived.');
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to hide course');
        }
    };

    const handleUnpublishCourse = async (id: string, title: string) => {
        if (!confirm(`Unpublish "${title}" back to Draft?`)) return;
        try {
            await adminApi.unpublishCourse(id);
            alert('Course unpublished and returned to Draft status.');
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to unpublish course');
        }
    };

    const handleDeleteCourse = async (id: string, title: string) => {
        if (!confirm(`PERMANENTLY DELETE course "${title}"? This will delete all lessons and curriculum. This action CANNOT be undone.`)) return;
        try {
            await adminApi.deleteCourse(id);
            alert('Course permanently deleted.');
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to delete course');
        }
    };

    // ACTIONS FOR USERS
    const handleToggleUserRole = async (targetUser: UserResponse) => {
        const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
        if (!confirm(`Change role of "${targetUser.fullName || targetUser.email}" to ${newRole}?`)) return;
        try {
            await adminApi.updateUserRole(targetUser.id, newRole);
            alert(`User role updated to ${newRole}.`);
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to update role');
        }
    };

    const handleToggleUserStatus = async (targetUser: UserResponse) => {
        const newStatus = targetUser.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        if (!confirm(`${newStatus === 'SUSPENDED' ? 'Suspend' : 'Reactivate'} account for "${targetUser.email}"?`)) return;
        try {
            await adminApi.updateUserStatus(targetUser.id, newStatus);
            alert(`User status updated to ${newStatus}.`);
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to update user status');
        }
    };

    const handleDeleteUser = async (targetUser: UserResponse) => {
        if (targetUser.id === user.id) {
            alert('You cannot delete your own active admin account.');
            return;
        }
        if (!confirm(`PERMANENTLY DELETE user "${targetUser.fullName} (${targetUser.email})"? This will also delete their enrolled progress and courses. This cannot be undone.`)) return;
        try {
            await adminApi.deleteUser(targetUser.id);
            alert('User deleted successfully.');
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to delete user');
        }
    };

    // ACTIONS FOR CATEGORIES
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createCategory({
                name: catForm.name.trim(),
                slug: catForm.slug.trim().toLowerCase(),
                description: catForm.description.trim(),
                displayOrder: catForm.displayOrder,
                isActive: true
            });
            alert('Category created successfully!');
            setIsCreatingCategory(false);
            setCatForm({ name: '', slug: '', description: '', displayOrder: 1 });
            fetchAllData();
        } catch (err: any) {
            alert(err.message || 'Failed to create category');
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

    // Filter pending courses
    const filteredPendingCourses = pendingCourses.filter(c => {
        if (pendingStatusFilter !== 'ALL' && c.status !== pendingStatusFilter) {
            return false;
        }
        if (!pendingSearch.trim()) return true;
        const q = pendingSearch.toLowerCase().trim();
        return (c.title && c.title.toLowerCase().includes(q)) ||
               (c.courseCode && c.courseCode.toLowerCase().includes(q)) ||
               (c.teacherName && c.teacherName.toLowerCase().includes(q)) ||
               (c.teacherEmail && c.teacherEmail.toLowerCase().includes(q)) ||
               (c.categoryName && c.categoryName.toLowerCase().includes(q));
    });

    const pendingReviewCount = pendingCourses.filter(c => c.status === 'PENDING_REVIEW').length;
    const changesRequestedCount = pendingCourses.filter(c => c.status === 'CHANGES_REQUESTED').length;

    // Filter courses
    const filteredCourses = allCourses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                              (c.courseCode && c.courseCode.toLowerCase().includes(courseSearch.toLowerCase())) ||
                              (c.teacherName && c.teacherName.toLowerCase().includes(courseSearch.toLowerCase())) ||
                              (c.teacherEmail && c.teacherEmail.toLowerCase().includes(courseSearch.toLowerCase()));
        const matchesStatus = courseStatusFilter === 'ALL' || c.status === courseStatusFilter;
        return matchesSearch && matchesStatus;
    });

    // Filter users
    const filteredUsers = allUsers.filter(u => {
        return (u.fullName && u.fullName.toLowerCase().includes(userSearch.toLowerCase())) ||
               (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()));
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" /> Full Admin Control Panel
                    </div>
                    <h1 className="text-3xl font-black text-heading tracking-tight">Admin Headquarters</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Manage course approvals, platform-wide course moderation, user accounts, and categories.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchAllData} 
                        disabled={isRefreshing}
                        className="gap-1.5 text-xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{errorMessage}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setErrorMessage(null)} className="h-6 w-6 p-0 text-red-700 hover:bg-red-100">
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border border-slate-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Users</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                        <div className="text-2xl font-black text-heading">{stats?.totalUsers || allUsers.length}</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Courses</CardTitle>
                        <BookOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                        <div className="text-2xl font-black text-heading">{stats?.totalCourses || allCourses.length}</div>
                    </CardContent>
                </Card>

                <Card className={`border shadow-xs ${pendingCourses.length > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/80'}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700">Requires Approval</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                        <div className="text-2xl font-black text-amber-700">{pendingCourses.length}</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</CardTitle>
                        <Tag className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                        <div className="text-2xl font-black text-heading">{categories.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'pending'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Pending Approvals
                    {pendingCourses.length > 0 && (
                        <span className="bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                            {pendingCourses.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('courses')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'courses'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    All Courses Moderation ({allCourses.length})
                </button>

                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'users'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    User Management ({allUsers.length})
                </button>

                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'categories'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <Tag className="w-3.5 h-3.5" />
                    Categories ({categories.length})
                </button>
            </div>

            {/* TAB 1: PENDING COURSES FOR APPROVAL (DEDICATED TABLE) */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {/* Header & Filter Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                                    Pending Course Approvals
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {pendingCourses.length} in review queue
                                    </span>
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Inspect curriculum & lessons, suggest changes to instructors, or approve & publish.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            {/* Status Sub-Filters */}
                            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                                <button
                                    onClick={() => setPendingStatusFilter('ALL')}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${
                                        pendingStatusFilter === 'ALL'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    All ({pendingCourses.length})
                                </button>
                                <button
                                    onClick={() => setPendingStatusFilter('PENDING_REVIEW')}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${
                                        pendingStatusFilter === 'PENDING_REVIEW'
                                            ? 'bg-white text-amber-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Awaiting Review ({pendingReviewCount})
                                </button>
                                <button
                                    onClick={() => setPendingStatusFilter('CHANGES_REQUESTED')}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${
                                        pendingStatusFilter === 'CHANGES_REQUESTED'
                                            ? 'bg-white text-orange-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Changes Requested ({changesRequestedCount})
                                </button>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input 
                                    placeholder="Search title, instructor, email..." 
                                    value={pendingSearch}
                                    onChange={e => setPendingSearch(e.target.value)}
                                    className="pl-9 h-9 text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dedicated Pending Approvals Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                                    <tr>
                                        <th className="py-3.5 px-4">Course Info</th>
                                        <th className="py-3.5 px-4">Instructor Account</th>
                                        <th className="py-3.5 px-4">Category</th>
                                        <th className="py-3.5 px-4">Difficulty</th>
                                        <th className="py-3.5 px-4">Submitted At</th>
                                        <th className="py-3.5 px-4 text-center">Status</th>
                                        <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPendingCourses.length > 0 ? (
                                        filteredPendingCourses.map(course => (
                                            <tr key={course.id} className="hover:bg-amber-50/20 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                            {course.thumbnailUrl ? (
                                                                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <BookOpen className="w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 max-w-xs">
                                                            <div className="font-bold text-heading truncate text-sm" title={course.title}>
                                                                {course.title}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                                                    {course.courseCode}
                                                                </span>
                                                            </div>
                                                            {course.status === 'CHANGES_REQUESTED' && course.rejectionReason && (
                                                                <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded truncate" title={course.rejectionReason}>
                                                                    <span className="font-semibold">Edits:</span> {course.rejectionReason}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-slate-800">
                                                            {course.teacherName || 'Instructor'}
                                                        </div>
                                                        {course.teacherEmail && (
                                                            <div className="text-[11px] text-slate-500 font-mono truncate" title={course.teacherEmail}>
                                                                {course.teacherEmail}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md text-[11px]">
                                                        {course.categoryName || 'General'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-[11px] font-semibold text-slate-600">
                                                        {course.difficulty}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        {course.submittedAt ? new Date(course.submittedAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Pending'}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {course.status === 'PENDING_REVIEW' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                            UNDER REVIEW
                                                        </span>
                                                    ) : course.status === 'CHANGES_REQUESTED' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                                            <AlertTriangle className="w-3 h-3 text-orange-600" />
                                                            CHANGES REQUESTED
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                                            {course.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-xs gap-1 border-slate-200 text-slate-700 hover:text-slate-900 bg-white"
                                                        title="Open in-app preview"
                                                        onClick={() => handleOpenPreview(course.id)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-slate-500" /> Preview
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white text-xs gap-1 font-bold transition-colors"
                                                        title="Suggest edits or request changes from instructor"
                                                        onClick={() => {
                                                            setRequestChangesModal({ id: course.id, title: course.title, currentNotes: course.rejectionReason });
                                                            setChangeNotes(course.rejectionReason || '');
                                                        }}
                                                    >
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Suggest Edits
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs gap-1.5 font-bold transition-colors"
                                                        onClick={() => handleApproveCourse(course.id, course.title)}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white text-xs gap-1.5 font-bold transition-colors"
                                                        onClick={() => {
                                                            setRejectModal({ id: course.id, title: course.title, currentReason: course.rejectionReason });
                                                            setRejectNotes(course.rejectionReason || '');
                                                        }}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-16">
                                                <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                                                <h3 className="text-base font-bold text-heading mb-1">
                                                    {pendingSearch ? 'No matching pending courses found' : 'Queue is Clear!'}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {pendingSearch ? 'Try a different search query.' : 'All submitted courses have been reviewed and processed.'}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ALL COURSES (DELETE & HIDE CONTROLS) */}
            {activeTab === 'courses' && (
                <div className="space-y-4">
                    {/* Search & Status Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input 
                                placeholder="Search courses by title, author, or code..." 
                                value={courseSearch}
                                onChange={e => setCourseSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-slate-500">Status:</Label>
                            <select 
                                value={courseStatusFilter}
                                onChange={e => setCourseStatusFilter(e.target.value)}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="PENDING_REVIEW">Pending Review</option>
                                <option value="DRAFT">Draft</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="ARCHIVED">Archived / Hidden</option>
                            </select>
                        </div>
                    </div>

                    {/* Courses Table / List */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                                    <tr>
                                        <th className="py-3 px-4">Course</th>
                                        <th className="py-3 px-4">Instructor</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Admin Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.map(course => (
                                            <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border">
                                                            {course.thumbnailUrl ? (
                                                                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <BookOpen className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-heading truncate">{course.title}</div>
                                                            <div className="text-[11px] font-mono text-slate-400">{course.courseCode}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-medium text-slate-700">
                                                    <div>{course.teacherName || 'Instructor'}</div>
                                                    {course.teacherEmail && (
                                                        <div className="text-[11px] text-slate-400 font-mono truncate" title={course.teacherEmail}>
                                                            {course.teacherEmail}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600">
                                                    {course.categoryName}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                                                        course.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' :
                                                        course.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                                    {course.status === 'PUBLISHED' ? (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-xs text-amber-700 hover:bg-amber-50"
                                                            title="Hide from public catalog"
                                                            onClick={() => handleHideCourse(course.id, course.title)}
                                                        >
                                                            <EyeOff className="w-3.5 h-3.5 mr-1" /> Hide Course
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-xs text-emerald-700 hover:bg-emerald-50"
                                                            title="Publish Course"
                                                            onClick={() => handleApproveCourse(course.id, course.title)}
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Publish
                                                        </Button>
                                                    )}

                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        title="Delete Course permanently"
                                                        onClick={() => handleDeleteCourse(course.id, course.title)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400">
                                                No courses match your query.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: USER MANAGEMENT (DELETE USER & ROLES) */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input 
                                placeholder="Search users by name or email address..." 
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground">{filteredUsers.length} total users</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                                    <tr>
                                        <th className="py-3 px-4">User</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Admin Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                                                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <span className="font-bold text-heading">{u.fullName || 'User'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-slate-600">
                                                    {u.email}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        u.accountStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {u.accountStatus}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-xs"
                                                        onClick={() => handleToggleUserRole(u)}
                                                    >
                                                        {u.role === 'ADMIN' ? 'Demote to User' : 'Make Admin'}
                                                    </Button>

                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className={`text-xs ${u.accountStatus === 'ACTIVE' ? 'text-amber-700' : 'text-emerald-700'}`}
                                                        onClick={() => handleToggleUserStatus(u)}
                                                    >
                                                        {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                                    </Button>

                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        disabled={u.id === user.id}
                                                        onClick={() => handleDeleteUser(u)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: CATEGORY MANAGEMENT */}
            {activeTab === 'categories' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-heading">Course Categories</h2>
                        <Button size="sm" onClick={() => setIsCreatingCategory(true)} className="gap-1.5 text-xs">
                            <PlusCircle className="w-3.5 h-3.5" /> Add Category
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(cat => (
                            <Card key={cat.id} className="border border-slate-200 rounded-2xl p-4 shadow-xs">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-sm text-heading">{cat.name}</h4>
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                        {cat.slug}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{cat.description || 'No description'}</p>
                            </Card>
                        ))}
                    </div>

                    {/* New Category Modal */}
                    {isCreatingCategory && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border">
                                <div className="flex items-center justify-between pb-3 border-b mb-4">
                                    <h3 className="font-bold text-base text-heading">Create New Category</h3>
                                    <button onClick={() => setIsCreatingCategory(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateCategory} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">Category Name *</Label>
                                        <Input 
                                            value={catForm.name} 
                                            onChange={e => {
                                                const name = e.target.value;
                                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                                setCatForm({ ...catForm, name, slug });
                                            }}
                                            placeholder="e.g. Artificial Intelligence" 
                                            className="h-9 text-xs" 
                                            required 
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">URL Slug *</Label>
                                        <Input 
                                            value={catForm.slug} 
                                            onChange={e => setCatForm({ ...catForm, slug: e.target.value })}
                                            placeholder="e.g. artificial-intelligence" 
                                            className="h-9 text-xs font-mono" 
                                            required 
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">Description</Label>
                                        <textarea 
                                            value={catForm.description} 
                                            onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                                            rows={2} 
                                            className="w-full rounded-md border border-input p-2 text-xs" 
                                            placeholder="Brief overview of category topics..." 
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-3 border-t">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setIsCreatingCategory(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" size="sm">
                                            Save Category
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

                    {/* Quick Course Preview Modal */}
                    {previewCourseId && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                {/* Modal Header */}
                                <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-base text-heading truncate">
                                                {previewData?.title || 'Course Preview'}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="font-mono bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-semibold text-[11px]">
                                                    {previewData?.courseCode}
                                                </span>
                                                <span>•</span>
                                                <span>{previewData?.teacherName || 'Instructor'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link href={`/admin/courses/${previewCourseId}/preview`} target="_blank">
                                            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                                                <ExternalLink className="w-3.5 h-3.5" /> Full Page
                                            </Button>
                                        </Link>
                                        <button 
                                            onClick={() => setPreviewCourseId(null)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                    {previewLoading ? (
                                        <div className="py-20 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                                            <p className="text-xs text-slate-500">Loading course curriculum & preview...</p>
                                        </div>
                                    ) : previewData ? (
                                        <div className="space-y-6">
                                            {/* Alert if has review feedback */}
                                            {previewData.rejectionReason && (
                                                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                                                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-bold">Active Feedback / Notes:</span>
                                                        <p className="font-mono mt-0.5 bg-white/70 p-2 rounded border border-amber-100 text-slate-800">
                                                            {previewData.rejectionReason}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2 Column Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Left: Thumbnail & Details */}
                                                <div className="space-y-4">
                                                    <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                                                        {previewData.thumbnailUrl ? (
                                                            <img src={previewData.thumbnailUrl} alt={previewData.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                                <BookOpen className="w-8 h-8 mb-1 opacity-50" />
                                                                <span className="text-[11px]">No Thumbnail</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Instructor:</span>
                                                            <span className="font-semibold text-slate-800">{previewData.teacherName}</span>
                                                        </div>
                                                        {previewData.teacherEmail && (
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-500">Email:</span>
                                                                <span className="font-mono text-[11px] text-slate-700 truncate max-w-[150px]">{previewData.teacherEmail}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Category:</span>
                                                            <span className="font-semibold text-slate-800">{previewData.categoryName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Difficulty:</span>
                                                            <span className="font-semibold text-slate-800">{previewData.difficulty}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Status:</span>
                                                            <span className="font-bold text-amber-700">{previewData.status}</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-700 mb-1">Description</h4>
                                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                                                            {previewData.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right: Lesson Inspector & Curriculum */}
                                                <div className="md:col-span-2 space-y-4">
                                                    {/* Lesson Inspector */}
                                                    {selectedPreviewLesson ? (
                                                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 p-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-bold text-xs text-heading flex items-center gap-1.5">
                                                                    {selectedPreviewLesson.lessonType === 'VIDEO' ? <Video className="w-3.5 h-3.5 text-primary" /> : <FileText className="w-3.5 h-3.5 text-primary" />}
                                                                    {selectedPreviewLesson.title}
                                                                </span>
                                                                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                                                                    {selectedPreviewLesson.lessonType}
                                                                </span>
                                                            </div>

                                                            {selectedPreviewLesson.lessonType === 'VIDEO' ? (
                                                                selectedPreviewLesson.videoUrl ? (
                                                                    selectedPreviewLesson.videoUrl.includes('youtube.com') || selectedPreviewLesson.videoUrl.includes('youtu.be') ? (
                                                                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                                                                            <iframe
                                                                                src={getEmbedUrl(selectedPreviewLesson.videoUrl) || ''}
                                                                                className="w-full h-full"
                                                                                title={selectedPreviewLesson.title}
                                                                                allowFullScreen
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <video
                                                                            src={selectedPreviewLesson.videoUrl}
                                                                            controls
                                                                            className="w-full rounded-lg max-h-60 bg-black"
                                                                        />
                                                                    )
                                                                ) : (
                                                                    <div className="p-6 text-center text-slate-400 text-xs">No video URL provided.</div>
                                                                )
                                                            ) : (
                                                                <div className="bg-white p-3 rounded-lg border border-slate-100 text-xs text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                                                                    {selectedPreviewLesson.contentText || 'No text content provided.'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : null}

                                                    {/* Curriculum List */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                                                            <span>Curriculum Lessons ({previewData.lessons?.length || 0})</span>
                                                            <span className="text-[11px] text-slate-400 font-normal">Click to inspect</span>
                                                        </h4>
                                                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                                                            {previewData.lessons && previewData.lessons.length > 0 ? (
                                                                previewData.lessons.map((lesson, idx) => (
                                                                    <button
                                                                        key={lesson.id}
                                                                        type="button"
                                                                        onClick={() => setSelectedPreviewLesson(lesson)}
                                                                        className={`w-full text-left p-2.5 flex items-center justify-between text-xs transition-colors ${
                                                                            selectedPreviewLesson?.id === lesson.id ? 'bg-primary/10 font-bold text-primary' : 'hover:bg-slate-50 text-slate-700'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2 truncate">
                                                                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                                                {idx + 1}
                                                                            </span>
                                                                            <span className="truncate">{lesson.title}</span>
                                                                        </div>
                                                                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                                                            {lesson.lessonType} {lesson.durationSeconds ? `(${Math.floor(lesson.durationSeconds / 60)}m)` : ''}
                                                                        </span>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="p-4 text-center text-xs text-slate-400">
                                                                    No lessons uploaded for this course yet.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Modal Footer Toolbar */}
                                {previewData && (
                                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setPreviewCourseId(null)}
                                        >
                                            Close Preview
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white font-bold text-xs gap-1"
                                                onClick={() => {
                                                    setRequestChangesModal({ id: previewData.id, title: previewData.title, currentNotes: previewData.rejectionReason });
                                                    setChangeNotes(previewData.rejectionReason || '');
                                                }}
                                            >
                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Suggest Edits
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs gap-1"
                                                onClick={() => {
                                                    setRejectModal({ id: previewData.id, title: previewData.title, currentReason: previewData.rejectionReason });
                                                    setRejectNotes(previewData.rejectionReason || '');
                                                }}
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
                                                onClick={() => handleApproveCourse(previewData.id, previewData.title)}
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Modal: Suggest Edits / Request Changes */}
                    {requestChangesModal && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-heading">Suggest Edits for "{requestChangesModal.title}"</h3>
                                        <p className="text-xs text-slate-500">Provide feedback notes on what the instructor should update before approval.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmitRequestChanges} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Requested Edits & Feedback Notes:
                                        </label>
                                        <textarea
                                            className="w-full border border-slate-200 rounded-xl p-3 text-xs min-h-[120px] focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-sans"
                                            placeholder="e.g. Please update course description, verify video audio, or add additional lessons..."
                                            value={changeNotes}
                                            onChange={e => setChangeNotes(e.target.value)}
                                            required
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            The instructor will see these notes directly in Course Studio and will be able to edit and re-submit.
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRequestChangesModal(null)}
                                            disabled={isSubmittingChanges}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold gap-1.5"
                                            disabled={isSubmittingChanges}
                                        >
                                            {isSubmittingChanges ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                            Send Change Request
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal: Reject Course */}
                    {rejectModal && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center font-bold shrink-0">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-heading">Reject Course Submission</h3>
                                        <p className="text-xs text-slate-500">Provide a mandatory reason for rejecting "{rejectModal.title}".</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmitReject} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Rejection Reason:
                                        </label>
                                        <textarea
                                            className="w-full border border-slate-200 rounded-xl p-3 text-xs min-h-[100px] focus:outline-hidden focus:ring-2 focus:ring-red-500 font-sans"
                                            placeholder="Explain why this course is being rejected..."
                                            value={rejectNotes}
                                            onChange={e => setRejectNotes(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRejectModal(null)}
                                            disabled={isSubmittingReject}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5"
                                            disabled={isSubmittingReject}
                                        >
                                            {isSubmittingReject ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
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
