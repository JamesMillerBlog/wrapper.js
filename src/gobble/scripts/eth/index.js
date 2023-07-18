const ethereum = require("./cli");

module.exports.run = (command) => {
    if(fs.existsSync("./backend/ethereum")) {
        if (command == "deploy") {
            const envVarsLocation = "backend/ethereum/eth.env.json";
            const envVars = JSON.parse(fs.readFileSync(envVarsLocation, "utf8"));
            ethereum.deploy(envVars);
        }
    } else {
        throw new Error('An Ethereum directory does not exist on your project.')
    }
}