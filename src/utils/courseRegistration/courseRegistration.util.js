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
const axios_1 = require("../../configs/axios");
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = __importDefault(require("dotenv"));
const _1 = require(".");
dotenv_1.default.config();
function courseRegistration({ lopMonHocId, lopMonHocKemId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new form_data_1.default();
        const dotDangKyId = yield (0, _1.getDotDangKyId)();
        formData.append("lopMonHocId", lopMonHocId.toString());
        formData.append("lopMonHocKemId", (lopMonHocKemId || -1).toString());
        formData.append("hocKyId", process.env.HOC_KY_ID);
        formData.append("dotDKId", dotDangKyId);
        return axios_1.vluteInstance
            .post("/hocvien/ketQuaDangKyLopMonHocInsert.action", formData)
            .then(({ data }) => { var _a, _b; return ((_b = (_a = data.at(0)) === null || _a === void 0 ? void 0 : _a.objs) === null || _b === void 0 ? void 0 : _b.at(1)) === "true"; })
            .catch(() => false);
    });
}
exports.default = courseRegistration;
