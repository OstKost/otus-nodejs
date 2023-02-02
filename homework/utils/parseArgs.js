import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const parseArgs = () => {
  return yargs(hideBin(process.argv))
    .option("path", {
      alias: "p",
      describe: "Path to directory",
      type: "string"
    })
    .option("nesting", {
      alias: "n",
      describe: "Depth of directories",
      type: "number"
    })
    .parse();
};