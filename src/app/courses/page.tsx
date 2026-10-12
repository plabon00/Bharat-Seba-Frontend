'use client';

import { useEffect, useState } from 'react';
import { CourseResponse, PaginatedResponse, CategoryResponse } from '@/lib/api/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public-api';
import { CourseCard } from '@/components/courses/course-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Layers, X, Sparkles, Filter } from 'lucide-react';
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
            .then(cats => setCategories(cats || []))
            .catch(err => console.error('Failed to load categories', err));
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
            setCourses(res);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch courses');
            setCourses(null);
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Top Header & Search Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-slate-100 pb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> Open Knowledge Catalog
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-heading tracking-tight">
                        Explore Community Courses
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                        Discover free courses created by passionate teachers, practitioners, and peers across India.
                    </p>
                </div>
                
                <form onSubmit={handleSearch} className="flex w-full md:w-80 gap-2 shrink-0">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input 
                            type="text" 
                            placeholder="Search topics, skills..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 h-10 text-sm"
                        />
                        {query && (
                            <button 
                                type="button" 
                                onClick={() => { setQuery(''); router.push(categoryParam ? `/courses?category=${categoryParam}` : '/courses'); }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" className="h-10 px-4">
                        Search
                    </Button>
                </form>
            </div>

            {/* CATEGORIES SECTION (INSIDE COURSE PAGE) */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" /> Filter by Category
                    </span>
                    {categoryParam && (
                        <button 
                            onClick={() => handleCategoryClick(null)}
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            Reset Category
                        </button>
                    )}
                </div>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            !categoryParam 
                                ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                    >
                        All Categories
                    </button>

                    {categories.map((cat) => {
                        const isSelected = categoryParam === cat.slug;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(isSelected ? null : cat.slug)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    isSelected 
                                        ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                                }`}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Active Category Banner */}
                {activeCategory && (
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-heading">{activeCategory.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{activeCategory.description}</p>
                        </div>
                        <button 
                            onClick={() => handleCategoryClick(null)}
                            className="text-xs font-semibold text-primary hover:underline ml-4 shrink-0"
                        >
                            Show All
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl mb-8 text-sm">
                    {error}
                </div>
            )}

            {/* Courses Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-72 bg-slate-100 animate-pulse rounded-2xl border" />
                    ))}
                </div>
            ) : courses && courses.content.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {courses.content.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    
                    {courses.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-12 pt-6 border-t border-slate-100">
                            <Button 
                                variant="outline" 
                                size="sm"
                                disabled={courses.first}
                                onClick={() => handlePageChange(courses.number - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-xs text-slate-500 font-medium px-2">
                                Page {courses.number + 1} of {courses.totalPages}
                            </span>
                            <Button 
                                variant="outline" 
                                size="sm"
                                disabled={courses.last}
                                onClick={() => handlePageChange(courses.number + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-heading mb-1">No courses found</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                        {categoryParam 
                            ? `No courses found in category '${activeCategory?.name || categoryParam}'.` 
                            : "Try adjusting your search terms or browse another category."}
                    </p>
                    {(initialQuery || categoryParam) && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                                setQuery('');
                                router.push('/courses');
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading courses catalog...</div>}>
            <CoursesContent />
        </Suspense>
    );
}
