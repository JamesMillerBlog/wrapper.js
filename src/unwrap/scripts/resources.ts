/* eslint-disable camelcase */
import cmd from "node-cmd";
import { error } from "../utils";
import { Configuration } from "../templates/types";

export const createSecrets = async (config: Configuration | undefined) => {
  const configuration_name = config?.configuration_name;
  if (!config || !configuration_name) error("Config needed to create secrets");

  const stringifiedJson = JSON.stringify(JSON.stringify(config));
  const cmdString = `aws secretsmanager create-secret --name ${configuration_name} --secret-string ${stringifiedJson}`;
  const command = cmd.runSync(cmdString);

  if (command.err) error(`Sync Err ${command.err}`);
  else if (command.stderr) error(`Sync stdrr ${command.stderr}`);
};

export const createS3Bucket = async (config: Configuration | undefined) => {
  const s3_bucket = config?.s3_bucket;
  const region = config?.region;
  if (!s3_bucket || !region) error("Config needed to create S3 Bucket");
  const cmdStr = `aws s3api create-bucket --bucket ${s3_bucket} --region ${region} --create-bucket-configuration LocationConstraint=${region}`;
  const command = cmd.runSync(cmdStr);
  if (command.err) error(`Sync Err ${command.err}`);
  else if (command.stderr) error(`Sync stderr: ${command.stderr}`);
};

export const shouldGenerateResources = ({
  secretsRequired,
}: {
  secretsRequired: boolean;
}) => secretsRequired;
