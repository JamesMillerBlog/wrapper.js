import { Template } from "./eth-metaverse";
import inquirer from "inquirer";

const secrets = {
  tf_sls_next_stage: "mock",
  tf_sls_next_region: "mock",
  tf_sls_next_root_domain_name: "mock",
  tf_sls_next_domain_name: "mock",
  tf_state_s3_bucket: "mock",
  tf_state_s3_key: "mock",
  eth_tf_sls_service_name: "mock",
  eth_network: "mock",
  eth_network_api_url: "mock",
  eth_account_address: "mock",
};

const config = {
  configuration_name: "mock",
  stage: "mock",
  region: "mock",
  root_domain_name: "mock",
  domain_name: "mock",
  s3_bucket: "mock",
  s3_key: "mock",
  network: "mock",
  network_api_url: "mock",
  account_address: "mock",
};

const mockInquirer = jest.spyOn(inquirer, "prompt");

jest.mock("inquirer", () => ({
  ...jest.requireActual("inquirer"),
  prompt: jest.fn().mockResolvedValue({
    configuration_name: "mock",
    stage: "mock",
    region: "mock",
    root_domain_name: "mock",
    domain_name: "mock",
    s3_bucket: "mock",
    s3_key: "mock",
    network: "mock",
    network_api_url: "mock",
    account_address: "mock",
  }),
}));

describe("Eth Metaverse Template", () => {
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

    it("should inquire about 10 variables and return them as a JSON", async () => {
      const res = await template.requestConfiguration();
      expect(mockInquirer).toBeCalledTimes(10);
      expect(res).toMatchObject(config);
    });
  });
});
