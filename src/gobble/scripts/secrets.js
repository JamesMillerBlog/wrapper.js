const fs = require("fs");
const config = require('./../config')

module.exports.secrets = async(secret) => {
  const manuallyCreatedSecretsExist = await utils.secretExists(secret);
  if (!manuallyCreatedSecretsExist) throw new Error(`secret ${secret} does not exist`);
  
  try {
    const secrets = await utils.getSecrets(secret);
    terraform.generateEnv(secrets);
    
    const serviceName = secrets.tf_sls_service_name
      ? secrets.tf_sls_service_name
      : secrets.eth_tf_sls_service_name;

    const tfCreatedSecretsExist = await utils.secretExists(`${serviceName}-tf`);
    
    if (serviceName && !!tfCreatedSecretsExist) {
      const tfSecrets = await utils.getSecrets(`${serviceName}-tf`);
      config.forEach((c) => {
        if (fs.existsSync(c.filepath)) c.cli.generateEnv(secrets, tfSecrets);
      })
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
};