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
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const scripts_1 = require("./scripts");
// import { TemplateInterface } from "./templates/types";
const scripts = {
    selectTemplate: scripts_1.selectTemplate,
    configureTemplate: scripts_1.configureTemplate,
    copyTemplateFiles: scripts_1.copyTemplateFiles,
    setupTargetDir: scripts_1.setupTargetDir,
    createSecrets: scripts_1.createSecrets,
    createS3Bucket: scripts_1.createS3Bucket,
    shouldGenerateResources: scripts_1.shouldGenerateResources,
};
// const template: TemplateInterface = {
//   name: "Auth",
//   secrets: undefined,
//   config: undefined,
//   secretsRequired: true,
//   setupConfig: jest.fn(),
//   createSecrets: jest.fn(),
//   requestConfiguration: jest.fn(),
// };
jest.mock("./scripts", () => ({
    selectTemplate: jest.fn(),
    configureTemplate: jest.fn(),
    copyTemplateFiles: jest.fn(),
    setupTargetDir: jest.fn(),
    createSecrets: jest.fn(),
    createS3Bucket: jest.fn(),
    shouldGenerateResources: jest.fn().mockReturnValue(true),
}));
const mockSelectTemplate = jest.spyOn(scripts, "selectTemplate");
const mockConfigureTemplate = jest.spyOn(scripts, "configureTemplate");
// .mockResolvedValue(template);
const mockCopyTemplateFiles = jest.spyOn(scripts, "copyTemplateFiles");
const mockSetupTargetDir = jest.spyOn(scripts, "setupTargetDir");
// const mockShouldGenerateResources = jest.spyOn(
//   scripts,
//   "shouldGenerateResources"
// );
// .mockReturnValue(true);
// const mockCreateS3Bucket = jest.spyOn(scripts, "createS3Bucket");
// const mockGenerateWrapperJSResources = jest.spyOn(
//   utils,
//   "generateWrapperJSResources"
// );
describe("main", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("should select template, configure it, then set up a directory and copy over files ", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, main_1.main)([""]);
        expect(mockSelectTemplate).toBeCalledTimes(1);
        expect(mockConfigureTemplate).toBeCalledTimes(1);
        expect(mockCopyTemplateFiles).toBeCalledTimes(1);
        expect(mockSetupTargetDir).toBeCalledTimes(1);
    }));
    // it("should create a secret and S3 bucket if generateWrapperJSResources returns true", async () => {
    //   mockGenerateWrapperJSResources.mockReturnValue(true);
    //   await main([""]);
    //   expect(mockCreateSecrets).toBeCalledTimes(1);
    //   expect(mockCreateS3Bucket).toBeCalledTimes(1);
    // });
    // it("should not create a secret and S3 bucket if generateWrapperJSResources returns true", async () => {
    //   mockGenerateWrapperJSResources.mockReturnValue(false);
    //   await main([""]);
    //   expect(mockCreateSecrets).toBeCalledTimes(0);
    //   expect(mockCreateS3Bucket).toBeCalledTimes(0);
    // });
});
