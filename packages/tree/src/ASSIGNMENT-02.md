# ASSIGNMENT 02

The goal of this assignment is to manipulate a graph structure that models metrics and transform the graph data into a tabular representation suitable for analysis or reporting.

The unit test you implement should be able to produce a table with the following structure but feel free to modify as you see fit for the data:

|               | Total Orders | Cart Conversion | Total Carts |
| ------------- | ------------ | --------------- | ----------- |
| Overall       |              |                 |             |
| New York      |              |                 |             |
| Boston        |              |                 |             |
| Chicago       |              |                 |             |
| Los Angeles   |              |                 |             |
| San Francisco |              |                 |             |

If it looks like you'll be unable to complete the full exercise in the time you're able to allot, please focus on depth rather than breadth - that is, focus on one part of the exercise and do it really well.

Below are some tips:

- Understand the `MultiDirectedGraph` type from the `graphology` library, focusing on how this exercise's node and edge types (`TreeNode` and `TreeEdge`) would be represented in a `graphology` graph.

- Carefully review the type definitions provided (`types.ts`), focusing on how these types exist within a `graphology` graph and how the node and edge relationships within a graph contain additional information.

- Pay special attention to the `Segment` type, as it plays a crucial role in defining how nodes are categorized or grouped within the graph. You'll need to identify and extract values from nodes connected by an arithmetic edge to the segmented nodes. Choose how the date will be determined or accepted as input.


### Extract graph data into a tabular format

Implement the `treeTable` function in `table.ts` to transform a tree represented by an instance of the `Tree` type into your `YourTableTypeOrInterfaceOrFunctionEtc` type consistent with the constraints detailed in the TSDoc comment attached to `treeTable`.

- This part of the assignment will take place within the `packages/tree` directory of your project setup.

- Implement unit tests that validate your algorithm and types for a variety of different graph structures.

### Response

- Created [Table](/packages/tree/src/types.ts#L136) and [TableRow](/packages/tree/src/types.ts#L141) types to store this data
- Updated [testing_trees.test.ts](/packages/tree/src/__testdata__/testing_trees.test.ts) with a set of test cases 
- Test cases use assertion data from [assertion.ts](/packages/tree/src/__testdata__/assertions.ts)
- In the future, this will use an API with a database or data warehouse to store this data
- Additional data processing can be done with a library like [Arquero](https://www.npmjs.com/package/arquero)
  