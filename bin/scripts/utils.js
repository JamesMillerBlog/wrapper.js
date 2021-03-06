const cmd = require('node-cmd'),
    AWS = require('aws-sdk'),
    fs = require('fs'),
    internalIp = require('internal-ip');

// **************************
//      HELPER FUNCTIONS
// **************************

module.exports = {
    
    // Function to run syncronous terminal commands
    runSyncTerminalCommand: (terminalCommand) => {
    
        let command = cmd.runSync(terminalCommand);
        // console.log(`Beginning ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
        console.log("Started running a command");
        console.log(terminalCommand)
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
                let newKey = property.replace(/tf_|sls_|eth_|next_/ig, '');
                data[newKey] = deploymentData[property];
                delete data[property];
            }
        }
        if(framework == "next" || framework == "sls") {
            data['api_local_ip_address'] = internalIp.v4.sync();
            data['local_api_rest_port'] = '4000';
            data['local_api_ws_port'] = '4500';
        }
        if(framework == "eth") {
            data['local_ip_address'] = internalIp.v4.sync();
            data['localhost_network_id'] = '5777';
        }
        if(framework === "next") {
            data = 
            `module.exports = {trailingSlash: true,env: ${JSON.stringify(data,null,2)}};`;
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
                return binarySecretData;
            }
        } catch (error) {
            console.log('Error retrieving secrets');
            // console.log(error);
            return false;
        }
    },

    install: () => {
        // install wrapper.js dependencies
        module.exports.runAsyncTerminalCommand(
            `npm install`
        );
    },

    awsAccessSetup: (awsCredentials) => {
        const { region, access_key_id, secret_access_key } = awsCredentials;
        module.exports.runSyncTerminalCommand(`
            export AWS_REGION=${region} && 
            export AWS_ACCESS_KEY_ID=${access_key_id} && 
            export AWS_SECRET_ACCESS_KEY=${secret_access_key}
        `)
    },

    secretExists: async(secretName) => {
        if (await module.exports.getSecrets(secretName) != false) {
            return true;
        }
        return false;
    }
};