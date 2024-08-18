import { testTree } from "./testing_trees";
import { Tree } from "../types";
import { treeTable } from "../table";
import { totalTable, tableLowerDate, tableUpperDate, tableDateRange, tableNoData } from "./assertions";

let testing_tree: Tree;
beforeAll(() => {
  testing_tree = testTree();
});

describe("testing_trees", () => {
  test("should assemble the testing tree instance", () => {
    expect(testing_tree.order).toEqual(12);
    expect(testing_tree.size).toEqual(11);

    for (const entry of testing_tree.nodeEntries()) {
      const { attributes } = entry;
      expect(attributes.data).toHaveLength(112);
    }
  });

  test("treeTable test with no date, so all values", () => {
    const table = treeTable(testing_tree);
    expect(table.length).toEqual(4);
    expect(table).toEqual(totalTable);
  });

  test("treeTable test with lower date", () => {
    const table = treeTable(testing_tree, new Date("2022-2-01"));
    expect(table.length).toEqual(4);
    expect(table).toEqual(tableLowerDate);
  });

  test("treeTable test with upper date", () => {
    const table = treeTable(testing_tree, undefined, new Date("2023-1-15"));
    expect(table.length).toEqual(4);
    expect(table).toEqual(tableUpperDate);
  });

  test("treeTable test date range", () => {
    const table = treeTable(testing_tree, new Date('2023-6-16'), new Date("2023-8-31"));
    expect(table.length).toEqual(4);
    expect(table).toEqual(tableDateRange);
  });

  test("treeTable test date range no data", () => {
    const table = treeTable(testing_tree, new Date('2023-6-16'), new Date("2023-6-17"));
    expect(table.length).toEqual(4);
    expect(table).toEqual(tableNoData);
  });

  test("treeTable test date error bad range", () => {
    expect(() => treeTable(testing_tree, new Date('2023-6-16'), new Date("2023-6-15"))).toThrow('Start date must be before end date');
  });
});
