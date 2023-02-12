import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "path";
import cliProgress from "cli-progress";
import zeroPad from "./utils/zeroPad.js";
import { root } from "../utils/dirname.js";

const dirLessonFiles = path.join(root, "homework", "lesson_4", "files");
const numbersFilePath = path.join(dirLessonFiles, "numbers.txt");
const dirChunks = path.join(dirLessonFiles, "chunks");

export const splitFileToChunks = () => {
  return new Promise(async (resolve, reject) => {
    await fsp.rm(dirChunks, { recursive: true }).catch(e => console.info(e.message));
    await fsp.mkdir(dirChunks, { recursive: true });

    const bar = new cliProgress.SingleBar({
      format: "Create chunks {bar} {value} / {total}",
      hideCursor: true
    }, cliProgress.Presets.shades_classic);

    const stats = await fsp.stat(numbersFilePath);
    const totalSize = Math.round(stats.size / (1024 * 1024));
    bar.start(totalSize, 0);

    const chunkSize = 5 * 1024 * 1024;
    const readStream = fs.createReadStream(path.join(dirLessonFiles, "numbers.txt"),
      {
        highWaterMark: chunkSize,
        autoClose: true
      }
    );

    let lastLineData;

    readStream.on("data", (chunk) => {
      const postfix = zeroPad(Math.floor(Math.random() * 1e4), 4);
      const writeStream = fs.createWriteStream(path.join(dirChunks, `chunk_${postfix}.txt`));
      let data = chunk.toString();
      if (lastLineData) data = lastLineData + data;
      const lines = data.split("\n");
      lastLineData = lines.splice(lines.length - 1, 1)[0];
      lines.sort((a, b) => Number(a) > Number(b) ? 1 : -1);
      writeStream.write(lines.join("\n"));
      bar.increment(Math.round(chunk.length / (1024 * 1024)));
      writeStream.end();
      writeStream.on("error", err => reject(err));
    });

    readStream.on("error", err => reject(err));

    readStream.on("end", () => {
      bar.stop();
      console.log("Chunks sorted and created");
      resolve();
    });
  });
};
