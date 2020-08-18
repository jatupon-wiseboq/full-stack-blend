// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {SourceType} from "./DatabaseHelper.js";
import {Permission} from "./PermissionHelper.js";
import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper.js";

enum FieldType {
  AutoNumber,
  String,
  Number,
  Boolean
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
}
interface DataColumnSchema {
	name: string;
	guid: string;
	fieldType: FieldType;
	required: boolean;
	unique: boolean;
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
	getFieldType: (value: string): FieldType => {
		switch (value) {
			case "auto":
				return FieldType.AutoNumber;
			case "number":
				return FieldType.Number;
			case "boolean":
				return FieldType.Boolean;
			default:
				return FieldType.String;
		}
	},
	verifyDataSchema: (data: DataSchema=ProjectConfigurationHelper.getDataSchema()) => {
	  for (const tableKey in data.tables) {
	    if (data.tables.hasOwnProperty(tableKey)) {
  	    const table = data.tables[tableKey];
  	    if (table.group === undefined || table.group === null || table.group.trim() === "")
  	      throw new Error(`There was an error verifying data schema (missing a group name: ${JSON.stringify(table)}).`);
  	    if (Object.keys(table.keys).length == 0)
  	      throw new Error(`There was an error verifying data schema (missing a primary key: ${JSON.stringify(table)}).`);
  	    
  	    if (table.modifyingPermission) SchemaHelper.verifyPermission(table.modifyingPermission);
  	    if (table.retrievingPermission) SchemaHelper.verifyPermission(table.retrievingPermission);
  	    
  	    for (const primaryKey in table.keys) {
	        if (table.keys.hasOwnProperty(primaryKey)) {
	          const column = table.keys[primaryKey];
	          if (column.name === undefined || column.name === null || column.name.trim() === "")
  	          throw new Error(`There was an error verifying data schema (missing a column name: ${JSON.stringify(column)}).`);
	        
		        if (column.modifyingPermission) SchemaHelper.verifyPermission(column.modifyingPermission);
	  	    	if (column.retrievingPermission) SchemaHelper.verifyPermission(column.retrievingPermission);
	        }
	      }
  	    for (const columnKey in table.columns) {
	        if (table.columns.hasOwnProperty(columnKey)) {
	          const column = table.columns[columnKey];
	          if (column.name === undefined || column.name === null || column.name.trim() === "")
  	          throw new Error(`There was an error verifying data schema (missing a column name: ${JSON.stringify(column)}).`);
	        
		        if (column.modifyingPermission) SchemaHelper.verifyPermission(column.modifyingPermission);
	  	    	if (column.retrievingPermission) SchemaHelper.verifyPermission(column.retrievingPermission);
	        }
	      }
  	    
        for (const relationTableKey in table.relations) {
          if (table.relations.hasOwnProperty(relationTableKey)) {
            const relation = table.relations[relationTableKey];
            
            if (relation.sourceGroup === undefined || relation.sourceGroup === null || relation.sourceGroup.trim() === "")
        	    throw new Error(`There was an error verifying data schema (missing a source group name: ${JSON.stringify(relation)}).`);
            if (relation.sourceEntity === undefined || relation.sourceEntity === null || relation.sourceEntity.trim() === "")
        	    throw new Error(`There was an error verifying data schema (missing a source entity name: ${JSON.stringify(relation)}).`);
            if (relation.targetGroup === undefined || relation.targetGroup === null || relation.targetGroup.trim() === "")
        	    throw new Error(`There was an error verifying data schema (missing a target group name: ${JSON.stringify(relation)}).`);
            if (relation.targetEntity === undefined || relation.targetEntity === null || relation.targetEntity.trim() === "")
        	    throw new Error(`There was an error verifying data schema (missing a target entity name: ${JSON.stringify(relation)}).`);
        	  
        	  if (!data.tables[relation.sourceGroup])
        	    throw new Error(`There was an error verifying data schema (source group unavailable: ${JSON.stringify(relation.sourceGroup)}; choices are ${Object.keys(data.tables).join(", ")}).`);
        	  if (!data.tables[relation.sourceGroup].keys[relation.sourceEntity] && !data.tables[relation.sourceGroup].columns[relation.sourceEntity])
        	    throw new Error(`There was an error verifying data schema (source entity unavailable: ${JSON.stringify(relation.sourceEntity)}; choices are ${[...Object.keys(data.tables[relation.sourceGroup].keys), ...Object.keys(data.tables[relation.sourceGroup].columns)].join(", ")}).`);
        	  if (!data.tables[relation.targetGroup])
        	    throw new Error(`There was an error verifying data schema (target group unavailable: ${JSON.stringify(relation.targetGroup)}; choices are ${Object.keys(data.tables).join(", ")}).`);
        	  if (!data.tables[relation.targetGroup].keys[relation.targetEntity] && !data.tables[relation.targetGroup].columns[relation.targetEntity])
        	    throw new Error(`There was an error verifying data schema (target entity unavailable: ${JSON.stringify(relation.targetEntity)}; choices are ${[...Object.keys(data.tables[relation.targetGroup].keys), ...Object.keys(data.tables[relation.targetGroup].columns)].join(", ")}).`);
          }
        }
  	  }
	  }
	},
	verifyPermission: (permission: Permission, data: DataSchema=ProjectConfigurationHelper.getDataSchema()) => {
		if (permission == null) return true;
		
		switch (permission.mode) {
			case "relation":
				if (permission.relationModeSourceGroup === undefined || permission.relationModeSourceGroup === null || permission.relationModeSourceGroup.trim() === "")
					throw new Error(`There was an error verifying permission settings (missing a source group name: ${JSON.stringify(data)}).`);
				if (permission.relationModeSourceEntity === undefined || permission.relationModeSourceEntity === null || permission.relationModeSourceEntity.trim() === "")
					throw new Error(`There was an error verifying permission settings (missing a source entity name: ${JSON.stringify(data)}).`);
				
				if (!data.tables[permission.relationModeSourceGroup])
    	    throw new Error(`There was an error verifying data schema (source group unavailable: ${JSON.stringify(permission.relationModeSourceGroup)}; choices are ${Object.keys(data.tables).join(", ")}).`);
    	  if (!data.tables[permission.relationModeSourceGroup].keys[permission.relationModeSourceEntity] && !data.tables[permission.relationModeSourceGroup].columns[permission.relationModeSourceEntity])
    	    throw new Error(`There was an error verifying data schema (source entity unavailable: ${JSON.stringify(permission.relationModeSourceEntity)}; choices are ${[...Object.keys(data.tables[permission.relationModeSourceGroup].keys), ...Object.keys(data.tables[permission.relationModeSourceGroup].columns)].join(", ")}).`);
				
				switch (permission.relationMatchingMode) {
					case "session":
						if (permission.relationMatchingSessionName === undefined || permission.relationMatchingSessionName === null || permission.relationMatchingSessionName.trim() === "")
							throw new Error(`There was an error verifying permission settings (missing a session name: ${JSON.stringify(data)}).`);
						break;
					default:
						if (permission.relationMatchingConstantValue === undefined || permission.relationMatchingConstantValue === null || permission.relationMatchingConstantValue.trim() === "")
							throw new Error(`There was an error verifying permission settings (missing a constant value: ${JSON.stringify(data)}).`);
						break;
				}
				break;
			case "session":
				if (permission.sessionMatchingSessionName === undefined || permission.sessionMatchingSessionName === null || permission.sessionMatchingSessionName.trim() === "")
					throw new Error(`There was an error verifying permission settings (missing a session name: ${JSON.stringify(data)}).`);
				if (permission.sessionMatchingConstantValue === undefined || permission.sessionMatchingConstantValue === null || permission.sessionMatchingConstantValue.trim() === "")
					throw new Error(`There was an error verifying permission settings (missing a constant value: ${JSON.stringify(data)}).`);
				break;
			default:
				break;
		}
		
		return true;
	},
	getSchemaFromKey: (key: string, current: DataTableSchema, data: DataSchema, searchForDataTableSchema: boolean=false): DataTableSchema | DataColumnSchema => {
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
			const column = (current.keys || {})[key] || (current.columns || {})[key];
			if (column) {
				return column;
			} else {
				return null;
			}
		}
  },
  findAllPossibleNotations: (tree: any, accumulatedNotation: string=null, notations: string[]=[]): string[] => {
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
	verifyNotations: (tree: any, data: DataSchema) => {
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
	getDataTableSchemaFromNotation: (notation: string, data: DataSchema): DataTableSchema => {
	  if (!notation) return null;
	  
    const splited = notation.split(".");
		let shifted: string = splited.shift();
		let current: DataTableSchema | DataColumnSchema = null;
		
		do {
		  current = SchemaHelper.getSchemaFromKey(shifted, current as DataTableSchema, data, current !== null && splited.length == 0);
		  shifted = splited.shift();
		} while (current && shifted);
		
		if (current == null) throw new Error("There was an error retreiving data schema (invalid of dot notation).");
		if ("fieldType" in current) throw new Error("There was an error retreiving data schema (dot notation gave a column instead of a table).");
		
		return current;
	},
	findShortestPathOfRelations: (from: DataTableSchema, to: DataTableSchema, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): DataTableSchema[] => {
		const results = [];
		
		SchemaHelper.recursiveFindShortestPathOfRelations(from, to, results);
		
		return results.reverse();
	},
	recursiveFindShortestPathOfRelations: (from: DataTableSchema, to: DataTableSchema, results: DataTableSchema[], walked: any={}, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): boolean => {
		if (walked[from.group]) return false;
		walked[from.group] = true;
		
		if (to == from) {
			results.push(to);
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
			for (const item of shortestResults) {
				results.push(item);
			}
			results.push(from);
			
			return true;
		} else {
			return false;
		}
	}
};

export {DataSchema, DataTableSchema, DataColumnSchema, DataRelationSchema, FieldType, SchemaHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.