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

    const { secretsFile } = ( secrets.includes('Yes') ) ? await secretsFileQuestion() : '';

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