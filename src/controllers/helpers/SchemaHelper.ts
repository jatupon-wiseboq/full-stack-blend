// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {SourceType} from "./DatabaseHelper";
import {Permission} from "./PermissionHelper";
import {CodeHelper} from "./CodeHelper";
import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper";

enum FieldType {
  AutoNumber,
  String,
  Number,
  Boolean,
  DateTime
}

interface ForwardOptions {
	option: string;
  mode: string;
  recursive: boolean;
  forwardingTable: string;
  forwardingPrefix: string;
}
interface DataSchema {
  tables: {[Identifier: string]: DataTableSchema};
}
interface DataTableSchema {
	source: SourceType;
	group: string;
	guid: string;
  keys: {[Identifier: string]: DataColumnSchema};
  columns: {[Identifier: string]: DataColumnSchema};
  relations: {[Identifier: string]: DataRelationSchema};
  modifyingPermission: Permission;
  retrievingPermission: Permission;
  forward?: ForwardOptions;
}
interface DataColumnSchema {
	name: string;
	guid: string;
	fieldType: FieldType;
	required: boolean;
	unique: boolean;
	verb: string;
	url: string;
  modifyingPermission: Permission;
  retrievingPermission: Permission;
}
interface DataRelationSchema {
  name: string;
	guid: string;
  sourceGroup: string;
  sourceEntity: string;
  targetGroup: string;
  targetEntity: string;
}

