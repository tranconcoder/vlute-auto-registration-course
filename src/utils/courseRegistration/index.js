"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDotDangKyId = exports.courseRegistration = void 0;
var courseRegistration_util_1 = require("./courseRegistration.util");
Object.defineProperty(exports, "courseRegistration", { enumerable: true, get: function () { return __importDefault(courseRegistration_util_1).default; } });
var getDotDangKyId_util_1 = require("./getDotDangKyId.util");
Object.defineProperty(exports, "getDotDangKyId", { enumerable: true, get: function () { return __importDefault(getDotDangKyId_util_1).default; } });
__exportStar(require("./getDotDangKyId.util"), exports);
