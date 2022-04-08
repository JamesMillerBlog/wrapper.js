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
            console.log('Created NextJS ENV file');
        } catch (err) {
            console.log(err);
        }
    },

    install: () => {
        console.log('Installing Next.JS dependencies');
        utils.runAsyncTerminalCommand(
            `cd ./frontend && npm install`
        );
    },

    dev: () => {
        console.log('Running Next.JS in dev');
        utils.runAsyncTerminalCommand(
            `cd ./frontend && npm install && npm run dev`
        );
    },
    // **************************
    //    BUILD AND UPLOAD APP
    // **************************

    buildAndDeploy: (deploymentData) => {
        console.log('Exporting and deploying Next.JS');
        const { domain_name } = deploymentData;
        console.log(domain_name);
        utils.runSyncTerminalCommand(`cd frontend && npm install && npm run build`);
        utils.runSyncTerminalCommand(`aws s3 rm --recursive s3://${domain_name}`);
        utils.runAsyncTerminalCommand(`aws s3 sync ./frontend/out s3://${domain_name}`);
    }
}

