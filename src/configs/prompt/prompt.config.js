"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt_sync_history_1 = __importDefault(require("prompt-sync-history"));
exports.default = (0, prompt_sync_1.default)({
    history: (0, prompt_sync_history_1.default)(),
});
