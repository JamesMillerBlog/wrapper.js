import { Template } from "./webxr";
import inquirer from "inquirer";

const secrets = {
  tf_sls_next_domain_name: "mock",
  tf_sls_next_region: "mock",
  tf_sls_next_root_domain_name: "mock",
  tf_sls_next_stage: "mock",
  tf_sls_service_name: "mock",
  tf_state_s3_bucket: "mock",
  tf_state_s3_key: "mock",
  next_ready_player_me: "mock",
};

const config = {
  stage: "mock",
  region: "mock",
  root_domain_name: "mock",
  domain_name: "mock",
  s3_bucket: "mock",
  s3_key: "mock",
  configuration_name: "mock",
  ready_player_me: "mock",
};

const mockInquirer = jest.spyOn(inquirer, "prompt");

jest.mock("inquirer", () => ({
  ...jest.requireActual("inquirer"),
  prompt: jest.fn().mockResolvedValue({
    stage: "mock",
    region: "mock",
    root_domain_name: "mock",
    domain_name: "mock",
    s3_bucket: "mock",
    s3_key: "mock",
    configuration_name: "mock",
    ready_player_me: "mock",
  }),
}));

describe("WebXR Template", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("constructor", () => {
    it("should set secretsRequired set to true if the parameter is true", async () => {
      const template = new Template(true);
      expect(template.secretsRequired).toBe(true);
    });

    it("should set secretsRequired set to false if the parameter is false", async () => {
      const template = new Template(false);
      expect(template.secretsRequired).toBe(false);
    });
  });

  describe("setupConfig", () => {
    const template = new Template(true);
    it("should generate a config and use that to set the secrets variable", async () => {
      const mockedRequestConfiguration = jest
        .spyOn(template, "requestConfiguration")
        .mockResolvedValue(config);

      const mockedCreateSecrets = jest
        .spyOn(template, "createSecrets")
        .mockReturnValue(secrets);

      await template.setupConfig();
      expect(mockedRequestConfiguration).toBeCalledTimes(1);
      expect(mockedCreateSecrets).toBeCalledTimes(1);
      expect(mockedCreateSecrets).toBeCalledWith(config);
      expect(mockedCreateSecrets).toReturnWith(secrets);
      expect(template.secrets).toMatchObject(secrets);
    });
  });

  describe("createSecrets", () => {
    const template = new Template(true);
    it("should return expected JSON formatted secrets", async () => {
      const result = template.createSecrets(config);
      expect(result).toMatchObject(secrets);
    });
  });

  describe("requestConfiguration", () => {
    const template = new Template(true);

    it("should inquire about 8 variables and return them as a JSON", async () => {
      const res = await template.requestConfiguration();
      expect(mockInquirer).toBeCalledTimes(8);
      expect(res).toMatchObject(config);
    });
  });
});
