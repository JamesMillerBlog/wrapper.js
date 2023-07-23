/* eslint-disable camelcase */
import {
  createSecrets,
  createS3Bucket,
  shouldGenerateResources,
} from "./resources";
import cmd from "node-cmd";
import * as utils from "../utils";
import { templates } from "../templates";

const mockCmd = jest.spyOn(cmd, "runSync").mockImplementation(() => ({
  data: "mock",
  err: null,
  stderr: null,
}));
const mockError = jest.spyOn(utils, "error");
// eslint-disable-next-line new-cap
const authTemplate = new templates.auth(false);

jest.mock("node-cmd", () => ({
  runSync: jest.fn(),
}));

jest.mock("../utils", () => ({
  error: jest.fn().mockImplementation(() => {
    throw new Error();
  }),
}));

describe("resources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("createSecrets", () => {
    it("should call the error function if appropriate config is not in the template", async () => {
      try {
        await createSecrets(authTemplate);
        expect(mockError).toBeCalledTimes(1);
        expect(mockError).toBeCalledWith("Config needed to create secrets");
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it("should run aws CLI to generate secrets if config exists", async () => {
      authTemplate.config = {
        configuration_name: "mock",
        stage: "mock",
        root_domain_name: "mock",
        domain_name: "mock",
        s3_bucket: "mock",
        s3_key: "mock",
        region: "mock",
      };
      authTemplate.secrets = {
        tf_sls_next_stage: "mock",
        tf_sls_next_region: "mock",
        tf_sls_next_root_domain_name: "mock",
        tf_sls_next_domain_name: "mock",
        tf_state_s3_bucket: "mock",
        tf_state_s3_key: "mock",
        tf_sls_service_name: "mock",
      };
      const { configuration_name } = authTemplate.config;
      const stringifiedJson = JSON.stringify(
        JSON.stringify(authTemplate.secrets)
      );
      const cmdString = `aws secretsmanager create-secret --name ${configuration_name} --secret-string ${stringifiedJson}`;
      await createSecrets(authTemplate);
      expect(mockCmd).toBeCalledTimes(1);
      expect(mockCmd).toBeCalledWith(cmdString);
    });
  });

  describe("createS3Bucket", () => {
    it("should call the error function if appropriate config is not in the template", async () => {
      try {
        await createS3Bucket(authTemplate);
        expect(mockError).toBeCalledTimes(1);
        expect(mockError).toBeCalledWith("Config needed to create S3 Bucket");
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it("should run aws CLI to create an S3 Bucket if config exists", async () => {
      authTemplate.config = {
        configuration_name: "mock",
        stage: "mock",
        root_domain_name: "mock",
        domain_name: "mock",
        s3_bucket: "mock",
        s3_key: "mock",
        region: "mock",
      };
      const { s3_bucket, region } = authTemplate.config;
      const cmdString = `aws s3api create-bucket --bucket ${s3_bucket} --region ${region} --create-bucket-configuration LocationConstraint=${region}`;

      await createS3Bucket(authTemplate);
      expect(mockCmd).toBeCalledTimes(1);
      expect(mockCmd).toBeCalledWith(cmdString);
    });
  });

  describe("shouldGenerateResources", () => {
    it("should return true if passed the true boolean", () => {
      const res = shouldGenerateResources({ secretsRequired: true });
      expect(res).toBe(true);
    });
    it("should return false if passed the false boolean", () => {
      const res = shouldGenerateResources({ secretsRequired: false });
      expect(res).toBe(false);
    });
  });
});
