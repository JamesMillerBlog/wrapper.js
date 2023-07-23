import chalk from "chalk";

export const validate = (input: string) => {
  if (input === "") {
    console.log("You need to enter a valid answer");
    return false;
  }
  return true;
};

export const validateNotJMB = (input: string) => {
  if (input.includes("jamesmiller.blog") || input.includes("jamesmillerblog")) {
    console.log(
      `You can't use the example of ${input}, this was just to help you understand how to enter your own configuration`
    );
    return false;
  }
  return true;
};

export const error = (message: string) => {
  console.error(message, chalk.red.bold("ERROR"));
  process.exit(1);
};
