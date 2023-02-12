import { createBigFile } from "./1_createBigFile.js";
import { splitFileToChunks } from "./2_splitToChunks.js";
import { sortMergeChunks } from "./3_sortMergeChunks.js";

(async () => {
// create 100mb file
  await createBigFile();
// split 100mb file to 5mb chunks
  await splitFileToChunks();
// read chunks, sort numbers, write in file
  await sortMergeChunks();
})();
