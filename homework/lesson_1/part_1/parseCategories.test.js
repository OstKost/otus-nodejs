import { parseCategories } from "./parseCategories.js";
import testCategories from "./fixtures/testCategories.json" assert { type: "json" };

describe("Parse children function", () => {
  let tree;

  beforeAll(() => {
    tree = parseCategories(testCategories);
  });

  it("Should have 4 first level categories", () => {
    expect(tree).toHaveLength(4);
  });

  it("First category should have 3 children", () => {
    const children = tree[0].children;
    expect(children).toHaveLength(3);
  });

  it("First children of first category should have 1 children", () => {
    const children = tree[0].children[0].children;
    expect(children).toHaveLength(1);
  });

  it("Second category should have 2 children", () => {
    const children = tree[1].children;
    expect(children).toHaveLength(2);
  });

  it("Third category should have 1 children", () => {
    const children = tree[2].children;
    expect(children).toHaveLength(1);
  });

  it("Fourth category should have no children", () => {
    const children = tree[3].children;
    expect(children).toHaveLength(0);
  });
});