const SchemaHelper = {
	verifyDataSchema: (data: DataSchema=ProjectConfigurationHelper.getDataSchema()) => {
	  for (const tableKey in data.tables) {
	    if (data.tables.hasOwnProperty(tableKey)) {
  	    const table = data.tables[tableKey];
  	    
  	    CodeHelper.assertOfPresent(table.group, 'table.group', 'There was an error verifying data schema: missing a group name.');
  	    CodeHelper.assertEquals(table.group, tableKey, 'table.group', 'There was an error verifying data schema: table name is mismatched.');
  	    if (Object.keys(table.keys).length == 0)
  	      throw new Error('There was an error verifying data schema: missing a primary key');
  	    
  	    if (table.modifyingPermission) SchemaHelper.verifyPermission(table.modifyingPermission);
  	    if (table.retrievingPermission) SchemaHelper.verifyPermission(table.retrievingPermission);
  	    
  	    for (const primaryKey in table.keys) {
	        if (table.keys.hasOwnProperty(primaryKey)) {
	          const column = table.keys[primaryKey];
	          
	          CodeHelper.assertOfPresent(column.name, 'column.name', 'There was an error verifying data schema: missing a key name.');
	          CodeHelper.assertOfPresent(column.fieldType, 'column.fieldType', 'There was an error verifying data schema: missing a kind of value.');
	          CodeHelper.assertEquals(column.name, primaryKey, 'column.name', 'There was an error verifying data schema: key name is mismatched.');
	        	
		        if (column.modifyingPermission) SchemaHelper.verifyPermission(column.modifyingPermission);
	  	    	if (column.retrievingPermission) SchemaHelper.verifyPermission(column.retrievingPermission);
	        }
	      }
  	    for (const columnKey in table.columns) {
	        if (table.columns.hasOwnProperty(columnKey)) {
	          const column = table.columns[columnKey];

	          CodeHelper.assertOfPresent(column.name, 'column.name', 'There was an error verifying data schema: missing a key name.');
	          CodeHelper.assertOfPresent(column.fieldType, 'column.fieldType', 'There was an error verifying data schema: missing a kind of value.');
	          CodeHelper.assertEquals(column.name, columnKey, 'column.name', 'There was an error verifying data schema: column name is mismatched.');
	        	
		        if (column.modifyingPermission) SchemaHelper.verifyPermission(column.modifyingPermission);
	  	    	if (column.retrievingPermission) SchemaHelper.verifyPermission(column.retrievingPermission);
	        }
	      }
  	    
        for (const relationTableKey in table.relations) {
          if (table.relations.hasOwnProperty(relationTableKey)) {
            const relation = table.relations[relationTableKey];
            
            CodeHelper.assertOfPresent(data.tables[relationTableKey], 'relations', 'There was an error verifying data schema: unavailable of relation.');
            
	          CodeHelper.assertOfPresent(relation.sourceGroup, 'relation.sourceGroup', 'There was an error verifying data schema: missing a source group name.');
	          CodeHelper.assertOfPresent(relation.sourceEntity, 'relation.sourceEntity', 'There was an error verifying data schema: missing a source entity name.');
	          CodeHelper.assertOfPresent(relation.targetGroup, 'relation.targetGroup', 'There was an error verifying data schema: missing a target group name.');
	          CodeHelper.assertOfPresent(relation.targetEntity, 'relation.targetEntity', 'There was an error verifying data schema: missing a target entity name.');
            
	          CodeHelper.assertOfPresent(data.tables[relation.sourceGroup], 'relation.sourceGroup', 'There was an error verifying data schema: source group unavailable; choices are ${Object.keys(data.tables).join(", ")}).');
	          CodeHelper.assertOfPresent(data.tables[relation.sourceGroup].keys[relation.sourceEntity] || data.tables[relation.sourceGroup].columns[relation.sourceEntity], 'relation.sourceEntity', `There was an error verifying data schema (source entity unavailable: ${JSON.stringify(relation.sourceEntity)}; choices are ${[...Object.keys(data.tables[relation.sourceGroup].keys), ...Object.keys(data.tables[relation.sourceGroup].columns)].join(", ")}).`);
	          CodeHelper.assertOfPresent(data.tables[relation.targetGroup], 'relation.targetGroup', `There was an error verifying data schema (target group unavailable: ${JSON.stringify(relation.targetGroup)}; choices are ${Object.keys(data.tables).join(", ")}).`);
	          CodeHelper.assertOfPresent(data.tables[relation.targetGroup].keys[relation.targetEntity] || data.tables[relation.targetGroup].columns[relation.targetEntity], 'relation.targetEntity', `There was an error verifying data schema (target entity unavailable: ${JSON.stringify(relation.targetEntity)}; choices are ${[...Object.keys(data.tables[relation.targetGroup].keys), ...Object.keys(data.tables[relation.targetGroup].columns)].join(", ")}).`);
          }
        }
  	  }
	  }
	},
	verifyPermission: (permission: Permission, data: DataSchema=ProjectConfigurationHelper.getDataSchema()) => {
		CodeHelper.assertOfNotUndefined(permission, 'permission');
		
		if (permission == null) return true;
		
		switch (permission.mode) {
			case "relation":
				CodeHelper.assertOfPresent(permission.relationModeSourceGroup, 'permission', 'There was an error verifying permission settings: missing a source group name.');
				CodeHelper.assertOfPresent(permission.relationModeSourceEntity, 'permission', 'There was an error verifying permission settings: missing a source entity name.');
				
				const table = data.tables[permission.relationModeSourceGroup];
				
				CodeHelper.assertOfPresent(table, 'permission.relationModeSourceGroup', 'There was an error verifying data schema: source group unavailable; choices are ${Object.keys(data.tables).join(", ")}).');
				CodeHelper.assertOfPresent(data.tables[permission.relationModeSourceGroup].keys[permission.relationModeSourceEntity] || data.tables[permission.relationModeSourceGroup].columns[permission.relationModeSourceEntity], 'permission.relationModeSourceGroup', 'There was an error verifying data schema (source entity unavailable: ${JSON.stringify(permission.relationModeSourceEntity)}; choices are ${[...Object.keys(data.tables[permission.relationModeSourceGroup].keys), ...Object.keys(data.tables[permission.relationModeSourceGroup].columns)].join(", ")}).');
				
				switch (permission.relationMatchingMode) {
					case "session":
						CodeHelper.assertOfKeyName(permission.relationMatchingSessionName, 'permission.relationMatchingSessionName', 'There was an error verifying permission settings: missing a session name.');
						break;
					default:
						CodeHelper.assertOfPresent(permission.relationMatchingConstantValue, 'permission.relationMatchingConstantValue', 'There was an error verifying permission settings: missing a constant value.');
						break;
				}
				break;
			case "session":
				CodeHelper.assertOfKeyName(permission.sessionMatchingSessionName, 'permission.sessionMatchingSessionName', 'There was an error verifying permission settings: missing a session name.');
				CodeHelper.assertOfPresent(permission.sessionMatchingConstantValue, 'permission.sessionMatchingConstantValue', 'There was an error verifying permission settings: missing a constant value.');
				break;
			default:
				break;
		}
		
		return true;
	},
	verifyNotations: (tree: any, data: DataSchema=ProjectConfigurationHelper.getDataSchema()) => {
		// TODO: re-enable in the future for notating on page.
		// 
		return true;
		
		CodeHelper.assertOfPresent(tree, 'tree');
		CodeHelper.recursiveEvaluate(tree, (obj: any) => {
			if (typeof obj !== 'object') CodeHelper.assertOfString(obj, 'children');
		});
		
	  const notations = SchemaHelper.findAllPossibleNotations(tree || {});
	  for (const notation of notations) {
	    const splited = notation.split(".");
  		let shifted: string = splited.shift();
  		let current: DataTableSchema | DataColumnSchema = null;
  		
  		do {
  		  current = SchemaHelper.getSchemaFromKey(shifted, current as DataTableSchema, data, splited.length == 0);
  		  shifted = splited.shift();
  		} while (current && shifted);
  		
  		if (current == null) throw new Error(`There was an error verifying dot notation (disconnected: ${notation}).`);
	  }
	},
	getFieldType: (value: string): FieldType => {
		CodeHelper.assertOfString(value, 'value');
		
		switch (value) {
			case "auto":
				return FieldType.AutoNumber;
			case "number":
				return FieldType.Number;
			case "boolean":
				return FieldType.Boolean;
			case "datetime":
				return FieldType.DateTime;
			case null:
				return FieldType.String;
			default:
				throw new Error('Wrong type of field.');
		}
	},
	getSchemaFromKey: (key: string, current: DataTableSchema, data: DataSchema=ProjectConfigurationHelper.getDataSchema(), searchForDataTableSchema: boolean=false): DataTableSchema | DataColumnSchema => {
		CodeHelper.assertOfPresent(key, 'key');
		if (key.split('.').length != 1) throw new Error('You have specified a notation, not a key.');
		
		if (!searchForDataTableSchema) {
			// Search DataTableSchema
			// 
			const relation = (current && current.relations || {})[key];
			const table = (data.tables || {})[key];
			
			if (relation) {
				return (data.tables || {})[relation.targetGroup] || null;
			} else if (table) {
				return table;
			} else {
				return null;
			}
		} else {
			// Search DataColumnSchema
			// 
			const column = (current && current.keys || {})[key] || (current && current.columns || {})[key];
			if (column) {
				return column;
			} else {
				return null;
			}
		}
  },
	getDataTableSchemaFromNotation: (notation: string, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): DataTableSchema => {
		CodeHelper.assertOfPresent(notation, 'notation');
		CodeHelper.assertOfNotationFormat(notation, 'notation');
	  
	  if (!notation) return null;
	  
    const splited = notation.split(".");
		let shifted: string = splited.shift();
		let current: DataTableSchema | DataColumnSchema = null;
		
		do {
		  current = SchemaHelper.getSchemaFromKey(shifted, current as DataTableSchema, data, current !== null && splited.length == 0);
		  shifted = splited.shift();
		} while (current && shifted);
		
		if (current == null) throw new Error(`There was an error retreiving data schema ${notation} (invalid of dot notation).`);
		if ("fieldType" in current) throw new Error("There was an error retreiving data schema (dot notation gave a column instead of a table).");
		
		return current;
	},
  findAllPossibleNotations: (tree: any, accumulatedNotation: string=null, notations: string[]=[]): string[] => {
    // TODO: re-enable in the future for notating on page.
		// 
		return [];
		
    for (const key in tree) {
      if (tree.hasOwnProperty(key)) {
        let currentNotation = null;
        if (accumulatedNotation == null) {
          currentNotation = key.split("[")[0];
        } else {
          currentNotation = accumulatedNotation + "." + key.split("[")[0];
        }
        if (Object.keys(tree[key]).length == 0) {
          notations.push(currentNotation);
        } else {
          SchemaHelper.findAllPossibleNotations(tree[key], currentNotation, notations);
        }
      }
    }
    
    return notations;
  },
	findShortestPathOfRelations: (from: DataTableSchema, to: DataTableSchema, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): DataTableSchema[] => {
		CodeHelper.assertOfPresent(from, 'from');
		CodeHelper.assertOfPresent(to, 'to');
		
		const results = [];
		
		SchemaHelper.recursiveFindShortestPathOfRelations(from, to, results);
		
		return results;
	},
	recursiveFindShortestPathOfRelations: (from: DataTableSchema, to: DataTableSchema, results: DataTableSchema[], walked: any={}, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): boolean => {
		CodeHelper.assertOfPresent(from, 'from');
		CodeHelper.assertOfPresent(to, 'to');
		CodeHelper.assertOfPresent(results, 'results');
		
		if (walked[from.group]) return false;
		walked[from.group] = true;
		
		if (from == to) {
			results.push(from);
			
			return true;
		}
		
		let minimum = Number.MAX_SAFE_INTEGER;
		let shortestResults = null;
		
		for (const key in from.relations) {
			if (from.relations.hasOwnProperty(key)) {
				const table = data.tables[key];
				const _walked = Object.assign({}, walked);
				const _results = [];
				
				const found = SchemaHelper.recursiveFindShortestPathOfRelations(table, to, _results, _walked, data);
				
				if (found && _results.length < minimum) {
					minimum = _results.length;
					shortestResults = _results;
				}
			}
		}
		
		if (shortestResults) {
			results.push(from);
			
			for (const item of shortestResults) {
				results.push(item);
			}
			
			return true;
		} else {
			return false;
		}
	}
};

export {DataSchema, DataTableSchema, DataColumnSchema, DataRelationSchema, FieldType, SchemaHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.