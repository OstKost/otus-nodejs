export const parseCategories = (categories) => {
  const findChildren = (category) => categories.filter(item => item.PRODUCT_TREE_ATTR_PARENT_ID === category.PRODUCT_TREE_ATTR_ID);

  categories.forEach(category => {
    category.children = findChildren(category);
  });

  const topLevel = categories.filter(item => !item.PRODUCT_TREE_ATTR_PARENT_ID);

  return topLevel;
};