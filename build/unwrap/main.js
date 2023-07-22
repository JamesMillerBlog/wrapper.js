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
exports.main = void 0;
const chalk_1 = __importDefault(require("chalk"));
const listr_1 = __importDefault(require("listr"));
const scripts_1 = require("./scripts");
const main = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield (0, scripts_1.selectTemplate)(argv);
    const template = yield (0, scripts_1.configureTemplate)(config);
    const location = yield (0, scripts_1.setupTargetDir)(template);
    const enabled = (0, scripts_1.shouldGenerateResources)(template);
    const tasks = new listr_1.default([
        {
            title: "Create secrets",
            task: () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, scripts_1.createSecrets)(template.config); }),
            enabled: () => enabled,
        },
        {
            title: "Create Terraform State S3 Bucket",
            task: () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, scripts_1.createS3Bucket)(template.config); }),
            enabled: () => enabled,
        },
        {
            title: "Copy project files",
            task: () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, scripts_1.copyTemplateFiles)(location); }),
        },
    ]);
    yield tasks.run();
    console.log("%s Project ready", chalk_1.default.green.bold("DONE"));
});
exports.main = main;
