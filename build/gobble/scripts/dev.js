"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
exports.default = () => {
    config_1.default.forEach((c) => {
        if (fs_1.default.existsSync(c.filepath))
            c.cli.dev();
    });
};
