/* eslint-disable camelcase */
const utils = require("../utils.js");

const finished = async (secret) => {
  const secretExists = await utils.secretExists(secret);
  if (!secretExists) throw new Error(`secret ${secret} does not exist`);

  const { tf_state_s3_bucket } = await utils.getSecrets(secret);

  if (tf_state_s3_bucket) {
    utils.runSyncTerminalCommand(
      `aws s3 rm s3://${tf_state_s3_bucket} --recursive`,
    );

    utils.runSyncTerminalCommand(
      `aws s3api delete-bucket --bucket ${tf_state_s3_bucket}`,
    );
  }
  utils.runSyncTerminalCommand(
    `aws secretsmanager delete-secret --secret-id ${secret} --force-delete-without-recovery`,
  );
};
module.exports = {
  finished,
};
