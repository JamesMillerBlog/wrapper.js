const cmd = require("node-cmd");
const templates = require('./templates');

module.exports = {
    createSecrets: async (options) => {  
        if (options.secrets.includes("Yes")) {
            
            const secrets = getTemplateSecrets(options)
            const stringifiedJson = JSON.stringify(JSON.stringify(secrets));
            const cmdString = `aws secretsmanager create-secret --name ${configuration_name} --secret-string ${stringifiedJson}`;
            const command = cmd.runSync(cmdString);
        
            if (command.err) {
            console.log(`Sync Err ${command.err}`);
            throw new Error(command.err);
            } else if (command.stderr) {
            console.log(`Sync stderr: ${command.stderr}`);
            throw new Error(command.stderr);
            }
        }
    },
    createS3Bucket: async (options) => {
        const { secretsFile, secrets } = options;
        if (secrets.includes("Yes")) {
          const { region, s3_bucket } = secretsFile;
          let command = cmd.runSync(
            `aws s3api create-bucket --bucket ${s3_bucket} --region ${region} --create-bucket-configuration LocationConstraint=${region}`
          );
          if (command.err) {
            console.log(`Sync Err ${command.err}`);
            throw new Error(command.err);
          } else if (command.stderr) {
            console.log(`Sync stderr: ${command.stderr}`);
            throw new Error(command.stderr);
          }
        }
      }
} 


const getTemplateSecrets = (options) => {
    for(const t in templates) {
        if (options.template.includes(t.name)) {
            return t.createSecrets(options)    
        }
    }
    throw new Error('No secrets exist for selected template');
}