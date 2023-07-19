const cmd = require("node-cmd");
const AWS = require("aws-sdk");

process.env.AWS_SDK_LOAD_CONFIG = 1;

const runSyncTerminalCommand = (terminalCommand) => {
  const command = cmd.runSync(terminalCommand);
  console.log("Started running a command");
  console.log(terminalCommand);
  if (command.err) {
    console.log(`Sync Err ${command.err}`);
    throw new Error(command.err);
  } else if (command.stderr) {
    console.log(`Sync stderr: ${command.stderr}`);
    throw new Error(command.stderr);
  }
};

const runAsyncTerminalCommand = async (terminalCommand) => {
  const command = cmd.run(terminalCommand, function (err, data, stderr) {
    console.log("Started running a command");
    if (err) console.error(err);
    if (stderr) console.error(stderr);
  });

  command.stdout.on("data", function (data) {
    if (data) console.log(data);
  });

  command.stdout.on("close", function (data) {
    console.log("Finished running command");
  });
};

const initialConfigPrep = (deploymentData, framework) => {
  const data = {};

  for (const property in deploymentData) {
    if (property.includes(framework)) {
      const newKey = property.replace(`${framework}_`, "");
      data[newKey] = deploymentData[property];
      delete data[property];
    }
  }

  return data;
};

const getSecrets = async (secretName) => {
  const client = new AWS.SecretsManager();
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
  } catch (error) {
    throw new Error(error);
  }
};

const install = () => {
  runAsyncTerminalCommand(`npm install`);
};

const secretExists = async (secretName) => {
  try {
    await module.exports.getSecrets(secretName);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  initialConfigPrep,
  runSyncTerminalCommand,
  runAsyncTerminalCommand,
  secretExists,
  install,
  getSecrets,
};
