import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fsp from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IGNORE_DIRS = ['.git', 'node_modules', '.idea'];
const ROOT_DIR = path.resolve('.');

const stats = {
  files: 0,
  directories: 0,
};

let logs = '';

const parseArgs = () => {
  return yargs(hideBin(process.argv))
    .option('path', {
      alias: 'p',
      describe: 'Path to directory',
      type: 'string',
    })
    .option('nesting', {
      alias: 'n',
      describe: 'Depth of directories',
      type: 'number',
    })
    .parse();
};

const isExist = async (p) => {
  try {
    return await fsp.stat(p);
  } catch (e) {
    console.error(e);
    return null;
  }
};

const isDirectory = async (p, softCheck = true) => {
  try {
    const stat = await fsp.stat(p);
    const isDir = stat.isDirectory();
    if (!isDir && !softCheck) throw 'Not a directory';
    return isDir;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getDirInfo = async (dirPath, maxDepth) => {
  const tree = [];
  if (!maxDepth) return null;
  const dirInfo = await fsp.readdir(dirPath);
  for await (const name of dirInfo) {
    if (IGNORE_DIRS.includes(name)) continue;
    const stat = await fsp.stat(path.join(dirPath, name));
    const isFile = stat.isFile();
    const isDirectory = stat.isDirectory();
    if (isDirectory) stats.directories++;
    if (isFile) stats.files++;
    const children = isDirectory ? await getDirInfo(path.join(dirPath, name), maxDepth - 1) : null;
    tree.push({
      name,
      isFile,
      isDirectory,
      children,
      size: stat.size,
    });
  }
  return tree;
};

const showTree = async (tree, title) => {
  logs += `${path.resolve(title)}\n`;
  console.log(path.resolve(title));
  const renderElement = (count, element) => Array(count).fill(element).join('');
  const logLevel = (files = [], depth = 0, isLast = false) => {
    if (!files) return;
    files.forEach((file, index) => {
      const isLastItem = files.length - 1 === index;
      let prefix = '  ';
      const vLinesLimit = isLast ? 1 : 0;
      const renderCount = (depth - vLinesLimit < 0) ? 0 : (depth - vLinesLimit);
      prefix += renderElement(renderCount, '│   ');
      if (isLast) prefix += renderElement(1, '    ');
      prefix += isLastItem ? '└──' : '├──';

      const counterChildren = Array.isArray(file.children) ? `(${file.children.length})` : '';
      const logText = `${prefix} ${file.name} ${counterChildren}`.trim();
      logs += `${logText}\n`;
      console.info(logText);
      if (file.isDirectory) logLevel(file.children, depth + 1, isLastItem);
    });
  };
  logLevel(tree);
};

const showStats = () => {
  const text = `${stats.directories} directories, ${stats.files} files`;
  logs += text;
  console.info(text);
};

const createTree = async (dirPath, maxDepth = 3) => {
  await isExist(dirPath);
  await isDirectory(dirPath);
  const tree = await getDirInfo(dirPath, maxDepth);
  await showTree(tree, dirPath);
  showStats();
  fsp.writeFile(path.join(__dirname, 'logs.txt'), logs).then(() => console.info('\nLogs saved'));
};

const args = parseArgs();
const pathToDir = args?.path || ROOT_DIR;
await createTree(pathToDir, args?.nesting);

