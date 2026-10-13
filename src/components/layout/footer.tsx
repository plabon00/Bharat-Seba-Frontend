import Link from 'next/link';
import { BookOpen, Heart, Sparkles, Globe, Compass, PlusCircle, Users } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-white mt-20 pt-16 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="inline-block">
                            <img 
                                src="/Bharat Seva.png" 
                                alt="Bharat Seva" 
                                className="h-14 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                            Bharat Seva is an open, community-powered education platform. Anyone can create any course, and anyone can learn for free—democratizing knowledge across India and beyond.
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                            <Sparkles className="w-3.5 h-3.5" />
                            100% Free Forever • Open Community
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-heading uppercase tracking-wider">Explore</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/courses" className="hover:text-primary transition-colors flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5" /> All Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="hover:text-primary transition-colors">
                                    Course Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium text-slate-800">
                                    <Users className="w-3.5 h-3.5 text-primary" /> About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Creators / Teach */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-heading uppercase tracking-wider">Instructors & Studio</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/how-to-publish" className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium text-slate-800">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" /> How to Publish a Course
                                </Link>
                            </li>
                            <li>
                                <Link href="/teacher/courses" className="hover:text-primary transition-colors flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> Course Studio
                                </Link>
                            </li>
                            <li>
                                <Link href="/teacher/courses/new" className="hover:text-primary transition-colors flex items-center gap-1.5">
                                    <PlusCircle className="w-3.5 h-3.5" /> Create New Course
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>&copy; 2026 Bharat Seva Portal. Built with dedication for the community.</p>
                    <p className="flex items-center gap-1">
                        Empowering Bharat through open learning <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
