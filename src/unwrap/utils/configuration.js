const inquirer = require("inquirer");
const templates = require('./templates')

module.exports = {
    cliGenerateSecretsPrompt: async () => {
        const secrets = {
          type: "list",
          name: "cli_to_generate_secrets_prompt",
          message:
            "Would you like Wrapper.js to create a Secret in AWS Secrets Manager for you?",
          choices: [
            "Yes - choose this if you are not sure.",
            "No - I will manually create my own AWS Secret based on the documentation noted on https://jamesmiller.blog/wrapperjs.",
          ],
        };
        return await inquirer.prompt(secrets);
    },
    configureTemplate: async(options) => {
        if (options.skipPrompts) return options;
        
        const { cli_to_generate_secrets_prompt } = await cliGenerateSecretsPrompt();
        
        const secretsFile = cli_to_generate_secrets_prompt.includes("Yes")
        ? await getTemplateSecretsFile(options)
        : undefined;
    
        return {
            ...options,
            secretsFile,
        };
    },
    validate: (input) => {
        if (input == "") {
            console.log("You need to enter a valid answer");
            return false;
        }
        return true;
    }, 
    validateNotJMB: (input) => {
        if (input.includes("jamesmiller.blog") || input.includes("jamesmillerblog")) {
            console.log(`You can't use the example of ${input}, this was just to help you understand how to enter your own configuration`);
            return false;
        }
        return true;
    }
  }

const getTemplateSecretsFile = (options) => {
    for (const t in templates) {
        if(options.template.includes(t.name)) {
            return t.requestConfiguration();
        }
    }
    throw new Error('Configuration prompts to not exist for your selected template')
}