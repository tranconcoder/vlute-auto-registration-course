import type { Course as CourseType } from "../types/course";

import xlsx from "xlsx";
import path from "path";
import {
    courseRegistration,
    getDotDangKyId,
} from "../utils/courseRegistration";
import { vluteInstance } from "../configs/axios";
import { AxiosResponse } from "axios";
import { error } from "../utils/courseRegistration/cliColor";

export default class Course {
    private courseCodeList: [string, string | undefined][] = [];
    private courseList: CourseType[] = [];
    private errorList: CourseType[] = [];

    public constructor() {}

    public loadCourseListFromExcel() {
        const filePath = path.join(__dirname, "../assets/excel/course.xlsx");
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const courseData = xlsx.utils.sheet_to_json(worksheet, {
            range: "B2:C21",
            header: "A",
        }) as { B: string; C: string }[];

        courseData.map(({ B, C }) => {
            if (B) {
                this.courseCodeList.push([B.toString(), C || ""]);
            }
        });
    }

    public async loadCourseDetailInfo() {
        const dotDangKyId = (await getDotDangKyId()) as number;
        const promiseList = [];

        for (const [courseCodeId, courseCodeAttachId] of this.courseCodeList) {
            const searchCourseForm = new FormData();
            const searchCourseAttachForm = new FormData();

            searchCourseForm.append("dotDKId", dotDangKyId.toString());
            searchCourseForm.append("monHocTheoCTDTYN", "false");
            searchCourseForm.append("searchkey", courseCodeId);

            if (courseCodeAttachId) {
                searchCourseAttachForm.append(
                    "dotDKId",
                    dotDangKyId.toString()
                );
                searchCourseAttachForm.append("monHocTheoCTDTYN", "false");
                searchCourseAttachForm.append(
                    "searchkey",
                    courseCodeAttachId || ""
                );
            }

            promiseList.push(
                vluteInstance.post(
                    "/hocvien/lopMonHocDuKienSearch.action",
                    searchCourseForm
                )
            );
            promiseList.push(
                courseCodeAttachId
                    ? vluteInstance.post(
                          "/hocvien/lopMonHocDuKienSearch.action",
                          searchCourseAttachForm
                      )
                    : Promise.resolve(undefined)
            );
        }

        await Promise.all(promiseList).then(([...dataList]) => {
            while (dataList.length) {
                const data = (dataList.shift() as AxiosResponse<any, any>).data;
                const attachData = dataList.shift()?.data;

                const rowListHtml = (data as string).split("<tr ").slice(1);

                rowListHtml.forEach((row) => {
                    const columnListHtml = row.split("<td ").slice(2);

                    const code = columnListHtml
                        .shift()
                        ?.match(/<strong>(.*?)<\/strong>/i)
                        ?.at(1) as string;
                    const courseName = columnListHtml
                        .shift()
                        ?.replace(/[\r\n\t]/g, "")
                        .split(">")
                        .at(1)
                        ?.split("</")
                        .at(0)
                        ?.replace(")", ") ") as string;
                    const creditCount = Number(
                        columnListHtml
                            .shift()
                            ?.match(/>(.*?)<\/td>/i)
                            ?.at(1)
                    );
                    const id = Number(
                        columnListHtml
                            .pop()
                            ?.match(/dangKyMonHocKemForm\((.*?)\)/i)
                            ?.at(1)
                            ?.split(",")
                            ?.at(3)
                    );
                    const practiceId = attachData
                        ? Number(
                              (attachData as string)
                                  ?.match(/dangKyMonHocKemForm\((.*?)\)/i)
                                  ?.at(1)
                                  ?.split(",")
                                  ?.at(3)
                          )
                        : -1;

                    this.courseList.push({
                        id,
                        practiceId,
                        code,
                        courseName,
                        creditCount,
                    });
                });
            }
        });
    }

    public async regisCourse() {
        do {
            if (this.errorList.length) {
                this.courseList = [...this.errorList];
                this.errorList = [];
            }

            for (const course of this.courseList) {
                const regisStatus = await courseRegistration({
                    lopMonHocId: course.id,
                    lopMonHocKemId: course.practiceId,
                });

                if (!regisStatus) this.errorList.push(course);
            }

            for (const courseError of this.errorList) {
                console.log(
                    error(
                        `Đăng ký học phần thất bại: ${courseError.courseName}`
                    )
                );
            }
        } while (this.errorList.length);
    }
}
