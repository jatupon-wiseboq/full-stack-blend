// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {VolatileMemoryClient, RelationalDatabaseClient, RelationalDatabaseORMClient, DocumentDatabaseClient, PrioritizedWorkerClient} from "./ConnectionHelper.js";
import {ValidationInfo} from "./ValidationHelper.js";
import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper.js";
import {FieldType, DataTableSchema} from "./SchemaHelper.js";

enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory
}
enum ActionType {
  Insert,
  Update,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}
enum OperationType {
  Equal,
  LessThan,
  MoreThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  NotEqual,
  Include,
  Exclude
}
interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: HierarchicalDataColumn};
  columns: {[Identifier: string]: HierarchicalDataColumn};
  relations: {[Identifier: string]: HierarchicalDataTable};
}
interface HierarchicalDataColumn {
	name: string;
  value: any;
}
interface HierarchicalDataFilter {
  name: string;
  operation: OperationType;
  value: any;
}

interface Input {
  target: SourceType;
  group: string;
  name: string;
  value: any;
  guid: string;
  validation: ValidationInfo;
}

const DatabaseHelper = {
  distinct: (data: Input[]): Input[] => {
    let results = [];
    let hash = {};
    for (let item of data) {
      if (!hash[`${item.target}:${item.group}:${item.name}`.toLowerCase()]) {
        hash[`${item.target}:${item.group}:${item.name}`.toLowerCase()] = true;
        results.push(item);
      }
    }
    return results;
  },
  satisfy: (data: Input[], action: ActionType, schema: DataTableSchema): boolean => {
    data = [...data];
    let inputs = data.filter(item => item.target == schema.source && item.group == schema.group);
    let requiredKeys;
    
    switch (action) {
      case ActionType.Insert:
      case ActionType.Update:
        requiredKeys = [
          ...schema.keys.filter(column => column.fieldType != FieldType.AutoNumber),
          ...schema.columns.filter(column => column.fieldType != FieldType.AutoNumber && column.required)
        ];
        break;
      case ActionType.Delete:
        requiredKeys = schema.keys;
        break;
      default:
        return false;
    }
    
    inputs = inputs.filter(input => !!requiredKeys[input.name]);
    
    if (inputs.length != requiredKeys.length) return false;
    else {
      data = data.filter(item => item.group != schema.group);
      
      if (data.length == 0) {
        return true;
      } else {
        for (let key in schema.relations) {
          if (schema.relations.hasOwnProperty(key)) {
            for (let input of data) {
              if (input.group == schema.relations[key].sourceGroup && input.name == schema.relations[key].sourceEntity) {
                data.push({
                  target: ProjectConfigurationHelper.getDataSchema().tables[schema.relations[key].targetGroup].source,
                  group: schema.relations[key].targetGroup,
                  name: schema.relations[key].targetEntity,
                  value: null,
                  guid: null,
                  validation: null
                });
              }
            }
          }
        }
        
        data = DatabaseHelper.distinct(data);
        
        for (let key in schema.relations) {
          if (schema.relations.hasOwnProperty(key)) {
            if (DatabaseHelper.satisfy(data, action, ProjectConfigurationHelper.getDataSchema().tables[relation.targetGroup])) {
              return true;
            }
          }
        }
        
        return false;
      }
    }
  },
  getRows: (data: Input[], action: ActionType, baseSchema: HierarchicalDataTable): HierarchicalDataRow[] => {
    const row: HierarchicalDataRow = {
	    keys: {},
	    columns: {},
	    relations: {}
	  };
	  
    for (const input of data) {
      if (schema.source != input.source || schema.group != input.group)
        throw new Error(`There was an error preparing data for manipulation ('${input.group}' doesn\'t match the schema group '${schema.group}').`);
      if (!schema.keys[input.name] || !schema.columns[input.name])
        throw new Error(`There was an error preparing data for manipulation ('${input.name}' column doesn\'t exist in the schema group '${schema.group}').`);
      if (schema.keys[input.name]) {
        row.keys[input.name] = {
          name: input.name,
          value: input.value
        };
      } else {
        row.columns[input.name] = {
          name: input.name,
          value: input.value
        };
      }
    }
    
		for (const key in schema.keys) {
		  if (schema.keys.hasOwnProperty(key)) {
		    switch (action) {
		      case ActionType.Insert:
		        if (schema.keys[key].fieldType != FieldType.AutoNumber) {
		          if (!row.keys[key] || row.keys[key].value === undefined || row.keys[key].value === null) {
		            throw new Error(`There was an error preparing data for manipulation (required ${schema.group}.${key}).`);
		          } else {
		            switch (schema.keys[key].fieldType) {
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].value.toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key].value = parseFloat(row.keys[key].value.toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key].value = (row.keys[key].value.toString() === "true" || row.keys[key].value.toString() === "1");
		                break;
		              case FieldType.String:
		                row.keys[key].value = row.keys[key].value.toString();
		                break;
		            }
		          }
		        }
		        break;
		      case ActionType.Update:
		      case ActionType.Delete:
	          if (!row.keys[key] || row.keys[key].value === undefined || row.keys[key].value === null) {
	            throw new Error(`There was an error preparing data for manipulation (required ${schema.group}.${key}).`);
	          } else {
	            switch (schema.keys[key].fieldType) {
	              case FieldType.AutoNumber:
	              case FieldType.Number:
	                if (isNaN(parseFloat(row.keys[key].value.toString())))
	                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
	                row.keys[key].value = parseFloat(row.keys[key].value.toString());
	                break;
	              case FieldType.Boolean:
	                row.keys[key].value = (row.keys[key].value.toString() === "true" || row.keys[key].value.toString() === "1");
	                break;
	              case FieldType.String:
	                row.keys[key].value = row.keys[key].value.toString();
	                break;
	            }
	          }
		        break;
		    }
		  }
		}
		for (const key in schema.columns) {
		  if (schema.columns.hasOwnProperty(key)) {
		    switch (action) {
		      case ActionType.Insert:
		        if (schema.columns[key].fieldType != FieldType.AutoNumber) {
		          if (!row.columns[key] || row.columns[key].value === undefined || row.columns[key].value === null) {
		            throw new Error(`There was an error preparing data for manipulation (required ${schema.group}.${key}).`);
		          } else {
		            switch (schema.columns[key].fieldType) {
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].value.toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key].value = parseFloat(row.keys[key].value.toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key].value = (row.keys[key].value.toString() === "true" || row.keys[key].value.toString() === "1");
		                break;
		              case FieldType.String:
		                row.keys[key].value = row.keys[key].value.toString();
		                break;
		            }
		          }
		        }
		        break;
		      case ActionType.Update:
		        if (schema.columns[key].required) {
		          if (!row.columns[key] || row.columns[key].value === undefined || row.columns[key].value === null) {
		            throw new Error(`There was an error preparing data for manipulation (required ${schema.group}.${key}).`);
		          } else {
		            switch (schema.columns[key].fieldType) {
		              case FieldType.AutoNumber:
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].value.toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key].value = parseFloat(row.keys[key].value.toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key].value = (row.keys[key].value.toString() === "true" || row.keys[key].value.toString() === "1");
		                break;
		              case FieldType.String:
		                row.keys[key].value = row.keys[key].value.toString();
		                break;
		            }
		          }
		        }
		        break;
		      case ActionType.Delete:
		        break;
		    }
		  }
		}
		return [row];
  },
	prepareData: (data: Input[], action: ActionType, baseSchema: DataTableSchema): HierarchicalDataTable[] => {
		const distinctedData = DatabaseHelper.distinct(data);
	  
	  let results: HierarchicalDataTable[] = [];
	  let current: HierarchicalDataTable = null;
	  
	  while (data.length != 0) {
	    if (current == null) {
  	    if (baseSchema == null) {
    	    for (let key in ProjectConfigurationHelper.getDataSchema().tables) {
    	      if (DatabaseHelper.satisfy(distinctedData, action, ProjectConfigurationHelper.getDataSchema().tables[key]) {
    	        baseSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
    	        break;
    	      }
    	    }
    	  }
    	  
    	  if (baseSchema == null) {
    	    throw new Error('There was an error preparing data for manipulation (a list of inputs cann\'t satisfy the data schema).');
    	  }
    	  
  	    current = {
  	      source: baseSchema.source,
  	      group: baseSchema.group,
  	      rows: DatabaseHelper.getRows(data, action, baseSchema)
  	    }
  	    results.push([current, baseSchema]);
  	  } else {
  	    let found = false;
  	    for (let key in baseSchema.relations) {
  	      if (DatabaseHelper.satisfy(distinctedData, action, ProjectConfigurationHelper.getDataSchema().tables[key]) {
  	        found = true;
  	        baseSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
  	        break;
  	      }
  	    }
  	    
  	    if (!found) {
    	    throw new Error('There was an error preparing data for manipulation (a list of inputs cann\'t satisfy the data schema).');
    	  }
    	  
    	  let next = {
  	      source: baseSchema.source,
  	      group: baseSchema.group,
  	      rows: DatabaseHelper.getRows(data, action, baseSchema)
  	    }
    	  
    	  current.rows[0].relations[baseSchema.group] = next;
    	  current = next;
  	  }
	  }
	  
	  return results;
	},
	prepareFilter: (data: Input[], schema: DataTableSchema): {[Identifier: string]: HierarchicalDataFilter} => {
		return null;
	},
	insert: async (data: Input[], baseSchema: DataTableSchema): Promise<HierarchicalDataRow[]> => {
		return new Promise((resolve) => {
			const list = DatabaseHelper.prepareData(data, ActionType.Insert, baseSchema);
			if (list.length > 1) throw new Error("There was an error preparing data for manipulation (related tables isn't supported for now)");
		  
			const input = list[0][0];
			const schema = list[0][1];
			
      switch (input.source) {
      	case SourceType.Relational:
      		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
					
					let map = RelationalDatabaseORMClient.tableMap(schema.group);
					const hash = {};
					for (const key in schema.columns) {
					  if (schema.columns.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.columns[key].fieldType == FieldType.AutoNumber});
					    if (schema.columns[key].fieldType !== FieldType.AutoNumber) {
					      hash[key] = input.columns[key] && input.columns[key].value || null;
					    }
					  }
					}
					for (const key in schema.keys) {
					  if (schema.keys.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.keys[key].fieldType == FieldType.AutoNumber});
					    if (schema.columns[key].fieldType !== FieldType.AutoNumber) {
					      hash[key] = input.keys[key] && input.keys[key].value || null;
					    }
					  }
					}
					
					map.insert(hash).then((results) => {
					  if (results.affectedRows == 0) throw new Error("There was an error executing INSERT command.");
					  const row = {
					    keys: {},
					    columns: {},
					    relations: {}
					  };
					  for (const key in schema.columns) {
  					  if (schema.columns.hasOwnProperty(key)) {
  					    row.columns[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					for (const key in schema.keys) {
  					  if (schema.keys.hasOwnProperty(key)) {
  					    row.keys[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					resolve([row]);
					});
					
      		break;
      	case SourceType.PrioritizedWorker:
      		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.Document:
      		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.VolatileMemory:
      		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      }
    });
	},
	update: async (data: Input[], baseSchema: DataTableSchema): Promise<HierarchicalDataRow[]> => {
		return new Promise((resolve) => {
			const list = DatabaseHelper.prepareData(data, ActionType.Update, baseSchema);
			if (list.length > 1) throw new Error("There was an error preparing data for manipulation (related tables isn't supported for now)");
		  
			const input = list[0][0];
			const schema = list[0][1];
			
      switch (input.source) {
      	case SourceType.Relational:
      		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		let map = RelationalDatabaseORMClient.tableMap(schema.group);
					const hash = {};
					for (const key in schema.columns) {
					  if (schema.columns.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.columns[key].fieldType == FieldType.AutoNumber});
					    hash[key] = input.columns[key] && input.columns[key].value || null;
					  }
					}
					for (const key in schema.keys) {
					  if (schema.keys.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.keys[key].fieldType == FieldType.AutoNumber});
					    hash[key] = input.keys[key] && input.keys[key].value || null;
					  }
					}
					
					map.update(hash).then((results) => {
					  if (results.affectedRows == 0) throw new Error("There was an error executing UPDATE command.");
					  const row = {
					    keys: {},
					    columns: {},
					    relations: {}
					  };
					  for (const key in schema.columns) {
  					  if (schema.columns.hasOwnProperty(key)) {
  					    row.columns[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					for (const key in schema.keys) {
  					  if (schema.keys.hasOwnProperty(key)) {
  					    row.keys[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					resolve([row]);
					});
      		
      		break;
      	case SourceType.PrioritizedWorker:
      		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.Document:
      		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.VolatileMemory:
      		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      }
    });
	},
	retrieve: async (data: Input[], baseSchema: DataTableSchema): Promise<{[Identifier: string]: HierarchicalDataTable}> => {
		return new Promise((resolve) => {
			const input: {[Identifier: string]: HierarchicalDataFilter} = DatabaseHelper.prepareFilter(data, schema);
			
      switch (input.source) {
      	case SourceType.Relational:
      		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		let map = RelationalDatabaseORMClient.tableMap(schema.group);
					const hash = {};
					for (const key in schema.columns) {
					  if (schema.columns.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.columns[key].fieldType == FieldType.AutoNumber});
					  }
					}
					for (const key in schema.keys) {
					  if (schema.keys.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.keys[key].fieldType == FieldType.AutoNumber});
					  }
					}
					
					map.select().then((results) => {
					  if (results.affectedRows == 0) throw new Error("There was an error executing SELECT command.");
					  const row = {
					    keys: {},
					    columns: {},
					    relations: {}
					  };
					  for (const key in schema.columns) {
  					  if (schema.columns.hasOwnProperty(key)) {
  					    row.columns[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					for (const key in schema.keys) {
  					  if (schema.keys.hasOwnProperty(key)) {
  					    row.keys[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					resolve([row]);
					});
      		
      		break;
      	case SourceType.PrioritizedWorker:
      		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.Document:
      		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.VolatileMemory:
      		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      }
    });
	},
	delete: async (data: Input[], baseSchema: DataTableSchema): Promise<HierarchicalDataRow[]> => {
		return new Promise((resolve) => {
			const list = DatabaseHelper.prepareData(data, ActionType.Delete, baseSchema);
			if (list.length > 1) throw new Error("There was an error preparing data for manipulation (related tables isn't supported for now)");
		  
			const input = list[0][0];
			const schema = list[0][1];
			
      switch (input.source) {
      	case SourceType.Relational:
      		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		let map = RelationalDatabaseORMClient.tableMap(schema.group);
					const hash = {};
					for (const key in schema.keys) {
					  if (schema.keys.hasOwnProperty(key)) {
					    map = map.columnMap(key, key, {isAutoIncrement: schema.keys[key].fieldType == FieldType.AutoNumber});
					    hash[key] = input.keys[key] && input.keys[key].value || null;
					  }
					}
					
					map.delete(hash).then((results) => {
					  if (results.affectedRows == 0) throw new Error("There was an error executing DELETE command.");
					  const row = {
					    keys: {},
					    columns: {},
					    relations: {}
					  };
  					for (const key in schema.keys) {
  					  if (schema.keys.hasOwnProperty(key)) {
  					    row.keys[key] = {
  					      name: key,
  					      value: results[key]
  					    };
  					  }
  					}
  					resolve([row]);
					});
      		
      		break;
      	case SourceType.PrioritizedWorker:
      		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.Document:
      		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      	case SourceType.VolatileMemory:
      		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
      		
      		throw new Error("NotImplementedError");
      		
      		break;
      }
    });
	}
};

export {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, HierarchicalDataColumn, Input, DatabaseHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.