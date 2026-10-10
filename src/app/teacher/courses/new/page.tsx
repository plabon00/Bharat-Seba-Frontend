'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { publicApi } from '@/lib/api/public-api';
import { teacherApi } from '@/lib/api/teacher-api';
import { CategoryResponse } from '@/lib/api/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const courseSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    thumbnailUrl: z.string().url('Must be a valid URL').or(z.string().length(0)).optional(),
    categoryId: z.string().uuid('Please select a valid category'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            difficulty: 'ALL_LEVELS'
        }
    });

    useEffect(() => {
        publicApi.getCategories().then(setCategories).catch(console.error);
    }, []);

    const onSubmit = async (data: CourseFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const course = await teacherApi.createCourse(data);
            router.push(`/teacher/courses/${course.id}/edit`);
        } catch (err: any) {
            setError(err.message || 'Failed to create course');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-heading">Create a New Course</h1>
                <p className="text-muted-foreground">Fill in the basic details to create a draft course.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>You can edit these details later.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-white bg-destructive rounded-md">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input id="title" {...register('title')} placeholder="e.g., Introduction to React" />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea 
                                id="description" 
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                {...register('description')}
                                placeholder="Describe what students will learn..."
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Category</Label>
                                <select 
                                    id="categoryId"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    {...register('categoryId')}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty Level</Label>
                                <select 
                                    id="difficulty"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    {...register('difficulty')}
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="ALL_LEVELS">All Levels</option>
                                </select>
                                {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
                            <Input id="thumbnailUrl" {...register('thumbnailUrl')} placeholder="https://example.com/image.jpg" />
                            {errors.thumbnailUrl && <p className="text-sm text-destructive">{errors.thumbnailUrl.message}</p>}
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Draft'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
