export type UserRole = 'USER' | 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
export type CourseDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type LessonType = 'VIDEO' | 'TEXT';
export type VideoProvider = 'YOUTUBE' | 'GOOGLE_DRIVE';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface JwtResponse {
    token: string;
    type: string;
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}

export interface UserResponse {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    accountStatus: UserStatus;
    profileImageUrl?: string;
    createdAt: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    slug: string;
    description?: string;
    thumbnailUrl?: string;
    displayOrder: number;
}

export interface CourseResponse {
    id: string;
    courseCode: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    teacherName: string;
    teacherEmail?: string;
    categoryName: string;
    categorySlug: string;
    difficulty: CourseDifficulty;
    status: CourseStatus;
    submittedAt?: string;
    publishedAt?: string;
}

export interface LessonResponse {
    id: string;
    title: string;
    lessonType: LessonType;
    videoProvider?: VideoProvider;
    videoUrl?: string;
    contentText?: string;
    durationSeconds?: number;
    displayOrder: number;
    isPreview: boolean;
}

export interface EnrollmentResponse {
    id: string;
    courseId: string;
    courseTitle: string;
    courseThumbnailUrl?: string;
    status: EnrollmentStatus;
    enrolledAt: string;
    completedAt?: string;
}

export interface ProgressResponse {
    id: string;
    enrollmentId: string;
    lessonId: string;
    status: ProgressStatus;
    lastPositionSeconds: number;
    startedAt: string;
    completedAt?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
