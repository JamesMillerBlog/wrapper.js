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

const scripts = {
  selectTemplate,
  configureTemplate,
  copyTemplateFiles,
  setupTargetDir,
  createSecrets,
  createS3Bucket,
  shouldGenerateResources,
};

jest.mock("./scripts", () => ({
  selectTemplate: jest.fn(),
  configureTemplate: jest.fn(),
  copyTemplateFiles: jest.fn(),
  setupTargetDir: jest.fn(),
  createSecrets: jest.fn(),
  createS3Bucket: jest.fn(),
  shouldGenerateResources: jest.fn(),
}));

const mockSelectTemplate = jest.spyOn(scripts, "selectTemplate");
const mockConfigureTemplate = jest.spyOn(scripts, "configureTemplate");
const mockCopyTemplateFiles = jest.spyOn(scripts, "copyTemplateFiles");
const mockSetupTargetDir = jest.spyOn(scripts, "setupTargetDir");
const mockShouldGenerateResources = jest.spyOn(
  scripts,
  "shouldGenerateResources"
);
const mockCreateS3Bucket = jest.spyOn(scripts, "createS3Bucket");

const mockCreateSecrets = jest.spyOn(scripts, "createSecrets");

describe("main", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should select template, configure it, then set up a directory and copy over files ", async () => {
    await main([""]);
    expect(mockSelectTemplate).toBeCalledTimes(1);
    expect(mockConfigureTemplate).toBeCalledTimes(1);
    expect(mockCopyTemplateFiles).toBeCalledTimes(1);
    expect(mockSetupTargetDir).toBeCalledTimes(1);
  });

  it("should create a secret and S3 bucket if generateWrapperJSResources returns true", async () => {
    mockShouldGenerateResources.mockReturnValue(true);
    await main([""]);
    expect(mockCreateSecrets).toBeCalledTimes(1);
    expect(mockCreateS3Bucket).toBeCalledTimes(1);
  });

  it("should not create a secret and S3 bucket if generateWrapperJSResources returns true", async () => {
    mockShouldGenerateResources.mockReturnValue(false);
    await main([""]);
    expect(mockCreateSecrets).toBeCalledTimes(0);
    expect(mockCreateS3Bucket).toBeCalledTimes(0);
  });
});
