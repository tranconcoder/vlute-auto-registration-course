"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const courseRegistration_1 = require("../utils/courseRegistration");
const axios_1 = require("../configs/axios");
const cliColor_1 = require("../utils/courseRegistration/cliColor");
class Course {
    constructor() {
        this.courseCodeList = [];
        this.courseList = [];
        this.errorList = [];
    }
    loadCourseListFromExcel() {
        const filePath = path_1.default.join(__dirname, "../assets/excel/course.xlsx");
        const workbook = xlsx_1.default.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const courseData = xlsx_1.default.utils.sheet_to_json(worksheet, {
            range: "B2:C21",
            header: "A",
        });
        courseData.map(({ B, C }) => {
            if (B) {
                this.courseCodeList.push([B.trim(), C.trim() || undefined]);
            }
        });
    }
    loadCourseDetailInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const dotDangKyId = (yield (0, courseRegistration_1.getDotDangKyId)());
            const promiseList = [];
            for (const [courseCodeId, courseCodeAttachId] of this.courseCodeList) {
                const searchCourseForm = new FormData();
                const searchCourseAttachForm = new FormData();
                searchCourseForm.append("dotDKId", dotDangKyId.toString());
                searchCourseForm.append("monHocTheoCTDTYN", "false");
                searchCourseForm.append("searchkey", courseCodeId);
                if (courseCodeAttachId) {
                    searchCourseAttachForm.append("dotDKId", dotDangKyId.toString());
                    searchCourseAttachForm.append("monHocTheoCTDTYN", "false");
                    searchCourseAttachForm.append("searchkey", courseCodeAttachId || "");
                }
                promiseList.push(axios_1.vluteInstance.post("/hocvien/lopMonHocDuKienSearch.action", searchCourseForm));
                promiseList.push(courseCodeAttachId
                    ? axios_1.vluteInstance.post("/hocvien/lopMonHocDuKienSearch.action", searchCourseAttachForm)
                    : Promise.resolve(undefined));
            }
            yield Promise.all(promiseList).then(([...dataList]) => {
                var _a;
                while (dataList.length) {
                    const data = dataList.shift().data;
                    const attachData = (_a = dataList.shift()) === null || _a === void 0 ? void 0 : _a.data;
                    const rowListHtml = data.split("<tr ").slice(1);
                    rowListHtml.forEach((row) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                        const columnListHtml = row.split("<td ").slice(2);
                        const code = (_b = (_a = columnListHtml
                            .shift()) === null || _a === void 0 ? void 0 : _a.match(/<strong>(.*?)<\/strong>/i)) === null || _b === void 0 ? void 0 : _b.at(1);
                        const courseName = (_e = (_d = (_c = columnListHtml
                            .shift()) === null || _c === void 0 ? void 0 : _c.replace(/[\r\n\t]/g, "").split(">").at(1)) === null || _d === void 0 ? void 0 : _d.split("</").at(0)) === null || _e === void 0 ? void 0 : _e.replace(")", ") ");
                        const creditCount = Number((_g = (_f = columnListHtml
                            .shift()) === null || _f === void 0 ? void 0 : _f.match(/>(.*?)<\/td>/i)) === null || _g === void 0 ? void 0 : _g.at(1));
                        const id = Number((_l = (_k = (_j = (_h = columnListHtml
                            .pop()) === null || _h === void 0 ? void 0 : _h.match(/dangKyMonHocKemForm\((.*?)\)/i)) === null || _j === void 0 ? void 0 : _j.at(1)) === null || _k === void 0 ? void 0 : _k.split(",")) === null || _l === void 0 ? void 0 : _l.at(3));
                        const practiceId = attachData
                            ? Number((_p = (_o = (_m = attachData === null || attachData === void 0 ? void 0 : attachData.match(/dangKyMonHocKemForm\((.*?)\)/i)) === null || _m === void 0 ? void 0 : _m.at(1)) === null || _o === void 0 ? void 0 : _o.split(",")) === null || _p === void 0 ? void 0 : _p.at(3))
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
        });
    }
    regisCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            do {
                if (this.errorList.length) {
                    this.courseList = [...this.errorList];
                    this.errorList = [];
                }
                const regisStatusPromiseList = [];
                for (const course of this.courseList) {
                    regisStatusPromiseList.push((0, courseRegistration_1.courseRegistration)({
                        lopMonHocId: course.id,
                        lopMonHocKemId: course.practiceId,
                    }));
                }
                yield Promise.all(regisStatusPromiseList).then(([...regisStatusList]) => {
                    for (let index in regisStatusList) {
                        const regisStatus = regisStatusList[index];
                        if (!regisStatus) {
                            this.errorList.push(this.courseList[index]);
                        }
                    }
                });
                // Show error
                if (this.errorList.length) {
                    console.log((0, cliColor_1.error)(`Đăng ký học phần thất bại:`));
                    for (const courseError of this.errorList) {
                        console.log((0, cliColor_1.error)(`\t+ ${courseError.courseName}`, { icon: false }));
                    }
                }
                // Show success registration
                const errorIdList = this.errorList.map((error) => error.id);
                const successCourseList = this.courseList.filter((course) => !errorIdList.includes(course.id));
                successCourseList.forEach((course) => {
                    console.log((0, cliColor_1.success)(`Đăng ký thành công: ${course.courseName}`));
                });
            } while (this.errorList.length);
        });
    }
}
exports.default = Course;
