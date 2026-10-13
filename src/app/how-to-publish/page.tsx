'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    BookOpen, CheckCircle, ArrowRight, Play, Award, Sparkles, 
    Video, FileText, PlusCircle, Check, HelpCircle, 
    Upload, Eye, ShieldCheck, ChevronDown, Rocket, Lightbulb
} from 'lucide-react';

export default function HowToPublishPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans selection:bg-[#0056D2] selection:text-white">
            
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-white border-b border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/40 pointer-events-none" />
                
                <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Instructor Publishing Guide
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
                        How to Publish a Free Course on <span className="text-[#0056D2]">Bharat Seva</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
                        A step-by-step guide for teachers, professors, and subject mentors. Share your knowledge with over 50,000 learners nationwide with zero hosting or platform fees.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        <Link href="/teacher/courses/new">
                            <button className="h-11 px-6 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> Open Course Studio
                            </button>
                        </Link>
                        <Link href="/courses">
                            <button className="h-11 px-6 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2">
                                Browse Existing Courses
                            </button>
                        </Link>
                    </div>

                    {/* Quick Highlights Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto text-left">
                        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl">
                            <div className="text-xl font-bold text-[#0056D2]">100% Free</div>
                            <div className="text-xs text-slate-500 mt-0.5">Zero platform & hosting fees</div>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl">
                            <div className="text-xl font-bold text-emerald-600">Quick Review</div>
                            <div className="text-xs text-slate-500 mt-0.5">Approved in 24 to 48 hours</div>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl">
                            <div className="text-xl font-bold text-amber-600">50,000+</div>
                            <div className="text-xs text-slate-500 mt-0.5">Active students across India</div>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl">
                            <div className="text-xl font-bold text-purple-600">Your Content</div>
                            <div className="text-xs text-slate-500 mt-0.5">Full ownership & creator credit</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6-STEP PUBLISHING ROADMAP */}
            <section className="py-16 bg-[#F8FAFC]">
                <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    <div className="text-center space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            STEP-BY-STEP INSTRUCTIONS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            6 Easy Steps to Publish Your Course
                        </h2>
                        <p className="text-slate-600 text-sm max-w-xl mx-auto">
                            Follow these simple steps in our Course Studio to get your course ready for students.
                        </p>
                    </div>

                    {/* Step Cards List */}
                    <div className="space-y-6">
                        
                        {/* Step 1 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0056D2] font-black text-xl flex items-center justify-center shrink-0">
                                01
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Sign Up & Open the Course Studio
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Sign in to your Bharat Seva account using your email or Google account. From the top navigation bar, click on <strong className="text-slate-800">Course Studio</strong> (or visit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-[#0056D2]">/teacher/courses</code>). Click the blue <strong className="text-slate-800">Create Course</strong> button.
                                </p>
                                <div className="pt-2 flex items-center gap-2 text-xs text-[#0056D2] font-medium">
                                    <Check className="w-4 h-4 text-emerald-600" /> All verified teacher accounts have free access to the Course Studio.
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center shrink-0">
                                02
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Fill in Course Basics (Title, Category & Level)
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Give your course a clear, descriptive title that students easily recognize (e.g. <em>Class 10 Physical Science: Light & Optics</em> or <em>Full Stack Web Development</em>).
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <span className="font-bold text-slate-800 block">Category</span>
                                        <span className="text-slate-500">Science, Coding, English, etc.</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <span className="font-bold text-slate-800 block">Difficulty</span>
                                        <span className="text-slate-500">Beginner, Intermediate, Advanced</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <span className="font-bold text-slate-800 block">Summary</span>
                                        <span className="text-slate-500">2-3 sentences on what students learn</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-black text-xl flex items-center justify-center shrink-0">
                                03
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Upload a High-Quality Thumbnail Image
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    A great course thumbnail creates an instant good impression. You can upload an image file (JPG or PNG) or paste a direct image URL.
                                </p>
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span><strong>Pro Tip:</strong> Use standard 16:9 widescreen images (1280x720 pixels). Keep text large and high-contrast so students browsing on mobile phones can read it clearly.</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center shrink-0">
                                04
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Add Curriculum Modules & Video Lessons
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Break your course into structured chapters or modules. Inside each module, click <strong className="text-slate-800">Add Lesson</strong> to add video lectures and reading notes.
                                </p>
                                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        <span><strong>Video URLs:</strong> Paste YouTube links (Public or Unlisted) or direct video stream links.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        <span><strong>Summary Notes:</strong> Write bullet points, formulas, or code snippets for each lesson.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        <span><strong>Lesson Duration:</strong> Recommended 5 to 15 minutes per video for optimal attention.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center shrink-0">
                                05
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Preview Course Exactly as Students See It
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Before publishing, use the built-in <strong className="text-slate-800">Preview Mode</strong>. This lets you play through your videos, check that your syllabus order is correct, and verify that notes formatting looks crisp on desktop and mobile.
                                </p>
                            </div>
                        </div>

                        {/* Step 6 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0056D2] font-black text-xl flex items-center justify-center shrink-0">
                                06
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Submit for Admin Approval & Go Live!
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Click <strong className="text-slate-800">Submit for Approval</strong>. Our curriculum moderator team verifies the content for student safety and syllabus accuracy within 24 to 48 hours.
                                </p>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#0056D2] space-y-1">
                                    <div className="font-bold flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4" /> Transparent Status Tracking in Studio
                                    </div>
                                    <p className="text-slate-600">
                                        You can view status updates (Pending, Approved, or Suggested Edits) directly on your course card in the Course Studio. Once approved, your course is immediately published to 50,000+ students!
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* QUALITY GUIDELINES SECTION */}
            <section className="py-16 bg-white border-y border-slate-200">
                <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full">
                            BEST PRACTICES
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Course Quality Guidelines
                        </h2>
                        <p className="text-slate-600 text-sm max-w-xl mx-auto">
                            Follow these simple standards to make sure your course is approved quickly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0056D2] flex items-center justify-center font-bold">
                                🔊
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Clear Audio & Speech</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Good sound is even more important than 4K video. Use an inexpensive mic, minimize background noise, and speak at a steady pace.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                ⏱️
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Bite-Sized Lessons</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Keep individual videos between 5 to 15 minutes. This makes it easy for students to study on their daily commute or during lunch breaks.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                                📝
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Original & Safe Content</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Share your own teaching, diagrams, and explanations. Avoid using copyrighted music or unauthorized video clips.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* TEACHER FAQ ACCORDION */}
            <section className="py-16 bg-[#F8FAFC]">
                <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Instructor Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Answers to common questions from educators and creators.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {teacherFaqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div 
                                    key={index}
                                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs transition-colors"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#0056D2] transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#0056D2]' : 'text-slate-400'}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* FINAL CTA BANNER */}
            <section className="py-16 bg-white border-t border-slate-200 text-center">
                <div className="max-w-[680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        Ready to Create Your First Course?
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Join passionate educators teaching science, computer programming, languages, and vocational skills. It's completely free to publish.
                    </p>
                    <div className="pt-2">
                        <Link href="/teacher/courses/new">
                            <button className="h-11 px-8 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm shadow-sm hover:shadow transition-all inline-flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> Start Building in Course Studio
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

const teacherFaqs = [
    {
        question: "Does Bharat Seva charge any fees to publish courses?",
        answer: "No, never. Bharat Seva is a non-profit public initiative. There are zero platform fees, zero video hosting costs, and zero publishing commissions. Every educator can publish completely free."
    },
    {
        question: "Who owns the copyright and intellectual property of the course?",
        answer: "You do. You retain 100% intellectual property ownership of your lectures, curriculum, and notes. Bharat Seva simply acts as a public distribution platform connecting you to students."
    },
    {
        question: "Can I teach in languages other than English?",
        answer: "Absolutely! We strongly encourage courses in Hindi, Bengali, Tamil, Telugu, Marathi, and all Indian regional languages. Regional language education has the highest student demand on our portal."
    },
    {
        question: "What happens if an admin requests edits on my course?",
        answer: "If our moderation team suggests changes (such as fixing a broken video link or adjusting a module title), you will see clear feedback in your Course Studio. You can update the course and resubmit with one click."
    },
    {
        question: "Can I update or add more lessons after my course is published?",
        answer: "Yes! You can add new chapters, upload fresh practice questions, or update video links at any time from your Course Studio dashboard."
    }
];
