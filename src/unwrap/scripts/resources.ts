/* eslint-disable camelcase */
import cmd from "node-cmd";
import { error } from "../utils";
import { TemplateInterface } from "../templates/types";

export const createSecrets = async (template: TemplateInterface) => {
  const configuration_name = template.config?.configuration_name;
  if (!template.config || !configuration_name) {
    error("Config needed to create secrets");
  }

  const stringifiedJson = JSON.stringify(JSON.stringify(template.secrets));
  const cmdString = `aws secretsmanager create-secret --name ${configuration_name} --secret-string ${stringifiedJson}`;
  const command = cmd.runSync(cmdString);

  if (command.err) error(`Sync Err ${command.err}`);
  else if (command.stderr) error(`Sync stdrr ${command.stderr}`);
};

export const createS3Bucket = async (template: TemplateInterface) => {
  const s3_bucket = template.config?.s3_bucket;
  const region = template.config?.region;
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
