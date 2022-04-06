// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {DatabaseHelper, ActionType, SourceType} from './DatabaseHelper';
import {RequestHelper} from './RequestHelper';
import {DataTableSchema, DataColumnSchema, DataSchema, SchemaHelper} from './SchemaHelper';
import {ProjectConfigurationHelper} from './ProjectConfigurationHelper';
import {RelationalDatabaseClient} from './ConnectionHelper';
import {Md5} from 'md5-typescript';

const cachedPermissions = {};

interface Permission {
  mode: string;
  relationModeSourceGroup: string;
  relationModeSourceEntity: string;
  relationMatchingMode: string;
  relationMatchingConstantValue: string;
  relationMatchingSessionName: string;
  sessionMatchingSessionName: string;
  sessionMatchingConstantValue: string;
}

const PermissionHelper = {
	allowActionOnTable: async (action: ActionType, schema: DataTableSchema, modifyingColumns: any, session: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (action == ActionType.Insert || action == ActionType.Upsert) {
					if (schema.modifyingPermission && schema.modifyingPermission.mode == 'relation' && schema.modifyingPermission.relationModeSourceGroup == schema.group) {
						if (!await PermissionHelper.allowPermission(schema.modifyingPermission, schema, modifyingColumns, session, data)) {
							resolve(false);
							return;
						}
					}
				} else {
					if (!await PermissionHelper.allowPermission((action == ActionType.Retrieve) ? schema.retrievingPermission : schema.modifyingPermission, schema, modifyingColumns, session, data)) {
						resolve(false);
						return;
					} else if (action != ActionType.Retrieve) {
						for (const key in schema.keys) {
							if (schema.keys.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
								if (!await PermissionHelper.allowPermission(schema.keys[key].modifyingPermission, schema, modifyingColumns, session, data)) {
									resolve(false);
									return;
								}
							}
						}
						for (const key in schema.columns) {
							if (schema.columns.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
								if (!await PermissionHelper.allowPermission(schema.columns[key].modifyingPermission, schema, modifyingColumns, session, data)) {
									resolve(false);
									return;
								}
							}
						}
					}
				}
				
				resolve(true);
			} catch(error) {
				reject(error);
			}
		});
	},
	allowOutputOfColumn: async (column: DataColumnSchema, schema: DataTableSchema, session: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return PermissionHelper.allowPermission(column.retrievingPermission, schema, {}, session, data);
	},
	allowPermission: async (permission: Permission, target: DataTableSchema, modifyingColumns: any, session: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (permission == null) {
					resolve(true);
					return;
				}
				
				switch (permission.mode) {
					case 'block':
					case 'always':
						resolve(false);
						break;
					case 'relation':
						if (session == null) throw new Error('There was an error authorizing a permission (the request session variable was null).');
						
						const unitedShortestPath = SchemaHelper.findShortestPathOfRelations(target, data.tables[permission.relationModeSourceGroup], data);
						let value;
						
						switch (permission.relationMatchingMode) {
							case 'session':
								value = session[permission.relationMatchingSessionName];
								break;
							default:
								value = permission.relationMatchingConstantValue;
								break;
						}
						
						const separatedSourceShortestPath = [];
						let currentSourceShortestPath = [];
						let currentSource = null;
						
						for (const schema of unitedShortestPath) {
							if (currentSource != null && (currentSource != schema.source || currentSource != SourceType.Relational)) {
								if (currentSource) separatedSourceShortestPath.push(currentSourceShortestPath);
								currentSourceShortestPath = [];
								currentSource = null;
							}
							
							currentSourceShortestPath.push(schema);
							currentSource = schema.source;
						}
						
						if (currentSource) separatedSourceShortestPath.push(currentSourceShortestPath);
						
						let flag = true;
						let lastSourceGroup = null;
						let lastSourceEntity = null;
						
						for (const [index, shortestPath] of separatedSourceShortestPath.entries()) {
							if (!flag) break;
							if (shortestPath[0].source == SourceType.Relational && shortestPath.length > 1) {
								const INNER_JOIN = [];
								const WHERE_CLAUSE = [];
								const VALUES = [];
								
								let current = shortestPath[0];
								
								for (let i=1; i<shortestPath.length; i++) {
									const next = shortestPath[i];
									
									INNER_JOIN.push(`INNER JOIN ${next.group} ON ${current.group}.${current.relations[next.group].sourceEntity} = ${next.group}.${current.relations[next.group].targetEntity}`);
									
									lastSourceGroup = next.group;
									lastSourceEntity = current.relations[next.group].sourceEntity;
									
									current = next;
								}
								
								WHERE_CLAUSE.push(`CONVERT(${lastSourceGroup}.${lastSourceEntity}, char) = CONVERT(?, char)`);
								VALUES.push(value);
								
								const from = shortestPath[shortestPath.length - 1];
								for (const key in from.keys) {
									if (from.keys.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
										WHERE_CLAUSE.push(`${from.group}.${key} = ?`);
										VALUES.push(modifyingColumns[key]);
									}
								}
								
								const COMMAND = `SELECT ${lastSourceGroup}.${lastSourceEntity} as value FROM ${target.group} ${INNER_JOIN.join(' ')} WHERE ${WHERE_CLAUSE.join(' AND ')} LIMIT 1`;
			      		console.log(COMMAND);
			      		
			      		const cachedPermissionMD5Key = Md5.init(session.id + COMMAND);
			      		if (cachedPermissions[cachedPermissionMD5Key] !== '__FALSE__') {
			      			value = cachedPermissions[cachedPermissionMD5Key];
			      			continue;
			      		}
								
								RelationalDatabaseClient.query(COMMAND, VALUES, (function(error, results, fields) {
			            if (error) {
			              reject(error);
			      			} else if (results.length > 0) {
			      				cachedPermissions[cachedPermissionMD5Key] = results[0]['value'];
			      				value = results[0]['value'];
			      			} else {
			      				cachedPermissions[cachedPermissionMD5Key] = '__FALSE__';
			      			  flag = false;
			      			}
			      		}).bind(this));
			      	} else {
			      		const data = {};
			      		data[`${shortestPath[0].group}.${lastSourceEntity}`] = value;
			      					      		
		      			lastSourceGroup = shortestPath[0].group;
		      			if (separatedSourceShortestPath[index + 1]) {
		      				lastSourceEntity = shortestPath[0].relations[separatedSourceShortestPath[index + 1][0].group].sourceEntity;
		      			} else {
		      				lastSourceEntity = null;
		      			}
			      		
			      		let cachedPermissionMD5Key = null;
			      		if (lastSourceEntity) {			
			      			cachedPermissionMD5Key = Md5.init(session.id + JSON.stringify([data, lastSourceGroup, lastSourceEntity]));
				      		if (cachedPermissions[cachedPermissionMD5Key] !== '__FALSE__') {
				      			value = cachedPermissions[cachedPermissionMD5Key];
				      			continue;
				      		}
				      	}
			      		
			      		const dataset = await DatabaseHelper.retrieve(RequestHelper.createInputs(data), ProjectConfigurationHelper.getDataSchema().tables[shortestPath[0].group], false);
			      		
			      		if (dataset[shortestPath[0].group].rows.length == 0) {
			      			if (cachedPermissionMD5Key) cachedPermissions[cachedPermissionMD5Key] = '__FALSE__';
			      			flag = false;
			      			break;
			      		} else {
			      			if (lastSourceEntity) {
				      			if (shortestPath[0].keys.hasOwnProperty(lastSourceEntity)) {
				      				value = dataset[shortestPath[0].group].rows[0].keys[lastSourceEntity];
				      			} else {
				      				value = dataset[shortestPath[0].group].rows[0].columns[lastSourceEntity];
				      			}
				      			
				      			cachedPermissions[cachedPermissionMD5Key] = value;
				      		}
			      		}
			      	}
						}
						
						resolve(flag);
						break;
					case 'session':
						if (session == null) throw new Error('There was an error authorizing a permission (the request session variable was null).');
						resolve(session[permission.sessionMatchingSessionName] == permission.sessionMatchingConstantValue);
						break;
					default:
						resolve(true);
						break;
				}
			} catch(error) {
				reject(error);
			}
		});
	},
};

export {Permission, PermissionHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.