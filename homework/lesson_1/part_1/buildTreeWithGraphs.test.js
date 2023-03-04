import { buildLevel, buildTreeWithGraphs } from "./buildTreeWithGraphs.js";
import { parseCategories } from "./parseCategories.js";
import testCategories from "./fixtures/testCategories.json" assert { type: "json" };

describe("Builds correct graphs for tree", () => {
  let graphs;

  beforeAll(() => {
    const tree = parseCategories(testCategories);
    graphs = buildTreeWithGraphs(tree);
  });

  it("Tree renders correctly", () => {
    expect(graphs).toMatchSnapshot();
  });

  it("Top level builds correctly", () => {
    const topLevelGraph = buildLevel(testCategories.slice(0, 2));
    expect(topLevelGraph).toMatchSnapshot();
  });
});