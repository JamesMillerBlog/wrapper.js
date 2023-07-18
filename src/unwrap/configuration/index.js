const { cliGenerateSecretsPrompt, secretsConfigurationQuestions } = require('./generic');
const { addEthSecrets } = require('./eth');
const { addWebXrSecrets } = require('./webXR')


module.exports = {
    configureTemplate: async(options) => {
      if (options.skipPrompts) return options;
      
      const { cli_to_generate_secrets_prompt } = await cliGenerateSecretsPrompt();
      const { secretsFile } = cli_to_generate_secrets_prompt.includes("Yes")
        ? await secretsConfigurationQuestions(options)
        : undefined;
      if(secretsFile && options.template.includes("WebXR")) {
        addWebXrSecrets(secretsFile)
      } else if(secretsFile && options.template.includes("Eth")) {
        addEthSecrets(secretsFile);
      }
    
      return {
        ...options,
        secretsFile: secretsFile,
      };
    }
  }