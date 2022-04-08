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
        // {
        //   title: 'Initialize git',
        //   task: () => initGit(options),
        //   enabled: () => options.git,
        // },
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