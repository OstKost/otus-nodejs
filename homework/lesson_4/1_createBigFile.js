import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "path";
import getRandomInt from "./utils/getRandomInt.js";
import bytesToSize from "./utils/bytesToSize.js";
import cliProgress from "cli-progress";
import { root } from "../utils/dirname.js";

const dirLessonFiles = path.join(root, "homework", "lesson_4", "files");
const numbersPath = path.join(dirLessonFiles, "numbers.txt");

export const createBigFile = () => {
  return new Promise(async (resolve, reject) => {
    await fsp.rm(numbersPath).catch((e) => console.info(e.message));

    const bar = new cliProgress.SingleBar({
      format: "Create big file {bar} {value} / {total}",
      hideCursor: true
    }, cliProgress.Presets.shades_classic);

    const writeStream = fs.createWriteStream(numbersPath);

    bar.start(100, 0);
    for (let i = 0; i < 100; i++) {
      const chunk = createChunk();
      const value = (i ? "\n" : "") + chunk;
      writeStream.write(value);
      bar.increment(1);
    }

    writeStream.close();

    writeStream.on("error", err => reject(err));

    writeStream.on("close", async () => {
      bar.stop();
      const stat = await fs.statSync(numbersPath);
      console.log("File created", bytesToSize(stat.size), numbersPath);
      resolve();
    });
  });
};

const createChunk = () => {
  const numbers = [];
  for (let i = 0; i < 2e5; i++) {
    const number = getRandomInt(1, 99999);
    numbers.push(number);
  }
  return numbers.join("\n");
};