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
const cli_color_1 = __importDefault(require("cli-color"));
const axios_1 = require("../configs/axios");
const courseRegistration_1 = require("../utils/courseRegistration");
const prompt_1 = require("../configs/prompt");
class Login {
    constructor() {
        this.result = false;
    }
    showTitle() {
        console.log(cli_color_1.default.cyan("Vui lòng đăng nhập trước khi đăng ký học phần"));
    }
    handleLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            const loginForm = new FormData();
            loginForm.append("username", this.username || "");
            loginForm.append("password", this.password || "");
            yield axios_1.vluteInstance.post("login.action", loginForm);
            const checkPermissionForm = new FormData();
            const dotDangKyId = yield (0, courseRegistration_1.getDotDangKyId)();
            checkPermissionForm.append("dotDKId", dotDangKyId.toString());
            return axios_1.vluteInstance
                .post("/hocvien/kiemTraQuyenDangKy.action", checkPermissionForm)
                .then(({ data }) => (this.result = data.code === "SUCCESS"));
        });
    }
    inputUsernameAndPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            this.username = (0, prompt_1.promptSync)("Tên đăng nhập: ");
            this.password = (0, prompt_1.promptSync)("Mật khẩu: ", {
                echo: "*",
            });
        });
    }
    getLoginResult() {
        return this.result;
    }
}
const login = new Login();
exports.default = login;
