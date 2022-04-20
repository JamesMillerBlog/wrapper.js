import chalk from 'chalk';
import fs from 'fs'; 
import ncp from 'ncp';
import path from 'path';
// import execa from 'execa';
import {promisify} from 'util';

import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
 return copy(options.templateDirectory, options.targetDirectory, {
   clobber: false,
 });
}

// async function initGit(options) {
//     const result = await execa('git', ['init'], {
//         cwd: options.targetDirectory,
//     });
//     if (result.failed) {
//         return Promise.reject(new Error('Failed to initialize git'));
//     }
//     return;
// }

const createEnvFile = async(options) => {
  if(options.envFile.includes("Yes - I would like Wrapper.js to create the `.env`")) {
    fs.writeFileSync(`${options.targetDirectory}/.env`, `AWS_REGION=${options.awsCredentials.region}\nAWS_ACCESS_KEY_ID=${options.awsCredentials.accessKeyId}\nAWS_SECRET_ACCESS_KEY=${options.awsCredentials.secretAccessKey}`);
  } else {
    fs.writeFileSync(`${options.targetDirectory}/.env`, `# edit these fields with your AWS details\n# remove 'example-' from this file's name so its called '.env'\n# remove the 3 comments at the top of this file\nAWS_REGION=eu-west-2\nAWS_ACCESS_KEY_ID=ABCDEFGHIJKLMNOPQRSTUVWXYZ\nAWS_SECRET_ACCESS_KEY=0123456789`);
  }
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };
    
    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
        '../../templates',
        options.template.toLowerCase()
    );
  
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
          title: 'Copy project files',
          task: () => copyTemplateFiles(options),
        },
        {
          title: 'Create .env file',
          task: () => createEnvFile(options),
          enabled: () => options.envFile,
        },
        {
          title: 'Install dependencies',
          task: () =>
            projectInstall({
              cwd: options.targetDirectory,
            }),
          skip: () =>
            !options.runInstall
              ? 'Pass --install to automatically install dependencies'
              : undefined,
        },
    ]);

    await tasks.run();

    console.log('Copy project files');
    await copyTemplateFiles(options);
    if(options.envFile) {
      console.log('Create env files');
      await createEnvFile(options);
    }
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}

// function currentFileUrl() {
//     const stackTraceFrames = String(new Error().stack)
//         .replace(/^Error.*\n/, '')
//         .split('\n');
//     // 0 = this getFileUrl frame (because the Error is created here)
//     // 1 = the caller of getFileUrl (the file path we want to grab)
//     const callerFrame = stackTraceFrames[1];
//     // Extract the script's complete url
//     const url = callerFrame.match(/http.*\.js/)[0];
//     return url;
// }

/* 
Next create secret: https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/create-secret.html
*/