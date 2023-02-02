import { parseCategories } from "./parseCategories.js";
import { buildTreeWithGraphs } from "./buildTreeWithGraphs.js";
import categories from "./categories.json" assert { type: "json" };
import fsp from "node:fs/promises";
import path from "path";
import { root } from "../../utils/dirname.js";

const tree = await parseCategories(categories);

const graphs = buildTreeWithGraphs(tree);

console.info(graphs);
const filePath = path.join(root, "homework", "lesson_1", "part_1", "result.txt");
await fsp.writeFile(filePath, graphs);
console.info("\nResult saved");
