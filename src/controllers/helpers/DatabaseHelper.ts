// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {VolatileMemoryClient, RelationalDatabaseClient, RelationalDatabaseORMClient, DocumentDatabaseClient, PrioritizedWorkerClient, CreateTransaction} from './ConnectionHelper';
import {CodeHelper} from './CodeHelper';
import {NotificationHelper} from './NotificationHelper';
import {DataFormationHelper} from './DataFormationHelper';
import {RequestHelper} from './RequestHelper';
import {ValidationInfo} from './ValidationHelper';
import {PermissionHelper} from './PermissionHelper';
import {ActionHelper} from './ActionHelper';
import {WorkerHelper} from './WorkerHelper';
import {ProjectConfigurationHelper, SourceType} from './ProjectConfigurationHelper';
import {FieldType, DataTableSchema} from './SchemaHelper';
import {DataTypes, Op} from 'sequelize';
import {ObjectID} from 'mongodb';

const DEFAULT_DOCUMENT_DATABASE_NAME = process.env.MONGODB_DEFAULT_DATABASE_NAME;

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
  associate?: boolean;
  notify?: string[];
  forwarded?: boolean;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
  timestamp?: number;
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
  division?: number[];
  associate?: boolean;
  notify?: boolean;
}

interface BooleanObject {
	value: boolean;	
}

const fixType = (type: FieldType, value: any): any => {
	if (value === undefined) return value;
	if (value === null) return value;
	
	switch (type) {
		case FieldType.AutoNumber:
		case FieldType.Number:
			if (typeof value !== 'number') {
				return parseFloat(value.toString());
			}
			break;
		case FieldType.String:
			if (typeof value !== 'string') {
				return value.toString();
			}
			break;
		case FieldType.Boolean:
			if (typeof value !== 'boolean') {
				return value.toString() == 'true';
			}
			break;
		case FieldType.DateTime:
			if (!(value instanceof Date)) {
				return new Date(value.toString());
			}
			break;
	}
	
	return value;
};
const isObjectID = (value: string): boolean => {
	if (value && value.length != 24) return false;
	if (value && value.indexOf('.') != -1) return false;
	
	return ObjectID.isValid(value);
};

