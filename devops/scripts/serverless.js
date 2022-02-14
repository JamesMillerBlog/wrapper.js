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
            console.log('SLS ENV file updated');
        } catch (err) {
            console.log(err);
        }
    },

    // **************************
    //       DEPLOY LAMBDAS
    // **************************
    
    deploy: () => {
        utils.runAsyncTerminalCommand(
            `cd ./backend/serverless && npm install && npm run deploy`
        );
    },

    // **************************
    //    DESTROY ENVIRONMENT
    // **************************

    remove: () => {  
        utils.runAsyncTerminalCommand(
            `cd ./backend/serverless && npm install && npm run remove`
        );
    }
}

