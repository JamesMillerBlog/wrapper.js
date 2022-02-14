const cmd = require('node-cmd');

// **************************
//      HELPER FUNCTIONS
// **************************

module.exports = {
    
    // Function to run syncronous terminal commands
    runSyncTerminalCommand: (terminalCommand) => {
        
        let command = cmd.runSync(terminalCommand);
        // console.log(`Beginning ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
        console.log(`Started running a command: ${terminalCommand}`);
        if(command.data) {
            console.log(command.data);
        } else if (command.err) {
            console.log(`Sync Err ${command.err}`);
            throw new Error(command.err);
        } else if (command.stderr) {
            console.log(`Sync stderr: ${command.stderr}`)
            throw new Error(command.stderr);
        }
        // return command.data;
    },
    // Function to run asyncronous terminal commands
    runAsyncTerminalCommand: async (terminalCommand) => {

        let command = cmd.run(terminalCommand, function (err, data, stderr) {
            console.log(`Started running a command: ${terminalCommand}`);

            // console.log(`Start ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
            if (data) {
                console.log(data)
            } else if (err) {
                console.log(err);
                // throw new Error(err);
            } if (stderr) {
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
    }
};