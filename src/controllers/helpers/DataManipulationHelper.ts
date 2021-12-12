// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable, HierarchicalDataRow} from "./DatabaseHelper";
import {CodeHelper} from "./CodeHelper";
import {strict as assert} from 'assert';

let dataset: {[Identifier: string]: HierarchicalDataTable} = null;

const DataManipulationHelper = {
	setData: (data: {[Identifier: string]: HierarchicalDataTable}) => {
		CodeHelper.assertOfPresent(data, 'data');
		
		dataset = data;
	},
  getDataFromKey: (key: string, current: any, index: number=-1): any => {
		CodeHelper.assertOfPresent(key, 'key');
		CodeHelper.assertOfKeyName(key, 'key');
		CodeHelper.assertOfPresent(current, 'current');
		
		if (Array.isArray(current)) {
			current = current[0] || {};
		}
		
  	// Search HierarchicalDataRow
		// 		
		const table = (current.relations || {})[key];
		if (table) {
			if (index != -1) {
				if (table.rows[index] == undefined) return null;
				else return table.rows[index];
			} else {
				return table.rows;
			}
		} else {
			// Search HierarchicalDataColumn
			// 
			const column = (current.keys || {})[key] || (current.columns || {})[key];
			if (column != undefined) {
				return column;
			} else {
				return null;
			}
		}
  },
  getDataFromNotation: (notation: string, data: {[Identifier: string]: HierarchicalDataTable}=dataset, inArray: boolean=false): any => {
    CodeHelper.assertOfPresent(notation, 'notation');
    CodeHelper.assertOfNotationFormat(notation, 'notation');
    
    const splited = notation.split(".");
    let current = {
			keys: null,
			columns: null,
			relations: data
		};
		
		let shifted = splited.shift();
		while (current && shifted) {
		  const tokens = shifted.split("[");
		  if (tokens.length == 1) {
			  current = DataManipulationHelper.getDataFromKey(tokens[0], current);
			} else if (tokens.length == 2) {
			  current = DataManipulationHelper.getDataFromKey(tokens[0], current, parseInt(tokens[1].split("]")[0]));
			} else {
			  current = null;
			}
			shifted = splited.shift();
		}
		
		if (inArray) {
			if (Array.isArray(current)) {
				return current;
			} else if (current !== null && current !== undefined) {
				return [current];
			} else {
				return [];
			}
		} else {
			return current;
		}
  }
};

export {DataManipulationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
