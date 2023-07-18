#!/usr/bin/env node
const chalk = require('chalk');
const Listr = require('listr');
const { setup, configuration, files, resources } = require('./')

module.exports.main = async(argv) => {
    const { selectTemplate } = setup;
    const { configureTemplate } = configuration;
    const { copyTemplateFiles, installDependencies, setupTargetDir } = files;
    const { createSecrets, createS3Bucket} = resources;

    const config = await selectTemplate(argv);
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
};
  