const utils = require("./../utils");

module.exports.duplicate = async(secret) => {
    const duplicate = process.argv[4] ? process.argv[4] : null;

    // Check if manually generated secret exists
    if ((await utils.secretExists(secret)) != false) {
      const secrets = await utils.getSecrets(secret);
      if (duplicate) {
        let env = "";
        if (isNaN(duplicate) == false) {
          env = "pr-";
        }
        const prSecret = secrets;
        const serviceName = prSecret.tf_sls_service_name
          ? prSecret.tf_sls_service_name
          : prSecret.eth_tf_sls_service_name;
        serviceName = `${env}${duplicate}-${secrets.tf_sls_service_name}`;
        prSecret.tf_sls_next_stage = `${env}${duplicate}`;
        prSecret.tf_sls_next_domain_name = `${env}${duplicate}.${secrets.tf_sls_next_root_domain_name}`;
        prSecret.tf_state_s3_bucket = `${env}${duplicate}-${secrets.tf_state_s3_bucket}`;
        utils.runSyncTerminalCommand(
          `aws secretsmanager create-secret --name ${env}${duplicate}-${secret} --secret-string ${JSON.stringify(
            JSON.stringify(prSecret)
          )}`
        );
        if (
          (await utils.secretExists(`${env}${duplicate}-${secret}`)) == false
        ) {
          throw new Error(
            `new secret ${env}${duplicate}-${secret} not created`
          );
        } else {
          console.log(`secret ${env}${duplicate}-${secret} has been created`);
        }
        utils.runSyncTerminalCommand(
          `aws s3api create-bucket --bucket ${prSecret.tf_state_s3_bucket} --region ${prSecret.tf_sls_next_region} --create-bucket-configuration LocationConstraint=${prSecret.tf_sls_next_region}`
        );
      }
    } else {
      throw new Error(`secret ${secret} does not exist`);
    }
};