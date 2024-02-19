interface CourseLearningTime {
    dayOfWeek: number;
    lessonStart: number;
    lessonEnd: number;
}

interface Course {
    id: number;
    practiceId?: number;
    code: string;
    name: string;
    creditCount: number;
    teacher: string;
    learningTime: CourseLearningTime[];
}
