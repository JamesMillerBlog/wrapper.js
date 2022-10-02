import chalk from 'chalk';
// import execa from 'execa';
import Listr from 'listr';
import { copyTemplateFiles, installDependencies, setupTargetDir, createSecrets, createS3Bucket } from './utils';

export async function createProject(options) {
    options = await setupTargetDir(options);

    const tasks = new Listr([
      {
        title: 'Copy project files',
        task: async() => await copyTemplateFiles(options),
      },
      {
        title: 'Create secrets',
        task: async() => await createSecrets(options),
        enabled: () => options.secrets.includes('Yes')
      },
      {
        title: 'Create Terraform State S3 Bucket',
        task: async() => await createS3Bucket(options),
        enabled: () => options.secrets.includes('Yes')
      },
      {
        title: 'Install dependencies',
        task: async() => await installDependencies(options)
      },
    ]);

    await tasks.run();

    await copyTemplateFiles(options);

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}
/* 
  Add commands to pull the secrets and run the dev environment
*/