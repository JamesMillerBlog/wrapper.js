import { config } from "dotenv";

import { terraform, serverless, ethereum, next } from "./frameworks";
import scripts from "./scripts";
import { error } from "./utils";

config();

export enum LeadCommand {
  DEV = "dev",
  FINISHED = "finished",
  DUPLICATE = "duplicate",
  SECRETS = "secrets",
  TERRAFORM = "terraform",
  TF = "tf",
  SERVERLESS = "serverless",
  SLS = "sls",
  ETH = "eth",
  NEXT = "next",
}

export const main = async (argv: string[]) => {
  if (argv.length < 2) error("Enter a valid gobble command");

  const leadCommand = argv[2];
  const subCommand = argv[3];
  switch (leadCommand) {
    case LeadCommand.DEV:
      scripts.dev(); // todo: retire this function and move to templates package.json
      break;
    case LeadCommand.FINISHED:
      if (argv.length < 3) error("Enter a valid wrapperjs config to destroy");
      await scripts.finished(subCommand);
      break;
    case LeadCommand.DUPLICATE:
      if (argv.length < 3) error("Enter a valid wrapperjs config to duplicate");
      await scripts.duplicate(subCommand, argv[4]);
      break;
    case LeadCommand.SECRETS:
      if (argv.length < 3) error("Enter valid wrapperjs secrets to retrieve");
      await scripts.secrets(subCommand);
      break;
    case LeadCommand.TERRAFORM:
    case LeadCommand.TF:
      if (argv.length < 3) error("Enter valid terraform command");
      terraform.run(subCommand);
      break;
    case LeadCommand.SERVERLESS:
    case LeadCommand.SLS:
      if (argv.length < 3) error("Enter valid serverless command");
      serverless.run(subCommand); // todo: retire this function and move to templates package.json
      break;
    case LeadCommand.ETH:
      if (argv.length < 3) error("Enter valid ethereum command");
      ethereum.run(subCommand); // todo: retire this function and move to templates package.json
      break;
    case LeadCommand.NEXT:
      if (argv.length < 3) error("Enter valid next command");
      next.run(subCommand); // todo: retire this function and move to templates package.json
      break;
    default:
      error("Command not recognised, please try again");
  }
};
