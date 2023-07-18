const arg = require("arg");
const inquirer = require("inquirer");

module.exports = {
    selectTemplate: async(args) => {
      welcomeMessage()
      const options = await parseArgumentsIntoOptions(args)
      const { template } = await templateQuestion(options);
      options.template = template;
      return options;
    }
}

const welcomeMessage = () => {
    console.log("Thank you for using\n");
    console.log(`
    ██╗    ██╗██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗         ██╗███████╗
    ██║    ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗        ██║██╔════╝
    ██║ █╗ ██║██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝        ██║███████╗
    ██║███╗██║██╔══██╗██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗   ██   ██║╚════██║
    ╚███╔███╔╝██║  ██║██║  ██║██║     ██║     ███████╗██║  ██║██╗╚█████╔╝███████║
     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚════╝ ╚══════╝
                                                                                 `
    );
    console.log(
      "\nYou will now be asked questions on your wrapper configuration:\n"
    );
};

const parseArgumentsIntoOptions = async(rawArgs) => {
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
   skipPrompts: args["--yes"] || false,
   env: args["--env"] || false,
   template: args._[0],
   runInstall: args["--install"] || false,
 };
};

const templateQuestion = async (options, defaultTemplate = 'WebXR') => {
  const template = {
    type: "list",
    name: "template",
    message: "Please choose which project template to use",
    choices: ["WebXR", "Auth", "Eth-Auth", "Eth-Metaverse"],
    default: defaultTemplate,
  };
  if (!options.template) {
    return await inquirer.prompt(template);
  } else if (template.choices.includes(options.template)) {
    return options.template;
  }
  console.log("Template does not exist, please choose from one of the below.");
  return await inquirer.prompt(template);
};