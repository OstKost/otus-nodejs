import { buildTree, checkDirectory, getStructure } from "./showTreeOfDir.js";
import { root } from "../../utils/dirname.js";
import { parseArgs } from "../../utils/parseArgs.js";
import fsp from "fs/promises";
import path from "path";

const args = parseArgs();

const pathToDir = args?.path || root;

const isOkPath = await checkDirectory(pathToDir);

if (!isOkPath) throw new Error(pathToDir + ' not a directory or not exist');

const structure = await getStructure(pathToDir, args?.nesting);

const tree = await buildTree(structure, pathToDir);

console.log(tree);

const filePath = path.join(root, "homework", "lesson_1", "part_2", "result.txt");

await fsp.writeFile(filePath, tree);

console.info("\nResult saved");

