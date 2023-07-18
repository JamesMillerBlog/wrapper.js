const serverless = require("./cli");

module.exports.run = (command) => {
  if(fs.existsSync("./backend/serverless")) {
    if (command == "deploy") {
      // build and deploy back end
      serverless.deploy();
    } else if (command == "remove") {
      // build and deploy back end
      serverless.remove();
    }
  } else {
    throw new Error('A Serverless Framework directory does not exist on your project.')
  }
}