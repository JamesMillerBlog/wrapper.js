const inquirer = require("inquirer");
const { validateNotJMB } = require('./validation')

module.exports = {
    addWebXrSecrets: async(secretsFile) => {
        const ready_player_me_prompt = {
            name: "ready_player_me",
            message:
              "Enter the readyplayer.me subdomain used for creating and retrieving 3D Avatars.",
            default: "jamesmillerblog",
            validate: validateNotJMB,
          };
        const { ready_player_me } = await inquirer.prompt(ready_player_me_prompt);
        secretsFile.ready_player_me = ready_player_me;
    }
}