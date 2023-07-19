const utils = require("./../utils");

const duplicate = async (secret, argv) => {
  const duplicate = argv[4] ? argv[4] : null;
  const secretExists = await utils.secretExists(secret);
  if (!duplicate)
    throw new Error(
      `secret ${duplicate} is not valid and cannot be duplicated`,
    );
  if (!secretExists) throw new Error(`secret ${secret} does not exist`);

  const secrets = await utils.getSecrets(secret);
  const env = !isNaN(duplicate) ? "pr-" : "";
  const prSecret = secrets;
  prSecret.tf_sls_next_stage = `${env}${duplicate}`;
  prSecret.tf_sls_next_domain_name = `${env}${duplicate}.${secrets.tf_sls_next_root_domain_name}`;
  prSecret.tf_state_s3_bucket = `${env}${duplicate}-${secrets.tf_state_s3_bucket}`;
  utils.runSyncTerminalCommand(
    `aws secretsmanager create-secret --name ${env}${duplicate}-${secret} --secret-string ${JSON.stringify(
      JSON.stringify(prSecret),
    )}`,
  );
  const duplicatedSecretExists = await utils.secretExists(
    `${env}${duplicate}-${secret}`,
  );
  if (!duplicatedSecretExists)
    throw new Error(`new secret ${env}${duplicate}-${secret} not created`);
  else console.log(`secret ${env}${duplicate}-${secret} has been created`);

  utils.runSyncTerminalCommand(
    `aws s3api create-bucket --bucket ${prSecret.tf_state_s3_bucket} --region ${prSecret.tf_sls_next_region} --create-bucket-configuration LocationConstraint=${prSecret.tf_sls_next_region}`,
  );
};

module.exports = {
  duplicate,
};
