const utils = require('./utils.js'),
    fs = require('fs');

module.exports = {

    // **************************
    //       DEPLOY LAMBDAS
    // **************************
    
    deploy: (secrets, ssm) => {
        const deploymentData = { ...ssm, ...secrets };

        fs.writeFile('./serverless/serverless.env.json', utils.prepData(deploymentData, "sls"), (err) => {
            if (err) throw err;
            console.log('SLS ENV file updated');

            utils.runAsyncTerminalCommand(
                `cd ./serverless && serverless deploy`
            );
        });
    },

    // **************************
    //    DESTROY ENVIRONMENT
    // **************************

    remove: (secrets, ssm) => {
        const deploymentData = { ...ssm, ...secrets };
        fs.writeFile('./serverless/serverless.env.json', utils.prepData(deploymentData, "sls"), (err) => {
            if (err) throw err;
            console.log('SLS ENV file updated');

            utils.runAsyncTerminalCommand(
                `cd ./serverless && serverless remove`
            );
        });
    }
}

