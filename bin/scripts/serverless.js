const utils = require('./utils.js'),
    fs = require('fs');

module.exports = {

    // **************************
    //       GENERATE ENV
    // **************************
    
    generateEnv: (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
        const deploymentData = { ...terraformGeneratedSecrets, ...manuallyCreatedSecrets };

        try {
            fs.writeFileSync('./backend/serverless/serverless.env.json', utils.prepData(deploymentData, "sls"));
            console.log('Created SLS ENV file');
        } catch (err) {
            console.log(err);
        }
    },

    install: () => {
        console.log('Installing Serverless dependencies');
        utils.runAsyncTerminalCommand(
            `cd ./backend/serverless && npm install`
        );
    },

    dev:() => {
        console.log('Running Serverless in dev');
        utils.runAsyncTerminalCommand(
            `cd ./backend/serverless && npm install && npm run dev`
        );
    },

    // **************************
    //       DEPLOY LAMBDAS
    // **************************
    
    deploy: () => {
        console.log('Deploying Serverless backend');
        utils.runAsyncTerminalCommand(
            `cd ./backend/serverless && npm install && npm run deploy`
        );
    },

    // **************************
    //    DESTROY ENVIRONMENT
    // **************************

    remove: () => {  
        console.log('Removing Serverless in backend');
        utils.runAsyncTerminalCommand(
            `cd ./backend/serverless && npm install && npm run remove`
        );
    }
}

