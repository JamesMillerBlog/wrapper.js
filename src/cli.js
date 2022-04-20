import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
    //  '--env': Boolean,
     '--yes': Boolean,
     '--install': Boolean,
    //  '-g': '--git',
     '-y': '--yes',
     '-i': '--install',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
   skipPrompts: args['--yes'] || false,
   env: args['--env'] || false,
   template: args._[0],
   runInstall: args['--install'] || false,
 };
}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'WebXR';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['WebXR'],
        default: defaultTemplate,
      });
    }

    if (!options.env) {
      questions.push({
        type: 'list',
        name: 'env',
        message: 'Have you configured your local development environment with your aws credentials (e.g with ~/.aws/config), or would you like to set this up in your project directory (with a .env file)?',
        choices: [
          'I would like to configure my AWS details using a .env file in my project directory (choose this if you are not sure).',
          'I have (or will) configure my local development environment with my AWS credentials using another method.'
        ],
      });
    }
    const answers = await inquirer.prompt(questions);
    const envFileQuestions = [];
    let awsCredentialsAnswers;
    let secondAnswers;
    if(answers.env.includes('I would like to')) {
      envFileQuestions.push({
        type: 'list',
        name: 'envFile',
        message: 'Would you like Wrapper.js to create a .env file for you, or would you like to manually edit an example file?',
        choices: [
          'Yes - I would like Wrapper.js to create the `.env` file for me with my AWS credentials (choose this if you are not sure).',
          'No - I would like Wrapper.js to create a blank `.env` file for me to manually edit.'
        ],
      });
      secondAnswers = await inquirer.prompt(envFileQuestions);
  
      const awsCredentials = [];
      if(secondAnswers.envFile.includes('Yes - I would like Wrapper.js to create the `.env`')) {
        awsCredentials.push({
          name: 'awsRegion',
          message: 'Enter your AWS EU Region.',
          default: 'eu-west-2'
        });
        awsCredentials.push({
          type: 'password',
          name: 'awsAccessKeyId',
          message: 'Enter your AWS Access Key Id.',
        });
        awsCredentials.push({
          type: 'password',
          name: 'awsSecretAccessKey',
          message: 'Enter your AWS Secret Access Key.',
        });
      }
  
      awsCredentialsAnswers = await inquirer.prompt(awsCredentials);
    } else {
      secondAnswers = {
        envFile: undefined
      };
      awsCredentialsAnswers = {
        awsRegion: undefined,
        awsAccessKeyId: undefined,
        awsSecretAccessKey: undefined
      };
      // secondAnswers.envFile = undefined;
    }

    return {
      ...options,
      template: options.template || answers.template,
      env: options.env || answers.env,
      envFile: options.envFile || secondAnswers.envFile,
      awsCredentials: options.awsCredentialsAnswers || {
        region: awsCredentialsAnswers.awsRegion,
        accessKeyId: awsCredentialsAnswers.awsAccessKeyId,
        secretAccessKey: awsCredentialsAnswers.awsSecretAccessKey
      }
    };
  }
  
  export async function cli (args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
}

// module.exports = {cli};