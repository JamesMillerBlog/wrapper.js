const next = require("./cli");

module.exports.run = (command) => {
  if(fs.existsSync("./frontend")) {
    if (command == "export") {
        // build and deploy app
        const envVars = JSON.parse(
          fs.readFileSync("devops/terraform/terraform.tfvars.json", "utf8")
        );
        next.buildAndDeploy(envVars);
    }
  } else {
    throw new Error('A Front End directory for NextJS does not exist on your project.')
  }
}