export interface CourseLearningTime {
    dayOfWeek: number;
    lessonStart: number;
    lessonEnd: number;
}

export interface Course {
    id: number;
    practiceId?: number;
    code: string;
    courseName: string;
    creditCount: number;
}
