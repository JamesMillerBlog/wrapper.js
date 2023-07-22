import { config } from "dotenv";

import { terraform, serverless, ethereum, next } from "./frameworks";
import scripts from "./scripts";
import { error } from "./utils";

config();

export const main = async (argv: string[]) => {
  if (argv.length < 3) error("Enter a valid gobble command");

  const leadCommand = argv[2];
  const subCommand = argv[3];
  if (leadCommand === "dev") {
    // todo: retire this function and move to templates package.json
    scripts.dev();
  } else if (leadCommand === "finished") {
    await scripts.finished(subCommand);
  } else if (leadCommand === "duplicate") {
    await scripts.duplicate(subCommand, argv[4]);
  } else if (leadCommand === "secrets") {
    await scripts.secrets(subCommand);
  } else if (leadCommand === "terraform" || leadCommand === "tf") {
    // todo: retire this function and move to templates package.json
    terraform.run(subCommand);
  } else if (leadCommand === "serverless" || leadCommand === "sls") {
    // todo: retire this function and move to templates package.json
    serverless.run(subCommand);
  } else if (leadCommand === "eth") {
    // todo: retire this function and move to templates package.json
    ethereum.run(subCommand);
  } else if (leadCommand === "next") {
    // todo: retire this function and move to templates package.json
    next.run(subCommand);
  }
};
