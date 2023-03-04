import fs from "node:fs";
import fsp from "node:fs/promises";
import readline from "node:readline";
import path from "node:path";
import bytesToSize from "./utils/bytesToSize.js";
import { root } from "../utils/dirname.js";

const dirLessonFiles = path.join(root, "homework", "lesson_4", "files");
const sortedFilePath = path.join(dirLessonFiles, "sorted_numbers.txt");
const dirChunks = path.join(dirLessonFiles, "chunks");

export const sortMergeChunks = () => {
  return new Promise(async (resolve, reject) => {
    await fsp.rm(sortedFilePath).catch((e) => console.info(e.message));

    console.log("Sorting merging chunks");

    const chunks = await fsp.readdir(dirChunks);

    const writeStream = fs.createWriteStream(sortedFilePath, { highWaterMark: 1024 });

    let streamIterators = getIterators(chunks);

    let numbers = [];
    for (const streamIterator of streamIterators) {
      const number = await streamIterator.next();
      numbers.push(number.value);
    }

    let min = Math.min(...numbers);
    while (streamIterators.length > 0) {
      const index = numbers.findIndex((number) => +number === +min);
      const buffer = await streamIterators[index].next();
      numbers[index] = buffer.value;
      if (buffer.done) {
        streamIterators.splice(index, 1);
        numbers.splice(index, 1);
      }
      min = Math.min(...numbers);
      writeStream.write(min + "\n");
    }

    writeStream.close();

    writeStream.on("close", async () => {
      const stats = await fsp.stat(sortedFilePath);
      console.log("Done. Sorted file:", bytesToSize(stats.size), sortedFilePath);
      resolve();
    });

    writeStream.on("error", err => reject(err));
  });
};

function getIterators(paths) {
  const iterators = [];
  paths.forEach((p) => {
    const filePath = path.join(dirChunks, p);
    const iterator = readline.createInterface({
      input: fs.createReadStream(filePath, { highWaterMark: 1024 })
    })[Symbol.asyncIterator]();
    iterators.push(iterator);
  });
  return iterators;
}