import { Tree, Table, TableRow, ValueFormat, Timeseries } from "./types";

/**
 * Transforms a given tree structure into a table format suitable for
 * rendering. It specifically targets nodes segmented by certain criteria
 * and displays their values at two distinct dates.
 *
 * The function accepts a `Tree` object, representing a graph of nodes
 * connected by various types of edges. The output is a table structure
 * (represented by `YourTableTypeOrInterfaceOrFunctionEtc`) designed for tabular
 * data display.
 *
 * The generated table focuses on nodes with at least one incoming
 * segmentation edge. For each of these nodes, the table includes columns
 * for:
 * - The values at two specific dates, for temporal comparison.
 * - The segment definition, providing data context.
 * - Values of nodes connected by an arithmetic edge, showing operational
 *   relationships.
 *
 * @param tree The `Tree` object with the data to transform into a table.
 * @param startDate The starting date for the data comparison.
 * @param endDate The ending date for the data comparison.
 * @returns A `Table` table structure detailing segmented
 *          nodes, their data at two dates, segmentation definitions, and
 *          arithmetic connections.
 */
export function treeTable(
  tree: Tree,
  startDate?: Date,
  endDate?: Date,
): Table {
  if (startDate && endDate && startDate > endDate) {
    throw new Error('Start date must be before end date');
  }

  const tableMap: Map<string, Map<string, number>> = new Map();
  for (const entry of tree.nodeEntries()) {
    const [ city, label, format ] = [ extractCity(entry.node), entry.attributes.label, entry.attributes.format ];
    const startIndex = startDate ? searchDate(entry.attributes.data, startDate, true) : 0;
    const endIndex = endDate ? searchDate(entry.attributes.data, endDate, false) : entry.attributes.data.length;

    for (let i = startIndex; i < endIndex; i++) {
      const data = entry.attributes.data[i];
      const values = tableMap.get(city) || new Map();
      values.set(label, (values.get(label) || 0) + data.value);
      tableMap.set(city, values);
    }

    const values = tableMap.get(city) || new Map();
    values.set(label, handleFormat(values.get(label) || 0, format, endIndex - startIndex));
    if (startIndex >= 0 && startIndex < entry.attributes.data.length) {
      values.set('Earliest Date', entry.attributes.data[startIndex].date);
    }
    if (endIndex > 0 && endIndex <= entry.attributes.data.length) {
      values.set('Latest Date', entry.attributes.data[endIndex - 1].date);
    }
    tableMap.set(city, values);
  }

  return buildTableFromTableMap(tableMap);
}

/**
 * Extracts the city name from a given string, which can be formatted as
 * "total_orders_calc__first_order_market__eq__Chicago",
 * "total_carts__first_order_market__eq__Boston",
 * "cart_conversion__first_order_market__eq__New_York"
 * Uses regex to extract the city name from the string.
 * 
 * @param s 
 * @returns city name
 */
function extractCity(s?: string): string {
  const match = s && s.match(/__eq__(.+)/);
  return match ? match[1].replace('_', ' ') : 'Overall';
}

/**
 * Searches for the index of a given date within a timeseries.
 * Uses binary search to find the index of the date within the timeseries.
 * 
 * @param timeseries Timeseries to search
 * @param date Date to search for
 * @param lowerBound Whether to search for the lower bound
 */
function searchDate(timeseries: Timeseries, date: Date, lowerBound: boolean) {
  // assumes timeseries is sorted
  let left = 0;
  let right = timeseries.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (lowerBound ? timeseries[mid].date < date : timeseries[mid].date <= date) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

/**
 * Builds a table from a table map with Table type made up with TableRow type.
 * 
 * @param tableMap
 * @returns table
 */
function buildTableFromTableMap(tableMap: Map<string, Map<string, number>>): Table {
  return Array.from(tableMap.entries()).map(([city, values]) => {
    const row: TableRow = { city };
    for (const [label, value] of values.entries()) {
      switch (label) {
        case 'Total Orders':
          row.totalOrders = value;
          break;
        case 'Cart Conversion':
          row.cartConversion = value;
          break;
        case 'Total Carts':
          row.totalCarts = value;
          break;
        case 'Earliest Date':
          row.earliest = new Date(value);
          break;
        case 'Latest Date':
          row.latest = new Date(value);
          break;
        default:
          break;
      }
    }
    return row;
  });
}

/**
 * Handles the formatting of a given value based on the specified format.
 * 
 * @param value 
 * @param format format with ValueFormat
 * @param count count of items, used for percent format
 * @returns value after formatting
 */
function handleFormat(value: number, format: ValueFormat, count: number): number {
  if (format === ValueFormat.Percent && count > 0) {
    return value / count;
  } else if (format === ValueFormat.Currency) {
    // Get two decimal places
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (format === ValueFormat.Integer) {
    return Math.round(value);
  }
  return value;
}
