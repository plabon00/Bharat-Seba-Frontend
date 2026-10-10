import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Video, Target, Award, Sparkles, Globe, PlayCircle, Zap, Shield, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F7F9FC] to-white py-24 lg:py-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                Empowering India's Digital Future
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-[#14213D] leading-[1.1] tracking-tight">
                Unlock Your Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Bharat Seva</span>
              </h1>
              <p className="text-xl text-[#526078] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Learn from industry experts, upgrade your skills, and advance your career with our carefully curated, 100% free learning paths accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <Link href="/courses" className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 px-8 text-lg w-full rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">
                    Explore Courses
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full rounded-full bg-white hover:bg-slate-50 transition-all">
                    Become an Instructor
                  </Button>
                </Link>
              </div>
              
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-[#526078] text-sm font-medium">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    100% Free Forever
                </div>
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Learn Anywhere
                </div>
              </div>
            </div>
            
            {/* Hero Visual Mockup */}
            <div className="relative hidden lg:block">
               <div className="relative rounded-2xl border bg-white/50 backdrop-blur-sm p-4 shadow-2xl">
                 <div className="absolute -left-6 -top-6 h-24 w-24 rounded-2xl bg-yellow-400/20 blur-2xl" />
                 <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                    alt="Students Learning" 
                    className="rounded-xl object-cover w-full h-[450px] shadow-sm"
                 />
                 
                 {/* Floating Badges */}
                 <div className="absolute -bottom-6 -left-6 rounded-xl border bg-white p-4 shadow-xl animate-bounce-slow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Active Learners</p>
                            <p className="text-xl font-bold text-[#14213D]">50,000+</p>
                        </div>
                    </div>
                 </div>
                 
                 <div className="absolute -top-6 -right-6 rounded-xl border bg-white p-4 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Average Rating</p>
                            <p className="text-xl font-bold text-[#14213D]">4.9/5.0</p>
                        </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-y bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-[#14213D]">1K+</h3>
                    <p className="text-slate-500 font-medium">Free Courses</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-[#14213D]">50K+</h3>
                    <p className="text-slate-500 font-medium">Happy Students</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-[#14213D]">200+</h3>
                    <p className="text-slate-500 font-medium">Expert Teachers</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-[#14213D]">98%</h3>
                    <p className="text-slate-500 font-medium">Completion Rate</p>
                </div>
            </div>
        </div>
      </section>

      {/* 3. OUR VISION SECTION */}
      <section className="py-24 bg-[#F7F9FC]">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                    <img 
                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                        alt="Our Vision" 
                        className="rounded-3xl shadow-xl border-4 border-white"
                    />
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10"></div>
                </div>
                <div className="order-1 lg:order-2 space-y-6">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Our Vision</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-[#14213D] leading-tight">
                        Democratizing Education for the Modern Era
                    </h3>
                    <p className="text-[#526078] text-lg leading-relaxed">
                        At Bharat Seva, we believe that high-quality education shouldn't be a privilege reserved for the few. Our platform bridges the gap between passionate educators and eager learners, completely free of charge.
                    </p>
                    <ul className="space-y-4 pt-4">
                        {[
                            { icon: Target, text: "Mission-driven to reach every corner of the nation" },
                            { icon: Award, text: "Uncompromising focus on educational quality" },
                            { icon: Users, text: "Fostering a supportive community of lifelong learners" }
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium text-[#14213D]">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* 4. FOR STUDENTS (FEATURES) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#14213D]">Why Learn with Us?</h2>
              <p className="text-[#526078] text-lg">
                  Everything you need to master a new skill, built into one seamless platform.
              </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { icon: PlayCircle, title: "High-Quality Video Lessons", desc: "Learn visually through expertly crafted video content.", color: "bg-blue-100 text-blue-600" },
                { icon: Zap, title: "Learn at Your Pace", desc: "No deadlines. Access your courses 24/7 and learn whenever you want.", color: "bg-yellow-100 text-yellow-600" },
                { icon: Globe, title: "Accessible Anywhere", desc: "Seamlessly switch between your desktop, tablet, and mobile devices.", color: "bg-green-100 text-green-600" },
                { icon: Shield, title: "Trusted Content", desc: "Courses are vetted and reviewed by our community and moderators.", color: "bg-purple-100 text-purple-600" },
                { icon: BookOpen, title: "Comprehensive Resources", desc: "Get access to text notes, external links, and structured chapters.", color: "bg-pink-100 text-pink-600" },
                { icon: Sparkles, title: "Absolutely Free", desc: "We don't charge you a single rupee. Knowledge is completely free.", color: "bg-orange-100 text-orange-600" },
            ].map((feature, idx) => (
                <Card key={idx} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <CardContent className="p-8 space-y-4 text-center flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#14213D]">{feature.title}</h3>
                        <p className="text-[#526078] leading-relaxed">{feature.desc}</p>
                    </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOR TEACHERS */}
      <section className="py-24 bg-[#14213D] text-white">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6 order-2 lg:order-1">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase">For Educators</h2>
                    <h3 className="text-3xl lg:text-5xl font-bold leading-tight">
                        Share Your Knowledge.<br/>Build Your Legacy.
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                        Are you an expert in your field? Join Bharat Seva as an instructor and reach thousands of eager learners across the country. Our powerful course builder makes it incredibly easy to create and publish your courses.
                    </p>
                    <div className="pt-6">
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white border-0">
                                Start Teaching Today
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" className="rounded-2xl object-cover h-64 w-full" alt="Teacher 1" />
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" className="rounded-2xl object-cover h-64 w-full mt-12" alt="Teacher 2" />
                </div>
            </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-[#14213D]">Ready to Start Learning?</h2>
            <p className="text-xl text-[#526078] max-w-2xl mx-auto">
                Join our community of over 50,000 learners today. Creating an account is completely free and takes less than a minute.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg hover:-translate-y-1 transition-transform">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full bg-white hover:bg-slate-50">
                    Browse Courses First
                  </Button>
                </Link>
            </div>
        </div>
      </section>
      
    </div>
  );
}
