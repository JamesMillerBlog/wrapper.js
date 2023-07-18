const cmd = require("node-cmd");

module.exports = { 
  genericSecrets: async (options) => {
    const { secretsFile, secrets } = options;
  
    if (secrets.includes("Yes")) {
      const {
        stage,
        region,
        root_domain_name,
        domain_name,
        s3_bucket,
        s3_key,
      } = secretsFile;
  
      return {
        tf_sls_next_stage: stage,
        tf_sls_next_region: region,
        tf_sls_next_root_domain_name: root_domain_name,
        tf_sls_next_domain_name: domain_name,
        tf_state_s3_bucket: s3_bucket,
        tf_state_s3_key: s3_key,
      };
      
    }
  },
  createS3Bucket: async (options) => {
    const { secretsFile, secrets } = options;
    if (secrets.includes("Yes")) {
      const { region, s3_bucket } = secretsFile;
      let command = cmd.runSync(
        `aws s3api create-bucket --bucket ${s3_bucket} --region ${region} --create-bucket-configuration LocationConstraint=${region}`
      );
      if (command.err) {
        console.log(`Sync Err ${command.err}`);
        throw new Error(command.err);
      } else if (command.stderr) {
        console.log(`Sync stderr: ${command.stderr}`);
        throw new Error(command.stderr);
      }
    }
  }
}








