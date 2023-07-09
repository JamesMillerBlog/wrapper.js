const utils = require('./utils.js');

( async () => {
    // run dev env
    if (process.argv.includes('dev')) {
        utils.dev();
    } else if (process.argv.includes('deploy')) {
        utils.deploy();
    } else if (process.argv.includes('remove')) {
        utils.remove();
    }
})();
