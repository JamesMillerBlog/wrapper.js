import { templates } from "../templates";
import {
  cliGenerateSecretsPrompt,
  retrieveTemplate,
  configureTemplate,
} from "./configuration";
import inquirer from "inquirer";
import * as utils from "../utils";

const mockInquirer = jest.spyOn(inquirer, "prompt");
const mockError = jest.spyOn(utils, "error");

jest.mock("inquirer", () => ({
  ...jest.requireActual("inquirer"),
  prompt: jest.fn().mockResolvedValue({
    secrets: "mock",
  }),
}));

jest.mock("../utils", () => ({
  error: jest.fn(),
}));

describe("configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("cliGenerateSecretsPrompt", () => {
    it("should return the result of cliGenerateSecretsPrompt()", async () => {
      const res = await cliGenerateSecretsPrompt();
      expect(mockInquirer).toBeCalledTimes(1);
      expect(res).toBe("mock");
    });
  });

  describe("configureTemplate", () => {
    it("should return a requested template without setting up a config, if secretsRequired is false", async () => {
      const res = await configureTemplate({
        template: "Auth",
        runInstall: false,
      });
      expect(mockInquirer).toBeCalledTimes(1);
      // eslint-disable-next-line new-cap
      const authTemplate = new templates.auth(false);
      expect(res.name).toBe(authTemplate.name);
    });
  });

  describe("retrieveTemplate", () => {
    it("should return the selected template based on the passed parameter", () => {
      const res = retrieveTemplate("Auth");
      expect(res).toBe(templates.auth);
    });

    it("should run the error function if the selected template does not exist", () => {
      retrieveTemplate("mock");
      expect(mockError).toBeCalledTimes(1);
      expect(mockError).toBeCalledWith("Template mock does not exist");
    });
  });
});
