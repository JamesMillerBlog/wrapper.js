const cmd = require('node-cmd'),
    AWS = require('aws-sdk'),
    fs = require('fs');

// **************************
//      HELPER FUNCTIONS
// **************************

module.exports ={
    
    // Function to run syncronous terminal commands
    runSyncTerminalCommand: (terminalCommand) => {
    
        let command = cmd.runSync(terminalCommand);
        // console.log(`Beginning ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
        console.log("Started running a command");
    
        if (command.err) {
            console.log(`Sync Err ${command.err}`);
            throw new Error(command.err);
        }
        else if (command.stderr) {
            console.log(`Sync stderr: ${command.stderr}`)
            throw new Error(command.stderr);
        }
    
        console.log(command.data);
    },
    // Function to run asyncronous terminal commands
    runAsyncTerminalCommand: async (terminalCommand) => {

        let command = cmd.run(terminalCommand, function (err, data, stderr) {
            console.log("Started running a command");
            // console.log(`Start ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
            if (err) {
                console.log(err);
                // throw new Error(err);
            }
            if (stderr) {
                console.log(stderr);
                // throw new Error(stderr);
            }
        });

        // stream terminal output
        command.stdout.on('data', function (data) {
            console.log(data);
        });

        command.stdout.on('close', function (data) {
            console.log("Finished running command");
            // console.log(`Finished ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
        });

        await command;
    },
    
    prepData: (deploymentData, framework) => {
        let data = {};

        for (var property in deploymentData) {
            if(property.includes(framework)) {
                data[property] = deploymentData[property];
                let newKey = property.replace(/terraform_|sls_|next_/ig, '');
                data[newKey] = deploymentData[property];
                delete data[property];
            }
        }

        if(framework === "next") {
            data = 
`const withTM = require('next-transpile-modules')(['@react-three/drei', 'three'])

const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withTM], {env: ${JSON.stringify(data,null,2)}});`;
        } else {
            data = JSON.stringify(data, null, 2);
        }

        return data;
    },

    getSecrets: async (secretName) => {
        const client = new AWS.SecretsManager();
        try {
            const data = await client.getSecretValue({
                SecretId: secretName,
            }).promise();
            if (data) {
                if (data.SecretString) {
                    const secret = data.SecretString;
                    const parsedSecret = JSON.parse(secret);
                    returnedData = parsedSecret;
                    return parsedSecret;
                }
                const binarySecretData = data.SecretBinary;
                // console.log(binarySecretData);
                return binarySecretData;
            }
        } catch (error) {
            console.log('Error retrieving secrets');
            console.log(error);
        }
    },
    getSSM: async (deploymentData) => {   
        const { ssm } = deploymentData;
        const rawSsmParams = ssm.split(",");
        let formattedParams = [], loadedSsmValues = {}, paramNames = [];
        
        for (let x = 0; x < rawSsmParams.length; x++) {
            if (!rawSsmParams[x].includes(' ')) {
                formattedParams[x] = rawSsmParams[x];
            } else {
                formattedParams[x] = rawSsmParams[x].replace(/ /ig, '');
            }
            
            paramNames[x] = formattedParams[x].split('param_')[1];
            loadedSsmValues[paramNames[x]] = await module.exports.retrieveSSM(formattedParams[x]);
        }
        return loadedSsmValues;
    }, 
    retrieveSSM: async (secretName) => {
        const ssm = new AWS.SSM();       

        console.log(`Getting secret for ${secretName}`);
        const params = {
            Name: secretName,
            WithDecryption: true
        };

        const result = await ssm.getParameter(params).promise();
        // console.log(result.Parameter.Value);
        return result.Parameter.Value;
    } 
};