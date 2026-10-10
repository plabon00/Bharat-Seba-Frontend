import Link from 'next/link';
import { CourseResponse } from '@/lib/api/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { BookOpen, User, Tag } from 'lucide-react';

interface CourseCardProps {
    course: CourseResponse;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video w-full bg-muted flex items-center justify-center relative">
                {course.thumbnailUrl ? (
                    <img 
                        src={course.thumbnailUrl} 
                        alt={course.title} 
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                )}
                <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded">
                    {course.difficulty}
                </div>
            </div>
            
            <CardContent className="flex-1 p-4">
                <Link href={`/categories/${course.categorySlug}`} className="text-xs font-medium text-primary hover:underline mb-2 inline-block flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {course.categoryName}
                </Link>
                <Link href={`/courses/${course.courseCode}`} className="block group">
                    <h3 className="font-bold text-lg text-heading line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                </p>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-auto">
                <div className="flex items-center text-sm text-muted-foreground pt-4">
                    <User className="w-4 h-4 mr-1" />
                    {course.teacherName}
                </div>
                <div className="font-bold text-primary pt-4">
                    Free
                </div>
            </CardFooter>
        </Card>
    );
}
