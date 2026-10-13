import Link from 'next/link';
import { CourseResponse } from '@/lib/api/types';
import { BookOpen, User, Star, ChevronRight, Tag } from 'lucide-react';

interface CourseCardProps {
    course: CourseResponse;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col group h-full">
            {/* Card Thumbnail */}
            <Link href={`/courses/${course.courseCode || course.id}`} className="block aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
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
                
                {/* Badges */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
                        FREE
                    </span>
                </div>

                {course.difficulty && (
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                        {course.difficulty.replace('_', ' ')}
                    </span>
                )}
            </Link>
            
            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                    {course.categorySlug ? (
                        <Link 
                            href={`/courses?category=${course.categorySlug}`} 
                            className="text-[11px] font-semibold text-[#0056D2] hover:underline uppercase tracking-wider block truncate"
                        >
                            {course.categoryName || 'General Skills'}
                        </Link>
                    ) : (
                        <span className="text-[11px] font-semibold text-[#0056D2] uppercase tracking-wider block truncate">
                            {course.categoryName || 'General Skills'}
                        </span>
                    )}

                    <Link href={`/courses/${course.courseCode || course.id}`} className="block">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0056D2] transition-colors line-clamp-2 leading-snug">
                            {course.title}
                        </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                    </p>
                </div>
                
                {/* Card Footer with Teacher & Price */}
                <div className="space-y-2 pt-2 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0056D2] flex items-center justify-center font-bold text-[10px] shrink-0">
                                {course.teacherName?.charAt(0) || 'T'}
                            </div>
                            <span className="truncate font-medium text-slate-700">
                                {course.teacherName || 'Faculty Member'}
                            </span>
                        </div>
                        <span className="flex items-center font-bold text-amber-600 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 mr-1" /> 4.9
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold text-emerald-700">Free</span>
                            <span className="text-xs line-through text-slate-400">₹1,999</span>
                        </div>
                        <Link 
                            href={`/courses/${course.courseCode || course.id}`}
                            className="text-[11px] font-bold text-[#0056D2] group-hover:translate-x-0.5 transition-transform flex items-center"
                        >
                            Enroll Free <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
