'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Upload, ImageIcon, CheckCircle, AlertCircle, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const courseSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    thumbnailUrl: z.string().optional(),
    categoryId: z.string().min(1, 'Please select a valid category'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image upload states
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [showManualUrl, setShowManualUrl] = useState(false);
    const [submitForReview, setSubmitForReview] = useState(true);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            difficulty: 'ALL_LEVELS',
            thumbnailUrl: ''
        }
    });

    const currentThumbnail = watch('thumbnailUrl');

    useEffect(() => {
        publicApi.getCategories()
            .then(cats => setCategories(cats || []))
            .catch(err => console.error('Failed to load categories', err));
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic client validation
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file (.png, .jpg, .jpeg, .webp)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError('Image size exceeds 10MB limit.');
            return;
        }

        setIsUploadingImage(true);
        setUploadError(null);

        try {
            const res = await teacherApi.uploadThumbnail(file);
            if (res && res.url) {
                setUploadedUrl(res.url);
                setValue('thumbnailUrl', res.url, { shouldValidate: true });
            } else {
                throw new Error('No image URL returned by the server.');
            }
        } catch (err: any) {
            console.error('Image upload failed:', err);
            setUploadError(err.message || 'Failed to upload image to ImgBB.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveThumbnail = () => {
        setUploadedUrl('');
        setValue('thumbnailUrl', '', { shouldValidate: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: CourseFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const payload = {
                title: data.title.trim(),
                description: data.description.trim(),
                categoryId: data.categoryId,
                difficulty: data.difficulty,
                thumbnailUrl: data.thumbnailUrl && data.thumbnailUrl.trim() !== '' ? data.thumbnailUrl.trim() : null
            };

            const course = await teacherApi.createCourse(payload);
            router.push(`/teacher/courses/${course.id}/edit`);
        } catch (err: any) {
            console.error('Course creation error:', err);
            setError(err.message || 'Failed to create course. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <Link href="/teacher/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Course Studio
                </Link>
                <h1 className="text-3xl font-bold text-heading">Create a New Course</h1>
                <p className="text-muted-foreground text-sm mt-1">Set up the initial course details and curriculum will follow.</p>
            </div>

            <Card className="border border-slate-200/90 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>Fill out the fundamental information for your new course.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                <div>
                                    <h4 className="font-semibold">Creation Failed</h4>
                                    <p className="text-xs mt-0.5">{error}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-semibold text-slate-700">Course Title *</Label>
                            <Input 
                                id="title" 
                                {...register('title')} 
                                placeholder="e.g., Complete Full-Stack Web Development Masterclass" 
                                className="h-11"
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-semibold text-slate-700">Description *</Label>
                            <textarea 
                                id="description" 
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                {...register('description')}
                                placeholder="Describe what students will learn, who this is for, and prerequisites..."
                            />
                            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="categoryId" className="font-semibold text-slate-700">Category *</Label>
                                <select 
                                    id="categoryId"
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    {...register('categoryId')}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty" className="font-semibold text-slate-700">Difficulty Level *</Label>
                                <select 
                                    id="difficulty"
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    {...register('difficulty')}
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="ALL_LEVELS">All Levels</option>
                                </select>
                                {errors.difficulty && <p className="text-xs text-destructive">{errors.difficulty.message}</p>}
                            </div>
                        </div>

                        {/* Thumbnail Image Section */}
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold text-slate-700 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-primary" /> Course Thumbnail (ImgBB Upload)
                                </Label>
                                <button 
                                    type="button" 
                                    onClick={() => setShowManualUrl(!showManualUrl)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    {showManualUrl ? 'Hide manual URL' : 'Or enter custom URL'}
                                </button>
                            </div>

                            {/* Hidden file input */}
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Thumbnail Preview or Upload Box */}
                            {currentThumbnail ? (
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-full sm:w-48 h-28 rounded-lg overflow-hidden border bg-white flex items-center justify-center relative shrink-0">
                                        <img 
                                            src={currentThumbnail} 
                                            alt="Thumbnail preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-600">
                                            <CheckCircle className="w-4 h-4" /> Thumbnail Ready
                                        </div>
                                        <p className="text-xs text-muted-foreground break-all truncate font-mono">
                                            {currentThumbnail}
                                        </p>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploadingImage}
                                            >
                                                Change Image
                                            </Button>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={handleRemoveThumbnail}
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                                        isUploadingImage 
                                            ? 'border-primary/50 bg-primary/5' 
                                            : 'border-slate-300 hover:border-primary hover:bg-slate-50'
                                    }`}
                                >
                                    {isUploadingImage ? (
                                        <div className="flex flex-col items-center justify-center py-4">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                            <p className="text-sm font-semibold text-heading">Uploading image to ImgBB...</p>
                                            <p className="text-xs text-muted-foreground mt-1">Please wait while the thumbnail is hosted.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-2">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-semibold text-heading text-sm mb-1">Click to upload course thumbnail</h4>
                                            <p className="text-xs text-muted-foreground max-w-sm mb-2">
                                                Supports PNG, JPG, JPEG, WEBP up to 10MB. Hosted directly via ImgBB.
                                            </p>
                                            <Button type="button" variant="outline" size="sm" className="mt-1 pointer-events-none">
                                                Choose File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {uploadError && (
                                <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
                                </p>
                            )}

                            {showManualUrl && (
                                <div className="space-y-1.5 pt-2">
                                    <Label htmlFor="thumbnailUrl" className="text-xs font-medium text-slate-600">Manual Image URL</Label>
                                    <Input 
                                        id="thumbnailUrl" 
                                        {...register('thumbnailUrl')} 
                                        placeholder="https://i.ibb.co/.../image.png" 
                                        className="h-9 text-xs font-mono"
                                    />
                                    {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl.message}</p>}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <input 
                                type="checkbox" 
                                id="submitForReview" 
                                checked={submitForReview} 
                                onChange={e => setSubmitForReview(e.target.checked)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                            />
                            <Label htmlFor="submitForReview" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                Submit for Admin Review immediately (sends to Admin Panel for approval)
                            </Label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading || isUploadingImage} className="gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Creating Course...
                                    </>
                                ) : (
                                    'Create & Proceed to Studio'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
