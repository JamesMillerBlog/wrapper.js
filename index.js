const utils = require('./devops/scripts/utils.js'),
    terraform = require('./devops/scripts/terraform.js'),
    next = require('./devops/scripts/next.js'),
    serverless = require('./devops/scripts/serverless.js');

// **************************
//  LOGIC TO TRIGGER PROCESS
// **************************

( async () => {
    const envData = await utils.getSecrets(`${process.env.npm_config_client}-${process.env.npm_config_project}-${process.env.npm_config_environment}`);
    // create terraform environment
    if (process.argv.includes('terraformInit')) {
        terraform.init(envData);
    } else if (process.argv.includes('terraformPlan')) {
        terraform.plan(envData);
        // build and deploy app
    } else if (process.argv.includes('terraformApply')) {
        terraform.apply(envData);
    // build and deploy app
    } else if (process.argv.includes('deployApp')) {
        const ssmParams = await utils.getSSM(envData);
        next.buildAndDeploy(envData, ssmParams);
    // destroy environment
    } else if (process.argv.includes('destroyEnv')) {
        terraform.destroy(envData);
    }
    // deploy serverless environment
    else if (process.argv.includes('deployBackend')) {
        const ssmParams = await utils.getSSM(envData);
        serverless.deploy(envData, ssmParams);
        // build and deploy app
    } else if (process.argv.includes('removeBackend')) {
        const ssmParams = await utils.getSSM(envData);
        serverless.remove(envData, ssmParams);
    }
})();
// npm start createEnv --client=client --project=project --environment=dev
// npm run deployApp --client=client --project=project --environment=dev
// npm run destroyEnv --client=client --project=project --environment=dev

// terraform init -backend-config=environments/client/arena/dev/backend.hcl
// terraform apply -var client = "client" -var project = "project" -var environment = "stage"