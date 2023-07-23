export interface AuthConfiguration {
  configuration_name: string;
  stage: string;
  region: string;
  root_domain_name: string;
  domain_name: string;
  s3_bucket: string;
  s3_key: string;
}

export interface EthAuthConfiguration extends AuthConfiguration {
  network: string;
  network_api_url: string;
  account_address: string;
}

export type EthMetaverseConfiguration = EthAuthConfiguration;

export interface WebxrConfiguration extends AuthConfiguration {
  ready_player_me: string;
}

export type Configuration =
  | AuthConfiguration
  | EthAuthConfiguration
  | EthMetaverseConfiguration
  | WebxrConfiguration;

export type RequestConfiguration = () => Promise<Configuration>;

export interface CreateAuthSecrets {
  tf_sls_next_stage: string;
  tf_sls_next_region: string;
  tf_sls_next_root_domain_name: string;
  tf_sls_next_domain_name: string;
  tf_state_s3_bucket: string;
  tf_state_s3_key: string;
  tf_sls_service_name: string;
}

export interface CreateEthAuthSecrets {
  tf_sls_next_stage: string;
  tf_sls_next_region: string;
  tf_sls_next_root_domain_name: string;
  tf_sls_next_domain_name: string;
  tf_state_s3_bucket: string;
  tf_state_s3_key: string;
  eth_tf_sls_service_name: string;
  eth_network: string;
  eth_network_api_url: string;
  eth_account_address: string;
}

export interface CreateEthMetaverseSecrets {
  tf_sls_next_stage: string;
  tf_sls_next_region: string;
  tf_sls_next_root_domain_name: string;
  tf_sls_next_domain_name: string;
  tf_state_s3_bucket: string;
  tf_state_s3_key: string;
  eth_tf_sls_service_name: string;
  eth_network: string;
  eth_network_api_url: string;
  eth_account_address: string;
}

export interface CreateWebxrSecrets {
  tf_sls_next_stage: string;
  tf_sls_next_region: string;
  tf_sls_next_root_domain_name: string;
  tf_sls_next_domain_name: string;
  tf_state_s3_bucket: string;
  tf_state_s3_key: string;
  next_ready_player_me: string;
  tf_sls_service_name: string;
}

export type CreateSecrets =
  | ((config: AuthConfiguration) => CreateAuthSecrets)
  | ((config: EthAuthConfiguration) => CreateEthAuthSecrets)
  | ((config: EthMetaverseConfiguration) => CreateEthMetaverseSecrets)
  | ((config: WebxrConfiguration) => CreateWebxrSecrets);

export type Secrets =
  | CreateAuthSecrets
  | CreateEthAuthSecrets
  | CreateEthMetaverseSecrets
  | CreateWebxrSecrets;

export interface TemplateInterface {
  name: string;
  secrets: Secrets | undefined;
  config: Configuration | undefined;
  secretsRequired: boolean;
  setupConfig: () => Promise<void>;
  createSecrets: CreateSecrets;
  requestConfiguration: () => Promise<Configuration>;
}
