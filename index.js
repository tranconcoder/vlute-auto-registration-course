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
const dotenv_1 = __importDefault(require("dotenv"));
const cli_color_1 = __importDefault(require("cli-color"));
const Login_class_1 = __importDefault(require("./src/class/Login.class"));
const cliColor_util_1 = require("./src/utils/courseRegistration/cliColor/cliColor.util");
const Course_class_1 = __importDefault(require("./src/class/Course.class"));
dotenv_1.default.config();
console.clear();
console.log(cli_color_1.default.blue("Chào mừng đến với ứng dụng tự động đăng ký học phần!"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    do {
        // Handle login
        Login_class_1.default.showTitle();
        yield Login_class_1.default.inputUsernameAndPassword();
        yield Login_class_1.default.handleLogin();
        if (Login_class_1.default.getLoginResult()) {
            console.log((0, cliColor_util_1.success)("Đăng nhập thành công!"));
        }
        else {
            console.log((0, cliColor_util_1.error)("Đăng nhập thất bại!"));
        }
    } while (!Login_class_1.default.getLoginResult());
    const course = new Course_class_1.default();
    course.loadCourseListFromExcel();
    yield course.loadCourseDetailInfo();
    yield course.regisCourse();
}))();
