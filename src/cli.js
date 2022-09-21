import arg from 'arg';
import { createProject } from './main';
import { welcomeMessage, templateQuestion, secretsQuestion, secretsFileQuestion } from './utils';

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
       
    const { template } = await templateQuestion(options, defaultTemplate);
    
    const { secrets } =  await secretsQuestion();

    const { secretsFile } = ( secrets.includes('Yes') ) ? await secretsFileQuestion() : { 
      secretsFile: `{
  // create a secret in Amazon Secrets Manager with the below fields
  // once you've set this up with your own data, delete this file
  // the service name for terraform and serverless
  "tf_sls_service_name": "your-service-name",
  // the stage for terraform and serverless
  "tf_sls_next_stage": "dev",
  // the aws region your resources will be deployed to
  "tf_sls_next_region": "eu-west-2",
  // a domain name you own, with an existing hosted zone in route53
  "tf_sls_next_root_domain_name": "a-domain-name-own.com",
  // the subdomain you'd like terraform to create for you
  "tf_sls_next_domain_name": "subdomain-for.a-domain-name-own.com",
  // create an s3 bucket for your terraform state
  "tf_state_s3_bucket": "unique-s3-bucket-name",
  // name of tf state file you'd like to be created in your s3 bucket
  "tf_state_s3_key": "terraform.tfstate"
}`
    };

    return {
      ...options,
      template: options.template || template,
      secrets: secrets,
      secretsFile: secretsFile
    };
  }
  
  export async function cli (args) {
    welcomeMessage();
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
}

// module.exports = {cli};