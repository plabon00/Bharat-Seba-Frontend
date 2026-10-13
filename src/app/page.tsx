'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public-api';
import { CourseResponse } from '@/lib/api/types';
import { 
    Search, BookOpen, CheckCircle, ArrowRight, Play, Award, Users, 
    Globe, Shield, Sparkles, ChevronRight, Video, FileText, 
    Compass, PlusCircle, User, Star, Clock, Laptop, ChevronDown,
    Check, Smartphone, GraduationCap, Code, Atom, MessageSquare,
    Briefcase, HelpCircle, ShieldCheck
} from 'lucide-react';

export default function HomePage() {
    const router = useRouter();
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Fetch published courses from API with high quality fallback
    useEffect(() => {
        publicApi.getCourses(0, 8)
            .then(data => {
                if (data?.content && data.content.length > 0) {
                    setCourses(data.content);
                } else {
                    setCourses(fallbackCourses);
                }
            })
            .catch(() => {
                setCourses(fallbackCourses);
            })
            .finally(() => {
                setIsLoadingCourses(false);
            });
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/courses');
        }
    };

    const filteredCourses = selectedCategoryTab === 'ALL'
        ? courses
        : courses.filter(c => {
            const cat = (c.categorySlug || c.categoryName || '').toLowerCase();
            return cat.includes(selectedCategoryTab.toLowerCase());
        });

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 md:pb-12 font-sans selection:bg-[#0056D2] selection:text-white">
            
            {/* 1. HERO SECTION (Coursera / Udemy inspired) */}
            <section className="relative overflow-hidden bg-white border-b border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/40 pointer-events-none" />
                
                <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-18">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                        
                        {/* Hero Left Content */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Simple Announcement Pill */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0056D2] text-xs font-semibold">
                                <span className="flex h-2 w-2 rounded-full bg-[#0056D2] animate-pulse" />
                                100% Free Online Learning Portal for India
                            </div>

                            {/* Headline in simple, crystal-clear English */}
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                                Learn New Skills. <br className="hidden sm:block" />
                                <span className="text-[#0056D2]">Get Certified.</span> 100% Free.
                            </h1>

                            {/* Easy-to-understand subhead */}
                            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                                Master school subjects, coding, spoken English, and job-ready practical skills. 
                                Taught by passionate teachers in English, Hindi, and Bengali. No subscription fees.
                            </p>

                            {/* Prominent Search Bar (Udemy / Coursera style) */}
                            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
                                <div className="flex items-center bg-white border-2 border-slate-300 hover:border-[#0056D2] focus-within:border-[#0056D2] rounded-xl shadow-sm transition-all overflow-hidden p-1">
                                    <div className="pl-3 pr-2 text-slate-400">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="What do you want to learn today? (e.g. Science, Python, English)"
                                        className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none py-2.5 px-1"
                                    />
                                    <button 
                                        type="submit"
                                        className="shrink-0 bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                                    >
                                        Search
                                    </button>
                                </div>

                                {/* Popular Quick Search Pills */}
                                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">Popular:</span>
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearchQuery('Science'); router.push('/courses?q=Science'); }}
                                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                    >
                                        Class 9-10 Science
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearchQuery('Web Development'); router.push('/courses?q=Web%20Development'); }}
                                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                    >
                                        Web Development
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearchQuery('English'); router.push('/courses?q=English'); }}
                                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                    >
                                        Spoken English
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearchQuery('Digital'); router.push('/courses?q=Digital'); }}
                                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors hidden sm:inline-block"
                                    >
                                        Cyber Safety
                                    </button>
                                </div>
                            </form>

                            {/* Dual Primary Call-To-Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link href="/courses">
                                    <button className="h-11 px-6 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2">
                                        Explore All Courses <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                                <Link href="/teacher/courses">
                                    <button className="h-11 px-6 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-[#0056D2]" /> Teach on Bharat Seva
                                    </button>
                                </Link>
                            </div>

                        </div>

                        {/* Hero Right: Featured Course Spotlight Card (Udemy style preview card) */}
                        <div className="lg:col-span-5">
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg relative group hover:shadow-xl transition-all">
                                
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-2.5 py-1 rounded-full">
                                        ★ MOST POPULAR FREE COURSE
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Free Certificate
                                    </span>
                                </div>

                                {/* Video Banner Simulation */}
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center group-hover:scale-[1.01] transition-transform">
                                    <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800')" }} />
                                    <div className="w-14 h-14 rounded-full bg-white/90 text-[#0056D2] flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10">
                                        <Play className="w-6 h-6 fill-[#0056D2] ml-1" />
                                    </div>
                                    <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                                        12 Video Lessons
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="font-semibold text-slate-700">Secondary Science</span>
                                        <span>•</span>
                                        <span>Class 9 & 10</span>
                                        <span>•</span>
                                        <span className="text-amber-500 flex items-center font-bold">
                                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> 4.9 (1,840)
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 hover:text-[#0056D2] transition-colors leading-snug">
                                        Class IX Physical Science & Laboratory Foundation
                                    </h3>

                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        Complete physics and chemistry foundation with experiments, practice questions, and chapter-wise summary notes.
                                    </p>

                                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0056D2] font-bold text-xs flex items-center justify-center">
                                                SP
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">Prof. S. Paul</span>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xs line-through text-slate-400 mr-1.5">₹1,999</span>
                                            <span className="text-base font-extrabold text-emerald-600">FREE</span>
                                        </div>
                                    </div>

                                    <Link href="/courses/SCI-09" className="block pt-2">
                                        <button className="w-full py-2.5 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5">
                                            Start This Course for Free <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. KEY STATS BANNER (Instant Trust & Credibility) */}
            <section className="bg-slate-900 text-white py-6">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">50,000+</div>
                            <div className="text-xs sm:text-sm text-slate-300">Active Students Learning</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100% Free</div>
                            <div className="text-xs sm:text-sm text-slate-300">No Fees, No Subscriptions</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">120+</div>
                            <div className="text-xs sm:text-sm text-slate-300">Free Video Lessons</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl font-extrabold text-white">4.9 ★</div>
                            <div className="text-xs sm:text-sm text-slate-300">Average Course Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS IN 3 EASY STEPS (Easy instructions to understand at one glance) */}
            <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            EASY INSTRUCTIONS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            How Bharat Seva Works in 3 Easy Steps
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Start learning in less than a minute. No paperwork, no credit card required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        
                        {/* Step 1 */}
                        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 relative group hover:border-[#0056D2]/50 hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0056D2] font-black text-xl flex items-center justify-center shadow-xs">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Choose Your Course
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Search by subject or browse our categories. Whether you need Class 10 science help or want to learn web development, pick the course you like.
                            </p>
                            <div className="pt-2 text-xs font-semibold text-[#0056D2] flex items-center gap-1">
                                <Search className="w-3.5 h-3.5" /> Over 100+ topics available
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 relative group hover:border-[#0056D2]/50 hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center shadow-xs">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Watch & Practice Anytime
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Learn at your own pace from your phone, tablet, or computer. Watch bite-sized video lessons and review simple chapter summary notes.
                            </p>
                            <div className="pt-2 text-xs font-semibold text-amber-700 flex items-center gap-1">
                                <Smartphone className="w-3.5 h-3.5" /> Mobile and low-data friendly
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 relative group hover:border-[#0056D2]/50 hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center shadow-xs">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Get Your Free Certificate
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Finish all modules and answer simple check-in quiz questions. Download a recognized digital certificate to show on your CV or job portfolio.
                            </p>
                            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" /> Instant digital download
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. EXPLORE TOP CATEGORIES (Coursera / Udemy Grid) */}
            <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block">
                                TOP SUBJECTS
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Explore Popular Categories
                            </h2>
                            <p className="text-slate-600 text-sm mt-1">
                                Click on any topic to discover high-rated free courses.
                            </p>
                        </div>
                        <Link 
                            href="/courses" 
                            className="text-sm font-semibold text-[#0056D2] hover:text-[#00419e] flex items-center gap-1 transition-colors"
                        >
                            View All Categories <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        
                        {/* Cat 1 */}
                        <Link 
                            href="/courses?category=programming" 
                            className="bg-white border border-slate-200 hover:border-[#0056D2] hover:shadow-md rounded-xl p-4 text-center space-y-3 transition-all group block"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0056D2] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Code className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors">
                                    Computer & Coding
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">14 Courses</p>
                            </div>
                        </Link>

                        {/* Cat 2 */}
                        <Link 
                            href="/courses?category=science" 
                            className="bg-white border border-slate-200 hover:border-[#0056D2] hover:shadow-md rounded-xl p-4 text-center space-y-3 transition-all group block"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Atom className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors">
                                    School Science
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">22 Courses</p>
                            </div>
                        </Link>

                        {/* Cat 3 */}
                        <Link 
                            href="/courses?category=languages" 
                            className="bg-white border border-slate-200 hover:border-[#0056D2] hover:shadow-md rounded-xl p-4 text-center space-y-3 transition-all group block"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors">
                                    Spoken English
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">9 Courses</p>
                            </div>
                        </Link>

                        {/* Cat 4 */}
                        <Link 
                            href="/courses?category=public-skills" 
                            className="bg-white border border-slate-200 hover:border-[#0056D2] hover:shadow-md rounded-xl p-4 text-center space-y-3 transition-all group block"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors">
                                    Cyber & Safety
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">8 Courses</p>
                            </div>
                        </Link>

                        {/* Cat 5 */}
                        <Link 
                            href="/courses?category=business" 
                            className="bg-white border border-slate-200 hover:border-[#0056D2] hover:shadow-md rounded-xl p-4 text-center space-y-3 transition-all group block"
                        >
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors">
                                    Career & Office
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">11 Courses</p>
                            </div>
                        </Link>

                        {/* Cat 6 */}
                        <Link 
                            href="/courses" 
                            className="bg-white border border-slate-200 hover:border-[#0056D2] hover:shadow-md rounded-xl p-4 text-center space-y-3 transition-all group block"
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Compass className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors">
                                    All Courses
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">Browse 100+</p>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>

            {/* 5. POPULAR & FEATURED COURSES (The core Udemy/Coursera browsing grid) */}
            <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block">
                                FEATURED SELECTION
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Recommended Free Courses
                            </h2>
                            <p className="text-slate-600 text-sm mt-1">
                                Learn from qualified educators. 100% free with verified certificates.
                            </p>
                        </div>

                        {/* Category Filter Tabs (Udemy style tabs) */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {[
                                { id: 'ALL', label: 'All Courses' },
                                { id: 'science', label: 'School Science' },
                                { id: 'programming', label: 'Coding' },
                                { id: 'languages', label: 'English' },
                                { id: 'public-skills', label: 'Digital Skills' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedCategoryTab(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                        selectedCategoryTab === tab.id
                                            ? 'bg-[#0056D2] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Course Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredCourses.slice(0, 8).map((course, idx) => (
                            <Link 
                                key={course.id || idx}
                                href={`/courses/${course.courseCode || 'explore'}`}
                                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col group block"
                            >
                                {/* Card Thumbnail */}
                                <div className="aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                    {course.thumbnailUrl ? (
                                        <img 
                                            src={course.thumbnailUrl} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-950 flex items-center justify-center text-white relative">
                                            <BookOpen className="w-10 h-10 text-white/40" />
                                            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded text-white/90">
                                                {course.categoryName || 'GENERAL'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
                                        FREE
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="text-[11px] font-semibold text-[#0056D2] uppercase tracking-wider">
                                            {course.categoryName || 'Skill Course'}
                                        </div>
                                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors line-clamp-2 leading-snug">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span className="truncate max-w-[130px] font-medium text-slate-700">
                                                {course.teacherName || 'Faculty Member'}
                                            </span>
                                            <span className="flex items-center font-bold text-amber-600">
                                                <Star className="w-3 h-3 fill-amber-400 mr-1" /> 4.9
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-base font-extrabold text-emerald-700">Free</span>
                                                <span className="text-xs line-through text-slate-400">₹1,999</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-[#0056D2] group-hover:translate-x-0.5 transition-transform flex items-center">
                                                Enroll Free <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/courses">
                            <button className="h-11 px-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all inline-flex items-center gap-2">
                                Browse All 100+ Free Courses <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                </div>
            </section>

            {/* 6. WHY STUDENTS CHOOSE BHARAT SEVA (Coursera-style Value Pillars) */}
            <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            WHY BHARAT SEVA
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            Quality Education for Every Citizen
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            We believe that good education should never depend on how much money a student has.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">100% Free Forever</h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                No credit card needed, no 7-day trials, no locked videos. Every course is completely free for everyone.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0056D2] flex items-center justify-center font-bold">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Learn in Your Language</h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Watch lessons explained in simple English, Hindi, and Bengali. Switch between languages anytime.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Mobile Friendly</h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Stream lessons smoothly on ordinary budget smartphones even with slow 3G or 4G internet connection.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Verified Certificates</h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Receive a shareable digital certificate after completing all lessons to attach to your college or job CV.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* 7. BECOME AN INSTRUCTOR (Udemy-style Teacher Banner) */}
            <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-blue-900 via-[#0056D2] to-indigo-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                            <div className="lg:col-span-8 space-y-4">
                                <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    FOR EDUCATORS & PROFESSIONALS
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                                    Become an Instructor on Bharat Seva
                                </h2>
                                <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                                    Are you a teacher, professor, or skilled working professional? Teach students across India by uploading video lessons. 
                                    Our intuitive Course Studio helps you structure modules, add quizzes, and track learner progress with zero platform fees.
                                </p>
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <Link href="/teacher/courses">
                                        <button className="h-11 px-6 rounded-lg bg-white text-[#0056D2] font-bold text-sm shadow hover:bg-blue-50 transition-all flex items-center gap-2">
                                            <PlusCircle className="w-4 h-4" /> Open Course Studio
                                        </button>
                                    </Link>
                                    <Link href="/how-to-publish">
                                        <button className="h-11 px-6 rounded-lg border border-white/40 hover:border-white text-white font-semibold text-sm transition-all">
                                            How to Publish a Course
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 space-y-3">
                                <h3 className="font-bold text-sm text-white">Why Teach With Us?</h3>
                                <ul className="space-y-2 text-xs text-blue-100">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Reach 50,000+ registered students
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Zero hosting and streaming costs
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Verified Instructor Badge on profile
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Simple video uploader & quiz builder
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. STUDENT REVIEWS / TESTIMONIALS (Coursera-style Social Proof) */}
            <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            STUDENT STORIES
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            What Our Learners Are Saying
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Real stories from students and lifelong learners across India.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed italic">
                                &ldquo;The Class 10 Science lectures helped me clear all my physics doubts before my board exams. Everything was explained step-by-step in simple language!&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0056D2] font-bold text-xs flex items-center justify-center">
                                    RM
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-slate-900">Rohan Mondal</h3>
                                    <p className="text-[11px] text-slate-500">Secondary Student, Kolkata</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed italic">
                                &ldquo;I learned full stack web development without paying expensive coaching fees. The exercises and certificate helped me land my first software internship!&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                                    PS
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-slate-900">Pooja Sharma</h3>
                                    <p className="text-[11px] text-slate-500">College Graduate, Patna</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed italic">
                                &ldquo;The digital banking and cyber safety course was so easy to follow. Now I can pay utility bills and use UPI with complete confidence without asking my children.&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                                    AK
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-slate-900">Amit K. Patel</h3>
                                    <p className="text-[11px] text-slate-500">Citizen Learner, Ahmedabad</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ Accordion with clear, easy English) */}
            <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
                <div className="max-w-[840px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center space-y-3 mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            COMMON QUESTIONS
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Everything you need to know about Bharat Seva.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqList.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div 
                                    key={index}
                                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#0056D2] bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#0056D2]' : 'text-slate-400'}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* 10. FINAL CALL TO ACTION (Hero Footer) */}
            <section className="py-14 sm:py-18 bg-gradient-to-b from-blue-50/40 to-slate-50 text-center">
                <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        Start Learning Today — It Takes 30 Seconds
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        Join over 50,000 citizens mastering new skills and expanding career opportunities. 
                        No fees, no catch. Just free, high-quality knowledge.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto h-11 px-8 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all">
                                Create Free Student Account
                            </button>
                        </Link>
                        <Link href="/courses" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto h-11 px-8 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all">
                                Browse All Courses
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 11. FIXED MOBILE NAVIGATION (Coursera / Udemy Mobile Bottom Bar) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-50 shadow-lg flex items-center justify-around px-2">
                <Link 
                    href="/" 
                    className="flex flex-col items-center justify-center gap-0.5 text-[#0056D2] w-1/4"
                >
                    <BookOpen className="w-5 h-5 text-[#0056D2]" />
                    <span className="text-[10px] font-bold">Home</span>
                </Link>

                <Link 
                    href="/courses" 
                    className="flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-[#0056D2] w-1/4"
                >
                    <Compass className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Courses</span>
                </Link>

                <Link 
                    href="/teacher/courses" 
                    className="flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-[#0056D2] w-1/4"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Teach</span>
                </Link>

                <Link 
                    href="/login" 
                    className="flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-[#0056D2] w-1/4"
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Account</span>
                </Link>
            </nav>

        </div>
    );
}

// Clear FAQ data in plain, easy-to-understand English
const faqList = [
    {
        question: "Is Bharat Seva really 100% free?",
        answer: "Yes, completely! Bharat Seva was built as a non-profit public initiative. There are no course fees, no monthly subscriptions, and no paid premium features. Every lesson is free for every citizen."
    },
    {
        question: "Do I need any previous degree or qualification to enroll?",
        answer: "No. Anyone can join! Whether you are a school student, college graduate, job seeker, or homemaker, you can sign up with your email or Google account and start learning immediately."
    },
    {
        question: "How do I get my course certificate?",
        answer: "Once you watch the required video lessons and complete the check-in quizzes for a course, your digital certificate of completion is automatically generated. You can download it as a PDF or share the link on your resume and LinkedIn profile."
    },
    {
        question: "Can I watch lessons on my mobile phone?",
        answer: "Yes. The entire platform is built to work smoothly on mobile phones, tablets, and computers. Video streaming is optimized to work even on low-speed 3G or 4G connections."
    },
    {
        question: "How can teachers create and publish courses?",
        answer: "Any educator, professor, or skilled expert can click on 'Teach on Bharat Seva' or 'Course Studio'. You can create course modules, upload video lectures, and submit for quick administrative review before it goes live to thousands of students."
    }
];

// Fallback high-quality curated courses
const fallbackCourses: CourseResponse[] = [
    {
        id: '1',
        courseCode: 'SCI-09',
        title: 'Class IX Physical Science & Laboratory Foundation',
        description: 'Complete physics and chemistry syllabus for Class IX students with experiments and practice questions.',
        teacherName: 'Prof. S. Paul',
        categoryName: 'Secondary Science',
        categorySlug: 'science',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    },
    {
        id: '2',
        courseCode: 'WEB-101',
        title: 'Full Stack Web Development & Modern JavaScript',
        description: 'Master HTML5, CSS3, modern JavaScript, and React from the ground up with hands-on projects.',
        teacherName: 'Plabon Sarkar',
        categoryName: 'Computer Science',
        categorySlug: 'programming',
        difficulty: 'INTERMEDIATE',
        status: 'PUBLISHED'
    },
    {
        id: '3',
        courseCode: 'DIGI-01',
        title: 'Digital Literacy, Cyber Safety & Financial Inclusion',
        description: 'Practical digital skills for citizens, online banking safety, UPI payments, and government scheme portal usage.',
        teacherName: 'Bharat Seva Foundation',
        categoryName: 'Public Skills',
        categorySlug: 'public-skills',
        difficulty: 'ALL_LEVELS',
        status: 'PUBLISHED'
    },
    {
        id: '4',
        courseCode: 'ENG-201',
        title: 'Spoken English & Workplace Communication',
        description: 'Practical conversational English tailored for interview preparation, office speaking, and everyday fluency.',
        teacherName: 'Dr. Ananya Sen',
        categoryName: 'Communication',
        categorySlug: 'languages',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    },
    {
        id: '5',
        courseCode: 'MTH-10',
        title: 'Class X Mathematics: Board Exam Preparation',
        description: 'Step-by-step problem solving for Class 10 trigonometry, algebra, quadratic equations, and geometry.',
        teacherName: 'Rajesh Mukherjee',
        categoryName: 'Secondary Science',
        categorySlug: 'science',
        difficulty: 'INTERMEDIATE',
        status: 'PUBLISHED'
    },
    {
        id: '6',
        courseCode: 'PY-101',
        title: 'Python for Beginners: From Zero to Code',
        description: 'Learn programming fundamentals, variables, loops, functions, and real automation scripts using Python.',
        teacherName: 'Vikram Roy',
        categoryName: 'Computer Science',
        categorySlug: 'programming',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    },
    {
        id: '7',
        courseCode: 'EXC-101',
        title: 'Microsoft Excel & Data Entry for Job Readiness',
        description: 'Master spreadsheets, formulas, VLOOKUP, pivot tables, and professional data entry techniques.',
        teacherName: 'Kavita Das',
        categoryName: 'Business Skills',
        categorySlug: 'business',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    },
    {
        id: '8',
        courseCode: 'DES-101',
        title: 'Graphic Design with Canva & Basic Media Creation',
        description: 'Create social media posts, posters, certificates, and marketing banners using free design tools.',
        teacherName: 'Megha Sen',
        categoryName: 'Creative Arts',
        categorySlug: 'creative',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    }
];
