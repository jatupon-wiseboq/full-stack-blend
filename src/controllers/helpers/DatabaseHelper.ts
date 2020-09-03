// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {VolatileMemoryClient, RelationalDatabaseClient, RelationalDatabaseORMClient, DocumentDatabaseClient, PrioritizedWorkerClient, CreateTransaction} from "./ConnectionHelper.js";
import {CodeHelper} from "./CodeHelper.js";
import {NotificationHelper} from "./NotificationHelper.js";
import {ValidationInfo} from "./ValidationHelper.js";
import {PermissionHelper} from "./PermissionHelper.js";
import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper.js";
import {FieldType, DataTableSchema} from "./SchemaHelper.js";
import {DataTypes} from "sequelize";

enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory
}
enum ActionType {
  Insert,
  Update,
  Upsert,
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
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
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
  premise: string;
  validation: ValidationInfo;
}

const DatabaseHelper = {
	getSourceType: (value: string): SourceType => {
		switch (value) {
			case "relational":
				return SourceType.Relational;
			case "document":
				return SourceType.PrioritizedWorker;
			case "worker":
				return SourceType.Document;
			case "volatile-memory":
				return SourceType.VolatileMemory;
		  default:
		    throw new Error(`There was an error preparing data for manipulation (invalid type of available data source, '${value}').`);
		}
	},
  distinct: (data: Input[]): Input[] => {
    const results = [];
    const hash = {};
    for (const item of data) {
      if (!hash[`${item.target}:${item.group}:${item.name}`.toLowerCase()]) {
        hash[`${item.target}:${item.group}:${item.name}`.toLowerCase()] = true;
        results.push(item);
      }
    }
    return results;
  },
  satisfy: (data: Input[], action: ActionType, schema: DataTableSchema): boolean => {
  	if (data.length == 0) return false;
  	
  	data = CodeHelper.clone(data);
    data = [...DatabaseHelper.distinct(data)];
    
    for (const input of data) {
    	if (input.premise && input.premise.indexOf(schema.group) == 0) {
  			const splited = input.premise.split(".");
  			splited.shift();
  			input.premise = splited.join(".") || null;
  		}
  	}
    
    let inputs = data.filter(item => item.target == schema.source && item.group == schema.group && item.premise == null);
    const requiredKeys = {};
    
    switch (action) {
      case ActionType.Insert:
      case ActionType.Upsert:
        for (const key in schema.columns) {
          if (schema.columns.hasOwnProperty(key)) {
            if (schema.columns[key].fieldType != FieldType.AutoNumber && schema.columns[key].required) {
              requiredKeys[key] = schema.columns[key];
            }
          }
        }
        for (const key in schema.keys) {
          if (schema.keys.hasOwnProperty(key)) {
            if (schema.keys[key].fieldType != FieldType.AutoNumber) {
              requiredKeys[key] = schema.keys[key];
            }
          }
        }
        break;
      case ActionType.Update:
      case ActionType.Delete:
        for (const key in schema.keys) {
          if (schema.keys.hasOwnProperty(key)) {
            if (schema.keys[key].fieldType != FieldType.AutoNumber) {
              requiredKeys[key] = schema.keys[key];
            }
          }
        }
        break;
      case ActionType.Retrieve:
        return (inputs.length != 0);
      default:
        return false;
    }
    
    inputs = inputs.filter(input => !!requiredKeys[input.name]);
    const existingKeys = {};
    for (const input of inputs) {
    	existingKeys[input.name] = true;
    }
    
    if (Object.keys(existingKeys).length != Object.keys(requiredKeys).length) {
      return false;
    } else {
      data = data.filter(item => item.group != schema.group || item.premise != null);
      
      if (data.length == 0) {
        return true;
      } else {
      	const schemata = [];
      	
        for (const key in schema.relations) {
          if (schema.relations.hasOwnProperty(key)) {
            const length = data.length;
            for (let i=0; i<length; i++) {
            	const input = data[i];
            	
              if (input.group == schema.relations[key].targetGroup) {
                data.push({
                  target: ProjectConfigurationHelper.getDataSchema().tables[schema.relations[key].targetGroup].source,
                  group: schema.relations[key].targetGroup,
                  name: schema.relations[key].targetEntity,
                  value: null,
                  guid: null,
  								premise: null,
                  validation: null
                });
                schemata.push(ProjectConfigurationHelper.getDataSchema().tables[schema.relations[key].targetGroup]);
              }
            }
          }
        }
        
        data = DatabaseHelper.distinct(data);
        
        for (const schema of schemata) {
         	if (DatabaseHelper.satisfy(data, action, schema)) {
          	return true;
          }
        }
        
        return false;
      }
    }
  },
  getRows: (data: Input[], action: ActionType, schema: DataTableSchema): HierarchicalDataRow[] => {
  	const results: HierarchicalDataRow[] = [];
	  let found: boolean = false;
	  
    for (const input of data) {
    	if (input.group != schema.group) continue;
    	if (input.premise) continue;
    	
    	found = true;
    	
    	const splited = (input.guid || "").split("[");
    	let index = 0;
    	
    	if (splited.length > 1) {
    		index = parseInt(splited[1].split("]")[0]);
    	}
    	if (!results[index]) {
    		results[index] = {
			    keys: {},
			    columns: {},
			    relations: {}
			  };
    	}
    	const row: HierarchicalDataRow = results[index];
    	
      if (!schema.keys[input.name] && !schema.columns[input.name])
        throw new Error(`There was an error preparing data for manipulation ('${input.name}' column doesn\'t exist in the schema group '${schema.group}').`);
      if (schema.keys[input.name]) {
        row.keys[input.name] = input.value;
      } else {
        row.columns[input.name] = input.value;
      }
    }
    
    if (!found) {
    	throw new Error(`There was an error preparing data for manipulation (${data.map(item => (item.premise ? item.premise + "." : "") + item.group + "." + item.name).join(", ")} couldn\'t be children of '${schema.group}').`);
    }
    
    for (const row of results) {
			for (const key in schema.keys) {
			  if (schema.keys.hasOwnProperty(key)) {
			    switch (action) {
			      case ActionType.Insert:
			        if (schema.keys[key].fieldType != FieldType.AutoNumber) {
			          if (row.keys[key] === undefined || row.keys[key] === null) {
			            throw new Error(`There was an error preparing data for manipulation (required the value of a key ${schema.group}.${key} for manipulate ${schema.group}).`);
			          } else {
			            switch (schema.keys[key].fieldType) {
			              case FieldType.Number:
			                if (isNaN(parseFloat(row.keys[key].toString())))
			                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
			                row.keys[key] = parseFloat(row.keys[key].toString());
			                break;
			              case FieldType.Boolean:
			                row.keys[key] = (row.keys[key].toString() === "true" || row.keys[key].toString() === "1");
			                break;
			              case FieldType.String:
			                row.keys[key] = row.keys[key].toString();
			                break;
			              case FieldType.DateTime:
			                row.keys[key] = new Date(row.keys[key].toString());
			                break;
			            }
			          }
			        }
			        break;
			      case ActionType.Upsert:
		          if (schema.keys[key].fieldType != FieldType.AutoNumber && (row.keys[key] === undefined || row.keys[key] === null)) {
		            throw new Error(`There was an error preparing data for manipulation (required the value of a key ${schema.group}.${key} for manipulate ${schema.group}).`);
		          } else {
		            switch (schema.keys[key].fieldType) {
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key] = parseFloat(row.keys[key].toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key] = (row.keys[key].toString() === "true" || row.keys[key].toString() === "1");
		                break;
		              case FieldType.String:
		                row.keys[key] = row.keys[key].toString();
		                break;
		              case FieldType.DateTime:
		                row.keys[key] = new Date(row.keys[key].toString());
		                break;
		            }
		          }
			        break;
			      case ActionType.Update:
			      case ActionType.Delete:
		          if (row.keys[key] === undefined || row.keys[key] === null) {
		            throw new Error(`There was an error preparing data for manipulation (required the value of a key ${schema.group}.${key} for manipulate ${schema.group}).`);
		          } else {
		            switch (schema.keys[key].fieldType) {
		              case FieldType.AutoNumber:
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key] = parseFloat(row.keys[key].toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key] = (row.keys[key].toString() === "true" || row.keys[key].toString() === "1");
		                break;
		              case FieldType.String:
		                row.keys[key] = row.keys[key].toString();
		                break;
		              case FieldType.DateTime:
		                row.keys[key] = new Date(row.keys[key].toString());
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
			          if (schema.columns[key].required && (row.columns[key] === undefined || row.columns[key] === null)) {
			            throw new Error(`There was an error preparing data for manipulation (required the value of a column ${schema.group}.${key} for manipulate ${schema.group}).`);
			          } else {
			          	if (row.columns[key]) {
				            switch (schema.columns[key].fieldType) {
				              case FieldType.Number:
				                if (isNaN(parseFloat(row.columns[key].toString())))
				                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
				                row.columns[key] = parseFloat(row.columns[key].toString());
				                break;
				              case FieldType.Boolean:
				                row.columns[key] = (row.columns[key].toString() === "true" || row.columns[key].toString() === "1");
				                break;
				              case FieldType.String:
				                row.columns[key] = row.columns[key].toString();
				                break;
				              case FieldType.DateTime:
				                row.columns[key] = new Date(row.columns[key].toString());
				                break;
				            }
				          }
			          }
			        }
			        break;
			      case ActionType.Upsert:
		          if (schema.columns[key].fieldType != FieldType.AutoNumber && schema.columns[key].required && (row.columns[key] === undefined || row.columns[key] === null)) {
		            throw new Error(`There was an error preparing data for manipulation (required the value of a column ${schema.group}.${key} for manipulate ${schema.group}).`);
		          } else {
		          	if (row.columns[key]) {
			            switch (schema.columns[key].fieldType) {
			              case FieldType.Number:
			                if (isNaN(parseFloat(row.columns[key].toString())))
			                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
			                row.columns[key] = parseFloat(row.columns[key].toString());
			                break;
			              case FieldType.Boolean:
			                row.columns[key] = (row.columns[key].toString() === "true" || row.columns[key].toString() === "1");
			                break;
			              case FieldType.String:
			                row.columns[key] = row.columns[key].toString();
			                break;
			              case FieldType.DateTime:
			                row.columns[key] = new Date(row.columns[key].toString());
			                break;
			            }
			          }
		          }
			        break;
			      case ActionType.Update:
			        if (schema.columns[key].required) {
			          if (row.columns[key] === undefined || row.columns[key] === null) {
			            /* void */
			          } else {
			          	if (row.columns[key]) {
				            switch (schema.columns[key].fieldType) {
				              case FieldType.AutoNumber:
				              case FieldType.Number:
				                if (isNaN(parseFloat(row.columns[key].toString())))
				                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
				                row.columns[key] = parseFloat(row.columns[key].toString());
				                break;
				              case FieldType.Boolean:
				                row.columns[key] = (row.columns[key].toString() === "true" || row.columns[key].toString() === "1");
				                break;
				              case FieldType.String:
				                row.columns[key] = row.columns[key].toString();
				                break;
				              case FieldType.DateTime:
				                row.columns[key] = new Date(row.columns[key].toString());
				                break;
				            }
				          }
			          }
			        }
			        break;
			      case ActionType.Delete:
			        break;
			    }
			  }
			}
		}
		
		return results;
  },
	prepareData: (data: Input[], action: ActionType, baseSchema: DataTableSchema, crossRelationUpsert: boolean=false): {[Identifier: string]: HierarchicalDataTable} => {
	  data = CodeHelper.clone(data);
	  
	  const results: {[Identifier: string]: HierarchicalDataTable} = {};
	  DatabaseHelper.recursivePrepareData(results, data, action, baseSchema, crossRelationUpsert);
	  
	  if (data.length != 0) throw new Error(`There was an error preparing data for manipulation (unrelated field(s) left after preparing data: ${[...new Set(data.map(item => (item.premise ? item.premise + "." : "") + item.group + "." + item.name))].join(", ")}).`);
	  
	  return results;
	},
	recursivePrepareData: (results: {[Identifier: string]: HierarchicalDataTable}, data: Input[], action: ActionType, baseSchema: DataTableSchema, crossRelationUpsert: boolean=false, current: HierarchicalDataTable=null) => {
		const tables = [];
		
		if (baseSchema == null) {
			for (const key in ProjectConfigurationHelper.getDataSchema().tables) {
	    	if (ProjectConfigurationHelper.getDataSchema().tables.hasOwnProperty(key)) {
		      if (DatabaseHelper.satisfy(data, action, ProjectConfigurationHelper.getDataSchema().tables[key])) {
		        baseSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
		        
		        const current = {
				      source: baseSchema.source,
				      group: baseSchema.group,
				      rows: DatabaseHelper.getRows(data, action, baseSchema)
				    };
				    tables.push(current);
				    
				    for (const input of data) {
					    if (input.premise && input.premise.indexOf(baseSchema.group) == 0) {
				  			const splited = input.premise.split(".");
				  			splited.shift();
				  			input.premise = splited.join(".") || null;
				  		}
				  	}
	    
				  	const items = data.filter(item => item.group == baseSchema.group && item.premise == null);
				    for (const item of items) {
				   		data.splice(data.indexOf(item), 1);
				    }
		      }
		    }
	    }
	  } else if (DatabaseHelper.satisfy(data, action, baseSchema)) {
	  	const current = {
	      source: baseSchema.source,
	      group: baseSchema.group,
	      rows: DatabaseHelper.getRows(data, action, baseSchema)
	    };
	    tables.push(current);
	    
	    for (const input of data) {
		    if (input.premise && input.premise.indexOf(baseSchema.group) == 0) {
	  			const splited = input.premise.split(".");
	  			splited.shift();
	  			input.premise = splited.join(".") || null;
	  		}
	  	}
	    
	  	const items = data.filter(item => item.group == baseSchema.group && item.premise == null);
	    for (const item of items) {
	   		data.splice(data.indexOf(item), 1);
	    }
	  }
	  
    for (const table of tables) {
			results[table.group] = table;
			baseSchema = ProjectConfigurationHelper.getDataSchema().tables[table.group];
			
			for (const key in baseSchema.relations) {
	    	if (baseSchema.relations.hasOwnProperty(key)) {
	      	const _data = [...data];
	      	const _appended = [];
	      	const _hash = {};
	      	const _currentGroup = baseSchema.relations[key].targetGroup;
	      	const _currentName = baseSchema.relations[key].targetEntity;
	      	const _schema = ProjectConfigurationHelper.getDataSchema().tables[_currentGroup];
	      	
	      	for (const input of data) {
	      		if (input.premise) continue;
            if (input.group == _currentGroup) {
            	const splited = input.guid.split("[");
            	let index = -1;
            	if (splited.length > 1) {
            		index = parseInt(splited[1].split("]")[0]);
            	}
            	
            	if (_hash[index]) continue;
            	_hash[index] = true;
            
            	const forwarding = {
                target: _schema.source,
                group: _currentGroup,
                name: _currentName,
                value: "123",
                guid: (index == -1) ? "" : "[" + index + "]",
								premise: null,
                validation: null
              };
            
              _data.push(forwarding);
              _appended.push(forwarding);
            }
          }
  	      
  	      if (DatabaseHelper.satisfy(_data, action, _schema)) {
  	      	for (const item of _appended) {
  	      		data.push(item);
  	      	}
  	      	
  	        DatabaseHelper.recursivePrepareData(table.rows[0].relations, data, (crossRelationUpsert) ? ActionType.Upsert : action, ProjectConfigurationHelper.getDataSchema().tables[key], crossRelationUpsert, table);
  	      }
  	    }
	    }
		}
	},
	ormMap: (schema: DataTableSchema): any => {
	  if (!RelationalDatabaseORMClient.models[schema.group]) {
	    const columns = {};
	    const options = {tableName: schema.group};
	    
			for (const key in schema.columns) {
			  if (schema.columns.hasOwnProperty(key)) {
			    let type;
			    let autoIncrement = false;
			    const unique = schema.columns[key].unique;
			    const primaryKey = true;
			    const allowNull = !schema.columns[key].required;
			    
			    switch (schema.columns[key].fieldType) {
			      case FieldType.AutoNumber:
              type = DataTypes.INTEGER;
              autoIncrement = true;
              break;
			      case FieldType.String:
              type = DataTypes.STRING;
              break;
            case FieldType.Number:
              type = DataTypes.INTEGER;
              break;
            case FieldType.Boolean:
              type = DataTypes.BOOLEAN;
              break;
            case FieldType.DateTime:
              type = DataTypes.DATE;
              break;
            default:
              throw new Error("There was an error preparing data for manipulation (unsupported field type).");
			    }
			    
			    columns[key] = {
			      type: type,
			      autoIncrement: autoIncrement,
			      unique: unique,
			      primaryKey: primaryKey,
			      allowNull: allowNull
			    };
			  }
			}
			for (const key in schema.keys) {
			  if (schema.keys.hasOwnProperty(key)) {
			    let type;
			    let autoIncrement = false;
			    const unique = schema.keys[key].unique;
			    const primaryKey = false;
			    const allowNull = !schema.keys[key].required;
			    
			    switch (schema.keys[key].fieldType) {
			      case FieldType.AutoNumber:
              type = DataTypes.INTEGER;
              autoIncrement = true;
              break;
			      case FieldType.String:
              type = DataTypes.STRING;
              break;
            case FieldType.Number:
              type = DataTypes.INTEGER;
              break;
            case FieldType.Boolean:
              type = DataTypes.BOOLEAN;
              break;
            case FieldType.DateTime:
              type = DataTypes.DATE;
              break;
            default:
              throw new Error("There was an error preparing data for manipulation (unsupported field type).");
			    }
			    
			    columns[key] = {
			      type: type,
			      autoIncrement: autoIncrement,
			      unique: unique,
			      primaryKey: primaryKey,
			      allowNull: allowNull
			    };
			  }
			}
	    
	    const User = RelationalDatabaseORMClient.define(schema.group, columns, options);
	  }
	  
	  return RelationalDatabaseORMClient.models[schema.group];
	},
	insert: async (data: Input[], baseSchema: DataTableSchema, crossRelationUpsert: boolean=false, session: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
  		const transaction = await CreateTransaction({});
  		
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Insert, baseSchema, crossRelationUpsert);
	  		const results = [];
  		  
  		  for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
	  		  	await DatabaseHelper.performRecursiveInsert(input, schema, results, transaction, crossRelationUpsert, session);
	  		  }
  		  }
	      
      	if (transaction) await transaction.commit();
		  	
	  		resolve(results);
      } catch(error) {
      	console.log(error);
      	
      	if (transaction) await transaction.rollback();
      	
        reject(error);
      }
    });
	},
	performRecursiveInsert: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, crossRelationUpsert: boolean=false, session: any=null) => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						const map = DatabaseHelper.ormMap(schema);
						
						for (const row of input.rows) {
							const hash = {};
							
							for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && row.columns[key] != undefined) {
							    if (schema.columns[key].fieldType !== FieldType.AutoNumber) {
							      hash[key] = row.columns[key];
							    }
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && row.keys[key] != undefined) {
							    if (schema.keys[key].fieldType !== FieldType.AutoNumber) {
							      hash[key] = row.keys[key];
							    }
							  }
							}
							
							if (!await PermissionHelper.allowActionOnTable(ActionType.Insert, schema, hash, session)) throw new Error(`You have no permission to insert any row in ${schema.group}.`);
							
							const record = await map.create(hash, {transaction: transaction});
							
						  const result = {
						    keys: {},
						    columns: {},
						    relations: {}
						  };
						  
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
							    result.columns[key] = record[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
							    result.keys[key] = record[key];
							  }
							}
							
							results.push(result);
							
							NotificationHelper.notifyUpdates(ActionType.Insert, schema, results);
							
							for (const key in row.relations) {
								if (row.relations.hasOwnProperty(key)) {
									const relation = schema.relations[key];
									const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
									
						  		for (const nextRow of row.relations[key].rows) {
						  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			}
						  			} else {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
						  					nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			}
						  			}
						  		}
						  		
						  		result.relations[nextSchema.group] = {
			  					  source: SourceType.Relational,
										group: nextSchema.group,
									  rows: []
								  };
								
									if (!crossRelationUpsert) await DatabaseHelper.performRecursiveInsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, false, session);
									else await DatabaseHelper.performRecursiveUpsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session);
								}
							}
						  
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, session)) delete result.columns[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, session)) delete result.keys[key];
							  }
							}
						}
		    		break;
		    	case SourceType.PrioritizedWorker:
		    		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.Document:
		    		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.VolatileMemory:
		    		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
	},
	upsert: async (data: Input[], baseSchema: DataTableSchema, session: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
  		const transaction = await CreateTransaction({});
  		
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Upsert, baseSchema, true);
	  		const results = [];
  		  
  		  for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
	  		  	await DatabaseHelper.performRecursiveUpsert(input, schema, results, transaction, session);
	  		  }
  		  }
	      
      	if (transaction) await transaction.commit();
		  	
	  		resolve(results);
      } catch(error) {
      	console.log(error);
      	
      	if (transaction) await transaction.rollback();
      	
        reject(error);
      }
    });
	},
	performRecursiveUpsert: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, session: any=null) => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						const map = DatabaseHelper.ormMap(schema);
						
						for (const row of input.rows) {
							const hash = {};
						
							for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && row.columns[key] != undefined) {
							    if (schema.columns[key].fieldType !== FieldType.AutoNumber) {
							      hash[key] = row.columns[key];
							    }
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && row.keys[key] != undefined) {
							    if (schema.keys[key].fieldType !== FieldType.AutoNumber) {
							      hash[key] = row.keys[key];
							    }
							  }
							}
							
							const record = (await map.upsert(hash, {transaction: transaction}))[0];
							
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
							    hash[key] = record[key];
							  }
							}
							
							if (!await PermissionHelper.allowActionOnTable(ActionType.Upsert, schema, hash, session)) throw new Error(`You have no permission to upsert any row in ${schema.group}.`);
							
						  const result = {
						    keys: {},
						    columns: {},
						    relations: {}
						  };
						  
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
							    result.columns[key] = record[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
							    result.keys[key] = record[key];
							  }
							}
							
							results.push(result);
							
							NotificationHelper.notifyUpdates(ActionType.Upsert, schema, results);
							
							for (const key in row.relations) {
								if (row.relations.hasOwnProperty(key)) {
									const relation = schema.relations[key];
									const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
									
						  		for (const nextRow of row.relations[key].rows) {
						  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			}
						  			} else {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
						  					nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			}
						  			}
						  		}
						  		
						  		result.relations[nextSchema.group] = {
			  					  source: SourceType.Relational,
										group: nextSchema.group,
									  rows: []
								  };
								
									await DatabaseHelper.performRecursiveUpsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session);
								}
							}
						
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, session)) delete result.columns[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, session)) delete result.keys[key];
							  }
							}
						}
		    		break;
		    	case SourceType.PrioritizedWorker:
		    		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.Document:
		    		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.VolatileMemory:
		    		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
	},
	update: async (data: Input[], baseSchema: DataTableSchema, crossRelationUpsert: boolean=false, session: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
  		const transaction = await CreateTransaction({});
  		
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Update, baseSchema, crossRelationUpsert);
	  		const results = [];
	  		
	  		for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
  		  		await DatabaseHelper.performRecursiveUpdate(input, schema, results, transaction, crossRelationUpsert, session);
  		  	}
  		  }
	      
      	if (transaction) await transaction.commit();
		  	
	  		resolve(results);
      } catch(error) {
      	console.log(error);
      	
      	if (transaction) await transaction.rollback();
      	
        reject(error);
      }
    });
	},
	performRecursiveUpdate: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, crossRelationUpsert: boolean=false, session: any=null) => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						const map = DatabaseHelper.ormMap(schema);
						
						for (const row of input.rows) {
							const hash = {};
							const data = {};
						
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && row.keys[key] != undefined) {
							    hash[key] = row.keys[key];
							  }
							}
							for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && row.columns[key] != undefined) {
							    data[key] = row.columns[key];
							  }
							}
							
							if (!await PermissionHelper.allowActionOnTable(ActionType.Update, schema, hash, session)) throw new Error(`You have no permission to update any row in ${schema.group}.`);
							
							await map.update(data, {where: hash, transaction: transaction});
							
							const record = await map.findOne({where: hash, transaction: transaction});
						  const result = {
						    keys: {},
						    columns: {},
						    relations: {}
						  };
						  
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key)) {
							    result.columns[key] = record[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key)) {
							    result.keys[key] = record[key];
							  }
							}
						
							results.push(result);
							
							NotificationHelper.notifyUpdates(ActionType.Update, schema, results);
							
							for (const key in row.relations) {
								if (row.relations.hasOwnProperty(key)) {
									const relation = schema.relations[key];
									const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
									
						  		for (const nextRow of row.relations[key].rows) {
						  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			}
						  			} else {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
						  					nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			}
						  			}
						  		}
						  		
						  		result.relations[nextSchema.group] = {
			  					  source: SourceType.Relational,
										group: nextSchema.group,
									  rows: []
								  };
									
									if (!crossRelationUpsert) await DatabaseHelper.performRecursiveUpdate(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, false, session);
									else await DatabaseHelper.performRecursiveUpsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session);
								}
							}
						
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, session)) delete result.columns[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, session)) delete result.keys[key];
							  }
							}
						}
						break;
		    	case SourceType.PrioritizedWorker:
		    		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.Document:
		    		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.VolatileMemory:
		    		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
  },
	retrieve: async (data: Input[], baseSchema: DataTableSchema, session: any=null, notifyUpdates: boolean=false): Promise<{[Identifier: string]: HierarchicalDataTable}> => {
		return new Promise(async (resolve, reject) => {
		  try {
		  	if (data != null) {
	  			const list = DatabaseHelper.prepareData(data, ActionType.Retrieve, baseSchema);
		  		const results = {};
		  		
		  		for (const key in list) {
	  		  	if (list.hasOwnProperty(key)) {
		  		  	const input = list[key];
		  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
		  		  	
		  		  	await DatabaseHelper.performRecursiveRetrieve(input, schema, results, session, notifyUpdates);
		  		  }
	  		  }
			  	
		  		resolve(results);
		  	} else {
		  		if (!await PermissionHelper.allowActionOnTable(ActionType.Retrieve, baseSchema, {}, session)) throw new Error(`You have no permission to retrieve any row in ${baseSchema.group}.`);
		  		
		  		const results = {};
		  		
		  		switch (baseSchema.source) {
	        	case SourceType.Relational:
	        		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
	        		
	        		const map = DatabaseHelper.ormMap(baseSchema);
	        		const hash = {};
	  					
	  					const rows = [];
	  					const records = await map.findAll() || [];
	  					
	  					for (const record of records) {
	  					  const row = {
	    				    keys: {},
	    				    columns: {},
	    				    relations: {}
	    				  };
	  				  
	  					  for (const key in baseSchema.columns) {
								  if (baseSchema.columns.hasOwnProperty(key) && record[key] != undefined) {
								    row.columns[key] = record[key];
								  }
								}
								for (const key in baseSchema.keys) {
								  if (baseSchema.keys.hasOwnProperty(key) && record[key] != undefined) {
								    row.keys[key] = record[key];
								  }
								}
	  				  
	  					  for (const key in baseSchema.columns) {
	    					  if (baseSchema.columns.hasOwnProperty(key) && row.columns[key] !== undefined) {
	    					    if (!await PermissionHelper.allowOutputOfColumn(baseSchema.columns[key], baseSchema, session)) delete row.columns[key];
	    					  }
	    					}
	    					for (const key in baseSchema.keys) {
	    					  if (baseSchema.keys.hasOwnProperty(key) && row.keys[key] !== undefined) {
	    					    if (!await PermissionHelper.allowOutputOfColumn(baseSchema.keys[key], baseSchema, session)) delete row.keys[key];
	    					  }
	    					}
	    					
	    					rows.push(row);
	  					}
	  					
	  					results[baseSchema.group] = {
	  					  source: baseSchema.source,
	  					  group: baseSchema.group,
	  					  rows: rows,
							  notification: (notifyUpdates) ? NotificationHelper.getTableUpdatingIdentity(baseSchema, {}, session) : null
	  					};
	        		
	        		break;
	        	case SourceType.PrioritizedWorker:
	        		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
	        		
	        		throw new Error("Not Implemented Error");
	        		
	        		break;
	        	case SourceType.Document:
	        		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
	        		
	        		throw new Error("Not Implemented Error");
	        		
	        		break;
	        	case SourceType.VolatileMemory:
	        		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
	        		
	        		throw new Error("Not Implemented Error");
	        		
	        		break;
	        }
	      
	      	resolve(results);
	      }
      } catch(error) {
      	console.log(error);
      	
        reject(error);
      }
		});
	},
	performRecursiveRetrieve: async (input: HierarchicalDataTable, baseSchema: DataTableSchema, results: {[Identifier: string]: HierarchicalDataTable}, session: any=null, notifyUpdates: boolean=false) => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						const map = DatabaseHelper.ormMap(baseSchema);
						
						for (const row of input.rows) {
		      		const hash = {};
							
							for (const key in baseSchema.columns) {
							  if (baseSchema.columns.hasOwnProperty(key) && row.columns[key] != undefined) {
							    hash[key] = row.columns[key];
							  }
							}
							for (const key in baseSchema.keys) {
							  if (baseSchema.keys.hasOwnProperty(key) && row.keys[key] != undefined) {
							    hash[key] = row.keys[key];
							  }
							}
							
							if (!await PermissionHelper.allowActionOnTable(ActionType.Retrieve, baseSchema, hash, session)) throw new Error(`You have no permission to retrieve any row in ${baseSchema.group}.`);
							
							const rows = [];
							const records = await map.findAll({where: hash}) || [];
							
							for (const record of records) {
							  const row = {
		  				    keys: {},
		  				    columns: {},
		  				    relations: {}
		  				  };
						  	
							  for (const key in baseSchema.columns) {
		  					  if (baseSchema.columns.hasOwnProperty(key) && record[key] !== undefined) {
		  					    row.columns[key] = record[key];
		  					  }
		  					}
		  					for (const key in baseSchema.keys) {
		  					  if (baseSchema.keys.hasOwnProperty(key) && record[key] !== undefined) {
		  					    row.keys[key] = record[key];
		  					  }
		  					}
		  					
		  					rows.push(row);
							}
						
							results[baseSchema.group] = {
							  source: baseSchema.source,
							  group: baseSchema.group,
							  rows: rows,
							  notification: (notifyUpdates) ? NotificationHelper.getTableUpdatingIdentity(baseSchema, hash, session) : null
							};
							
							for (const _row of rows) {
								for (const key in row.relations) {
									if (row.relations.hasOwnProperty(key)) {
										const relation = baseSchema.relations[key];
										const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
										
							  		for (const nextRow of row.relations[key].rows) {
							  			if (baseSchema.columns.hasOwnProperty(relation.sourceEntity)) {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				nextRow.columns[relation.targetEntity] = _row.columns[relation.sourceEntity];
								  			} else {
								  				nextRow.keys[relation.targetEntity] = _row.columns[relation.sourceEntity];
								  			}
							  			} else {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  					nextRow.columns[relation.targetEntity] = _row.keys[relation.sourceEntity];
								  			} else {
								  				nextRow.keys[relation.targetEntity] = _row.keys[relation.sourceEntity];
								  			}
							  			}
							  		}
									  
									  await DatabaseHelper.performRecursiveRetrieve(row.relations[key], nextSchema, _row.relations, session, notifyUpdates);
							  	}
							  }
							}
							
							for (const _row of rows) {
							  for (const key in baseSchema.columns) {
								  if (baseSchema.columns.hasOwnProperty(key) && _row.columns[key] !== undefined) {
								    if (!await PermissionHelper.allowOutputOfColumn(baseSchema.columns[key], baseSchema, session)) delete _row.columns[key];
								  }
								}
								for (const key in baseSchema.keys) {
								  if (baseSchema.keys.hasOwnProperty(key) && _row.keys[key] !== undefined) {
								    if (!await PermissionHelper.allowOutputOfColumn(baseSchema.keys[key], baseSchema, session)) delete _row.keys[key];
								  }
								}
							}
						}
						break;
		    	case SourceType.PrioritizedWorker:
		    		if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.Document:
		    		if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    	case SourceType.VolatileMemory:
		    		if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
		    		
		    		throw new Error("Not Implemented Error");
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
  },
	delete: async (data: Input[], baseSchema: DataTableSchema, session: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
  		const transaction = await CreateTransaction({});
  		
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Delete, baseSchema);
  		  const results = [];
  		  
  		  for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
  		  		await DatabaseHelper.performRecursiveDelete(input, schema, results, transaction, session);
  		  	}
  		  }
	      
      	if (transaction) await transaction.commit();
	      
	      resolve(results);
      } catch(error) {
      	console.log(error);
      	
      	if (transaction) await transaction.rollback();
      	
        reject(error);
      }
    });
	},
	performRecursiveDelete: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, session: any=null) => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    		if (!RelationalDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						const map = DatabaseHelper.ormMap(schema);
						
						for (const row of input.rows) {
							const hash = {};
						
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && row.keys[key] != undefined) {
							    hash[key] = row.keys[key];
							  }
							}
							
							if (!await PermissionHelper.allowActionOnTable(ActionType.Delete, schema, hash, session)) throw new Error(`You have no permission to delete any row in ${schema.group}.`);
							
							const record = await map.findOne({where: hash, transaction: transaction});
							await record.destroy({force: true, transaction: transaction});
						  
						  const result = {
						    keys: {},
						    columns: {},
						    relations: {}
						  };
						  
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
							    result.columns[key] = record[key];
							  }
							}
						  
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
							    result.keys[key] = record[key];
							  }
							}
						
							results.push(result);
							
							NotificationHelper.notifyUpdates(ActionType.Delete, schema, results);
							
							for (const key in row.relations) {
								if (row.relations.hasOwnProperty(key)) {
									const relation = schema.relations[key];
									const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
									
						  		for (const nextRow of row.relations[key].rows) {
						  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
							  			}
						  			} else {
						  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
						  					nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			} else {
							  				nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  			}
						  			}
						  		}
						  		
						  		result.relations[nextSchema.group] = {
			  					  source: SourceType.Relational,
										group: nextSchema.group,
									  rows: []
								  };
								
									await DatabaseHelper.performRecursiveDelete(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session);
								}
							}
						
						  for (const key in schema.columns) {
							  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, session)) delete result.columns[key];
							  }
							}
							for (const key in schema.keys) {
							  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
							    if (!await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, session)) delete result.keys[key];
							  }
							}
						}
						break;
					case SourceType.PrioritizedWorker:
						if (!VolatileMemoryClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						throw new Error("Not Implemented Error");
						
						break;
					case SourceType.Document:
						if (!DocumentDatabaseClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						throw new Error("Not Implemented Error");
						
						break;
					case SourceType.VolatileMemory:
						if (!PrioritizedWorkerClient) throw new Error("There was an error trying to obtain a connection (not found).");
						
						throw new Error("Not Implemented Error");
						
						break;
				}
		    
	  		resolve();
			} catch(error) {
				reject(error);
			}
		});
	}     
};

export {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, Input, DatabaseHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.