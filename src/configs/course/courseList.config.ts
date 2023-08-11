interface Course {
    id: number;
    practiceId?: number;
    code: string;
    name: string;
}

export const courseList: Omit<Course, "isPractice">[] = [
    {
        id: 66234,
        practiceId: 66353,
        code: "TH1358",
        name: "Bảo mật ứng dụng Web",
    },
];
