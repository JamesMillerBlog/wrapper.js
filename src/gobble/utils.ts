import cmd from "node-cmd";
import aws from "aws-sdk";
import chalk from "chalk";

process.env.AWS_SDK_LOAD_CONFIG = "1";

export const runSyncTerminalCommand = (terminalCommand: string) => {
  const command = cmd.runSync(terminalCommand);
  console.log("Started running a command");
  console.log(terminalCommand);
  if (command.err) error(`Sync Err ${command.err}`);
};

export const runAsyncTerminalCommand = async (terminalCommand: string) => {
  const command = cmd.run(terminalCommand, function (err: string) {
    console.log("Started running a command");
    if (err) error(`${err}`);
  });

  command.stdout.on("data", function (data: string) {
    if (data) console.log(data);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  command.stdout.on("close", function (_data: string) {
    console.log("Finished running command");
  });
};

export const initialConfigPrep = (deploymentData: any, framework: string) => {
  const data: any = {};
  for (const property in deploymentData) {
    if (property.includes(framework)) {
      const newKey = property.replace(/tf_|sls_|eth_|next_/gi, "");
      data[newKey] = deploymentData[property];
    }
  }

  return data;
};

export const getSecrets = async (secretName: string) => {
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
    throw new Error(String(err));
  }
};

export const secretExists = async (secretName: string) => {
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
