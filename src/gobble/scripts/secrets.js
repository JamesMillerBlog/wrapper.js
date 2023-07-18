const fs = require("fs");

const next = require("../next/cli.js"),
  serverless = require("../sls/cli.js"),
  ethereum = require("../eth/cli.js");

module.exports.secrets = async() => {
    let secret = subCommand;
      // Check if manually generated secret exists
      const manuallyCreatedSecretsExist = await utils.secretExists(secret);
      if (!!manuallyCreatedSecretsExist) {
        try {
          // generate ENV files for terraform frameworks
          const secrets = await utils.getSecrets(secret);
          terraform.generateEnv(secrets);
          const serviceName = secrets.tf_sls_service_name
            ? secrets.tf_sls_service_name
            : secrets.eth_tf_sls_service_name;
          // check if terraform generated secrets exist
          const tfCreatedSecretsExist = await utils.secretExists(`${serviceName}-tf`);
          if (serviceName && !!tfCreatedSecretsExist) {
            // generate ENV files for next & sls frameworks
            const tfSecrets = await utils.getSecrets(`${serviceName}-tf`);
            if (fs.existsSync("./frontend")) next.generateEnv(secrets, tfSecrets);
            if (fs.existsSync("./backend/serverless")) serverless.generateEnv(secrets, tfSecrets);
            if (fs.existsSync("./backend/ethereum")) ethereum.generateEnv(secrets, tfSecrets);
          } else {
            console.log("Congrats, Terraform files have been generated!\n");
            console.log(
              "Next step, run Terraform commands to create AWS resources."
            );
            console.log(
              "Once you've created your Terraform resources, rerun this command to generate secrets that can be used for the Back End and Front End."
            );
          }
        } catch (e) {
          throw new Error(e);
        }
      } else {
        throw new Error(`secret ${secret} does not exist`);
      }
};