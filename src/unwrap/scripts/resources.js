/* eslint-disable camelcase */
const cmd = require("node-cmd");
const templates = require("./../templates");

const createSecrets = async (options) => {
  if (options.secrets.includes("Yes")) {
    const secrets = getTemplateSecrets(options);
    const stringifiedJson = JSON.stringify(JSON.stringify(secrets));
    const cmdString = `aws secretsmanager create-secret --name ${secrets.configuration_name} --secret-string ${stringifiedJson}`;
    const command = cmd.runSync(cmdString);

    if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
    } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`);
      throw new Error(command.stderr);
    }
  }
};

const createS3Bucket = async (options) => {
  const { secretsFile, secrets } = options;
  if (secrets.includes("Yes")) {
    const { region, s3_bucket } = secretsFile;
    const command = cmd.runSync(
      `aws s3api create-bucket --bucket ${s3_bucket} --region ${region} --create-bucket-configuration LocationConstraint=${region}`,
    );
    if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
    } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`);
      throw new Error(command.stderr);
    }
  }
};

const getTemplateSecrets = (options) => {
  for (const t in templates) {
    const template = templates[t];
    if (options.template.includes(template.name)) {
      return template.createSecrets(options);
    }
  }
  throw new Error("No secrets exist for selected template");
};

module.export = {
  createSecrets,
  createS3Bucket,
};
