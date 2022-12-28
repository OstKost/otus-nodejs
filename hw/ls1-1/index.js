import fsp from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const parseCategories = async () => {
  const inputFile = await fsp.readFile(path.join(__dirname, 'categories.json'));
  const categories = JSON.parse(inputFile);

  const findChildren = (category) => categories.filter(item => item.PRODUCT_TREE_ATTR_PARENT_ID === category.PRODUCT_TREE_ATTR_ID);

  categories.forEach(category => {
    category.children = findChildren(category);
  });

  const topLevel = categories.filter(item => !item.PRODUCT_TREE_ATTR_PARENT_ID);

  return topLevel;
};

const logTree = (tree) => {
  let logs = '';
  const transformName = (_name) => _name.charAt(0).toUpperCase() + _name.slice(1).toLowerCase();
  const renderElement = (count, element) => Array(count).fill(element).join('');

  const logLevel = (level = [], depth = 0, isLast = false) => {
    level.forEach((category, index) => {
      const isLastItem = depth ? level.length - 1 === index : false;
      let prefix = depth ? '  ' : ' ';
      const vLinesLimit = isLast ? 2 : 1;
      const renderCount = (depth - vLinesLimit < 0) ? 0 : (depth - vLinesLimit);
      prefix += depth ? renderElement(renderCount, '│   ') : '';
      if (isLast) prefix += renderElement(1, '    ');
      if (depth) prefix += isLastItem ? '└──' : '├──';

      const name = transformName(category.PRODUCT_TREE_ATTR_NAME)
      const counterChildren = category.children.length ? `(${category.children.length})` : '';
      const logText = `${prefix} ${name} ${counterChildren}`.trim();
      logs += `${logText}\n`;
      console.info(logText);
      logLevel(category.children, depth + 1, isLastItem);
    });
  };

  logLevel(tree);
  fsp.writeFile(path.join(__dirname, 'logs.txt'), logs).then(() => console.info('\nLogs saved'));
};

const parsedTree = await parseCategories();
logTree(parsedTree);
