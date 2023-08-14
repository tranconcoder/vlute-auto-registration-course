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
const index_1 = require("../../configs/axios/index");
const dotenv_1 = __importDefault(require("dotenv"));
const cliColor_util_1 = require("./cliColor/cliColor.util");
const coursesRegistrationInfo_config_1 = require("../../configs/course/coursesRegistrationInfo.config");
const prompt_1 = require("../../configs/prompt");
dotenv_1.default.config();
function getDotDangKyId() {
    return __awaiter(this, void 0, void 0, function* () {
        if (coursesRegistrationInfo_config_1.dotDangKyId)
            return Promise.resolve(coursesRegistrationInfo_config_1.dotDangKyId);
        const formData = new FormData();
        formData.append("hocKyId", process.env.HOC_KY_ID);
        return index_1.vluteInstance
            .post("/hocvien/dkmhTKBDotDKList.action", formData)
            .then(({ data }) => __awaiter(this, void 0, void 0, function* () {
            let html = data;
            const rowList = html
                .slice(html.indexOf("<tr "), html.lastIndexOf("</tr>"))
                .split("<tr ")
                .slice(1, -1);
            const dotDangKyIdList = rowList.map((row) => { var _a; return Number((_a = row.match(/id='dotDKId(\d+)'/)) === null || _a === void 0 ? void 0 : _a.at(1)); });
            const dotDangKyTitleList = rowList.map((row) => { var _a; return (_a = row.match(/<td>(.*?)<\/td>/)) === null || _a === void 0 ? void 0 : _a.at(1); });
            // Show result
            // Clear screen
            console.log("===== Danh sách các đợt đăng ký =====");
            dotDangKyTitleList.forEach((title, index) => {
                console.log(`\t[${index + 1}] ${title}`);
            });
            // User input on terminal
            let dotDangKyIdSelectIndex = -1;
            do {
                dotDangKyIdSelectIndex =
                    Number((0, prompt_1.promptSync)("Nhập lựa chọn của bạn: ")) - 1;
                // Select values: 1 -> length
            } while (dotDangKyIdSelectIndex < 0 ||
                dotDangKyIdSelectIndex >= dotDangKyIdList.length);
            console.log((0, cliColor_util_1.success)(`➡ Bạn đã chọn "${dotDangKyTitleList[dotDangKyIdSelectIndex]}"`));
            (0, coursesRegistrationInfo_config_1.setDotDangKyId)(dotDangKyIdList[dotDangKyIdSelectIndex]);
            return dotDangKyIdList[dotDangKyIdSelectIndex];
        }));
    });
}
exports.default = getDotDangKyId;
