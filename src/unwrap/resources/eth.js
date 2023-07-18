module.exports = { 
  addEthSecrets: async (options, secretsJson) => {
    const {
        configuration_name,
        network,
        network_api_url,
        account_address,
    } = options.secretsFile;

    secretsJson.eth_tf_sls_service_name = configuration_name;
    secretsJson.eth_network = network;
    secretsJson.eth_network_api_url = network_api_url;
    secretsJson.eth_account_address = account_address;
  }
}