import chalk from "chalk";
import Listr from "listr";
import {
  selectTemplate,
  configureTemplate,
  setupTargetDir,
  copyTemplateFiles,
  createSecrets,
  createS3Bucket,
  shouldGenerateResources,
} from "./scripts";

export const main = async (argv: string[]) => {
  const config = await selectTemplate(argv);
  const template = await configureTemplate(config);
  const location = await setupTargetDir(template);
  const userWantsResourcesGenerated = shouldGenerateResources(template);
  const tasks = new Listr([
    {
      title: "Create secrets",
      task: async () => await createSecrets(template),
      enabled: () => userWantsResourcesGenerated,
    },
    {
      title: "Create Terraform State S3 Bucket",
      task: async () => await createS3Bucket(template),
      enabled: () => userWantsResourcesGenerated,
    },
    {
      title: "Copy project files",
      task: async () => await copyTemplateFiles(location),
    },
  ]);
  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
};
