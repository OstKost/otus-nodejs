import fsp from "node:fs/promises";
import path from "path";

const IGNORE_DIRS = [".git", "node_modules", ".idea"];

export const checkDirectory = async (_path) => {
  try {
    const stat = await fsp.stat(_path);
    if (!stat.isDirectory()) throw new Error(`${_path} is not a directory`);
    return true;
  } catch (e) {
    return false;
  }
};

export const getStructure = async (dirPath, maxDepth) => {
  const tree = [];
  if (!maxDepth) return null;
  const dirInfo = await fsp.readdir(dirPath);
  for await (const name of dirInfo) {
    if (IGNORE_DIRS.includes(name)) continue;
    const stat = await fsp.stat(path.join(dirPath, name));
    const isDirectory = stat.isDirectory();
    const children = isDirectory ? await getStructure(path.join(dirPath, name), maxDepth - 1) : null;
    tree.push({
      name,
      isDirectory,
      children
    });
  }
  return tree;
};

export const buildTree = async (structure, title) => {
  let tree = "";
  tree += path.resolve(title);
  const renderElement = (count, element) => Array(count).fill(element).join("");
  const buildLevel = (files = [], depth = 0, isLast = false) => {
    if (!files) return;
    files.forEach((file, index) => {
      const isLastItem = files.length - 1 === index;
      let prefix = "  ";
      const vLinesLimit = isLast ? 1 : 0;
      const renderCount = (depth - vLinesLimit < 0) ? 0 : (depth - vLinesLimit);
      prefix += renderElement(renderCount, "│   ");
      if (isLast) prefix += renderElement(1, "    ");
      prefix += isLastItem ? "└──" : "├──";

      const counterChildren = Array.isArray(file.children) ? `(${file.children.length})` : "";
      const level = `${prefix} ${file.name} ${counterChildren}`.trim() + "\n";
      tree += level;
      if (file.isDirectory) buildLevel(file.children, depth + 1, isLastItem);
    });
  };

  buildLevel(structure);

  return tree;
};
