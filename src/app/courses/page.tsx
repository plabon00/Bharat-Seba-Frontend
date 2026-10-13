'use client';

import { useEffect, useState } from 'react';
import { CourseResponse, PaginatedResponse, CategoryResponse } from '@/lib/api/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public-api';
import { CourseCard } from '@/components/courses/course-card';
import { Search, BookOpen, X, Sparkles, Filter, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { Suspense } from 'react';

function CoursesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const initialQuery = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');
    const initialPage = pageParam ? parseInt(pageParam) : 0;
    
    const [query, setQuery] = useState(initialQuery);
    const [courses, setCourses] = useState<PaginatedResponse<CourseResponse> | null>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        publicApi.getCategories()
            .then(cats => setCategories(cats || defaultCategories))
            .catch(() => setCategories(defaultCategories));
    }, []);

    const fetchCourses = async (searchQuery: string, category: string | null, page: number) => {
        setIsLoading(true);
        try {
            let res;
            if (searchQuery) {
                res = await publicApi.searchCourses(searchQuery, page);
            } else if (category) {
                res = await publicApi.getCoursesByCategory(category, page);
            } else {
                res = await publicApi.getCourses(page);
            }

            // If empty result and on page 0 with no query, supply curated fallback courses
            if ((!res || res.content.length === 0) && page === 0 && !searchQuery) {
                let filtered = fallbackCourses;
                if (category) {
                    filtered = fallbackCourses.filter(c => c.categorySlug === category);
                }
                setCourses(createFallbackPagination(filtered));
            } else {
                setCourses(res);
            }
            setError(null);
        } catch (err: any) {
            // Graceful fallback for offline or unseeded database
            let filtered = fallbackCourses;
            if (searchQuery) {
                filtered = fallbackCourses.filter(c => 
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            } else if (category) {
                filtered = fallbackCourses.filter(c => c.categorySlug === category);
            }
            setCourses(createFallbackPagination(filtered));
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(initialQuery, categoryParam, initialPage);
    }, [initialQuery, categoryParam, initialPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (categoryParam) params.set('category', categoryParam);
        params.set('page', '0');
        router.push(`/courses?${params.toString()}`);
    };

    const handleCategoryClick = (slug: string | null) => {
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (slug) params.set('category', slug);
        params.set('page', '0');
        router.push(`/courses?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams();
        if (initialQuery) params.set('q', initialQuery);
        if (categoryParam) params.set('category', categoryParam);
        params.set('page', newPage.toString());
        router.push(`/courses?${params.toString()}`);
    };

    const activeCategory = categories.find(c => c.slug === categoryParam);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans selection:bg-[#0056D2] selection:text-white">
            
            {/* 1. TOP HEADER & SEARCH BANNER (Coursera / Udemy style) */}
            <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                100% Free Public Knowledge Catalog
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Explore All Free Courses
                            </h1>

                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                Master school science, modern coding, spoken English, and job-ready practical skills. 
                                Taught by passionate teachers across India with zero tuition fees.
                            </p>
                        </div>

                        {/* Search Input Box */}
                        <form onSubmit={handleSearch} className="w-full md:w-80 shrink-0">
                            <div className="relative flex items-center bg-white border-2 border-slate-300 hover:border-[#0056D2] focus-within:border-[#0056D2] rounded-xl shadow-xs overflow-hidden transition-all">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                                <input 
                                    type="text" 
                                    placeholder="Search by topic or skill..." 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
                                />
                                {query && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setQuery(''); router.push(categoryParam ? `/courses?category=${categoryParam}` : '/courses'); }}
                                        className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORY PILLS BAR & FILTER CONTROLS */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Filter className="w-3.5 h-3.5 text-[#0056D2]" /> Filter by Category
                        </span>
                        {categoryParam && (
                            <button 
                                onClick={() => handleCategoryClick(null)}
                                className="text-xs text-[#0056D2] hover:underline font-semibold"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills (Horizontal Scrollable) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                                !categoryParam 
                                    ? 'bg-[#0056D2] text-white shadow-xs' 
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            All Categories
                        </button>

                        {categories.map((cat) => {
                            const isSelected = categoryParam === cat.slug;
                            return (
                                <button
                                    key={cat.id || cat.slug}
                                    onClick={() => handleCategoryClick(isSelected ? null : cat.slug)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                                        isSelected 
                                            ? 'bg-[#0056D2] text-white shadow-xs' 
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Category Information Banner */}
                    {activeCategory && (
                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sm text-[#0056D2]">{activeCategory.name}</h3>
                                <p className="text-xs text-slate-600 mt-0.5">{activeCategory.description || 'Showing all courses in this category.'}</p>
                            </div>
                            <button 
                                onClick={() => handleCategoryClick(null)}
                                className="text-xs font-bold text-[#0056D2] hover:underline ml-4 shrink-0"
                            >
                                Show All
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl my-6 text-sm">
                        {error}
                    </div>
                )}

                {/* 3. COURSES GRID */}
                <div className="pt-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-80 bg-white animate-pulse rounded-xl border border-slate-200" />
                            ))}
                        </div>
                    ) : courses && courses.content.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {courses.content.map(course => (
                                    <CourseCard key={course.id || course.courseCode} course={course} />
                                ))}
                            </div>
                            
                            {courses.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-12 pt-6 border-t border-slate-200">
                                    <button 
                                        disabled={courses.first}
                                        onClick={() => handlePageChange(courses.number - 1)}
                                        className="h-10 px-4 rounded-lg border border-slate-300 hover:bg-white text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </button>
                                    <span className="text-xs text-slate-600 font-medium px-2">
                                        Page {courses.number + 1} of {courses.totalPages}
                                    </span>
                                    <button 
                                        disabled={courses.last}
                                        onClick={() => handlePageChange(courses.number + 1)}
                                        className="h-10 px-4 rounded-lg border border-slate-300 hover:bg-white text-xs font-semibold disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1"
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white shadow-xs">
                            <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No courses found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                                {categoryParam 
                                    ? `No courses found in category '${activeCategory?.name || categoryParam}'.` 
                                    : "Try adjusting your search terms or browse another category."}
                            </p>
                            {(initialQuery || categoryParam) && (
                                <button 
                                    onClick={() => {
                                        setQuery('');
                                        router.push('/courses');
                                    }}
                                    className="h-9 px-4 rounded-lg bg-[#0056D2] text-white text-xs font-bold shadow-xs hover:bg-[#00419e] transition-all"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-sm text-slate-500">Loading courses catalog...</div>}>
            <CoursesContent />
        </Suspense>
    );
}

const createFallbackPagination = (filtered: CourseResponse[]): PaginatedResponse<CourseResponse> => ({
    content: filtered,
    totalElements: filtered.length,
    totalPages: 1,
    size: 12,
    number: 0,
    first: true,
    last: true,
    numberOfElements: filtered.length,
    pageable: { pageNumber: 0, pageSize: 12 },
    empty: filtered.length === 0
});

const defaultCategories: CategoryResponse[] = [
    { id: '1', name: 'Computer & Coding', slug: 'programming', description: 'HTML, CSS, JavaScript, React, Python and web engineering.', displayOrder: 1 },
    { id: '2', name: 'School Science', slug: 'science', description: 'Class 9 to 12 physics, chemistry, biology and exam prep.', displayOrder: 2 },
    { id: '3', name: 'Spoken English', slug: 'languages', description: 'Conversational fluency, grammar, vocabulary and job interview skills.', displayOrder: 3 },
    { id: '4', name: 'Cyber & Safety', slug: 'public-skills', description: 'Digital banking, online security, UPI, and public portals.', displayOrder: 4 },
    { id: '5', name: 'Business Skills', slug: 'business', description: 'Spreadsheets, Excel, typing, and workplace office fundamentals.', displayOrder: 5 }
];

const fallbackCourses: CourseResponse[] = [
    {
        id: '1',
        courseCode: 'SCI-09',
        title: 'Class IX Physical Science & Laboratory Foundation',
        description: 'Complete physics and chemistry syllabus for Class IX students with experiments and practice questions.',
        teacherName: 'Prof. S. Paul',
        categoryName: 'School Science',
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
        categoryName: 'Computer & Coding',
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
        categoryName: 'Cyber & Safety',
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
        categoryName: 'Spoken English',
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
        categoryName: 'School Science',
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
        categoryName: 'Computer & Coding',
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
        categoryName: 'Computer & Coding',
        categorySlug: 'programming',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED'
    }
];
