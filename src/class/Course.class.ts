import type { Course as CourseType } from "../types/course";

import xlsx from "xlsx";
import path from "path";
import {
    courseRegistration,
    getDotDangKyId,
} from "../utils/courseRegistration";
import { vluteInstance } from "../configs/axios";
import { AxiosResponse } from "axios";
import { error, success } from "../utils/courseRegistration/cliColor";

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
                this.courseCodeList.push([B.trim(), C?.trim() || undefined]);
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

                    const idHtml = columnListHtml.pop();
                    let id: number;
                    let practiceId: number = -1;
                    if (idHtml?.includes("dangKyMonHocKemForm(this")) {
                        id = Number(
                            idHtml
                                ?.match(/dangKyMonHocKemForm\((.*?)\)/i)
                                ?.at(1)
                                ?.split(",")
                                ?.at(3)
                        );
                        practiceId = attachData
                            ? Number(
                                  (attachData as string)
                                      ?.match(/dangKyMonHocKemForm\((.*?)\)/i)
                                      ?.at(1)
                                      ?.split(",")
                                      ?.at(3)
                              )
                            : -1;
                    } else {
                        id = Number(
                            idHtml
                                ?.match(/dangKyMonHocInsert\((.*?)\)/i)
                                ?.at(1)
                                ?.split(",")
                                ?.at(3)
                        );
                    }

                    if (idHtml?.includes("Đăng ký thành công")) {
                        console.log(
                            success(`Đã đăng ký từ trước: ${courseName}`)
                        );
                    } else {
                        this.courseList.push({
                            id,
                            practiceId,
                            code,
                            courseName,
                            creditCount,
                        });
                    }
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

            const regisStatusPromiseList: Array<Promise<boolean>> = [];

            for (const course of this.courseList) {
                regisStatusPromiseList.push(
                    courseRegistration({
                        lopMonHocId: course.id,
                        lopMonHocKemId: course.practiceId,
                    })
                );
            }

            await Promise.all(regisStatusPromiseList).then(
                ([...regisStatusList]) => {
                    for (let index in regisStatusList) {
                        const regisStatus = regisStatusList[index];

                        if (!regisStatus) {
                            this.errorList.push(this.courseList[index]);
                        }
                    }
                }
            );

            // Show error
            if (this.errorList.length) {
                console.log(error(`Đăng ký học phần thất bại:`));

                for (const courseError of this.errorList) {
                    console.log(
                        error(`\t+ ${courseError.courseName}`, { icon: false })
                    );
                }
            }

            // Show success registration
            const errorIdList = this.errorList.map((error) => error.id);
            const successCourseList = this.courseList.filter(
                (course) => !errorIdList.includes(course.id)
            );
            successCourseList.forEach((course) => {
                console.log(
                    success(`Đăng ký thành công: ${course.courseName}`)
                );
            });
        } while (this.errorList.length);
    }
}
