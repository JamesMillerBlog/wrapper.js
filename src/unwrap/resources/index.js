const cmd = require("node-cmd");
const { createS3Bucket, genericSecrets } = require('./generic');
const { addEthSecrets } = require('./eth');
const { addWebXRSecrets } = require('./webXR');

module.exports = { 
  createSecrets: async (options) => {
    const { secrets } = options;
  
    if (secrets.includes("Yes")) {
    
      const secrets = genericSecrets(options);

      if (options.template.includes("Eth")) {
        addEthSecrets(options, secrets)
      } else {
        if (options.template.includes("WebXR")) addWebXRSecrets(options, secrets)
        secretsJson.tf_sls_service_name = configuration_name;
      }
      const stringifiedJson = JSON.stringify(JSON.stringify(secretsJson));
  
      const command = cmd.runSync(
        `aws secretsmanager create-secret --name ${configuration_name} --secret-string ${stringifiedJson}`
      );
  
      if (command.err) {
        console.log(`Sync Err ${command.err}`);
        throw new Error(command.err);
      } else if (command.stderr) {
        console.log(`Sync stderr: ${command.stderr}`);
        throw new Error(command.stderr);
      }
    }
  },
  createS3Bucket,
}
