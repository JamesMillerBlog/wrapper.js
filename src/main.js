import chalk from 'chalk';
// import execa from 'execa';
import Listr from 'listr';
import { copyTemplateFiles, createEnvFile, installDependencies, setupTargetDir, createSecrets, createS3Bucket } from './utils';

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
        title: 'Create secrets',
        task: () => createSecrets(options),
      },
      {
        title: 'Create Terraform State S3 Bucket',
        task: () => createS3Bucket(options),
        enabled: () => options.s3Creation
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
  Add commands to pull the secrets and run the dev environment
*/