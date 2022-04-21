import inquirer from 'inquirer';
import ncp from 'ncp';
import path from 'path';
import fs from 'fs'; 
import { promisify } from 'util';

const access = promisify(fs.access);

const cmd = require('node-cmd');

const copy = promisify(ncp);

export const templateQuestion = async(options, defaultTemplate) => {
  let template = {
    type: 'list',
    name: 'template',
    message: 'Please choose which project template to use',
    choices: ['WebXR'],
    default: defaultTemplate,
  };
  if (!options.template) {
    return await inquirer.prompt(template)
  }
  else if (template.choices.includes(options.template)){
    return options.template;
  }
  console.log('Template does not exist, please choose from one of the below.')
  return await inquirer.prompt(template);
}

export const envQuestion = async() => {
    const env = {
      type: 'list',
      name: 'env',
      message: 'Have you configured your local development environment with your aws credentials (e.g with ~/.aws/config), or would you like to set this up in your project directory (with a .env file)?',
      choices: [
        'I would like to configure my AWS details using a .env file in my project directory (choose this if you are not sure).',
        'I have (or will) configure my local development environment with my AWS credentials using another method.'
      ],
    };
    return await inquirer.prompt(env)
}

export const envFileQuestion = async() => {
  const envFile = {
    type: 'list',
    name: 'envFile',
    message: 'Would you like Wrapper.js to create a .env file for you, or would you like to manually edit an example file?',
    choices: [
      'Yes - I would like Wrapper.js to create the `.env` file for me with my AWS credentials (choose this if you are not sure).',
      'No - I would like Wrapper.js to create a blank `.env` file for me to manually edit.'
    ]
  };
  return await inquirer.prompt(envFile)
}

export const awsCredentialsQuestion = async() => {
  const region = {
    name: 'region',
    message: 'Enter your AWS EU Region.',
    default: 'eu-west-2'
  };  
  const accessKeyId = {
    type: 'password',
    name: 'accessKeyId',
    message: 'Enter your AWS Access Key Id.',
  };
  
  const secretAccessKey = {
    type: 'password',
    name: 'secretAccessKey',
    message: 'Enter your AWS Secret Access Key.',
  };

  return {
    awsCredentials: {
      region: await inquirer.prompt(region),
      accessKeyId: await inquirer.prompt(accessKeyId),
      secretAccessKey: await inquirer.prompt(secretAccessKey)
    }
  };
}

export const secretsQuestion = async() => {
  const secrets = {
    type: 'list',
    name: 'secrets',
    message: 'Would you like Wrapper.js to create a Secret in AWS Secrets Manager for you, or would you like to manually create this yourself based on a template?',
    choices: [
      'Yes - I would like Wrapper.js to create a Secret for me (choose this if you are not sure).',
      'No - I will manually create my own Secret based on the template Wrapper.js creates for me in the root directory.'
    ],
  };
  return await inquirer.prompt(secrets)
}

export const copyTemplateFiles = async(options) => {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}
 
export const createEnvFile = async(options) => {
  if(options.envFile.includes("Yes - I would like Wrapper.js to create the `.env`")) {
    fs.writeFileSync(`${options.targetDirectory}/.env`, `AWS_REGION=${options.awsCredentials.region}\nAWS_ACCESS_KEY_ID=${options.awsCredentials.accessKeyId}\nAWS_SECRET_ACCESS_KEY=${options.awsCredentials.secretAccessKey}`);
  } else {
    fs.writeFileSync(`${options.targetDirectory}/.env`, `# edit these fields with your AWS details\n# remove 'example-' from this file's name so its called '.env'\n# remove the 3 comments at the top of this file\nAWS_REGION=eu-west-2\nAWS_ACCESS_KEY_ID=ABCDEFGHIJKLMNOPQRSTUVWXYZ\nAWS_SECRET_ACCESS_KEY=0123456789`);
  }
}

export const secretsFileQuestion = async() => {
  const service_name = {
    name: 'service_name',
    message: 'Enter a name for your Serverless Framework and Terraform service.',
    default: 'my-wrapperjs-fullstack-app'
  };  
  const stage = {
    name: 'stage',
    message: 'Enter the stage for your Serverless Framework and Terraform service.',
    default: 'dev'
  };
  
  const region = {
    name: 'region',
    message: 'Enter the region you want Serverless Framework and Terraform to create your AWS resources.',
    default: 'eu-west-2'
  };
  const root_domain_name = {
    name: 'root_domain_name',
    message: 'Enter a domain name you own, with an existing hosted zone in route53',
    default: 'jamesmiller.blog'
  };
  const domain_name = {
    name: 'domain_name',
    message: 'Enter the subdomain you would like terraform to create for you in your already existing hosted zone.',
    default: 'dev.jamesmiller.blog'
  };
  const s3_bucket = {
    name: 's3_bucket',
    message: 'Enter the name of an s3 bucket you would like Wrapper.js to create for your terraform state file.',
    default: 'my-wrapperjs-fullstack-app-dev.jamesmiller.blog'
  };
  const s3_key = {
    name: 's3_key',
    message: 'Enter name of tf state file you would like to be created in your s3 bucket',
    default: 'terraform.tfstate'
  };

  return {
    secretsFile: {
      service_name: await inquirer.prompt(service_name),
      stage: await inquirer.prompt(stage),
      region: await inquirer.prompt(region),
      root_domain_name: await inquirer.prompt(root_domain_name),
      domain_name: await inquirer.prompt(domain_name),
      s3_bucket: await inquirer.prompt(s3_bucket),
      s3_key: await inquirer.prompt(s3_key)
    }
  };
}

export const installDependencies = async(options) => {
  let command = cmd.runSync(`cd ${options.targetDirectory} && gobble install`);

  if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
  } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`)
      throw new Error(command.stderr);
  }
}

export const setupTargetDir = async(options) => {
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
  return options;
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
