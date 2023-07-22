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
exports.setupTargetDir = exports.copyTemplateFiles = void 0;
const ncp_1 = __importDefault(require("ncp"));
const util_1 = require("util");
const path_1 = require("path");
const fs_1 = require("fs");
const utils_1 = require("../utils");
const copy = (0, util_1.promisify)(ncp_1.default);
const access = (0, util_1.promisify)(fs_1.access);
const copyTemplateFiles = ({ templateDirectory, targetDirectory, }) => __awaiter(void 0, void 0, void 0, function* () {
    return copy(templateDirectory, targetDirectory, {
        clobber: false,
    });
});
exports.copyTemplateFiles = copyTemplateFiles;
const setupTargetDir = (template) => __awaiter(void 0, void 0, void 0, function* () {
    const targetDirectory = process.cwd();
    const name = template === null || template === void 0 ? void 0 : template.name;
    const templateDirectory = (0, path_1.resolve)(__dirname, "../../../templates", name.toLowerCase());
    try {
        yield access(templateDirectory, fs_1.constants.R_OK);
    }
    catch (err) {
        (0, utils_1.error)("%s Invalid template name");
    }
    return {
        targetDirectory,
        templateDirectory,
    };
});
exports.setupTargetDir = setupTargetDir;
