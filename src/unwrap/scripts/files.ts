import ncp from "ncp";
import { promisify } from "util";
import { resolve } from "path";
import { access as _access, constants } from "fs";
import { error } from "../utils";
import { TemplateInterface } from "../templates/types";

const copy = promisify(ncp);
const access = promisify(_access);

export const copyTemplateFiles = async ({
  templateDirectory,
  targetDirectory,
}: {
  templateDirectory: string;
  targetDirectory: string;
}) => {
  return copy(templateDirectory, targetDirectory, {
    clobber: false,
  });
};

export const setupTargetDir = async (template: TemplateInterface) => {
  const targetDirectory = process.cwd();
  const name = template?.name;
  const templateDirectory = resolve(
    __dirname,
    "../../../templates",
    name.toLowerCase()
  );

  try {
    await access(templateDirectory, constants.R_OK);
  } catch (err) {
    error("%s Invalid template name");
  }

  return {
    targetDirectory,
    templateDirectory,
  };
};
