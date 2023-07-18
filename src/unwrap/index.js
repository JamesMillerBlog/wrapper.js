#!/usr/bin/env node
const chalk = require('chalk');
const Listr = require('listr');


(async () => {
    const { selectTemplate } = require('./templates')
    const { configureTemplate } = require('./configuration')
    const { copyTemplateFiles, installDependencies, setupTargetDir } = require('./files');
    const { createSecrets, createS3Bucket} = require('./resources')

    const config = await selectTemplate(process.argv);
    const prompts = await configureTemplate(config);
    const options = await setupTargetDir(prompts);
    const tasks = new Listr([
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
            title: 'Copy project files',
            task: async() => await copyTemplateFiles(options),
        },
        {
            title: 'Install dependencies',
            task: async() => await installDependencies(options)
        },
    ]);
    await tasks.run();
    await copyTemplateFiles(options);
    console.log('%s Project ready', chalk.green.bold('DONE'));
})(process);
  