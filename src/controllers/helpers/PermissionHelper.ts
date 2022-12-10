// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {DatabaseHelper, ActionType, SourceType, HierarchicalDataTable} from './DatabaseHelper';
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
	allowActionOnTable: async (action: ActionType, schema: DataTableSchema, modifyingColumns: any, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (action == ActionType.Insert || action == ActionType.Upsert) {
					if (schema.modifyingPermission && schema.modifyingPermission.mode == 'relation' && schema.modifyingPermission.relationModeSourceGroup == schema.group) {
						if (!await PermissionHelper.allowPermission(schema.modifyingPermission, schema, modifyingColumns, session, transaction, data)) {
							resolve(false);
							return;
						}
					}
				} else {
					if (!await PermissionHelper.allowPermission((action == ActionType.Retrieve) ? schema.retrievingPermission : schema.modifyingPermission, schema, modifyingColumns, session, transaction, data)) {
						resolve(false);
						return;
					} else if (action != ActionType.Retrieve) {
						for (const key in schema.keys) {
							if (schema.keys.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
								if (!await PermissionHelper.allowPermission(schema.keys[key].modifyingPermission, schema, modifyingColumns, session, transaction, data)) {
									resolve(false);
									return;
								}
							}
						}
						for (const key in schema.columns) {
							if (schema.columns.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
								if (!await PermissionHelper.allowPermission(schema.columns[key].modifyingPermission, schema, modifyingColumns, session, transaction, data)) {
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
	allowOutputOfColumn: async (column: DataColumnSchema, schema: DataTableSchema, modifyingColumns: any={}, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return PermissionHelper.allowPermission(column.retrievingPermission, schema, modifyingColumns, session, transaction, data);
	},
	allowPermission: async (permission: Permission, target: DataTableSchema, referencings: any, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
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
						
						let finalEntity = null;
						let finalValue;
						let flag = true;
						
						switch (permission.relationMatchingMode) {
							case 'session':
								finalValue = session[permission.relationMatchingSessionName];
								finalEntity = permission.relationModeSourceEntity;
								break;
							default:
								finalValue = permission.relationMatchingConstantValue;
								break;
						}
						
						const separatedSourceShortestPath = [];
						let currentSourceShortestPath = [];
						let currentSource = null;
						
						for (const schema of unitedShortestPath) {
							if (currentSource != null && currentSource != schema.source) {
								if (currentSource) separatedSourceShortestPath.push(currentSourceShortestPath);
								currentSourceShortestPath = [schema];
								currentSource = null;
							}
							
							currentSourceShortestPath.push(schema);
							currentSource = schema.source;
						}
						
						if (currentSource) separatedSourceShortestPath.push(currentSourceShortestPath);
						
						for (const [index, shortestPath] of separatedSourceShortestPath.entries()) {
							if (!flag) break;
							
							const last = shortestPath[shortestPath.length - 1];
	      			const nextShortestPath = separatedSourceShortestPath[index + 1] || null;
	      			let targetEntity;
	      			
	      			if (nextShortestPath) {
	      				targetEntity = nextShortestPath[0].relations[last.group].sourceEntity;
	      			} else {
	      				targetEntity = finalEntity;
	      				
	      				if (shortestPath.length > 1) {
	      					const previous = shortestPath[shortestPath.length - 2];
	      					targetEntity = last.relations[previous.group].sourceEntity;
	      				} else {
	      					targetEntity = Object.keys(last.keys)[0];
	      				}
	      			}
							
							if (shortestPath[0].source == SourceType.Relational) {
								const INNER_JOIN = [];
								const WHERE_CLAUSE = [];
								const VALUES = [];
								
								for (let i=0; i<shortestPath.length-1; i++) {
									const current = shortestPath[i];
									const next = shortestPath[i+1];
									
									INNER_JOIN.push(`INNER JOIN ${current.group} ON ${next.group}.${next.relations[current.group].sourceEntity} = ${current.group}.${next.relations[current.group].targetEntity}`);
								}
								
								INNER_JOIN.reverse();
								
								const from = shortestPath[0];
								for (const key in from.keys) {
									if (from.keys.hasOwnProperty(key) && referencings[key] !== undefined && referencings[key] !== null) {
										WHERE_CLAUSE.push(`${from.group}.${key} = ?`);
										VALUES.push(referencings[key]);
									}
								}
								
								const COMMAND = `SELECT * FROM ${shortestPath[shortestPath.length - 1].group} ${INNER_JOIN.join(' ')} WHERE ${WHERE_CLAUSE.join(' AND ')} LIMIT 1`;
			      		
			      		const cachedPermissionMD5Key = session.id + Md5.init(JSON.stringify([COMMAND, finalValue]));
			      		if (!!cachedPermissions[cachedPermissionMD5Key]) {
			      			continue;
			      		}
								
								referencings = await new Promise<any>((resolve, reject) => {
									RelationalDatabaseClient.query(COMMAND, VALUES, (function(error, results, fields) {
				            if (error) {
				              reject(error);
				      			} else if (results.length > 0) {
				      				resolve(results[0]);
				      			} else {
				      				resolve(null);
				      			}
				      		}).bind(this));
								});
								
								if (referencings == null) {
			      			cachedPermissions[cachedPermissionMD5Key] = '__FALSE__';
			      			flag = false;
			      		} else if (!cachedPermissions[cachedPermissionMD5Key]) {
			      			flag = (finalValue == referencings[targetEntity]);
									cachedPermissions[cachedPermissionMD5Key] = (!flag) ? '__FALSE__' : '__TRUE__';
			      		}
			      	} else {
		      			const cachedPermissionMD5Key = session.id + Md5.init(JSON.stringify([shortestPath, finalValue]));
			      		if (!!cachedPermissions[cachedPermissionMD5Key]) {
			      			continue;
			      		}
								
								let i = 1;
								do {
									const previous = shortestPath[i-1];
									const current = shortestPath[i];
									const data = {};
									
									for (const key in previous.keys) {
										if (previous.keys.hasOwnProperty(key) && referencings[key] !== undefined && referencings[key] !== null && current.relations[previous.group].targetEntity == key) {
											data[`${current.group}.${current.relations[previous.group].sourceEntity}`] = referencings[key].toString();
										}
									}
									for (const key in previous.columns) {
										if (previous.columns.hasOwnProperty(key) && referencings[key] !== undefined && referencings[key] !== null && current.relations[previous.group].targetEntity == key) {
											data[`${current.group}.${current.relations[previous.group].sourceEntity}`] = referencings[key].toString();
										}
									}
									
									const dataset = await DatabaseHelper.retrieve(RequestHelper.createInputs(data), ProjectConfigurationHelper.getDataSchema().tables[current.group], session, false, true, undefined, transaction);
									
									if (dataset[current.group].rows.length == 0) {
										referencings = null;
										break;
									} else {
										referencings = Object.assign({}, dataset[current.group].rows[0].columns, dataset[current.group].rows[0].keys);
									}
								} while (referencings != null && ++i < shortestPath.length);
								
			      		if (referencings == null) {
			      			cachedPermissions[cachedPermissionMD5Key] = '__FALSE__';
			      			flag = false;
			      		} else if (!cachedPermissions[cachedPermissionMD5Key]) {
			      			flag = (finalValue == referencings[targetEntity]);
									cachedPermissions[cachedPermissionMD5Key] = (!flag) ? '__FALSE__' : '__TRUE__';
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
	hasPermissionDefining: (action: ActionType, input: {[Identifier: string]: HierarchicalDataTable}, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): boolean => {
		for (const group in input) {
			const schema = data.tables[group];
			
			if (action == ActionType.Retrieve) {
				return !!schema.retrievingPermission;
			} else {
				return !!schema.modifyingPermission;
			}
			
			for (const row of input[group].rows) {
				if (PermissionHelper.hasPermissionDefining(action, row.relations, data)) {
					return true;
				}
			}
		}
		
		return false;
	}
};

export {Permission, PermissionHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.