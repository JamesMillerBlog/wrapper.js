import arg from 'arg';
import { createProject } from './main';
import { templateQuestion, envQuestion, envFileQuestion, awsCredentialsQuestion, secretsQuestion, secretsFileQuestion } from './utils';

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
    
    const { env } = await envQuestion();
    
    const { envFile } = ( env.includes('I would like to') ) ? await envFileQuestion() : { envFile: null };
    
    const { awsCredentials } = (env.includes('I would like to') && envFile.includes('Yes') ) ? await awsCredentialsQuestion() : { 
        awsCredentials: {
          region: undefined,
          accessKeyId: undefined,
          secretAccessKey: undefined       
        }
    };

    const { secrets } =  await secretsQuestion();

    const { secretsFile } = ( secrets.includes('Yes') ) ? await secretsFileQuestion() : { 
      secretsFile: null 
    };


    return {
      ...options,
      template: options.template || template,
      envFile: options.envFile || envFile,
      awsCredentials: awsCredentials,
      secretsFile: secretsFile
    };
  }
  
  export async function cli (args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    console.log(options);
    // await createProject(options);
}

// module.exports = {cli};