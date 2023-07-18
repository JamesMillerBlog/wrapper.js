const utils = require("./../utils.js");

module.exports.dev = async() => {
    const secret = subCommand;
    // Check if manually generated secret exists
    if ((await utils.secretExists(secret)) != false) {
      const { tf_state_s3_bucket } = await utils.getSecrets(secret);
      if (tf_state_s3_bucket) {
        utils.runSyncTerminalCommand(
          `aws s3 rm s3://${tf_state_s3_bucket} --recursive`
        );

        utils.runSyncTerminalCommand(
          `aws s3api delete-bucket --bucket ${tf_state_s3_bucket}`
        );
      }
      utils.runSyncTerminalCommand(
        `aws secretsmanager delete-secret --secret-id ${secret} --force-delete-without-recovery`
      );
    } else {
      if ((await utils.secretExists(`${env}${pr}-${secret}`)) == false) {
        throw new Error(`secret ${secret} does not exist`);
      }
    }
};