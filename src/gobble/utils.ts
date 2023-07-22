import cmd from "node-cmd";
import aws from "aws-sdk";
import chalk from "chalk";

process.env.AWS_SDK_LOAD_CONFIG = "1";

export const runSyncTerminalCommand = (terminalCommand: string) => {
  const command = cmd.runSync(terminalCommand);
  console.log("Started running a command");
  console.log(terminalCommand);
  if (command.err) error(`Sync Err ${command.err}`);
  else if (command.stderr) error(`Sync stderr: ${command.stderr}`);
};

export const runAsyncTerminalCommand = async (terminalCommand: string) => {
  const command = cmd.run(
    terminalCommand,
    function (err: any, data: any, stderr: any) {
      console.log("Started running a command");
      if (err) error(err);
      if (stderr) error(stderr);
    }
  );

  command.stdout.on("data", function (data: any) {
    if (data) console.log(data);
  });

  command.stdout.on("close", function (data: any) {
    console.log("Finished running command");
  });
};

export const initialConfigPrep = (
  deploymentData: { [x: string]: any },
  framework: string
) => {
  const data: any = {};

  for (const property in deploymentData) {
    if (property.includes(framework)) {
      const newKey = property.replace(`${framework}_`, "");
      data[newKey] = deploymentData[property];
    }
  }

  return data;
};

export const getSecrets = async (secretName: any) => {
  const client = new aws.SecretsManager();
  try {
    const data = await client
      .getSecretValue({
        SecretId: secretName,
      })
      .promise();

    if (data) {
      if (data.SecretString) return JSON.parse(data.SecretString);
      return data.SecretBinary;
    }
  } catch (err) {
    error(JSON.stringify(err));
  }
};

export const secretExists = async (secretName: any) => {
  try {
    await getSecrets(secretName);
    return true;
  } catch (e) {
    return false;
  }
};

export const error = (message: string) => {
  console.error(message, chalk.red.bold("ERROR"));
  process.exit(1);
};
