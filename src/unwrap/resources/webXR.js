module.exports = { 
    addWebXRSecrets: async (options, secretsJson) => {
        const {
          ready_player_me,
        } = options.secretsFile;
    
        secretsJson.next_ready_player_me = ready_player_me;
    }
}