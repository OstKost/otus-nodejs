import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "path";
import cliProgress from "cli-progress";
import zeroPad from "./utils/zeroPad.js";

const dirLesson = path.join("homework", "lesson_4");
const dirChunks = path.join(dirLesson, "chunks");
await fsp.rm(dirChunks, { recursive: true });
await fsp.mkdir(dirChunks, { recursive: true });

const bar = new cliProgress.SingleBar({
  format: "Create chunks {bar} {value} / {total}",
  hideCursor: true
}, cliProgress.Presets.shades_classic);

const stats = await fsp.stat(path.join(dirLesson, "numbers.txt"));
const totalSize = Math.round(stats.size / (1024 * 1024));
bar.start(totalSize, 0);

const chunkSize = 5 * 1024 * 1024;
const readStream = fs.createReadStream(path.join(dirLesson, "numbers.txt"),
  {
    highWaterMark: chunkSize,
    autoClose: true
  }
);

let lastLineData;

readStream.on("data", (chunk) => {
  const postfix = zeroPad(Math.floor(Math.random() * 1e4), 4);
  const writeStream = fs.createWriteStream(path.join(dirChunks, `chunk_${postfix}.txt`));
  writeStream.on("error", console.error);
  let data = chunk.toString();
  if (lastLineData) data = lastLineData + data;
  const lines = data.split("\n");
  lastLineData = lines.splice(lines.length - 1, 1)[0];
  lines.sort((a,b) => Number(a) > Number(b) ? 1 : -1);
  writeStream.write(lines.join("\n"));
  bar.increment(Math.round(chunk.length / (1024 * 1024)));
  writeStream.end();
});

readStream.on("error", console.error);
readStream.on("end", () => {
  bar.stop();
  console.log("Chunks sorted and created");
});