import inquirer, { Answers, QuestionCollection } from "inquirer";
import { templates } from "../templates";
import { TemplateInterface } from "../templates/types";
import { error } from "../utils";

export const cliGenerateSecretsPrompt = async () => {
  const prompt: QuestionCollection<Answers> = {
    type: "list",
    name: "secrets",
    message:
      "Would you like Wrapper.js to create a Secret in AWS Secrets Manager for you?",
    choices: [
      "Yes - choose this if you are not sure.",
      "No - I will manually create my own AWS Secret based on the documentation noted on https://jamesmiller.blog/wrapperjs.",
    ],
  };

  const { secrets } = await inquirer.prompt(prompt);
  return String(secrets);
};

export const configureTemplate = async (options: {
  template: string;
  runInstall: boolean;
}): Promise<TemplateInterface> => {
  const secretsChoice: string = await cliGenerateSecretsPrompt();
  const secretsRequired = secretsChoice.includes("Yes");
  const name = options.template;

  const temp = retrieveTemplate(name);
  const template = new temp!(secretsRequired);
  if (secretsRequired) await template.setupConfig();
  return template;
};

export const retrieveTemplate = (name: string) => {
  for (const template of Object.values(templates)) {
    if (name === template.templateName) return template;
  }
  error(`Template ${name} does not exist`);
};
