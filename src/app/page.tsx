'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { publicApi } from '@/lib/api/public-api';
import { CourseResponse } from '@/lib/api/types';
import { 
    BookOpen, CheckCircle, ArrowRight, Play, Award, Users, 
    Globe, Shield, Sparkles, ChevronRight, Video, FileText, 
    Compass, PlusCircle, User, Star, Clock, Laptop, ExternalLink
} from 'lucide-react';

export default function HomePage() {
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [activeTab, setActiveTab] = useState<'video' | 'syllabus'>('video');

    // Fetch published courses from API with resilient fallback
    useEffect(() => {
        publicApi.getCourses(0, 6)
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

    return (
        <div className="min-h-screen bg-[#FFF8E1] text-[#2C2C2C] pb-24 md:pb-16 font-sans">
            {/* MAIN BENTO CONTAINER - Max 1200px, 32px H, 24px V, 32px Gap */}
            <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
                
                {/* 1. TOP HEADER / ANNOUNCEMENT BANNER */}
                <section className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="inline-flex items-center gap-2">
                                <span className="bg-[#F9A825] text-[#002D72] text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full">
                                    NATIONAL LEARNING INITIATIVE
                                </span>
                                <span className="bg-[#002D72]/10 text-[#002D72] text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full hidden sm:inline-flex">
                                    100% FREE EDUCATION
                                </span>
                            </div>

                            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#002D72] leading-tight tracking-tight">
                                Democratizing Digital Skills & Education Across Bharat
                            </h1>

                            <p className="text-[14px] text-[#4A4A4A] leading-relaxed">
                                A high-end, community-powered education portal providing free, structured courses 
                                for students, job aspirants, and lifelong learners. Zero subscription fees, expert-curated lessons, and recognized skill certificates.
                            </p>
                        </div>

                        {/* Quick CTA Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                            <Link href="/courses">
                                <button className="w-full sm:w-auto min-h-[44px] px-6 rounded-[10px] bg-[#F9A825] text-[#002D72] font-bold text-[14px] shadow-xs hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 transition-all duration-200 ease-in-out flex items-center justify-center gap-2">
                                    Explore Courses <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <Link href="/teacher/courses">
                                <button className="w-full sm:w-auto min-h-[44px] px-6 rounded-[10px] border-2 border-[#002D72] text-[#002D72] font-bold text-[14px] bg-transparent hover:bg-[#002D72]/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out flex items-center justify-center gap-2">
                                    Open Course Studio
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. CORE BENTO-GRID LAYOUT (2 Columns on Desktop, Stacks on Mobile, 32px Gap) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: ACTIVE LEARNING PATHWAY & REAL-TIME TRACKER WIDGET (7 Cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E0DDD6]/60">
                                <div>
                                    <span className="text-[11px] font-bold text-[#002D72]/70 uppercase tracking-[0.1em] block mb-1">
                                        REAL-TIME VERIFICATION & TRACKING
                                    </span>
                                    <h3 className="text-[24px] font-semibold text-[#002D72] leading-snug">
                                        Active Learning & Delivery Pathway
                                    </h3>
                                </div>

                                <Link href="/courses">
                                    <button className="min-h-[44px] px-6 rounded-[10px] bg-[#F9A825] text-[#002D72] font-bold text-[14px] shadow-xs hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 transition-all duration-200 ease-in-out flex items-center gap-2">
                                        Track Pathway <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>

                            {/* Inner Highlight Box: #F4F1EC background, 12px radius, destination & status pill */}
                            <div className="bg-[#F4F1EC] border border-[#E0DDD6] rounded-[12px] p-5 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <span className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.1em] block">
                                            CURRICULUM DESTINATION
                                        </span>
                                        <h4 className="text-[16px] font-bold text-[#002D72]">
                                            Digital Literacy, Science & Web Technology
                                        </h4>
                                    </div>
                                    <span className="bg-[#10B981] text-white text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full shrink-0">
                                        ACTIVE • VERIFIED
                                    </span>
                                </div>

                                <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
                                    Curriculum designed by educators for Indian secondary and collegiate learners. Complete video lectures, verified assignments, and downloadable summary sheets.
                                </p>

                                {/* Progress Visual */}
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex justify-between text-[12px] font-semibold text-[#002D72]">
                                        <span>Current Batch Progress</span>
                                        <span className="text-[#10B981]">68% Completed</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#E0DDD6] overflow-hidden">
                                        <div className="h-full bg-[#10B981] rounded-full w-[68%]" />
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Vertical Tracker Component */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#002D72]/70">
                                        MILESTONE PROGRESS TRACKER
                                    </h4>
                                    <span className="text-[10px] text-[#666666] font-medium">LIVE UPDATES</span>
                                </div>

                                <div className="relative pl-6 space-y-7">
                                    
                                    {/* Stage 1: Completed Node (Emerald #10B981 with check) */}
                                    <div className="relative group">
                                        {/* Completed Segment connecting Node 1 to Node 2 */}
                                        <div className="absolute -left-6 top-4 bottom-[-28px] w-[2px] bg-[#10B981]" />
                                        
                                        {/* 16px circular marker */}
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[9px] shadow-xs ring-4 ring-[#FFF8E1] z-10">
                                            <CheckCircle className="w-3 h-3 text-white" />
                                        </div>
                                        
                                        <div className="space-y-0.5 pl-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-[14px] font-bold text-[#002D72]">
                                                    Citizen Enrollment & Diagnostic
                                                </h4>
                                                <span className="text-[10px] text-[#666666] font-mono">
                                                    09:30 AM • COMPLETED
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-[#4A4A4A]">
                                                Instant zero-cost verification with email or Google ID. Selected Hindi/English language curriculum.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stage 2: Active Node (Golden #F9A825 with arrow & soft ring) */}
                                    <div className="relative group">
                                        {/* Pending Segment connecting Node 2 to Node 3 */}
                                        <div className="absolute -left-6 top-4 bottom-[-28px] w-[2px] bg-[#D1D5DB]" />
                                        
                                        {/* 16px circular marker with 4px soft ring */}
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#F9A825] text-[#002D72] flex items-center justify-center font-bold text-[9px] shadow-xs ring-4 ring-orange-100 z-10 animate-pulse">
                                            <ArrowRight className="w-2.5 h-2.5 text-[#002D72]" />
                                        </div>
                                        
                                        <div className="space-y-0.5 pl-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-[14px] font-bold text-[#002D72]">
                                                    Interactive Video Lessons & Practice Notes
                                                </h4>
                                                <span className="text-[10px] text-[#002D72] font-semibold font-mono bg-[#F9A825]/20 px-2 py-0.5 rounded-full">
                                                    ACTIVE • CURRENT
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-[#4A4A4A]">
                                                Stream high-definition lectures, test sample problems, and view downloadable chapter notes.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stage 3: Pending Node (Gray #D1D5DB) */}
                                    <div className="relative group">
                                        {/* 16px circular marker */}
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#D1D5DB] flex items-center justify-center font-bold text-[9px] shadow-xs ring-4 ring-[#FFF8E1] z-10" />
                                        
                                        <div className="space-y-0.5 pl-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-[14px] font-bold text-[#666666]">
                                                    Verification & Digital Skill Certification
                                                </h4>
                                                <span className="text-[10px] text-[#666666] font-mono">
                                                    ESTIMATED: STAGE 3
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-[#666666]">
                                                Complete module review to earn a verifiable digital certificate recognized across Bharat institutions.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Interactive Test-Drive / Lesson Inspector Preview */}
                            <div className="border border-[#E0DDD6] rounded-[12px] p-4 bg-[#F9F8F6] space-y-3">
                                <div className="flex items-center justify-between border-b border-[#E0DDD6] pb-2">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setActiveTab('video')}
                                            className={`text-[12px] font-bold px-3 py-1.5 rounded-[8px] transition-colors ${
                                                activeTab === 'video' ? 'bg-[#002D72] text-white' : 'text-[#666666] hover:text-[#002D72]'
                                            }`}
                                        >
                                            Interactive Video Player
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('syllabus')}
                                            className={`text-[12px] font-bold px-3 py-1.5 rounded-[8px] transition-colors ${
                                                activeTab === 'syllabus' ? 'bg-[#002D72] text-white' : 'text-[#666666] hover:text-[#002D72]'
                                            }`}
                                        >
                                            Module Syllabus & Notes
                                        </button>
                                    </div>
                                    <span className="text-[11px] font-mono text-[#666666]">Sample Lesson #01</span>
                                </div>

                                {activeTab === 'video' ? (
                                    <div className="aspect-video w-full rounded-[10px] overflow-hidden bg-black relative shadow-inner">
                                        <iframe 
                                            className="w-full h-full"
                                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                                            title="Interactive Lesson Sample"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-white p-4 rounded-[10px] border border-[#E0DDD6] text-[13px] text-[#4A4A4A] space-y-2 leading-relaxed">
                                        <h5 className="font-bold text-[#002D72] text-[14px]">
                                            Module Overview: Atomic Structure & Fundamentals
                                        </h5>
                                        <p>
                                            In this introductory module, learners study atomic particles, electronic configuration, 
                                            and fundamental laboratory principles required for higher secondary science curriculum.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1 text-[12px] text-[#666666]">
                                            <li>Fundamental particles: Protons, Neutrons, Electrons</li>
                                            <li>Atomic mass and isotopes in practical chemistry</li>
                                            <li>Revision quiz questions with detailed answer keys</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: LIST WIDGETS & COMMUNITY STUDIO (5 Cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        
                        {/* WIDGET 1: FEATURED COURSES LIST WIDGET */}
                        <section className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E0DDD6]">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#002D72]/70 block mb-0.5">
                                        CATALOG HIGHLIGHTS
                                    </span>
                                    <h3 className="text-[20px] font-semibold text-[#002D72]">
                                        Featured Courses
                                    </h3>
                                </div>
                                <Link 
                                    href="/courses" 
                                    className="text-[13px] font-semibold text-[#1E88E5] hover:text-[#002D72] flex items-center gap-1 transition-colors"
                                >
                                    View All <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {/* Vertical List of Courses separated by 1px #E0DDD6 dividers */}
                            <div className="divide-y divide-[#E0DDD6]">
                                {courses.slice(0, 4).map((course, idx) => (
                                    <Link 
                                        key={course.id || idx} 
                                        href={`/courses/${course.courseCode || 'explore'}`}
                                        className="py-3.5 px-2 flex items-center justify-between gap-3 hover:bg-[#F9F8F6] rounded-[8px] transition-colors group block"
                                    >
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <h4 className="text-[14px] font-bold text-[#002D72] group-hover:text-[#1E88E5] transition-colors truncate">
                                                {course.title}
                                            </h4>
                                            <p className="text-[12px] text-[#666666] truncate">
                                                By {course.teacherName || 'Bharat Seva Faculty'} • {course.categoryName || 'General'}
                                            </p>
                                        </div>

                                        <div className="shrink-0">
                                            {/* Status Pill Badge variants */}
                                            {idx === 0 ? (
                                                <span className="bg-[#F9A825] text-[#002D72] text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full shadow-2xs">
                                                    FEATURED
                                                </span>
                                            ) : idx === 1 ? (
                                                <span className="bg-[#10B981] text-white text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full shadow-2xs">
                                                    100% FREE
                                                </span>
                                            ) : (
                                                <span className="bg-[#002D72]/10 text-[#002D72] text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full">
                                                    {course.difficulty || 'POPULAR'}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* WIDGET 2: INSTRUCTOR & COMMUNITY STUDIO CARD */}
                        <section className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E0DDD6]">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#002D72]/70 block mb-0.5">
                                        FOR EDUCATORS & CREATORS
                                    </span>
                                    <h3 className="text-[20px] font-semibold text-[#002D72]">
                                        Course Studio Platform
                                    </h3>
                                </div>
                                <span className="bg-[#F9A825]/20 text-[#002D72] text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full">
                                    ZERO FEES
                                </span>
                            </div>

                            <div className="bg-[#F4F1EC] border border-[#E0DDD6] rounded-[12px] p-4 space-y-2">
                                <h4 className="text-[14px] font-bold text-[#002D72]">
                                    Teach Thousands of Aspiring Learners
                                </h4>
                                <p className="text-[12px] text-[#4A4A4A] leading-relaxed">
                                    Are you a teacher, professor, or technical expert? Upload video lessons, structure modules, 
                                    and publish free courses with our intuitive studio builder.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link href="/teacher/courses">
                                    <button className="w-full min-h-[44px] px-3 rounded-[10px] bg-[#F9A825] text-[#002D72] font-bold text-[13px] shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
                                        <PlusCircle className="w-4 h-4" /> Open Studio
                                    </button>
                                </Link>
                                <Link href="/about">
                                    <button className="w-full min-h-[44px] px-3 rounded-[10px] border-2 border-[#002D72] text-[#002D72] font-bold text-[13px] bg-transparent hover:bg-[#002D72]/5 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                        </section>

                    </div>
                </div>

                {/* 3. TRUST & NATIONAL IMPACT VALUE PILLARS (3-Column Bento Strip) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
                        <div className="w-10 h-10 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#002D72]">
                            100% Free Public Good
                        </h3>
                        <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
                            No paywalls, no hidden trial periods, and no course pay-per-view. Built as a social service portal for citizens nationwide.
                        </p>
                    </div>

                    <div className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
                        <div className="w-10 h-10 rounded-full bg-[#002D72]/10 text-[#002D72] flex items-center justify-center font-bold">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#002D72]">
                            Admin Moderated Quality
                        </h3>
                        <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
                            Every submitted course undergoes verification by administrative reviewers to ensure syllabus accuracy, lesson clarity, and student safety.
                        </p>
                    </div>

                    <div className="bg-white border border-[#E0DDD6] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9A825]/20 text-[#002D72] flex items-center justify-center font-bold">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#002D72]">
                            Regional & National Reach
                        </h3>
                        <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
                            Learn in English, Hindi, or Bengali with mobile-friendly video streaming, low bandwidth optimization, and offline summary notes.
                        </p>
                    </div>
                </section>

                {/* 4. CALL TO ACTION CONTAINER */}
                <section className="bg-white border border-[#E0DDD6] rounded-[16px] p-8 text-center space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <h2 className="text-[32px] font-bold text-[#002D72]">
                        Ready to Begin Your Learning Pathway?
                    </h2>
                    <p className="text-[14px] text-[#4A4A4A] max-w-xl mx-auto leading-relaxed">
                        Join over 50,000 learners already mastering subjects and upgrading their career prospects. Registration is free and takes less than a minute.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/register">
                            <button className="min-h-[44px] px-8 rounded-[10px] bg-[#F9A825] text-[#002D72] font-bold text-[14px] shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Create Free Student Account
                            </button>
                        </Link>
                        <Link href="/courses">
                            <button className="min-h-[44px] px-8 rounded-[10px] border-2 border-[#002D72] text-[#002D72] font-bold text-[14px] bg-transparent hover:bg-[#002D72]/5 transition-all">
                                Browse All Courses
                            </button>
                        </Link>
                    </div>
                </section>

            </main>

            {/* 5. MOBILE BOTTOM NAVIGATION (Fixed 72px height, #FFFFFF, border-top 1px #E0DDD6) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-[#E0DDD6] z-50 shadow-lg flex items-center justify-around px-2">
                <Link 
                    href="/" 
                    className="flex flex-col items-center justify-center gap-1 text-[#1E88E5] w-1/4"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <Laptop className="w-4 h-4 text-[#1E88E5]" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#1E88E5]">
                        DASHBOARD
                    </span>
                </Link>

                <Link 
                    href="/teacher/courses" 
                    className="flex flex-col items-center justify-center gap-1 text-[#666666] hover:text-[#1E88E5] w-1/4"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <PlusCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                        SEND
                    </span>
                </Link>

                <Link 
                    href="/courses" 
                    className="flex flex-col items-center justify-center gap-1 text-[#666666] hover:text-[#1E88E5] w-1/4"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <Compass className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                        TRACK
                    </span>
                </Link>

                <Link 
                    href="/login" 
                    className="flex flex-col items-center justify-center gap-1 text-[#666666] hover:text-[#1E88E5] w-1/4"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <User className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                        ACCOUNT
                    </span>
                </Link>
            </nav>
        </div>
    );
}

// Fallback curated courses if backend has not published courses yet
const fallbackCourses: CourseResponse[] = [
    {
        id: '1',
        courseCode: 'SCI-09',
        title: 'Class IX Physical Science & Laboratory Foundation',
        description: 'Complete physics and chemistry syllabus for Class IX students with experiments.',
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
        description: 'Master HTML5, CSS3, modern JavaScript, and React from the ground up.',
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
        description: 'Practical digital skills for rural and urban citizens, online banking safety, and portal usage.',
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
        description: 'Practical conversational English tailored for interview preparation and workplace readiness.',
        teacherName: 'Dr. Ananya Sen',
        categoryName: 'Communication',
        categorySlug: 'languages',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    }
];
