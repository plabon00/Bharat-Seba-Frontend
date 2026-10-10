'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/api/public-api';
import { CategoryResponse } from '@/lib/api/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tags, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function CategoriesContent() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        publicApi.getCategories()
            .then(cats => {
                setCategories(cats);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch categories", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="container mx-auto p-8 animate-pulse text-center">Loading categories...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-heading mb-4 flex justify-center items-center gap-3">
                    <Tags className="w-8 h-8 text-primary" />
                    Browse Categories
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore our wide range of course categories to find exactly what you're looking for to advance your skills.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow group">
                        <CardContent className="p-6 flex flex-col h-full">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-heading mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h2>
                                <p className="text-muted-foreground text-sm mb-6">
                                    {category.description || `Explore all courses related to ${category.name}. Enhance your knowledge and build new skills in this field.`}
                                </p>
                            </div>
                            <Link href={`/courses?category=${category.slug}`} className="mt-auto block">
                                <Button className="w-full gap-2 justify-between group-hover:bg-primary/90">
                                    See All Courses <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {categories.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No categories found.
                </div>
            )}
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={<div className="container p-8 text-center">Loading...</div>}>
            <CategoriesContent />
        </Suspense>
    );
}
