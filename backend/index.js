const utils = require('./utils.js');
( async () => {
    // run dev env
    if (process.argv.includes('dev')) {
        // serverless.dev();
        // ethereum.dev();
        utils.runAsyncTerminalCommand(
            `cd ./serverless && npm install && npm run dev`
        );
        utils.runAsyncTerminalCommand(
            `cd ./ethereum && npm install && npm run dev`
        );
    } else if (process.argv.includes('deploy')) {
        // serverless.deploy();
        utils.runAsyncTerminalCommand(
            `cd ./serverless && npm install && npm run deploy`
        );
    } else if (process.argv.includes('remove')) {
        // serverless.remove();
        utils.runAsyncTerminalCommand(
            `cd ./serverless && npm install && npm run remove`
        );
    }
})();