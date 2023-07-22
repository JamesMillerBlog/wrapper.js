/* eslint-disable camelcase */
import * as utils from "../utils";

export default async (secret: string | undefined) => {
  if (secret === undefined) utils.error("Provide secret to finish");
  const secretExists = await utils.secretExists(secret);
  if (!secretExists) utils.error(`secret ${secret} does not exist`);

  const { tf_state_s3_bucket }: { tf_state_s3_bucket: string } =
    await utils.getSecrets(secret);

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
};
