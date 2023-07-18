const cmd = require("node-cmd"),
  AWS = require("aws-sdk"),
  internalIp = require("internal-ip");

process.env.AWS_SDK_LOAD_CONFIG = 1;

// **************************
//      HELPER FUNCTIONS
// **************************

module.exports = {
  // Function to run syncronous terminal commands
  runSyncTerminalCommand: (terminalCommand) => {
    let command = cmd.runSync(terminalCommand);
    console.log("Started running a command");
    console.log(terminalCommand);
    if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
    } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`);
      throw new Error(command.stderr);
    }
  },
  // Function to run asyncronous terminal commands
  runAsyncTerminalCommand: async (terminalCommand) => {
    let command = cmd.run(terminalCommand, function (err, data, stderr) {
      console.log("Started running a command");
      if (err) console.error(err);
      if (stderr) console.error(stderr);
    });

    // stream terminal output
    command.stdout.on("data", function (data) {
      if (data) console.log(data);
    });

    command.stdout.on("close", function (data) {
      console.log("Finished running command");
      // console.log(`Finished ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
    });

    await command;
  },

  prepData: (deploymentData, framework) => {
    let data = {};

    for (var property in deploymentData) {
      if (property.includes(framework)) {
        data[property] = deploymentData[property];
        let newKey = property.replace(/tf_|sls_|eth_|next_/gi, "");
        data[newKey] = deploymentData[property];
        delete data[property];
      }
    }
    if (framework == "next" || framework == "sls") {
      data["api_local_ip_address"] = internalIp.v4.sync();
      data["local_api_rest_port"] = "4000";
      data["local_api_ws_port"] = "4500";
    }
    if (framework == "eth") {
      data["local_ip_address"] = internalIp.v4.sync();
      data["localhost_network_id"] = "5777";
    }
    if (framework === "next") {
      data = `module.exports = {trailingSlash: true,env: ${JSON.stringify(
        data,
        null,
        2
      )}};`;
    } else {
      data = JSON.stringify(data, null, 2);
    }

    return data;
  },

  getSecrets: async (secretName) => {
    const client = new AWS.SecretsManager();
    try {
      const data = await client
        .getSecretValue({
          SecretId: secretName,
        })
        .promise();

      if (data) {
        if (data.SecretString) {
          const secret = data.SecretString;
          const parsedSecret = JSON.parse(secret);
          returnedData = parsedSecret;
          return parsedSecret;
        }
        const binarySecretData = data.SecretBinary;
        return binarySecretData;
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  install: () => {
    // install wrapper.js dependencies
    module.exports.runAsyncTerminalCommand(`npm install`);
  },

  secretExists: async (secretName) => {
    try {
      await module.exports.getSecrets(secretName);
      return true;
    } catch (e) {
      return false;
    }
  },
};
