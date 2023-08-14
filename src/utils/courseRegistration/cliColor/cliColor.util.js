"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warning = exports.error = exports.success = void 0;
const cli_color_1 = __importDefault(require("cli-color"));
const success = (message, option = { icon: true }) => cli_color_1.default.green(option.icon ? "✔" : "", message);
exports.success = success;
const error = (message, option = { icon: true }) => cli_color_1.default.red(option.icon ? "✖" : "", message);
exports.error = error;
const warning = (message, option = { icon: true }) => cli_color_1.default.yellow(message);
exports.warning = warning;
