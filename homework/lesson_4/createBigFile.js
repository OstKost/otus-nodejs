import fs from "node:fs";
import path from "path";
import getRandomInt from "./utils/getRandomInt.js";
import bytesToSize from "./utils/bytesToSize.js";
import cliProgress from "cli-progress";

const start = async () => {
  const dirLesson = path.join("homework", "lesson_4");
  const pathResult = path.join(dirLesson, "numbers.txt");

  const writeStream = fs.createWriteStream(pathResult);

  const bar = new cliProgress.SingleBar({
    format: "Create big file {bar} {value} / {total}",
    hideCursor: true
  }, cliProgress.Presets.shades_classic);

  const createChunk = () => {
    const numbers = [];
    for (let i = 0; i < 2e5; i++) {
      const number = getRandomInt(1, 99999);
      numbers.push(number);
    }
    return numbers.join('\n');
  }

  bar.start(100, 0);
  for (let i = 0; i < 100; i++) {
    const chunk = createChunk();
    const value = (i ? '\n' : '') + chunk;
    writeStream.write(value);
    bar.increment(1);
  }

  bar.stop();
  const stat = await fs.statSync(pathResult);
  console.log("File created", bytesToSize(stat.size));

  writeStream.on("error", console.error);
};

void start();

