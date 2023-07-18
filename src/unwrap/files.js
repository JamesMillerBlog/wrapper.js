const ncp = require("ncp");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const access = promisify(fs.access);

const cmd = require("node-cmd");

const copy = promisify(ncp);

module.exports = { 
  copyTemplateFiles: async (options) => {
    return copy(options.templateDirectory, options.targetDirectory, {
      clobber: false,
    });
  },
  installDependencies: async (options) => {
    let command = cmd.runSync(`cd ${options.targetDirectory} && gobble install`);
  
    if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
    } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`);
      throw new Error(command.stderr);
    }
  },
  setupTargetDir: async (options) => {
    options = {
      ...options,
      targetDirectory: options.targetDirectory || process.cwd(),
    };
  
    const templateDir = path.resolve(
      new URL(__dirname).pathname,
      "../../templates",
      options.template.toLowerCase()
    );
  
    options.templateDirectory = templateDir;
  
    try {
      await access(templateDir, fs.constants.R_OK);
    } catch (err) {
      console.error("%s Invalid template name", chalk.red.bold("ERROR"));
      process.exit(1);
    }
    return options;
  }
}








