import fs from "fs";
import config from "../config";

export default () => {
  config.forEach((c: { filepath: fs.PathLike; cli: { dev: () => void } }) => {
    if (fs.existsSync(c.filepath)) c.cli.dev();
  });
};
