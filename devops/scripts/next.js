const utils = require('./utils.js'),
    fs = require('fs');

module.exports = {
    // **************************
    //    BUILD AND UPLOAD APP
    // **************************

    buildAndDeploy: (secrets, ssm) => {
        const { terraform_sls_next_domain_name } = secrets;

        const deploymentData = {...ssm, ...secrets};

        fs.writeFile('./webapp/next.config.js', utils.prepData(deploymentData, "next"), (err) => {
            if (err) throw err;
            console.log('NextJS env variables updated');
            
            utils.runSyncTerminalCommand(`cd webapp && npm run build`);
            utils.runSyncTerminalCommand(`aws s3 rm --recursive s3://${terraform_sls_next_domain_name}`);
            utils.runAsyncTerminalCommand(`aws s3 sync ./webapp/out s3://${terraform_sls_next_domain_name}`);
        });
    }
}

