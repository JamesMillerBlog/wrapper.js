const terraform = require("./cli");

module.exports.run = (command) => {
    if(fs.existsSync("./devops/terraform")) {
        const tfVarsLocation = './devops/terraform/terraform.tfvars.json';
        const envVars = JSON.parse(fs.readFileSync(tfVarsLocation, "utf8"));
        if (command == "init") terraform.init(envVars);
        else if (command == "plan") terraform.plan();
        else if (command == "apply") terraform.apply();
        else if (command == "destroy") terraform.destroy(envVars);
    } else {
        throw new Error('A Terraform directory does not exist on your project.')
    }
}