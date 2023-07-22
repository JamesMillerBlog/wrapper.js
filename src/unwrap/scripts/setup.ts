import arg from "arg";
import inquirer, { Answers, QuestionCollection } from "inquirer";

export const selectTemplate = async (args: string[]) => {
  welcomeMessage();
  const options = await parseArgumentsIntoOptions(args);
  const template = await templateQuestion(options);
  return {
    ...options,
    template,
  };
};

const welcomeMessage = () => {
  console.log("Thank you for using\n");
  console.log(`
    ██╗    ██╗██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗         ██╗███████╗
    ██║    ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗        ██║██╔════╝
    ██║ █╗ ██║██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝        ██║███████╗
    ██║███╗██║██╔══██╗██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗   ██   ██║╚════██║
    ╚███╔███╔╝██║  ██║██║  ██║██║     ██║     ███████╗██║  ██║██╗╚█████╔╝███████║
     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚════╝ ╚══════╝
                                                                                 `);
  console.log(
    "\nYou will now be asked questions on your wrapper configuration:\n"
  );
};

const parseArgumentsIntoOptions = async (rawArgs: string[]) => {
  const args = arg(
    {
      "--yes": Boolean,
      "--install": Boolean,
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    template: args._[0],
    runInstall: args["--install"] || false,
  };
};

const templateQuestion = async (
  options: {
    template: string;
    runInstall: boolean;
  },
  defaultTemplate = "WebXR"
) => {
  const choices = ["WebXR", "Auth", "Eth-Auth", "Eth-Metaverse"];

  const prompt: QuestionCollection<Answers> = {
    type: "list",
    name: "template",
    message: "Please choose which project template to use",
    choices,
    default: defaultTemplate,
  };
  if (choices.includes(options.template)) return options.template;

  console.log("Template does not exist, please choose from one of the below.");
  const { template } = await inquirer.prompt(prompt);
  return String(template);
};
