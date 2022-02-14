const utils = require('./utils.js'),
    fs = require('fs');

module.exports = {

    // **************************
    //       GENERATE ENV
    // **************************
    
    generateEnv: (manuallyCreatedSecrets, terraformGeneratedSecrets) => {
        const deploymentData = { ...terraformGeneratedSecrets, ...manuallyCreatedSecrets };

        try {
            fs.writeFileSync('./frontend/next.config.js', utils.prepData(deploymentData, "next"));
            console.log('NextJS ENV file updated');
        } catch (err) {
            console.log(err);
        }
    },
    // **************************
    //    BUILD AND UPLOAD APP
    // **************************

    buildAndDeploy: (deploymentData) => {
        const { domain_name } = deploymentData;
        utils.runSyncTerminalCommand(`cd frontend && npm install && npm run build`);
        utils.runSyncTerminalCommand(`aws s3 rm --recursive s3://${domain_name}`);
        utils.runAsyncTerminalCommand(`aws s3 sync ./frontend/out s3://${domain_name}`);
    }
}

