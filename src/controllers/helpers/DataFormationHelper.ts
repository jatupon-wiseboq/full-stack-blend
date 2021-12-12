// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable, HierarchicalDataRow, SourceType} from "./DatabaseHelper";
import {CodeHelper} from "./CodeHelper";
import { strict as assert } from 'assert';

const DataFormationHelper = {
	convertFromJSONToHierarchicalDataTable: (data: any, group: string="Collection"): HierarchicalDataTable => {
		CodeHelper.assertOfPresent(data, 'data');
		CodeHelper.assertOfKeyName(group, 'group');
		CodeHelper.recursiveEvaluate(data, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'data');
    });
		
		const table = {
			source: SourceType.Collection,
			group: group,
		  rows: []
		};
		
		table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(data));
		
		return table;
	},
	recursiveExtractNodesIntoDataRow: (data: any): HierarchicalDataRow => {
		CodeHelper.assertOfNotUndefined(data, 'data');
		
		const row = {
			keys: {},
		  columns: {},
		  relations: {}
		};
		
		if (Array.isArray(data)) {
			const table = {
				source: SourceType.Collection,
				group: 'Children',
			  rows: []
			};
			for (let item of data) {
				table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(item));
			}
			row.relations['Children'] = table;
		} else if (typeof data === 'object' && data !== null) {
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					CodeHelper.assertOfKeyName(key.replace(/^\$/, ''), 'key');
					
					if (Array.isArray(data[key])) {
						const table = {
							source: SourceType.Collection,
							group: key,
						  rows: []
						};
						for (let item of data[key]) {
							table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(item));
						}
						row.relations[key] = table;
					} else if (typeof data[key] === 'object') {
						const table = {
							source: SourceType.Dictionary,
							group: key,
						  rows: []
						};
						table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(data[key]));
						row.relations[key] = table;
					} else {
						if (key.indexOf('$') == 0) {
							row.keys[key.substring(1)] = data[key];
						} else {
							row.columns[key] = data[key];
						}
					}
				}
			}
		} else {
			row.columns['_'] = data;
		}
		
		return row;
	},
	convertFromHierarchicalDataTableToJSON: (data: HierarchicalDataTable): any => {
		CodeHelper.assertOfPresent(data, 'data');
		
		return DataFormationHelper.recursiveExtractNodesIntoDictionary(data.rows[0]);
	},
	recursiveExtractNodesIntoDictionary: (row: HierarchicalDataRow): any => {
		CodeHelper.assertOfPresent(row, 'row');
		
		if (row.columns.hasOwnProperty('_')) {
			return row.columns['_'];
		} else {
			const dictionary = {};
		
			for (let key in row.keys) {
				CodeHelper.assertOfKeyName(key.replace(/^\$/, ''), 'key');
				
				if (row.keys.hasOwnProperty(key)) {
					dictionary['$' + key] = row.keys[key];
				}
			}
			for (let key in row.columns) {
				CodeHelper.assertOfKeyName(key.replace(/^\$/, ''), 'key');
				
				if (row.columns.hasOwnProperty(key)) {
					dictionary[key] = row.columns[key];
				}
			}
			for (let key in row.relations) {
				CodeHelper.assertOfKeyName(key, 'key');
				
				if (row.relations.hasOwnProperty(key)) {
					if (key == 'Children') {
						const results = [];
						
						for (let _row of row.relations['Children'].rows) {
							results.push(DataFormationHelper.recursiveExtractNodesIntoDictionary(_row));
						}
						
						return results;
					} else {
						if (row.relations[key].source == SourceType.Dictionary) {
							dictionary[key] = DataFormationHelper.recursiveExtractNodesIntoDictionary(row.relations[key].rows[0])
						} else {
							dictionary[key] = [];
							
							for (let _row of row.relations[key].rows) {
								dictionary[key].push(DataFormationHelper.recursiveExtractNodesIntoDictionary(_row));
							}
						}
					}
				}
			}
			
			return dictionary;
		}
	},
};

export {DataFormationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
