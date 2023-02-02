export const buildTreeWithGraphs = (tree) => {
  return buildLevel(tree);
};

const transformName = (_name) => _name.charAt(0).toUpperCase() + _name.slice(1).toLowerCase();
const renderElement = (count, element) => Array(count).fill(element).join("");

export const buildLevel = (items = [], depth = 0, isLast = false) => {
  let levelResult = '';
  items.forEach((category, index) => {
    const isLastItem = depth ? items.length - 1 === index : false;
    let prefix = depth ? "  " : " ";
    const vLinesLimit = isLast ? 2 : 1;
    const renderCount = (depth - vLinesLimit < 0) ? 0 : (depth - vLinesLimit);
    prefix += depth ? renderElement(renderCount, "│   ") : "";
    if (isLast) prefix += renderElement(1, "    ");
    if (depth) prefix += isLastItem ? "└──" : "├──";

    const name = transformName(category.PRODUCT_TREE_ATTR_NAME);
    const counterChildren = category.children.length ? `(${category.children.length})` : "";
    const title = `${prefix} ${name} ${counterChildren}`.trim();
    levelResult += `${title}\n`;
    levelResult += buildLevel(category.children, depth + 1, isLastItem);
  });
  return levelResult;
};