const DatabaseHelper = {
  distinct: (data: Input[]) => {
    const remove = [];
    const hash = {};
    
    for (const item of [...data].reverse()) {
    	const key = `${item.premise}:${item.target}:${item.group}:${item.name}:${item.division.join(',')}`.toLowerCase();
      if (!hash[key]) {
        hash[key] = true;
      } else {
      	remove.push(item);
      }
    }
    
    for (const item of remove) {
    	data.splice(data.indexOf(item), 1);
    }
  },
  satisfy: (data: Input[], action: ActionType, schema: DataTableSchema, premise: string=null, division: number[]=[], associate: boolean=false): boolean => {
  	if (data.length == 0) return false;
  	
  	data = CodeHelper.clone(data);
    DatabaseHelper.distinct(data);
    
    data = data.filter(input => input.division.length <= division.length + 1 && (input.division.join(',') + ',').indexOf(division.join(',') + ',') == 0);
    
    let inputs = data.filter(item => (item.target == null || item.target == schema.source) && item.group == schema.group && item.premise == premise);
    const requiredKeys = {};
    
    if (inputs.length == 0) return false;
    
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
        for (const key in schema.keys) {
          if (schema.keys.hasOwnProperty(key)) {
            if (schema.keys[key].fieldType != FieldType.AutoNumber) {
              requiredKeys[key] = schema.keys[key];
            }
          }
        }
        break;
      case ActionType.Delete:
      case ActionType.Retrieve:
        if (inputs.length == 0) return false;
        break;
      default:
        return false;
    }
    
    inputs = inputs.filter(input => !!requiredKeys[input.name]);
    const existingKeys = {};
    for (const input of inputs) {
    	existingKeys[input.name] = true;
    }
    
    if (action != ActionType.Retrieve && !associate && Object.keys(existingKeys).length != Object.keys(requiredKeys).length) {
      return false;
    } else {
    	data = data.filter(item => (item.group != schema.group || item.premise != premise));
    	if (data.length == 0) return true;
    	
      let next = data.filter(item => item.premise == premise);
      const keys = Array.from(new Set(next.map(input => input.group)));
      
      for (const key of keys) {
      	const current = next.filter(item => item.group == key);
      	if (!DatabaseHelper.satisfy(current, action,  ProjectConfigurationHelper.getDataSchema().tables[key], premise, division, associate || current[0] && current[0].associate === true)) {
        	return false;
        }
      }
      
    	const schemata = [];
    	const associates = {};
    	const nextPremise = (premise == null) ? schema.group : `${premise}.${schema.group}`;
      
      next = data.filter(item => item.premise == nextPremise);
      
    	if (next.length == 0) return true;
    	
      for (const key in schema.relations) {
        if (schema.relations.hasOwnProperty(key)) {
          const length = next.length;
          let found = false;
          
          for (let i=0; i<length; i++) {
          	const input = next[i];
          	
            if (input.group == schema.relations[key].targetGroup) {
              next.push({
                target: ProjectConfigurationHelper.getDataSchema().tables[schema.relations[key].targetGroup].source,
                group: schema.relations[key].targetGroup,
                name: schema.relations[key].targetEntity,
                value: null,
                guid: null,
                division: input.division,
                associate: input.associate,
                notify: input.notify,
								premise: nextPremise,
                validation: null
              });
              
              associates[schema.relations[key].targetGroup] = associates[schema.relations[key].targetGroup] || (input.associate === true);
              found = true;
            }
          }
          
          if (found) schemata.push(ProjectConfigurationHelper.getDataSchema().tables[schema.relations[key].targetGroup]);
        }
      }
      
      DatabaseHelper.distinct(next);
      
      for (const nextSchema of schemata) {
        if (!DatabaseHelper.satisfy(next, action, nextSchema, nextPremise, division, associate || associates[nextSchema.group]) &&
          !DatabaseHelper.satisfy(next, action, nextSchema, nextPremise, next[0] && next[0].division || [], associate || associates[nextSchema.group])) {
          return false;
        }
      }
      
      return true;
    }
  },
  getRows: (data: Input[], action: ActionType, schema: DataTableSchema, premise: string=null, division: number[], matches: Input[], associate: boolean=false): HierarchicalDataRow[] => {
  	const results: HierarchicalDataRow[] = [];
  	const map: any = {};
	  let found = false;
	  
    for (const input of data) {
    	if (input.group != schema.group) continue;
    	if (input.premise != premise) continue;
    	if (input.division.length > division.length + 1 || (input.division.join(',') + ',').indexOf(division.join(',') + ',') != 0) continue;
    	
    	found = true;
    	
    	const key = input.division.join(',');
    	let row: HierarchicalDataRow;
    	if (!map[key]) {
    		row = {
			    keys: {},
			    columns: {},
			    relations: {},
			    division: input.division
			  };
			  results.push(row);
			  map[key] = row;
    	} else {
    		row = map[key];
    	}
    	
      if (!schema.keys[input.name] && !schema.columns[input.name])
        throw new Error(`There was an error preparing data for manipulation ('${input.name}' column doesn\'t exist in the schema group '${schema.group}').`);
      if (schema.keys[input.name]) {
        row.keys[input.name] = input.value;
      } else {
        row.columns[input.name] = input.value;
      }
      
      matches.push(input);
    }
    
    if (!found) return results;
    
    for (const row of results) {
			for (const key in schema.keys) {
			  if (schema.keys.hasOwnProperty(key)) {
			    switch (action) {
			      case ActionType.Insert:
			      	if (schema.source == SourceType.Document && row.keys[key] === null) row.keys[key] = '';
			        if (schema.keys[key].fieldType != FieldType.AutoNumber) {
			          if (row.keys[key] === undefined || row.keys[key] === null) {
			          	if (associate) continue;
			            throw new Error(`There was an error preparing data for manipulation (required the value of a key ${schema.group}.${key} for manipulate ${schema.group}).`);
			          } else {
			            switch (schema.keys[key].fieldType) {
			              case FieldType.Number:
			                if (isNaN(parseFloat(row.keys[key].toString())))
			                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
			                row.keys[key] = parseFloat(row.keys[key].toString());
			                break;
			              case FieldType.Boolean:
			                row.keys[key] = (row.keys[key].toString() === 'true' || row.keys[key].toString() === '1');
			                break;
			              case FieldType.String:
			                if (isObjectID(`${row.keys[key]}`) && schema.source == SourceType.Document) {
			                  row.keys[key] = new ObjectID(row.keys[key].toString());
			                } else {
			                  row.keys[key] = row.keys[key].toString();
			                }
			                break;
			              case FieldType.DateTime:
			                row.keys[key] = new Date(row.keys[key].toString());
			                break;
			            }
			          }
			        }
			        break;
			      case ActionType.Upsert:
			      	if (schema.source == SourceType.Document && row.keys[key] === null) row.keys[key] = '';
		          if (schema.keys[key].fieldType != FieldType.AutoNumber && (row.keys[key] === undefined || row.keys[key] === null)) {
			          if (associate) continue;
		            throw new Error(`There was an error preparing data for manipulation (required the value of a key ${schema.group}.${key} for manipulate ${schema.group}).`);
		          } else {
		            switch (schema.keys[key].fieldType) {
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key] = parseFloat(row.keys[key].toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key] = (row.keys[key].toString() === 'true' || row.keys[key].toString() === '1');
		                break;
		              case FieldType.String:
		                if (isObjectID(`${row.keys[key]}`) && schema.source == SourceType.Document) {
		                  row.keys[key] = new ObjectID(row.keys[key].toString());
		                } else {
		                  row.keys[key] = row.keys[key].toString();
		                }
		                break;
		              case FieldType.DateTime:
		                row.keys[key] = new Date(row.keys[key].toString());
		                break;
		            }
		          }
			        break;
			      case ActionType.Update:
		          if (row.keys[key] === undefined || row.keys[key] === null) {
			          if (associate) continue;
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
		                row.keys[key] = (row.keys[key].toString() === 'true' || row.keys[key].toString() === '1');
		                break;
		              case FieldType.String:
		                if (isObjectID(`${row.keys[key]}`) && schema.source == SourceType.Document) {
		                  row.keys[key] = new ObjectID(row.keys[key].toString());
		                } else {
		                  row.keys[key] = row.keys[key].toString();
		                }
		                break;
		              case FieldType.DateTime:
		                row.keys[key] = new Date(row.keys[key].toString());
		                break;
		            }
		          }
			        break;
			      case ActionType.Delete:
			      case ActionType.Retrieve:
			     	 	if (row.keys[key]) {
				      	switch (schema.keys[key].fieldType) {
		              case FieldType.AutoNumber:
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.keys[key].toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.keys[key] = parseFloat(row.keys[key].toString());
		                break;
		              case FieldType.Boolean:
		                row.keys[key] = (row.keys[key].toString() === 'true' || row.keys[key].toString() === '1');
		                break;
		              case FieldType.String:
		                if (isObjectID(`${row.keys[key]}`) && schema.source == SourceType.Document) {
		                  row.keys[key] = new ObjectID(row.keys[key].toString());
		                } else {
		                  row.keys[key] = row.keys[key].toString();
		                }
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
			          	if (associate) continue;
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
				                row.columns[key] = (row.columns[key].toString() === 'true' || row.columns[key].toString() === '1');
				                break;
				              case FieldType.String:
  				              if (isObjectID(`${row.columns[key]}`) && schema.source == SourceType.Document) {
    		                  row.columns[key] = new ObjectID(row.columns[key].toString());
    		                } else {
    		                  row.columns[key] = row.columns[key].toString();
    		                }
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
		          	if (associate) continue;
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
			                row.columns[key] = (row.columns[key].toString() === 'true' || row.columns[key].toString() === '1');
			                break;
			              case FieldType.String:
			                if (isObjectID(`${row.columns[key]}`) && schema.source == SourceType.Document) {
  		                  row.columns[key] = new ObjectID(row.columns[key].toString());
  		                } else {
  		                  row.columns[key] = row.columns[key].toString();
  		                }
			                break;
			              case FieldType.DateTime:
			                row.columns[key] = new Date(row.columns[key].toString());
			                break;
			            }
			          }
		          }
			        break;
			      case ActionType.Update:
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
			                row.columns[key] = (row.columns[key].toString() === 'true' || row.columns[key].toString() === '1');
			                break;
			              case FieldType.String:
			                if (isObjectID(`${row.columns[key]}`) && schema.source == SourceType.Document) {
  		                  row.columns[key] = new ObjectID(row.columns[key].toString());
  		                } else {
  		                  row.columns[key] = row.columns[key].toString();
  		                }
			                break;
			              case FieldType.DateTime:
			                row.columns[key] = new Date(row.columns[key].toString());
			                break;
			            }
			          }
		          }
			        break;
			      case ActionType.Delete:
			      case ActionType.Retrieve:
				      if (row.columns[key]) {
				      	switch (schema.columns[key].fieldType) {
		              case FieldType.AutoNumber:
		              case FieldType.Number:
		                if (isNaN(parseFloat(row.columns[key].toString())))
		                  throw new Error(`There was an error preparing data for manipulation (the value of ${schema.group}.${key} isn\'t a number).`);
		                row.columns[key] = parseFloat(row.columns[key].toString());
		                break;
		              case FieldType.Boolean:
		                row.columns[key] = (row.columns[key].toString() === 'true' || row.columns[key].toString() === '1');
		                break;
		              case FieldType.String:
		                if (isObjectID(`${row.columns[key]}`) && schema.source == SourceType.Document) {
		                  row.columns[key] = new ObjectID(row.columns[key].toString());
		                } else {
		                  row.columns[key] = row.columns[key].toString();
		                }
		                break;
		              case FieldType.DateTime:
		                row.columns[key] = new Date(row.columns[key].toString());
		                break;
		            }
		          }
			      	break;
			    }
			  }
			}
		}
		
		return results;
  },
	prepareData: (data: Input[], action: ActionType, baseSchema: DataTableSchema, crossRelationUpsert=false): {[Identifier: string]: HierarchicalDataTable} => {
	  data = CodeHelper.clone(data);
	  
	  RequestHelper.sortInputs(data);
	  
	  const original = [...new Set(data.map(item => (item.premise ? item.premise + '.' : '') + item.group + '.' + item.name + '[' + item.division.join(',') + ']'))].join(', ');
	  
	  const results: {[Identifier: string]: HierarchicalDataTable} = {};
	  let length = 0;
	  let count = 0;
	  
	  while (length != data.length) {
	  	length = data.length;
	  	DatabaseHelper.recursivePrepareData(results, data, action, baseSchema, crossRelationUpsert, [count++]);
	  }
	  
	  if (data.length != 0) throw new Error(`There was an error preparing data for manipulation (unrelated field(s) left after preparing data: ${[...new Set(data.map(item => (item.premise ? item.premise + '.' : '') + item.group + '.' + item.name + '[' + item.division.join(',') + ']'))].join(', ')}\n\nfrom:\n${original})`);
	  
	  return results;
	},
	recursivePrepareData: (results: {[Identifier: string]: HierarchicalDataTable}, data: Input[], action: ActionType, baseSchema: DataTableSchema, crossRelationUpsert=false, division: number[], premise: string=null, associate: boolean=false) => {
		const tables = [];
		
    DatabaseHelper.distinct(data);
		
		if (baseSchema == null) {
			for (const key in ProjectConfigurationHelper.getDataSchema().tables) {
	    	if (ProjectConfigurationHelper.getDataSchema().tables.hasOwnProperty(key)) {
	    		const _associate = associate || data.some(input => input.group == key && input.associate === true);
	    		const _notify = data.filter(input => input.group == key && input.notify === true).map((input) => { return input.name; });
	    		
		      if (DatabaseHelper.satisfy(data, action, ProjectConfigurationHelper.getDataSchema().tables[key], premise, division, _associate)) {
		        baseSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
		        
		        const matches = [];
		        const current = {
				      source: baseSchema.source,
				      group: baseSchema.group,
				      rows: DatabaseHelper.getRows(data, action, baseSchema, premise, division, matches, _associate),
				      associate: _associate,
				      notify: (_notify.length != 0) ? _notify : undefined
				    };
				    tables.push(current);
	    			
				  	for (const item of matches) {
				   		data.splice(data.indexOf(item), 1);
				    }
		      }
		    }
	    }
	  } else {
	   	const _associate = associate || data.some(input => input.group == baseSchema.group && input.associate === true);
	   	const _notify = data.filter(input => input.group == baseSchema.group && input.notify === true).map((input) => { return input.name; });
	    
	  	if (DatabaseHelper.satisfy(data, action, baseSchema, premise, division, _associate)) {
			  const matches = [];
		  	const current = {
		      source: baseSchema.source,
		      group: baseSchema.group,
		      rows: DatabaseHelper.getRows(data, action, baseSchema, premise, division, matches, _associate),
				  associate: _associate,
				  notify: (_notify.length != 0) ? _notify : undefined
		    };
		    tables.push(current);
		    
		    for (const item of matches) {
		   		data.splice(data.indexOf(item), 1);
		    }
		  }
		}
	  
    for (const table of tables) {
    	if (results[table.group]) results[table.group].rows = results[table.group].rows.concat(table.rows);
			else results[table.group] = table;
			
			baseSchema = ProjectConfigurationHelper.getDataSchema().tables[table.group];
			
			const keys = Object.keys(baseSchema.relations);
			keys.sort((a, b) => {
				return (data.some(input => input.premise == premise && input.group == a)) ? -1 : 1;
			});
			
			const nextPremise = (premise == null) ? baseSchema.group : `${premise}.${baseSchema.group}`;
			
			for (const key of keys) {
      	const _data = [...data];
      	const _appended = [];
      	const _based = [];
      	const _hash = {};
      	const _currentGroup = baseSchema.relations[key].targetGroup;
      	const _currentName = baseSchema.relations[key].targetEntity;
      	const _schema = ProjectConfigurationHelper.getDataSchema().tables[_currentGroup];
      	
      	for (const input of data) {
      		if (input.premise != nextPremise) continue;
          if (input.group != _currentGroup) continue;
    			if (input.division.length > division.length + 1 || (input.division.join(',') + ',').indexOf(division.join(',') + ',') != 0) continue;
        	
        	if (_hash[input.division.join(',')]) continue;
        	_hash[input.division.join(',')] = true;
        
        	const forwarding = {
            target: _schema.source,
            group: _currentGroup,
            name: _currentName,
            value: '123',
            guid: (input.division.length == 0) ? '' : '[' + input.division.join(',') + ']',
            division: input.division,
            associate: input.associate,
            notify: input.notify,
						premise: nextPremise,
            validation: null
          };
        
          _data.push(forwarding);
          _appended.push(forwarding);
          _based.push(input);
        }
	      
       	const _associate = associate || _data.some(input => input.group == key && input.associate === true);
        
        for (const row of table.rows) {
          if (DatabaseHelper.satisfy(_data, action, ProjectConfigurationHelper.getDataSchema().tables[key], nextPremise, division, _associate)) {
            for (const i in _appended) {
            	if (data.indexOf(_based[i]) != -1) data.push(_appended[i]);
            }
            
            DatabaseHelper.recursivePrepareData(row.relations, data, (crossRelationUpsert) ? ActionType.Upsert : action, ProjectConfigurationHelper.getDataSchema().tables[key], crossRelationUpsert, division, nextPremise, _associate);
          }
          
          if (DatabaseHelper.satisfy(_data, action, ProjectConfigurationHelper.getDataSchema().tables[key], nextPremise, row.division, _associate)) {
            for (const i in _appended) {
            	if (data.indexOf(_based[i]) != -1) data.push(_appended[i]);
            }
            
            DatabaseHelper.recursivePrepareData(row.relations, data, (crossRelationUpsert) ? ActionType.Upsert : action, ProjectConfigurationHelper.getDataSchema().tables[key], crossRelationUpsert, row.division, nextPremise, _associate);
          }
          
          const _tables = Object.keys(row.relations).map((key: string) => { return row.relations[key]; });
			    _tables.sort((a: HierarchicalDataTable, b: HierarchicalDataTable) => {
			   		if (a.associate !== b.associate) return (a.associate === true) ? 1 : -1;
			   		else return 0;
			    });
			    
			    row.relations = {};
			    for (const table of _tables) {
			    	row.relations[table.group] = table;
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
			    const primaryKey = false;
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
              throw new Error('There was an error preparing data for manipulation (unsupported field type).');
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
			    const primaryKey = true;
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
              throw new Error('There was an error preparing data for manipulation (unsupported field type).');
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
	formatKeysAndColumns: (row: HierarchicalDataRow, schema: DataTableSchema, skipAutoNumber=false): [{[Identifier: string]: any}, {[Identifier: string]: any}, {[Identifier: string]: any}, {[Identifier: string]: any}] => {
		const queryKeys: {[Identifier: string]: any} = {};
		const queryColumns: {[Identifier: string]: any} = {};
		const dataKeys: {[Identifier: string]: any} = {};
		const dataColumns: {[Identifier: string]: any} = {};
		
		for (const key in schema.columns) {
		  if (schema.columns.hasOwnProperty(key) && row.columns[key] != undefined) {
		    if (skipAutoNumber == true && schema.columns[key].fieldType == FieldType.AutoNumber) continue;
		    if (skipAutoNumber == true && schema.source == SourceType.Document && key == 'id') continue;
		    if (schema.source == SourceType.Document) {
		      queryColumns[(key == 'id') ? '_id' : key] = {$eq: isObjectID(`${row.columns[key]}`) && new ObjectID(row.columns[key]) || row.columns[key]};
		    	dataColumns[(key == 'id') ? '_id' : key] = isObjectID(`${row.columns[key]}`) && new ObjectID(row.columns[key]) || row.columns[key];
		    } else {
		    	const value = (typeof row.columns[key] === 'object' && row.columns[key] != null && row.columns[key].constructor.name === 'ObjectID') ? row.columns[key].toString() : row.columns[key];
		    	queryColumns[key] = value;
		    	dataColumns[key] = value;
		    }
		  }
		}
		for (const key in schema.keys) {
		  if (schema.keys.hasOwnProperty(key) && row.keys[key] != undefined) {
		    if (skipAutoNumber == true && schema.keys[key].fieldType == FieldType.AutoNumber) continue;
		    if (skipAutoNumber == true && schema.source == SourceType.Document && key == 'id') continue;
		    if (schema.source == SourceType.Document) {
		      queryKeys[(key == 'id') ? '_id' : key] = {$eq: isObjectID(`${row.keys[key]}`) && new ObjectID(row.keys[key]) || row.keys[key]};
		    	dataKeys[(key == 'id') ? '_id' : key] = isObjectID(`${row.keys[key]}`) && new ObjectID(row.keys[key]) || row.keys[key];
		    } else {
		    	const value = (typeof row.keys[key] === 'object' && row.keys[key] != null && row.keys[key].constructor.name === 'ObjectID') ? row.keys[key].toString() : row.keys[key];
		    	queryKeys[key] = row.keys[key];
		    	dataKeys[key] = row.keys[key];
		    }
		  }
		}
							
		return [queryKeys, queryColumns, dataKeys, dataColumns];
	},
	forwardRecordSet: async (schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any) => {
		await DatabaseHelper.recurrentForwardRecordSet(schema, results, undefined, undefined, transaction);
		await DatabaseHelper.recursiveForwardRecordSet(schema, results, undefined, undefined, transaction);
	},
	recursiveForwardRecordSet: async (forwardingSchema: DataTableSchema, forwardingResults: HierarchicalDataRow[]=[], nextForwardedSchema: DataTableSchema=null, nextForwardedResults: HierarchicalDataRow[]=[], transaction: any=null, isRoot: boolean=true, walked: string[]=[]) => {
		if (!forwardingSchema.forward) return;
		if (forwardingSchema.source != SourceType.Document) return;
		if (forwardingResults.length == 0) return;
		if (!forwardingSchema.forward.forwardingTable) throw new Error(`Developer must define a set of forwarding tables for '${forwardingSchema.group}'.`);
		if (isRoot) forwardingResults = CodeHelper.clone(forwardingResults);
		
		const tables = (nextForwardedSchema != null) ? [nextForwardedSchema.group] : forwardingSchema.forward.forwardingTable.split(',');
		for (const key of tables) {
			const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
			
			if (!nextSchema) throw new Error(`Developer specified a non-existing of forwarding tables for '${forwardingSchema.group}'.`);
			if (!forwardingSchema.relations[nextSchema.group]) throw new Error(`Developer specified a non-related of forwarding tables for '${forwardingSchema.group}'.`);
			
			const nextTable: HierarchicalDataTable = {
				source: nextSchema.source,
				group: nextSchema.group,
			  rows: []
			};
			const relation = forwardingSchema.relations[nextSchema.group];
			
			if (walked.indexOf(key) != -1) throw new Error(`Developer specified an infinite loop of forwarding tables ('${walked.join(', '), forwardingSchema.group}'.)`);
			walked.push(key);
			
			if (forwardingSchema.forward.option == 'single') {
				forwardingResults.splice(0, 1);
			}
			
			for (const [index, result] of forwardingResults.entries()) {
				const nextQuery = {keys: {}, columns: {}, relations: {}};
				if (isRoot) result.relations = {};
				
  			if (forwardingSchema.columns.hasOwnProperty(relation.sourceEntity)) {
  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
	  				nextQuery.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
	  			} else {
	  				nextQuery.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
	  			}
  			} else {
  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
  				  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && forwardingSchema.source == SourceType.Document) {
  						nextQuery.columns[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
  					} else {
  						nextQuery.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
  					}
	  			} else {
	  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && forwardingSchema.source == SourceType.Document) {
  						nextQuery.keys[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
  					} else {
  						nextQuery.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
  					}
	  			}
  			}
  			
  			const nextDataset = {};
  			
  			if (nextForwardedResults.length != 0) {
  				nextTable.rows = nextForwardedResults;
  				nextDataset[nextSchema.group] = nextTable;
  			} else {
  				nextDataset[nextSchema.group] = nextTable;
  				
					await DatabaseHelper.performRecursiveRetrieve({
						source: nextSchema.source,
						group: nextSchema.group,
					  rows: [nextQuery]
					}, nextSchema, nextDataset, undefined, undefined, undefined, transaction);
  			}
				
				const embeddingQuery = {keys: {}, columns: {}, relations: {}};
				
				if (forwardingSchema.columns.hasOwnProperty(relation.sourceEntity)) {
  				embeddingQuery.columns[relation.sourceEntity] = result.columns[relation.sourceEntity];
  			} else {
  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`)) {
						embeddingQuery.keys[relation.sourceEntity] = new ObjectID(result.keys[relation.sourceEntity]);
					} else {
						embeddingQuery.keys[relation.sourceEntity] = result.keys[relation.sourceEntity];
					}
  			}
  			
  			const embeddingDataset = {};
				embeddingDataset[forwardingSchema.group] = {
					source: forwardingSchema.source,
					group: forwardingSchema.group,
				  rows: []
				};
				
				const records = await new Promise<any[]>(async (resolve, reject) => {
					let queryKeys: {[Identifier: string]: any} = {};
					let queryColumns: {[Identifier: string]: any} = {};
					let dataKeys: {[Identifier: string]: any} = {};
					let dataColumns: {[Identifier: string]: any} = {};
					
					[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(embeddingQuery, forwardingSchema, true);
					
					await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(forwardingSchema.group).find(Object.assign({}, queryColumns, queryKeys), {session: transaction.documentDatabaseSession}).toArray((error: any, results: any) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					});
				});
				
				for (const record of records) {
				  const row = {
				    keys: {},
				    columns: {},
				    relations: {}
				  };
			  
			  	if (record['_id']) record['id'] = record['_id'].toString();
			  	
				  for (const key in forwardingSchema.columns) {
					  if (forwardingSchema.columns.hasOwnProperty(key) && record[key] !== undefined) {
					    row.columns[key] = fixType(forwardingSchema.columns[key].fieldType, record[key]);
					  }
					}
					for (const key in forwardingSchema.keys) {
					  if (forwardingSchema.keys.hasOwnProperty(key) && record[key] !== undefined) {
					    row.keys[key] = fixType(forwardingSchema.keys[key].fieldType, record[key]);
					  }
					}
					
					if (record['relations']) row.relations = record['relations'];
					
					embeddingDataset[forwardingSchema.group].rows.push(row);
				}
				
				const embeddingResults: HierarchicalDataRow[] = embeddingDataset[forwardingSchema.group].rows;
				
				if (forwardingSchema.forward.option == 'single') {
					embeddingResults.splice(0, 1);
				}
				
				for (const [i, nextResult] of nextTable.rows.entries()) {
					const properties = {};
					
					if (forwardingSchema.forward.mode == 'prefix') {
						if (forwardingSchema.forward.option == 'single') {
							const forwardingPrefix = forwardingSchema.forward.forwardingPrefix || '';
							
							for (const key in result.columns) {
								if (result.columns.hasProperty(key)) {
									properties[`${forwardingPrefix}${key.charAt(0).toUpperCase() + key.slice(1)}`] = result.columns[key];
								}
							}
						} else {
							const forwardingPrefix = forwardingSchema.forward.forwardingPrefix || '';
							
							for (const key in result.columns) {
								if (result.columns.hasProperty(key)) {
									properties[`${forwardingPrefix}${key.charAt(0).toUpperCase() + key.slice(1)}${i + 1}`] = result.columns[key];
								}
							}
						}
					} else {
						const nextRelations = {};
						nextRelations[forwardingSchema.group] = {
							forwarded: true,
							source: forwardingSchema.source,
							group: forwardingSchema.group,
						  rows: embeddingResults
						};
						properties['relations'] = Object.assign({}, nextResult.relations, nextRelations);
					}
					
					if (Object.keys(nextResult.keys).length != 0) {
						let queryKeys: {[Identifier: string]: any} = {};
						let queryColumns: {[Identifier: string]: any} = {};
						let dataKeys: {[Identifier: string]: any} = {};
						let dataColumns: {[Identifier: string]: any} = {};
						
						[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(nextResult, nextSchema, true);
						
						await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(nextSchema.group).updateOne(queryKeys, {$set: properties}, {session: transaction.documentDatabaseSession});
						nextResult.columns = Object.assign(nextResult.columns, properties);
					}
				}
				
				if (forwardingSchema.forward.recursive && nextForwardedSchema == null) {
					await DatabaseHelper.recursiveForwardRecordSet(nextSchema, embeddingResults, undefined, undefined, transaction, false, CodeHelper.clone(walked));
				}
			}
		}
	},
	recurrentForwardRecordSet: async (forwardedSchema: DataTableSchema, forwardedResults: HierarchicalDataRow[], previousForwardedSchema: DataTableSchema=null, previousForwardedResults: HierarchicalDataRow[]=[], transaction: any=null, walked: string[]=[]) => {
		if (forwardedResults.length == 0) return;
		
		for (const key in forwardedSchema.relations) {
			if (forwardedSchema.relations.hasOwnProperty(key)) {
				const forwardingSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
				
				if (!forwardingSchema.forward) continue;
				if (forwardingSchema.source != SourceType.Document) continue;
				if (!forwardingSchema.forward.forwardingTable) throw new Error(`Developer must define a set of forwarding tables for '${forwardingSchema.group}'.`);
				
				const relation = forwardedSchema.relations[key];
				
				const tables = forwardingSchema.forward.forwardingTable.split(',');
				if (tables.indexOf(forwardedSchema.group) == -1) continue;
				if (walked.indexOf(key) != -1) continue;
				
				walked.push(key);
				
				const dataset = {};
				dataset[forwardingSchema.group] = {
					source: forwardingSchema.source,
					group: forwardingSchema.group,
				  rows: []
				};
				
				for (const result of forwardedResults) {
					const forwardingQuery = {keys: {}, columns: {}, relations: {}};
					
	  			if (forwardedSchema.columns.hasOwnProperty(relation.sourceEntity)) {
	  				if (forwardingSchema.columns.hasOwnProperty(relation.targetEntity)) {
		  				forwardingQuery.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
		  			} else {
		  				forwardingQuery.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
		  			}
	  			} else {
	  				if (forwardingSchema.columns.hasOwnProperty(relation.targetEntity)) {
	  				  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && forwardedSchema.source == SourceType.Document) {
	  						forwardingQuery.columns[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
	  					} else {
	  						forwardingQuery.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
	  					}
		  			} else {
		  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && forwardedSchema.source == SourceType.Document) {
	  						forwardingQuery.keys[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
	  					} else {
	  						forwardingQuery.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
	  					}
		  			}
	  			}
	  			
					await DatabaseHelper.performRecursiveRetrieve({
						source: forwardingSchema.source,
						group: forwardingSchema.group,
					  rows: [forwardingQuery]
					}, forwardingSchema, dataset, undefined, undefined, undefined, transaction);
	  		}
				
				await DatabaseHelper.recurrentForwardRecordSet(forwardingSchema, dataset[forwardingSchema.group].rows, forwardedSchema, forwardedResults, transaction, CodeHelper.clone(walked));
				await DatabaseHelper.recursiveForwardRecordSet(forwardingSchema, dataset[forwardingSchema.group].rows, forwardedSchema, forwardedResults, transaction);
			}
		}
	},
	insert: async (data: Input[], baseSchema: DataTableSchema, crossRelationUpsert=false, session: any=null, leavePermission: boolean=false, innerCircleTags: string[]=[], transaction: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Insert, baseSchema, crossRelationUpsert);
	  		const results = [];
	  		
  			if (!transaction) transaction = await CreateTransaction({share: !PermissionHelper.hasPermissionDefining(ActionType.Insert, list)});
  		  
  		  for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
	  		  	await DatabaseHelper.performRecursiveInsert(input, schema, results, transaction, crossRelationUpsert, session, leavePermission, innerCircleTags);
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
	performRecursiveInsert: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, crossRelationUpsert=false, session: any=null, leavePermission: boolean=false, innerCircleTags: string[]=[]): Promise<void> => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    	case SourceType.Document:
		    	case SourceType.VolatileMemory:
		    		if (input.source == SourceType.Relational && !RelationalDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.Document && !DocumentDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.VolatileMemory && !VolatileMemoryClient) throw new Error('There was an error trying to obtain a connection (not found).');
						
						const map = (input.source == SourceType.Relational) ? DatabaseHelper.ormMap(schema) : null;
						
						let bulkResults = [];
						const recent = new Date();
						if (input.source == SourceType.Relational && input.rows.length > 1) {
							const records = [];
							for (const row of input.rows) {
								let queryKeys: {[Identifier: string]: any} = {};
								let queryColumns: {[Identifier: string]: any} = {};
								let dataKeys: {[Identifier: string]: any} = {};
								let dataColumns: {[Identifier: string]: any} = {};
								
								[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema, true);
								dataColumns['updatedAt'] = recent;
								
								records.push(Object.assign({}, dataColumns, dataKeys));
							}
							await map.bulkCreate(records, {transaction: transaction.relationalDatabaseTransaction});
							bulkResults = await map.findAll({where: {updatedAt: recent}, transaction: transaction.relationalDatabaseTransaction});
							
							if (input.rows.length != bulkResults.length) throw new Error('Cannot matching all of results to inputs while performing bulk insertion.');
						}
						
						for (const row of input.rows) {
							let queryKeys: {[Identifier: string]: any} = {};
							let queryColumns: {[Identifier: string]: any} = {};
							let dataKeys: {[Identifier: string]: any} = {};
							let dataColumns: {[Identifier: string]: any} = {};
							
							[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema, true);
							
							if (!leavePermission && !await PermissionHelper.allowActionOnTable(ActionType.Insert, schema, Object.assign({}, dataColumns, dataKeys), session, transaction)) throw new Error(`You have no permission to insert any row in ${schema.group}.`);
							
							let records = [];
							
							if (input.source == SourceType.Relational) {
								if (input.rows.length > 1) {
									records[0] = bulkResults[input.rows.indexOf(row)];
								} else {
									records[0] = await map.create(Object.assign({}, dataColumns, dataKeys), {transaction: transaction.relationalDatabaseTransaction});
								}
							} else if (input.source == SourceType.Document) {
								records[0] = (await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).insertOne(Object.assign({}, dataColumns, dataKeys), {session: transaction.documentDatabaseSession}))['ops'][0];
							} else if (input.source == SourceType.VolatileMemory) {
								const _key = schema.group + ':' + JSON.stringify(CodeHelper.sortHashtable(dataKeys));
								await VolatileMemoryClient.set(_key, JSON.stringify(Object.assign({}, dataColumns, dataKeys)));
								records[0] = Object.assign({}, dataColumns, dataKeys);
							}
							
							for (const record of records) {
							  const result: any = {
							    keys: {},
							    columns: {},
							    relations: {}
							  };
							  
							  if (record['_id']) record['id'] = record['_id'].toString();
							  
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
								    result.columns[key] = fixType(schema.columns[key].fieldType, record[key]);
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
								    result.keys[key] = fixType(schema.keys[key].fieldType, record[key]);
								  }
								}
								
								result.timestamp = (new Date()).getTime();
								results.push(result);
								
								for (const key in row.relations) {
									if (row.relations.hasOwnProperty(key)) {
										const relation = schema.relations[key];
										const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
										const _nextKeys = {};
										
							  		for (const nextRow of row.relations[key].rows) {
							  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
								  			} else {
								  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
								  			}
							  			} else {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.columns[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  					}
								  			} else {
								  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.keys[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  					}
								  			}
							  			}
							  		}
							  		
							  		if (row.relations[key].notify !== undefined) {
							  		  for (const _key of row.relations[key].notify) {
							  		    if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				_nextKeys[_key] = row.relations[key].rows[0].columns[_key];
								  			} else {
								  				_nextKeys[_key] = row.relations[key].rows[0].keys[_key];
								  			}
							  		  }
							  		}
							  		
							  		result.relations[nextSchema.group] = {
				  					  source: SourceType.Relational,
											group: nextSchema.group,
										  rows: [],
							  			notification: (row.relations[key].notify !== undefined) ? NotificationHelper.getTableUpdatingIdentity(nextSchema, _nextKeys, session, innerCircleTags) : undefined
									  };
									  
									  row.relations[key].rows = await ActionHelper.perform(ActionType.Insert, schema, nextSchema, row.relations[key].rows, transaction, crossRelationUpsert, session, leavePermission, innerCircleTags);
									
										if (row.relations[key].associate) await DatabaseHelper.performRecursiveRetrieve(row.relations[key], nextSchema, result.relations, session, row.relations[key].notify !== undefined, leavePermission, transaction, innerCircleTags);
										else if (!crossRelationUpsert) await DatabaseHelper.performRecursiveInsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, false, session, leavePermission, innerCircleTags);
										else await DatabaseHelper.performRecursiveUpsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session, leavePermission, innerCircleTags);
									}
								}
								
								await DatabaseHelper.forwardRecordSet(schema, [result], transaction);
							  
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.columns[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.keys[key];
								  }
								}
							}
						}
						
						NotificationHelper.notifyUpdates(ActionType.Insert, schema, results);
		    		break;
		    	case SourceType.PrioritizedWorker:
		    		WorkerHelper.enqueue(input);
		    		break;
		    	case SourceType.RESTful:
		    		const _column = Object.keys(schema.columns).map(key => schema.columns[key]).filter(column => column.verb == 'PUT');
		    		if (_column.length == 0) throw new Error(`Cannot perform PUT on RESTful group "${schema.group}".`);
		    		
		    		const _input = DataFormationHelper.convertFromHierarchicalDataTableToJSON(input);
		    		const _output = RequestHelper.put(_column[0].url, _input, 'json');
		    		
		    		const table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(_output);
		    		results.push(table.rows[0]);
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
	},
	upsert: async (data: Input[], baseSchema: DataTableSchema, session: any=null, leavePermission: boolean=false, innerCircleTags: string[]=[], transaction: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Upsert, baseSchema, true);
	  		const results = [];
	  		
  			if (!transaction) transaction = await CreateTransaction({share: !PermissionHelper.hasPermissionDefining(ActionType.Upsert, list)});
  		  
  		  for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
	  		  	await DatabaseHelper.performRecursiveUpsert(input, schema, results, transaction, session, leavePermission, innerCircleTags);
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
	performRecursiveUpsert: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, session: any=null, leavePermission: boolean=false, innerCircleTags: string[]=[]): Promise<void> => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    	case SourceType.Document:
		    	case SourceType.VolatileMemory:
		    		if (input.source == SourceType.Relational && !RelationalDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.Document && !DocumentDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.VolatileMemory && !VolatileMemoryClient) throw new Error('There was an error trying to obtain a connection (not found).');
						
						const map = (input.source == SourceType.Relational) ? DatabaseHelper.ormMap(schema) : null;
						
						let bulkResults = [];
						let allowBulkProcess = input.rows.every((row) => Object.keys(row.relations).length == 0);
						const recent = new Date();
						if (input.source == SourceType.Relational && input.rows.length > 1 && allowBulkProcess) {
							const records = [];
							for (const row of input.rows) {
								let queryKeys: {[Identifier: string]: any} = {};
								let queryColumns: {[Identifier: string]: any} = {};
								let dataKeys: {[Identifier: string]: any} = {};
								let dataColumns: {[Identifier: string]: any} = {};
								
								[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema, true);
								dataColumns['updatedAt'] = recent;
								
								records.push(Object.assign({}, dataColumns, dataKeys));
							}
							await map.bulkCreate(records, {updateOnDuplicate: Object.keys(schema.columns).filter(key => !schema.columns[key].unique), transaction: transaction.relationalDatabaseTransaction});
							bulkResults = await map.findAll({where: {updatedAt: recent}, transaction: transaction.relationalDatabaseTransaction});
							
							input.rows = input.rows.splice(0, bulkResults.length); // Please make sure these won't be used except loop counting.
						}
						
						for (const row of input.rows) {
							let queryKeys: {[Identifier: string]: any} = {};
							let queryColumns: {[Identifier: string]: any} = {};
							let dataKeys: {[Identifier: string]: any} = {};
							let dataColumns: {[Identifier: string]: any} = {};
							
							[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema, true);
							
							let records = [];
							
							if (input.source == SourceType.Relational) {
								if (input.rows.length > 1 && allowBulkProcess) {
									records[0] = bulkResults[input.rows.indexOf(row)];
								} else {
									records[0] = (await map.upsert(Object.assign({}, dataColumns, dataKeys), {transaction: transaction.relationalDatabaseTransaction}))[0];
								}
							} else if (input.source == SourceType.Document) {
								await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).updateOne(queryKeys, {$set: Object.assign({}, dataColumns, dataKeys)}, {upsert: true, session: transaction.documentDatabaseSession});
								records[0] = await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).findOne(queryKeys, {session: transaction.documentDatabaseSession});
							} else if (input.source == SourceType.VolatileMemory) {
								const _key = schema.group + ':' + JSON.stringify(CodeHelper.sortHashtable(dataKeys));
								records[0] = JSON.parse(await VolatileMemoryClient.get(_key) || '{}');
								await VolatileMemoryClient.set(_key, JSON.stringify(Object.assign({}, records[0], dataColumns, dataKeys)));
								records[0] = JSON.parse(await VolatileMemoryClient.get(_key));
							}
							
							for (const record of records) {
							  if (record['_id']) record['id'] = record['_id'].toString();
							  
								for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
								    dataColumns[key] = record[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
								    dataKeys[key] = record[key];
								  }
								}
								
								if (!leavePermission && !await PermissionHelper.allowActionOnTable(ActionType.Upsert, schema, Object.assign({}, dataColumns, dataKeys), session, transaction)) throw new Error(`You have no permission to upsert any row in ${schema.group}.`);
								
							  const result: any = {
							    keys: {},
							    columns: {},
							    relations: {}
							  };
							  
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
								    result.columns[key] = fixType(schema.columns[key].fieldType, record[key]);
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
								    result.keys[key] = fixType(schema.keys[key].fieldType, record[key]);
								  }
								}
								
								result.timestamp = (new Date()).getTime();
								results.push(result);
								
								for (const key in row.relations) {
									if (row.relations.hasOwnProperty(key)) {
										const relation = schema.relations[key];
										const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
										const _nextKeys = {};
										
							  		for (const nextRow of row.relations[key].rows) {
							  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
								  			} else {
								  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
								  			}
							  			} else {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.columns[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  					}
								  			} else {
								  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.keys[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  					}
								  			}
							  			}
							  		}
							  		
							  		if (row.relations[key].notify !== undefined) {
							  		  for (const _key of row.relations[key].notify) {
							  		    if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				_nextKeys[_key] = row.relations[key].rows[0].columns[_key];
								  			} else {
								  				_nextKeys[_key] = row.relations[key].rows[0].keys[_key];
								  			}
							  		  }
							  		}
							  		
							  		result.relations[nextSchema.group] = {
				  					  source: SourceType.Relational,
											group: nextSchema.group,
										  rows: [],
							  			notification: (row.relations[key].notify !== undefined) ? NotificationHelper.getTableUpdatingIdentity(nextSchema, _nextKeys, session, innerCircleTags) : undefined
									  };
									  
									  row.relations[key].rows = await ActionHelper.perform(ActionType.Upsert, schema, nextSchema, row.relations[key].rows, transaction, true, session, leavePermission, innerCircleTags);
										
										if (row.relations[key].associate) await DatabaseHelper.performRecursiveRetrieve(row.relations[key], nextSchema, result.relations, session, row.relations[key].notify !== undefined, leavePermission, transaction, innerCircleTags);
										else await DatabaseHelper.performRecursiveUpsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session, leavePermission, innerCircleTags);
									}
								}
								
								await DatabaseHelper.forwardRecordSet(schema, [result], transaction);
							
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.columns[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.keys[key];
								  }
								}
							}
						}
						
						NotificationHelper.notifyUpdates(ActionType.Upsert, schema, results);
		    		break;
		    	case SourceType.PrioritizedWorker:
		    		WorkerHelper.enqueue(input);
		    		break;
		    	case SourceType.RESTful:
		    		const _column = Object.keys(schema.columns).map(key => schema.columns[key]).filter(column => column.verb == 'POST');
		    		
		    		if (_column.length == 0) throw new Error(`Cannot perform POST on RESTful group "${schema.group}".`);
		    		
		    		const _input = DataFormationHelper.convertFromHierarchicalDataTableToJSON(input);
		    		const _output = RequestHelper.post(_column[0].url, _input, 'json');
		    		
		    		const table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(_output);
		    		results.push(table.rows[0]);
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
	},
	update: async (data: Input[], baseSchema: DataTableSchema, crossRelationUpsert=false, session: any=null, leavePermission: boolean=false, innerCircleTags: string[]=[], transaction: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Update, baseSchema, crossRelationUpsert);
	  		const results = [];
	  		
  			if (!transaction) transaction = await CreateTransaction({share: !PermissionHelper.hasPermissionDefining(ActionType.Update, list)});
  		  
	  		for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
  		  		await DatabaseHelper.performRecursiveUpdate(input, schema, results, transaction, crossRelationUpsert, session, leavePermission, innerCircleTags);
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
	performRecursiveUpdate: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, crossRelationUpsert=false, session: any=null, leavePermission: boolean=false, innerCircleTags: string[]=[]): Promise<void> => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    	case SourceType.Document:
		    	case SourceType.VolatileMemory:
		    		if (input.source == SourceType.Relational && !RelationalDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.Document && !DocumentDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.VolatileMemory && !VolatileMemoryClient) throw new Error('There was an error trying to obtain a connection (not found).');
						
						const map = (input.source == SourceType.Relational) ? DatabaseHelper.ormMap(schema) : null;
						
						for (const row of input.rows) {
							let queryKeys: {[Identifier: string]: any} = {};
							let queryColumns: {[Identifier: string]: any} = {};
							let dataKeys: {[Identifier: string]: any} = {};
							let dataColumns: {[Identifier: string]: any} = {};
							
							[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema);
							
							let records = [];
							
							if (input.source == SourceType.Relational) {
								await map.update(dataColumns, {where: queryKeys, transaction: transaction.relationalDatabaseTransaction});
								records[0] = await map.findOne({where: queryKeys, transaction: transaction.relationalDatabaseTransaction});
							} else if (input.source == SourceType.Document) {
								if (Object.keys(dataColumns).length != 0) {
									await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).updateOne(queryKeys, {$set: dataColumns}, {session: transaction.documentDatabaseSession});
								}
								records[0] = await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).findOne(queryKeys, {session: transaction.documentDatabaseSession});
							} else if (input.source == SourceType.VolatileMemory) {
								const _key = schema.group + ':' + JSON.stringify(CodeHelper.sortHashtable(dataKeys));
								records[0] = JSON.parse(await VolatileMemoryClient.get(_key) || '{}');
								await VolatileMemoryClient.set(_key, JSON.stringify(Object.assign({}, records[0], dataColumns, dataKeys)));
								records[0] = JSON.parse(await VolatileMemoryClient.get(_key));
							}
							
						  if (!records[0]) {
						  	resolve();
						  	return;
						  }
							
							for (const record of records) {
							  if (record['_id']) record['id'] = record['_id'].toString();
							  
								for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
								    dataColumns[key] = record[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
								    dataKeys[key] = record[key];
								  }
								}
								
								if (!leavePermission && !await PermissionHelper.allowActionOnTable(ActionType.Update, schema, Object.assign({}, dataColumns, dataKeys), session, transaction)) throw new Error(`You have no permission to update any row in ${schema.group}.`);
								
							  const result: any = {
							    keys: {},
							    columns: {},
							    relations: {}
							  };
							  
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key)) {
								    result.columns[key] = fixType(schema.columns[key].fieldType, record[key]);
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key)) {
								    result.keys[key] = fixType(schema.keys[key].fieldType, record[key]);
								  }
								}
								
								result.timestamp = (new Date()).getTime();
								results.push(result);
								
								for (const key in row.relations) {
									if (row.relations.hasOwnProperty(key)) {
										const relation = schema.relations[key];
										const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
										const _nextKeys = {};
										
							  		for (const nextRow of row.relations[key].rows) {
							  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				nextRow.columns[relation.targetEntity] = result.columns[relation.sourceEntity];
								  			} else {
								  				nextRow.keys[relation.targetEntity] = result.columns[relation.sourceEntity];
								  			}
							  			} else {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  				  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.columns[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
							  					}
								  			} else {
								  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.keys[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
							  					}
								  			}
							  			}
							  		}
							  		
							  		if (row.relations[key].notify !== undefined) {
							  		  for (const _key of row.relations[key].notify) {
							  		    if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				_nextKeys[_key] = row.relations[key].rows[0].columns[_key];
								  			} else {
								  				_nextKeys[_key] = row.relations[key].rows[0].keys[_key];
								  			}
							  		  }
							  		}
							  		
							  		result.relations[nextSchema.group] = {
				  					  source: SourceType.Relational,
											group: nextSchema.group,
										  rows: [],
							  			notification: (row.relations[key].notify !== undefined) ? NotificationHelper.getTableUpdatingIdentity(nextSchema, _nextKeys, session, innerCircleTags) : undefined
									  };
									  
									  row.relations[key].rows = await ActionHelper.perform(ActionType.Update, schema, nextSchema, row.relations[key].rows, transaction, crossRelationUpsert, session, leavePermission, innerCircleTags);
										
										if (row.relations[key].associate) await DatabaseHelper.performRecursiveRetrieve(row.relations[key], nextSchema, result.relations, session, row.relations[key].notify !== undefined, leavePermission, transaction, innerCircleTags);
										else if (!crossRelationUpsert) await DatabaseHelper.performRecursiveUpdate(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, false, session, leavePermission, innerCircleTags);
										else await DatabaseHelper.performRecursiveUpsert(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session, leavePermission, innerCircleTags);
									}
								}
								
								await DatabaseHelper.forwardRecordSet(schema, [result], transaction);
							
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.columns[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.keys[key];
								  }
								}
							}
						}
						
						NotificationHelper.notifyUpdates(ActionType.Update, schema, results);
						break;
		    	case SourceType.PrioritizedWorker:
		    		WorkerHelper.enqueue(input);
		    		break;
		    	case SourceType.RESTful:
		    		const _column = Object.keys(schema.columns).map(key => schema.columns[key]).filter(column => column.verb == 'POST');
		    		
		    		if (_column.length == 0) throw new Error(`Cannot perform POST on RESTful group "${schema.group}".`);
		    		
		    		const _input = DataFormationHelper.convertFromHierarchicalDataTableToJSON(input);
		    		const _output = RequestHelper.post(_column[0].url, _input, 'json');
		    		
		    		const table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(_output);
		    		results.push(table.rows[0]);
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
  },
	retrieve: async (data: Input[], baseSchema: DataTableSchema, session: any=null, notifyUpdates=false, leavePermission: boolean=false, innerCircleTags: string[]=[], transaction: any=null): Promise<{[Identifier: string]: HierarchicalDataTable}> => {
		return new Promise(async (resolve, reject) => {
		  const connectionInfos: {[Identifier: string]: any} = {};
		  if (transaction) connectionInfos['documentDatabaseConnection'] = transaction.documentDatabaseConnection;
		  try {
		  	if (data != null) {
	  			const list = DatabaseHelper.prepareData(data, ActionType.Retrieve, baseSchema);
		  		const results = {};
		  		
		  		for (const key in list) {
	  		  	if (list.hasOwnProperty(key)) {
		  		  	const input = list[key];
		  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
		  		  	
		  		  	await DatabaseHelper.performRecursiveRetrieve(input, schema, results, session, notifyUpdates, leavePermission, connectionInfos, innerCircleTags);
		  		  }
	  		  }
			  	
		  		resolve(results);
		  	} else {
		  		let map, records;
		  		const hash = {}, rows = [], results = {};
		  		
		  		switch (baseSchema.source) {
	        	case SourceType.Relational:
	        		if (!RelationalDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
	        		
	        		map = DatabaseHelper.ormMap(baseSchema);
	  					records = await map.findAll();
	  					
	  					for (const record of records) {
	  					  const row: any = {
	    				    keys: {},
	    				    columns: {},
	    				    relations: {}
	    				  };
	  				  
	  					  for (const key in baseSchema.columns) {
								  if (baseSchema.columns.hasOwnProperty(key) && record[key] != undefined) {
								    row.columns[key] = fixType(baseSchema.columns[key].fieldType, record[key]);
								  }
								}
								for (const key in baseSchema.keys) {
								  if (baseSchema.keys.hasOwnProperty(key) && record[key] != undefined) {
								    row.keys[key] = fixType(baseSchema.keys[key].fieldType, record[key]);
								  }
								}
	  				  
	  					  for (const key in baseSchema.columns) {
	    					  if (baseSchema.columns.hasOwnProperty(key) && row.columns[key] !== undefined) {
	    					    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(baseSchema.columns[key], baseSchema, Object.assign({}, row.columns, row.keys), session, transaction)) delete row.columns[key];
	    					  }
	    					}
	    					for (const key in baseSchema.keys) {
	    					  if (baseSchema.keys.hasOwnProperty(key) && row.keys[key] !== undefined) {
	    					    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(baseSchema.keys[key], baseSchema, Object.assign({}, row.columns, row.keys), session, transaction)) delete row.keys[key];
	    					  }
	    					}
	    					
	    					row.timestamp = (new Date()).getTime();
	    					rows.push(row);
	  					}
	  					
	  					results[baseSchema.group] = results[baseSchema.group] || {
	  					  source: baseSchema.source,
	  					  group: baseSchema.group,
	  					  rows: [],
							  notification: (notifyUpdates) ? NotificationHelper.getTableUpdatingIdentity(baseSchema, {}, session) : null
	  					};
	  					
	  					results[baseSchema.group].rows = [...results[baseSchema.group].rows, ...rows] as HierarchicalDataRow[];
	        		
	        		break;
	        	case SourceType.PrioritizedWorker:
	        		throw new Error('Cannot perform RETRIEVE ALL on prioritized worker.');
	        		break;
	        	case SourceType.Document:
	        		if (!DocumentDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
	        		
	        		if (!connectionInfos['documentDatabaseConnection']) connectionInfos['documentDatabaseConnection'] = await DocumentDatabaseClient.connect();
							records = await new Promise(async (resolve, reject) => {
								await connectionInfos['documentDatabaseConnection'].db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(baseSchema.group).find().toArray((error: any, results: any) => {
									if (error) {
										reject(error);
									} else {
										resolve(results);
									}
								});
							});
							
							for (const record of records) {
	  					  const row: any = {
	    				    keys: {},
	    				    columns: {},
	    				    relations: {}
	    				  };
	  				  
	  					  for (const key in baseSchema.columns) {
								  if (baseSchema.columns.hasOwnProperty(key) && record[key] != undefined) {
								    row.columns[key] = fixType(baseSchema.columns[key].fieldType, record[key]);
								  }
								}
								for (const key in baseSchema.keys) {
								  if (baseSchema.keys.hasOwnProperty(key) && record[key] != undefined) {
								    row.keys[key] = fixType(baseSchema.keys[key].fieldType, record[key]);
								  }
								}
	  				  
	  					  for (const key in baseSchema.columns) {
	    					  if (baseSchema.columns.hasOwnProperty(key) && row.columns[key] !== undefined) {
	    					    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(baseSchema.columns[key], baseSchema, Object.assign({}, row.columns, row.keys), session, transaction)) delete row.columns[key];
	    					  }
	    					}
	    					for (const key in baseSchema.keys) {
	    					  if (baseSchema.keys.hasOwnProperty(key) && row.keys[key] !== undefined) {
	    					    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(baseSchema.keys[key], baseSchema, Object.assign({}, row.columns, row.keys), session, transaction)) delete row.keys[key];
	    					  }
	    					}
	    					
	    					row.timestamp = (new Date()).getTime();
	    					rows.push(row);
	  					}
	  					
	  					results[baseSchema.group] = {
	  					  source: baseSchema.source,
	  					  group: baseSchema.group,
	  					  rows: rows,
							  notification: (notifyUpdates) ? NotificationHelper.getTableUpdatingIdentity(baseSchema, {}, session) : null
	  					};
	        		
	        		break;
	        	case SourceType.VolatileMemory:
	        		if (!VolatileMemoryClient) throw new Error('There was an error trying to obtain a connection (not found).');
	        		
	        		throw new Error('Cannot perform RETRIEVE ALL on volatile memory.');
	        		
	        		break;
			    	case SourceType.RESTful:
			    		const _column = Object.keys(baseSchema.columns).map(key => baseSchema.columns[key]).filter(column => column.verb == null);
			    		
			    		if (_column.length == 0) throw new Error(`Cannot perform RETRIEVE ALL on RESTful named "${baseSchema.group}".`);
			    		
			    		const _output = RequestHelper.get(_column[0].url, 'json');
			    		
			    		const table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(_output);
			    		results[table.group] = table;
			    		
			    		break;
	        }
	        
	        for (const result of results[baseSchema.group].rows) {
						if (!leavePermission && !await PermissionHelper.allowActionOnTable(ActionType.Retrieve, baseSchema, Object.assign({}, result.columns, result.keys), session, transaction)) throw new Error(`You have no permission to retrieve any row in ${baseSchema.group}.`);
	      	}
	      	
	      	resolve(results);
	      }
      } catch(error) {
      	console.log(error);
      	
        reject(error);
      } finally {
      	// if (connectionInfos['documentDatabaseConnection']) connectionInfos['documentDatabaseConnection'].close();
      }
		});
	},
	performRecursiveRetrieve: async (input: HierarchicalDataTable, schema: DataTableSchema, results: {[Identifier: string]: HierarchicalDataTable}, session: any=null, notifyUpdates=false, leavePermission: boolean=false, connectionInfos: {[Identifier: string]: any}={}, innerCircleTags: string[]=[]): Promise<void> => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    	case SourceType.Document:
		    	case SourceType.VolatileMemory:
		    		if (input.source == SourceType.Relational && !RelationalDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.Document && !DocumentDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.VolatileMemory && !VolatileMemoryClient) throw new Error('There was an error trying to obtain a connection (not found).');
						
						const map = (input.source == SourceType.Relational) ? DatabaseHelper.ormMap(schema) : null;
						
						for (const row of input.rows) {
							let rows = [];
							
							let queryKeys: {[Identifier: string]: any} = {};
							let queryColumns: {[Identifier: string]: any} = {};
							let dataKeys: {[Identifier: string]: any} = {};
							let dataColumns: {[Identifier: string]: any} = {};
							
							[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema);
							
							let notificationURI = NotificationHelper.getTableUpdatingIdentity(schema, Object.assign({}, dataColumns, dataKeys), session, innerCircleTags); // Early generate due to modification of dataKeys and dataColumns.
							
							if (!results.relations || !results.relations[schema.group] || results.relations[schema.group].forwarded !== true) {
								let records;
								if (input.source == SourceType.Relational) {
									records = await map.findAll({where: Object.assign({}, queryColumns, queryKeys)}) || [];
								} else if (input.source == SourceType.Document) {
									if (!connectionInfos['documentDatabaseConnection']) connectionInfos['documentDatabaseConnection'] = await DocumentDatabaseClient.connect();
									records = await new Promise(async (resolve, reject) => {
										await connectionInfos['documentDatabaseConnection'].db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).find(Object.assign({}, queryColumns, queryKeys)).toArray((error: any, results: any) => {
											if (error) {
												reject(error);
											} else {
												resolve(results);
											}
										});
									});
								} else if (input.source == SourceType.VolatileMemory) {
									const _key = schema.group + ':' + JSON.stringify(CodeHelper.sortHashtable(queryKeys));
									const record = await VolatileMemoryClient.get(_key);
									records = record && [JSON.parse(record)] || [];
								}
								
								for (const record of records) {
							  	if (record['_id']) record['id'] = record['_id'].toString();
							  	
							  	for (const key in schema.columns) {
									  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
									    dataColumns[key] = record[key];
									  }
									}
									for (const key in schema.keys) {
									  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
									    dataKeys[key] = record[key];
									  }
									}
									
									if (!leavePermission && !await PermissionHelper.allowActionOnTable(ActionType.Retrieve, schema, Object.assign({}, dataColumns, dataKeys), session, connectionInfos)) throw new Error(`You have no permission to retrieve any row in ${schema.group}.`);
								
								  const row: any = {
			  				    keys: {},
			  				    columns: {},
			  				    relations: {}
			  				  };
							  	
								  for (const key in schema.columns) {
			  					  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
			  					    row.columns[key] = fixType(schema.columns[key].fieldType, record[key]);
			  					  }
			  					}
			  					for (const key in schema.keys) {
			  					  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
			  					    row.keys[key] = fixType(schema.keys[key].fieldType, record[key]);
			  					  }
			  					}
			  					
			  					if (record['relations']) row.relations = record['relations'];
			  					
			  					row.timestamp = (new Date()).getTime();
			  					rows.push(row);
								}
							} else {
								for (const row of results.relations[schema.group].rows) {
									let found = false;
									
									for (const key in dataKeys) {
			  					  if (dataKeys.hasOwnProperty(key) && `${row.keys[key]}` != `${dataKeys[key]}`) {
			  					    found = true;
			  					    break;
			  					  }
			  					}
			  					for (const key in dataColumns) {
			  					  if (dataColumns.hasOwnProperty(key) && `${row.columns[key]}` != `${dataColumns[key]}`) {
			  					    found = true;
			  					    break;
			  					  }
			  					}
									
									if (!found) {
										row.timestamp = (new Date()).getTime();
										rows.push(row);
									}
								}
							}
						
							results[schema.group] = {
							  source: schema.source,
							  group: schema.group,
							  rows: rows,
							  notification: (notifyUpdates) ? notificationURI : null
							};
							
							for (const _row of rows) {
								for (const key in row.relations) {
									if (row.relations.hasOwnProperty(key)) {
										const relation = schema.relations[key];
										const nextSchema = ProjectConfigurationHelper.getDataSchema().tables[key];
										
							  		for (const nextRow of row.relations[key].rows) {
							  			if (schema.columns.hasOwnProperty(relation.sourceEntity)) {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
								  				nextRow.columns[relation.targetEntity] = _row.columns[relation.sourceEntity];
								  			} else {
								  				nextRow.keys[relation.targetEntity] = _row.columns[relation.sourceEntity];
								  			}
							  			} else {
							  				if (nextSchema.columns.hasOwnProperty(relation.targetEntity)) {
							  					if (isObjectID(`${_row.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.columns[relation.targetEntity] = new ObjectID(_row.keys[relation.sourceEntity]);
							  					} else {
							  						nextRow.columns[relation.targetEntity] = _row.keys[relation.sourceEntity];
							  					}
								  			} else {
								  				if (isObjectID(`${_row.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
							  						nextRow.keys[relation.targetEntity] = new ObjectID(_row.keys[relation.sourceEntity]);
							  					} else {
								  					nextRow.keys[relation.targetEntity] = _row.keys[relation.sourceEntity];
								  				}
								  			}
							  			}
							  		}
										
							  		row.relations[key].rows = await ActionHelper.perform(ActionType.Retrieve, schema, nextSchema, row.relations[key].rows, connectionInfos, undefined, session, leavePermission, innerCircleTags);
									  
									  await DatabaseHelper.performRecursiveRetrieve(row.relations[key], nextSchema, _row.relations, session, notifyUpdates, leavePermission, connectionInfos, innerCircleTags);
							  	}
							  }
							}
							
							for (const _row of rows) {
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && _row.columns[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, Object.assign({}, _row.columns, _row.keys), session, connectionInfos)) delete _row.columns[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && _row.keys[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, Object.assign({}, _row.columns, _row.keys), session, connectionInfos)) delete _row.keys[key];
								  }
								}
								for (const key in _row.relations) {
									if (_row.relations.hasOwnProperty(key)) {
										if (!row.relations.hasOwnProperty(key)) delete _row.relations[key];
									}
								}
							}
						}
						break;
		    	case SourceType.PrioritizedWorker:
		    		if (!PrioritizedWorkerClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		
		    		throw new Error('Cannot perform RETRIEVE on prioritized worker.');
		    		
		    		break;
		    	case SourceType.RESTful:
		    		const _column = Object.keys(schema.columns).map(key => schema.columns[key]).filter(column => column.verb == null);
		    		
		    		if (_column.length == 0) throw new Error(`Cannot perform GET on RESTful group "${schema.group}".`);
		    		
		    		const _input = DataFormationHelper.convertFromHierarchicalDataTableToJSON(input);
		    		const _output = RequestHelper.get(_column[0].url, 'json');
		    		
		    		const table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(_output);
		    		results[table.group] = table;
		    		
		    		break;
		    }
		    
	  		resolve();
		  } catch(error) {
		  	reject(error);
		  }
		});
  },
	delete: async (data: Input[], baseSchema: DataTableSchema, session: any=null, leavePermission: boolean=false, transaction: any=null): Promise<HierarchicalDataRow[]> => {
		return new Promise(async (resolve, reject) => {
		  try {
  			const list = DatabaseHelper.prepareData(data, ActionType.Delete, baseSchema);
  		  const results = [];
	  		
  			if (!transaction) transaction = await CreateTransaction({share: !PermissionHelper.hasPermissionDefining(ActionType.Delete, list)});
  		  
  		  for (const key in list) {
  		  	if (list.hasOwnProperty(key)) {
	  		  	const input = list[key];
	  		  	const schema = ProjectConfigurationHelper.getDataSchema().tables[key];
	  		  	
  		  		await DatabaseHelper.performRecursiveDelete(input, schema, results, transaction, session, leavePermission);
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
	performRecursiveDelete: async (input: HierarchicalDataTable, schema: DataTableSchema, results: HierarchicalDataRow[], transaction: any, session: any=null, leavePermission: boolean=false): Promise<void> => {
		return new Promise(async (resolve, reject) => {
		  try {
		    switch (input.source) {
		    	case SourceType.Relational:
		    	case SourceType.Document:
		    	case SourceType.VolatileMemory:
		    		if (input.source == SourceType.Relational && !RelationalDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.Document && !DocumentDatabaseClient) throw new Error('There was an error trying to obtain a connection (not found).');
		    		if (input.source == SourceType.VolatileMemory && !VolatileMemoryClient) throw new Error('There was an error trying to obtain a connection (not found).');
						
						const map = (input.source == SourceType.Relational) ? DatabaseHelper.ormMap(schema) : null;
						
						let bulkResults = [];
						let allowBulkProcess = input.rows.every((row) => Object.keys(row.relations).length == 0);
						const recent = new Date();
						if (input.source == SourceType.Relational && input.rows.length > 1 && allowBulkProcess) {
							const records = [];
							for (const row of input.rows) {
								let queryKeys: {[Identifier: string]: any} = {};
								let queryColumns: {[Identifier: string]: any} = {};
								let dataKeys: {[Identifier: string]: any} = {};
								let dataColumns: {[Identifier: string]: any} = {};
								
								[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema, true);
								
								records.push(Object.assign({}, queryColumns, queryKeys));
							}
							bulkResults = await map.findAll({where: {[Op.or]: records}, transaction: transaction.relationalDatabaseTransaction});
							await map.destroy({where: {[Op.or]: records}}, {force: true, transaction: transaction.relationalDatabaseTransaction});
						}
						
						for (const row of input.rows) {
							let queryKeys: {[Identifier: string]: any} = {};
							let queryColumns: {[Identifier: string]: any} = {};
							let dataKeys: {[Identifier: string]: any} = {};
							let dataColumns: {[Identifier: string]: any} = {};
							
							[queryKeys, queryColumns, dataKeys, dataColumns] = DatabaseHelper.formatKeysAndColumns(row, schema);
							
							let records = [];
							if (input.source == SourceType.Relational) {
		  				  if (input.rows.length > 1 && allowBulkProcess) {
									records = bulkResults;
								} else {
									records = await map.findAll({where: Object.assign({}, queryColumns, queryKeys)}) || [];
		  				  	await map.destroy({where: Object.assign({}, queryColumns, queryKeys)}, {force: true, transaction: transaction.relationalDatabaseTransaction});
								}
							} else if (input.source == SourceType.Document) {
								records = await new Promise(async (resolve, reject) => {
									await transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).find(Object.assign({}, queryColumns, queryKeys), {session: transaction.documentDatabaseSession}).toArray((error: any, results: any) => {
										if (error) {
											reject(error);
										} else {
											resolve(results);
										}
									});
								});
								
								for (const record of records) {
									transaction.documentDatabaseConnection.db(DEFAULT_DOCUMENT_DATABASE_NAME).collection(schema.group).deleteOne({
										'_id': {$eq: new ObjectID(record['_id'])}
									}, {session: transaction.documentDatabaseSession});
								}
							} else if (input.source == SourceType.VolatileMemory) {
								const _key = schema.group + ':' + JSON.stringify(CodeHelper.sortHashtable(dataKeys));
								const record = await VolatileMemoryClient.get(_key);
								records = record && [JSON.parse(record)] || [];
								await VolatileMemoryClient.del(_key);
							}
							
							for (const record of records) {
							  if (record['_id']) record['id'] = record['_id'].toString();
							  
								for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
								    dataColumns[key] = record[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
								    dataKeys[key] = record[key];
								  }
								}
							
								if (!leavePermission && !await PermissionHelper.allowActionOnTable(ActionType.Delete, schema, Object.assign({}, dataColumns, dataKeys), session, transaction)) throw new Error(`You have no permission to delete any row in ${schema.group}.`);
								
							  const row: any = {
		  				    keys: {},
		  				    columns: {},
		  				    relations: {}
		  				  };
						  	
							  for (const key in schema.columns) {
		  					  if (schema.columns.hasOwnProperty(key) && record[key] !== undefined) {
		  					    row.columns[key] = fixType(schema.columns[key].fieldType, record[key]);
		  					  }
		  					}
		  					for (const key in schema.keys) {
		  					  if (schema.keys.hasOwnProperty(key) && record[key] !== undefined) {
		  					    row.keys[key] = fixType(schema.keys[key].fieldType, record[key]);
		  					  }
		  					}
		  					
		  					row.timestamp = (new Date()).getTime();
		  					results.push(row);
							}
							
							for (const result of results) {
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
							  				  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
  						  						nextRow.columns[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
  						  					} else {
  						  						nextRow.columns[relation.targetEntity] = result.keys[relation.sourceEntity];
  						  					}
								  			} else {
								  			  if (isObjectID(`${result.keys[relation.sourceEntity]}`) && input.source == SourceType.Document) {
  						  						nextRow.keys[relation.targetEntity] = new ObjectID(result.keys[relation.sourceEntity]);
  						  					} else {
  						  						nextRow.keys[relation.targetEntity] = result.keys[relation.sourceEntity];
  						  					}
								  			}
							  			}
							  		}
							  		
							  		result.relations[nextSchema.group] = result.relations[nextSchema.group] || {
				  					  source: SourceType.Relational,
											group: nextSchema.group,
										  rows: []
									  };
									  
									  row.relations[key].rows = await ActionHelper.perform(ActionType.Delete, schema, nextSchema, row.relations[key].rows, transaction, undefined, session, leavePermission, []);
									
										await DatabaseHelper.performRecursiveDelete(row.relations[key], nextSchema, result.relations[nextSchema.group].rows, transaction, session, leavePermission);
									}
								}
								
								await DatabaseHelper.forwardRecordSet(schema, [result], transaction);
								
							  for (const key in schema.columns) {
								  if (schema.columns.hasOwnProperty(key) && result.columns[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.columns[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.columns[key];
								  }
								}
								for (const key in schema.keys) {
								  if (schema.keys.hasOwnProperty(key) && result.keys[key] !== undefined) {
								    if (!leavePermission && !await PermissionHelper.allowOutputOfColumn(schema.keys[key], schema, Object.assign({}, result.columns, result.keys), session, transaction)) delete result.keys[key];
								  }
								}
							}
							
				    	if (input.source == SourceType.Relational) {
				  			if (input.rows.length > 1 && allowBulkProcess) {
				  				break;
				  			}
				  		}
						}
						
						NotificationHelper.notifyUpdates(ActionType.Delete, schema, results);
						break;
					case SourceType.PrioritizedWorker:
						WorkerHelper.enqueue(input);
						break;
		    	case SourceType.RESTful:
		    		const _column = Object.keys(schema.columns).map(key => schema.columns[key]).filter(column => column.verb == 'DELETE');
		    		
		    		if (_column.length == 0) throw new Error(`Cannot perform DELETE on RESTful group "${schema.group}".`);
		    		
		    		const _input = DataFormationHelper.convertFromHierarchicalDataTableToJSON(input);
		    		const _output = RequestHelper.delete(_column[0].url, _input, 'json');
		    		
		    		const table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(_output);
		    		results.push(table.rows[0]);
		    		
		    		break;
				}
		    
	  		resolve();
			} catch(error) {
				reject(error);
			}
		});
	}     
};

export {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, Input, DatabaseHelper, fixType};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.