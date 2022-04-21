import chalk from 'chalk';
// import execa from 'execa';
import Listr from 'listr';
import { copyTemplateFiles, createEnvFile, installDependencies, setupTargetDir } from './utils';

export async function createProject(options) {
    options = await setupTargetDir(options);

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
          task: async() => await installDependencies(options)
        },
    ]);

    await tasks.run();

    await copyTemplateFiles(options);
    if(options.envFile) {
      await createEnvFile(options);
    }
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}
/* 
Next create secret: https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/create-secret.html
After create s3 bucket for tf state
*/