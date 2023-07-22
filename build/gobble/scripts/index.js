"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const finished_1 = __importDefault(require("./finished"));
const duplicate_1 = __importDefault(require("./duplicate"));
const secrets_1 = __importDefault(require("./secrets"));
const dev_1 = __importDefault(require("./dev"));
exports.default = {
    finished: finished_1.default,
    duplicate: duplicate_1.default,
    secrets: secrets_1.default,
    dev: dev_1.default,
};
