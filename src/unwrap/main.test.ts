import { main } from "./main";
import {
  selectTemplate,
  configureTemplate,
  copyTemplateFiles,
  setupTargetDir,
  createSecrets,
  createS3Bucket,
  shouldGenerateResources,
} from "./scripts";
// import { TemplateInterface } from "./templates/types";

const scripts = {
  selectTemplate,
  configureTemplate,
  copyTemplateFiles,
  setupTargetDir,
  createSecrets,
  createS3Bucket,
  shouldGenerateResources,
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

  it("should select template, configure it, then set up a directory and copy over files ", async () => {
    await main([""]);
    expect(mockSelectTemplate).toBeCalledTimes(1);
    expect(mockConfigureTemplate).toBeCalledTimes(1);
    expect(mockCopyTemplateFiles).toBeCalledTimes(1);
    expect(mockSetupTargetDir).toBeCalledTimes(1);
  });

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
