const cmd = require("node-cmd");
const ncp = require("ncp");
const { promisify } = require("util");
const path = require("path");
const chalk = require("chalk");

const copy = promisify(ncp);
const fs = require("fs");
const access = promisify(fs.access);

const copyTemplateFiles = async (options) => {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
};

const installDependencies = async (options) => {
  const command = cmd.runSync(
    `cd ${options.targetDirectory} && gobble install`,
  );

  if (command.err) {
    console.log(`Sync Err ${command.err}`);
    throw new Error(command.err);
  } else if (command.stderr) {
    console.log(`Sync stderr: ${command.stderr}`);
    throw new Error(command.stderr);
  }
};

const setupTargetDir = async (options) => {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.resolve(
    new URL(__dirname).pathname,
    "../../templates",
    options.template.toLowerCase(),
  );

  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }
  return options;
};

module.exports = {
  copyTemplateFiles,
  installDependencies,
  setupTargetDir,
};
