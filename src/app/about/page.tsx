'use client';

import Link from 'next/link';
import { 
    BookOpen, Users, Sparkles, GraduationCap, Globe, Heart, 
    ShieldCheck, ArrowRight, Rocket, Video, Layers, 
    CheckCircle2, Compass, Award, Smartphone, Check, PlusCircle
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans selection:bg-[#0056D2] selection:text-white">
            
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-white border-b border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/40 pointer-events-none" />
                
                <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        About Bharat Seva
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
                        Empowering India Through <br className="hidden sm:inline" />
                        <span className="text-[#0056D2]">Free, Open Education</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
                        We believe quality knowledge should never be trapped behind paywalls or subscription fees. 
                        Bharat Seva connects passionate teachers with eager learners across India — completely free, forever.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        <Link href="/courses">
                            <button className="h-11 px-6 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2">
                                <Compass className="w-4 h-4" /> Start Learning Free
                            </button>
                        </Link>
                        <Link href="/how-to-publish">
                            <button className="h-11 px-6 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#0056D2]" /> Teach on Bharat Seva
                            </button>
                        </Link>
                    </div>

                    {/* Stats Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto text-left">
                        <div className="bg-[#F8FAFC] border border-slate-200 p-5 rounded-2xl shadow-xs">
                            <div className="text-3xl font-extrabold text-[#0056D2]">100%</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Free Public Access</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Zero subscription or hidden fees</p>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-200 p-5 rounded-2xl shadow-xs">
                            <div className="text-3xl font-extrabold text-emerald-600">50,000+</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Registered Learners</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Students across all Indian states</p>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-200 p-5 rounded-2xl shadow-xs">
                            <div className="text-3xl font-extrabold text-amber-600">3+</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Languages Supported</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">English, Hindi & Bengali</p>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-200 p-5 rounded-2xl shadow-xs">
                            <div className="text-3xl font-extrabold text-purple-600">Free</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Verifiable Certificates</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Shareable on LinkedIn & resumes</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. OUR MISSION / WHY WE EXIST */}
            <section className="py-16 sm:py-20 bg-[#F8FAFC]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            OUR MISSION
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            Knowledge is a Right, Not a Luxury
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Millions of students in India face high coaching fees, expensive certification bootcamps, and language barriers. 
                            Bharat Seva is built to break down these barriers so that any student can learn anywhere, anytime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Box 1: For Learners */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0056D2] flex items-center justify-center font-bold">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    For Every Aspiring Learner
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Whether you are preparing for Class 10 board exams, learning modern web development, improving your spoken English for job interviews, or mastering digital payments safely, we provide structured video courses completely free.
                                </p>
                                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span><strong>Zero Cost:</strong> No hidden trial period, no pay-per-view videos.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span><strong>Learn in Your Language:</strong> Lessons explained in Hindi, Bengali, and English.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span><strong>Works on Any Phone:</strong> Optimized for budget smartphones and low-bandwidth internet.</span>
                                    </li>
                                </ul>
                            </div>
                            <Link href="/courses" className="pt-4 block">
                                <button className="w-full h-11 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2">
                                    Explore Courses <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {/* Box 2: For Teachers */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    For Educators & Knowledge Creators
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Every experienced teacher or skilled professional knows something that can transform someone else's life. We give you a world-class Course Studio platform to build, upload, and organize curriculum with zero hosting expenses.
                                </p>
                                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span><strong>Intuitive Course Studio:</strong> Add chapters, video lectures, and practice notes effortlessly.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span><strong>Keep 100% Rights:</strong> You retain complete ownership of your curriculum.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span><strong>National Reach:</strong> Connect directly with tens of thousands of enthusiastic students.</span>
                                    </li>
                                </ul>
                            </div>
                            <Link href="/how-to-publish" className="pt-4 block">
                                <button className="w-full h-11 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                                    Read Publishing Guide <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. FOUR CORE VALUES */}
            <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            CORE PRINCIPLES
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            What Guides Our Work Every Day
                        </h2>
                        <p className="text-slate-600 text-sm">
                            The commitments that shape every line of code and every feature we create.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0056D2] flex items-center justify-center font-bold">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-base text-slate-900">Universal Access</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Whether a student lives in a tier-1 metropolis or a remote village, high-quality lessons must always remain accessible on any smartphone.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <Users className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-base text-slate-900">Community Empowerment</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Anyone can be a teacher and anyone can be a student. We foster peer-to-peer growth, knowledge exchange, and mentorship.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <Heart className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-base text-slate-900">Selfless Service (Seba)</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                &apos;Seba&apos; means selfless social service. We do not sell user data, run intrusive ads, or charge paywalls. We exist purely for societal upliftment.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-base text-slate-900">Quality & Safety</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Administrative moderators review courses before publication to ensure syllabus accuracy, lesson clarity, and a respectful learning environment.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. WHO WE SERVE */}
            <section className="py-16 sm:py-20 bg-[#F8FAFC]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            AUDIENCE FOCUS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            Who Learns on Bharat Seva?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="text-3xl font-bold text-[#0056D2]">🎒</div>
                            <h3 className="font-bold text-base text-slate-900">School & College Students</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Students from Class 9 to graduation studying physics, chemistry, mathematics, and computer programming for exams and academic foundations.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="text-3xl font-bold text-emerald-600">💼</div>
                            <h3 className="font-bold text-base text-slate-900">Job Aspirants & Career Changers</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Learners building portfolios with real web applications, office Excel spreadsheets, resume preparation, and fluent conversational English.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                            <div className="text-3xl font-bold text-purple-600">📱</div>
                            <h3 className="font-bold text-base text-slate-900">Citizens & Lifelong Learners</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Homemakers, senior citizens, and working adults learning digital banking, cyber safety, government scheme access, and practical computer skills.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. BIG CALL TO ACTION BANNER */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-900 via-[#0056D2] to-indigo-900 text-white">
                <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        Join India&apos;s Open Education Movement
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Whether you want to learn a new skill today or share your wisdom with eager learners, your journey begins right here on Bharat Seva.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                        <Link href="/courses">
                            <button className="h-11 px-8 rounded-lg bg-white text-[#0056D2] font-bold text-sm shadow hover:bg-blue-50 transition-all">
                                Browse All Free Courses
                            </button>
                        </Link>
                        <Link href="/how-to-publish">
                            <button className="h-11 px-8 rounded-lg border border-white/40 hover:border-white text-white font-semibold text-sm transition-all">
                                How to Publish a Course
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
