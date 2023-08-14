"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vluteInstance = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const base_1 = require("../base");
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const tough_cookie_1 = __importDefault(require("tough-cookie"));
dotenv_1.default.config();
const jar = new tough_cookie_1.default.CookieJar();
const vluteInstance = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
    jar,
    baseURL: base_1.BASE_URL,
    withCredentials: true,
}));
exports.vluteInstance = vluteInstance;
