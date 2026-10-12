import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    BookOpen, Users, Sparkles, GraduationCap, Globe, Heart, 
    ShieldCheck, ArrowRight, Rocket, Share2, Video, Layers, 
    CheckCircle2, Compass, Award 
} from 'lucide-react';

export const metadata = {
    title: 'About Us | Bharat Seva - An Open Community for Education',
    description: 'Learn about Bharat Seva, an open community platform where anyone can create any course and anyone can learn for free. Bridging knowledge across India.',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 py-20 lg:py-28 border-b">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-primary/10 to-blue-300/10 rounded-full blur-3xl -z-10" />
                
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Who We Are & What We Stand For
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-heading tracking-tight leading-[1.15] mb-6">
                        A Community Where <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                            Anyone Can Teach, Anyone Can Learn.
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                        At <strong className="text-slate-800 font-semibold">Bharat Seva</strong>, we believe knowledge should never be trapped behind paywalls or credentialism. We are cultivating an open, community-driven education movement where anyone with a passion can create any course, and anyone with a desire to grow can learn from it—completely free.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/courses">
                            <Button size="lg" className="rounded-full shadow-md shadow-primary/20 gap-2 px-8 h-12 text-base">
                                <Compass className="w-4 h-4" /> Start Learning Free
                            </Button>
                        </Link>
                        <Link href="/teacher/courses/new">
                            <Button size="lg" variant="outline" className="rounded-full bg-white hover:bg-slate-50 gap-2 px-8 h-12 text-base border-slate-300">
                                <Rocket className="w-4 h-4 text-primary" /> Create a Course
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
                        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-3xl font-black text-primary mb-1">100%</div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Free Access</div>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-3xl font-black text-emerald-600 mb-1">Open</div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">To Any Creator</div>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-3xl font-black text-amber-500 mb-1">3+</div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Languages</div>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-3xl font-black text-blue-600 mb-1">All</div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Skill Domains</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE MANIFESTO / OUR MISSION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight mb-4">
                            The Bharat Seva Manifesto
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
                            Every single person knows something that can transform someone else's life. We exist to build the bridge between the two.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Column 1: Anyone can create */}
                        <Card className="rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50/40 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <Rocket className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-heading mb-3">Anyone Can Create Any Course</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    You don't need a PhD or a studio to teach on Bharat Seva. Whether you are a software developer teaching web design, a craftsman sharing woodwork, a high schooler explaining algebra, or a storyteller sharing cultural heritage—our Course Studio gives you every tool to build courses, organize modules, add videos, and share your wisdom with the world.
                                </p>
                                <ul className="space-y-3 text-sm text-slate-700">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Intuitive Course Studio:</strong> Effortlessly arrange chapters, video links, and tutorial text.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Direct ImgBB Image Uploads:</strong> Create high-impact course thumbnails with one click.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Zero Fees or Royalties:</strong> Your knowledge belongs to you and reaches everyone.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-8">
                                <Link href="/teacher/courses/new">
                                    <Button className="w-full gap-2 rounded-xl">
                                        Start Your First Course <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Column 2: Anyone can learn */}
                        <Card className="rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50/30 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6">
                                    <GraduationCap className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-heading mb-3">Anyone Can Learn Without Limits</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Quality education should never be a luxury reserved for the few. On Bharat Seva, every single course is free and openly accessible. Learners across every state, town, and village in India can master new skills, prepare for careers, and unlock their potential at their own pace.
                                </p>
                                <ul className="space-y-3 text-sm text-slate-700">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Zero Subscriptions:</strong> No hidden payments, no gated final exams, always 100% free.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Multilingual Learning:</strong> Built-in support for English, Hindi, Bengali, and more.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span><strong>Learn on Any Device:</strong> Mobile-friendly, high-speed streaming and readable text guides.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-8">
                                <Link href="/courses">
                                    <Button variant="outline" className="w-full gap-2 rounded-xl border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                                        Browse Course Catalog <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CORE COMMUNITY VALUES */}
            <section className="py-20 bg-slate-50/70 border-y">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">What Guides Us</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight mt-1 mb-4">
                            Our Core Community Principles
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            The driving convictions that shape every feature we build and every decision we make.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-4">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-heading text-lg mb-2">Radical Access</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                No paywalls, no barriers. Whether you are in a metro city or a rural village, world-class knowledge is available at your fingertips.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-heading text-lg mb-2">Peer Empowerment</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Everyone is a student in some domains and a teacher in others. We empower peer-to-peer sharing and mutual growth.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-heading text-lg mb-2">Service to Bharat</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                'Seba' means selfless service. We are committed to uplifting India's youth, vocational learners, and aspiring professionals.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-heading text-lg mb-2">Quality & Trust</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Through community feedback, transparent reviews, and instructor tools, we ensure a safe, engaging, and enriching space.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">Simple & Open</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight mt-1 mb-4">
                            How the Bharat Seva Platform Works
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            From creating your first course draft to mastering a brand-new skill in three simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                            <div className="text-4xl font-black text-primary/20 mb-3">01</div>
                            <h3 className="text-xl font-bold text-heading mb-2">Sign Up & Join</h3>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Create an account in seconds with your email. All accounts automatically have access to both learning and creating courses.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                            <div className="text-4xl font-black text-primary/20 mb-3">02</div>
                            <h3 className="text-xl font-bold text-heading mb-2">Create or Enroll</h3>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Use the Course Studio to upload thumbnail images, attach YouTube videos, and write lessons. Or browse categories and enroll in courses instantly.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                            <div className="text-4xl font-black text-primary/20 mb-3">03</div>
                            <h3 className="text-xl font-bold text-heading mb-2">Grow the Community</h3>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Track completion, share feedback, expand curriculum, and invite friends and students across Bharat to join the learning movement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BIG CALL TO ACTION BANNER */}
            <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
                <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                        Be Part of India's Open Education Movement
                    </h2>
                    <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Whether you want to impart knowledge or expand your horizons, your journey begins right here on Bharat Seva.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href="/teacher/courses/new">
                            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold rounded-full px-8 h-12 shadow-lg">
                                Create a Course Now
                            </Button>
                        </Link>
                        <Link href="/courses">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 h-12">
                                Browse All Courses
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
