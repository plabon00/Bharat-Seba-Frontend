'use client';

import { useEffect, useState } from 'react';
import { CourseResponse, PaginatedResponse } from '@/lib/api/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public-api';
import { CourseCard } from '@/components/courses/course-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen } from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        router.push(`/courses?q=${encodeURIComponent(query)}&page=0${categoryParam ? `&category=${categoryParam}` : ''}`);
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/courses?q=${encodeURIComponent(initialQuery)}&page=${newPage}${categoryParam ? `&category=${categoryParam}` : ''}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-heading">Explore Courses</h1>
                    <p className="text-muted-foreground mt-1">Discover new skills and knowledge</p>
                </div>
                
                <form onSubmit={handleSearch} className="flex w-full md:w-auto max-w-sm gap-2">
                    <Input 
                        type="text" 
                        placeholder="Search courses, teachers..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon">
                        <Search className="w-4 h-4" />
                    </Button>
                </form>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-8">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : courses && courses.content.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.content.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    
                    {courses.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <Button 
                                variant="outline" 
                                disabled={courses.first}
                                onClick={() => handlePageChange(courses.number - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {courses.number + 1} of {courses.totalPages}
                            </span>
                            <Button 
                                variant="outline" 
                                disabled={courses.last}
                                onClick={() => handlePageChange(courses.number + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 border rounded-xl bg-white">
                    <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-heading mb-2">No courses found</h3>
                    <p className="text-muted-foreground">Try adjusting your search query to find what you're looking for.</p>
                    {initialQuery && (
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                                setQuery('');
                                router.push('/courses');
                            }}
                        >
                            Clear Search
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading courses...</div>}>
            <CoursesContent />
        </Suspense>
    );
}
