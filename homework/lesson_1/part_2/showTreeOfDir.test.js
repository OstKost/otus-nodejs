import { buildTree, checkDirectory, getStructure } from "./showTreeOfDir.js";
import { root } from "../../utils/dirname.js";
import path from "path";


describe("Renders correct filesystem tree", () => {
  const rootFilePath = path.join(root, "homework", "lesson_1", "part_2", "__fixtures__", "app");

  // checkDirectory
  it("should return false when non exist", async () => {
    const filePath = "any-non-exist";
    const stats = await checkDirectory(filePath);
    expect(stats).toBeFalsy();
  });

  it("should return false if not directory", async () => {
    // const filePath = path.join(root, "homework", "lesson_1", "part_2", "index.js");
    const filePath = rootFilePath + "/dir1/file1.txt";
    const stats = await checkDirectory(filePath);
    expect(stats).not.toBeTruthy();
  });

  it("should return true if initial path exists and is directory", async () => {
    // const filePath = path.join(root, "homework", "lesson_1", "part_2");
    const stats = await checkDirectory(rootFilePath);
    expect(stats).toBeTruthy();
  });

  // getStructure
  it("should be null without maxDepth", async () => {
    // const filePath = path.join(root, "homework");
    const result = await getStructure(rootFilePath);
    expect(result).toBeNull();
  });

  it("should return dir structure with 1 depth", async () => {
    // const filePath = path.join(root, "homework");
    const structure = await getStructure(rootFilePath, 1);
    expect(structure).toMatchSnapshot();
  });

  it("should return dir structure with 2 depth", async () => {
    // const filePath = path.join(root, "homework");
    const structure = await getStructure(rootFilePath, 2);
    expect(structure).toMatchSnapshot();
  });

  it("should return dir structure with depth 3", async () => {
    // const filePath = path.join(root, "homework");
    const structure = await getStructure(rootFilePath, 3);
    expect(structure).toMatchSnapshot();
  });

  // buildTree
  it("should build text from structure - depth 0", async () => {
    // const filePath = path.join(root, "homework");
    const structure = await getStructure(rootFilePath, 0);
    const tree = await buildTree(structure, rootFilePath);
    expect(tree).toMatchSnapshot();
  });

  it("should build text from structure - depth 2", async () => {
    // const filePath = path.join(root, "homework");
    const structure = await getStructure(rootFilePath, 2);
    const tree = await buildTree(structure, rootFilePath);
    expect(tree).toMatchSnapshot();
  });

  it("should build text from structure - depth 3", async () => {
    // const filePath = path.join(root, "homework");
    const structure = await getStructure(rootFilePath, 3);
    const tree = await buildTree(structure, rootFilePath);
    expect(tree).toMatchSnapshot();
  });
});