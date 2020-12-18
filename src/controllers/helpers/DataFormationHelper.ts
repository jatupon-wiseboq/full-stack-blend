// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable, HierarchicalDataRow} from "./DatabaseHelper.js";

const DataFormationHelper = {
	convertFromJSONToHierarchicalDataTable: (data: any, group: string): HierarchicalDataTable => {
		const table = {
			source: SourceType.Other,
			group: group,
		  rows: []
		};
		
		table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(data));
		
		return table;
	},
	recursiveExtractNodesIntoDataRow: (data: any): HierarchicalDataRow => {
		const row = {
			keys: {},
		  columns: {},
		  relations: {}
		};
		
		if (Array.isArray(data)) {
			const table = {
				source: SourceType.Other,
				group: 'Children',
			  rows: []
			};
			for (let item of data) {
				table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(item));
			}
			row.relations['Children'] = table;
		} else if (typeof data === 'object') {
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					if (Array.isArray(data[key])) {
						const table = {
							source: SourceType.Other,
							group: key,
						  rows: []
						};
						for (let item of data[key]) {
							table.rows.push(DataFormationHelper.recursiveExtractNodesIntoDataRow(item));
						}
						row.relations[key] = table;
					} else if (typeof data[key] === 'object') {
						const table = {
							source: SourceType.Other,
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
		
	},
	recursiveExtractNodesIntoDictionary: (row: HierarchicalDataRow): any => {
		if (row.columns.hasOwnProperty('_')) {
			return row.columns['_'];
		} else {
			const dictionary = {};
		
			for (let key in row.keys) {
				if (row.keys.hasOwnProperty(key)) {
					dictionary['$' + key] = row.keys[key];
				}
			}
			for (let key in row.columns) {
				if (row.columns.hasOwnProperty(key)) {
					dictionary[key] = row.columns[key];
				}
			}
			for (let key in row.relations) {
				if (row.relations.hasOwnProperty(key)) {
					if (key == 'Children') {
						const results = [];
						
						for (let _row in row.relations['Children'].rows) {
							results.push(DataFormationHelper.recursiveExtractNodesIntoDictionary(_row));
						}
						
						return results;
					} else {
						dictionary[key] = [];
						
						for (let _row in row.relations[key].rows) {
							dictionary[key].push(DataFormationHelper.recursiveExtractNodesIntoDictionary(row.relations[key]));
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
