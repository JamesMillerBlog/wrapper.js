import * as utils from "../utils";

export default async (
  secret: string | undefined,
  duplicate: string | undefined = undefined
) => {
  if (secret === undefined) utils.error(`Provide a secret to duplicate.`);
  const secretExists = await utils.secretExists(secret);
  if (!secretExists) utils.error(`secret ${secret} does not exist`);

  const secrets = await utils.getSecrets(secret);
  const env = duplicate && parseInt(duplicate) ? "pr-" : "";
  secrets.tf_sls_next_stage = `${env}${duplicate}`;
  secrets.tf_sls_next_domain_name = `${env}${duplicate}.${secrets.tf_sls_next_root_domain_name}`;
  secrets.tf_state_s3_bucket = `${env}${duplicate}-${secrets.tf_state_s3_bucket}`;

  const duplicateSecret = `${env}${duplicate}-${secret}`;
  const stringifiedSecrets = JSON.stringify(JSON.stringify(secrets));
  const duplicateSecretCommand = `aws secretsmanager create-secret --name ${duplicateSecret} --secret-string ${stringifiedSecrets}`;

  utils.runSyncTerminalCommand(duplicateSecretCommand);
  const duplicatedSecretExists = await utils.secretExists(`${duplicateSecret}`);
  if (!duplicatedSecretExists) {
    utils.error(`new secret ${duplicateSecret} not created`);
  } else {
    console.log(`secret ${duplicateSecret} has been created`);
  }
  const duplicateS3Command = `aws s3api create-bucket --bucket ${secrets.tf_state_s3_bucket} --region ${secrets.tf_sls_next_region} --create-bucket-configuration LocationConstraint=${secrets.tf_sls_next_region}`;
  utils.runSyncTerminalCommand(duplicateS3Command);
};
