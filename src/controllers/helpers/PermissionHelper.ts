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
	allowActionOnTable: async (action: ActionType, schema: DataTableSchema, requestModifyingKeys: string[], modifyingFields: any, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (action != ActionType.Retrieve) {
					if (schema.modifyingPermission) {
						switch (schema.modifyingPermission.mode) {
							case 'always':
							case 'relation':
							case 'session':
								if (!await PermissionHelper.allowPermission(schema.modifyingPermission, schema, modifyingFields, session, transaction, data)) {
									resolve(false);
									return;
								}
								break;
							default:
								throw new Error('P1 Error: no implementation.');
						}
					}
					
					for (const key in schema.keys) {
						if (schema.keys.hasOwnProperty(key) && requestModifyingKeys.indexOf(key) != -1 && modifyingFields[key] !== undefined) {
							if (!await PermissionHelper.allowModifyOfColumn(schema.keys[key], schema, modifyingFields, session, transaction, data)) {
								resolve(false);
								return;
							}
						}
					}
					for (const key in schema.columns) {
						if (schema.columns.hasOwnProperty(key) && requestModifyingKeys.indexOf(key) != -1 && modifyingFields[key] !== undefined) {
							if (!await PermissionHelper.allowModifyOfColumn(schema.columns[key], schema, modifyingFields, session, transaction, data)) {
								resolve(false);
								return;
							}
						}
					}
					
					resolve(true);
				} else if (action == ActionType.Retrieve) {
					if (schema.retrievingPermission) {
						switch (schema.retrievingPermission.mode) {
							case 'always':
							case 'relation':
							case 'session':
								if (!await PermissionHelper.allowPermission(schema.retrievingPermission, schema, modifyingFields, session, transaction, data, false)) {
									resolve(false);
									return;
								}
								break;
							default:
								throw new Error('P1 Error: no implementation.');
						}
					}
					
					resolve(true);
				} else {
					throw new Error('P1 Error: no implementation.');
				}
			} catch(error) {
				reject(error);
			}
		});
	},
	allowModifyOfColumn: async (column: DataColumnSchema, schema: DataTableSchema, modifyingFields: any={}, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		if (!column.modifyingPermission) return true;
		
		return await PermissionHelper.allowPermission(column.modifyingPermission, schema, modifyingFields, session, transaction, data);
	},
	allowOutputOfColumn: async (column: DataColumnSchema, schema: DataTableSchema, modifyingFields: any={}, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		if (!column.retrievingPermission) return true;
		
		return await PermissionHelper.allowPermission(column.retrievingPermission, schema, modifyingFields, session, transaction, data, false);
	},
	allowPermission: async (permission: Permission, target: DataTableSchema, referencings: any, session: any=null, transaction: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema(), isRequiringTransaction: boolean=true): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (permission == null) {
					resolve(true);
					return;
				}
				
				if (isRequiringTransaction && target.source == SourceType.Relational && !transaction.relationalDatabaseTransaction) throw new Error('P1 Error: using permission, you have to turn on the transaction feature (relational).');
				if (isRequiringTransaction && target.source == SourceType.Document && !transaction.documentDatabaseSession) throw new Error('P1 Error: using permission, you have to turn on the transaction feature (document).');
				
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
						let flag = false;
						
						switch (permission.relationMatchingMode) {
							case 'session':
								finalEntity = permission.relationModeSourceEntity;
								finalValue = session[permission.relationMatchingSessionName];
								break;
							default:
								finalEntity = permission.relationModeSourceEntity;
								finalValue = permission.relationMatchingConstantValue;
								break;
						}
						
						const separatedSourceShortestPath = [];
						let currentSourceShortestPath = [];
						let currentSource = null;
						
						for (const schema of unitedShortestPath) {
							if (currentSource != null && currentSource != schema.source) {
								separatedSourceShortestPath.push(currentSourceShortestPath);
								currentSourceShortestPath = [];
								currentSource = null;
							}
							
							currentSourceShortestPath.push(schema);
							currentSource = schema.source;
						}
						
						separatedSourceShortestPath.push(currentSourceShortestPath);
						
						for (const [index, shortestPath] of separatedSourceShortestPath.entries()) {
							if (shortestPath.length == 0) {
								flag = false;
								break;
							}
							
							const last = shortestPath[shortestPath.length - 1];
	      			const nextShortestPath = separatedSourceShortestPath[index + 1] || null;
	      			let targetEntity;
							const isLastGroup = (index == separatedSourceShortestPath.length - 1);
							let previousGroup = null;
	      			
	      			if (nextShortestPath) {
	      				targetEntity = nextShortestPath[0].relations[last.group].sourceEntity;
	      			} else {
	      				targetEntity = finalEntity;
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
								for (const key in referencings) {
		      				if (referencings.hasOwnProperty(key)) {
										if ((from.keys.hasOwnProperty(key) || from.columns.hasOwnProperty(key)) && !!referencings[key]) {
											WHERE_CLAUSE.push(`${from.group}.${key} = ?`);
											VALUES.push(referencings[key]);
										}
		      				}
								}
								
								if (WHERE_CLAUSE.length == 0) throw new Error('P1 Error: must have at least one condition.');
								
								const COMMAND = `SELECT * FROM ${shortestPath[shortestPath.length - 1].group} ${INNER_JOIN.join(' ')} WHERE ${WHERE_CLAUSE.join(' AND ')} LIMIT 1`;
								
			      		const cachedPermissionMD5Key = session.id + Md5.init(JSON.stringify([COMMAND, finalValue]));
								// TODO: find the proper way to cache.
			      		// if (!!cachedPermissions[cachedPermissionMD5Key]) {
			      		// 	flag = (cachedPermissions[cachedPermissionMD5Key] == '__TRUE__');
			      		//	 continue;
			      		// }
								
								referencings = await RelationalDatabaseClient.query(COMMAND, {replacements: VALUES, transaction: transaction && transaction.relationalDatabaseTransaction || undefined});
								referencings = referencings && referencings[0] && referencings[0][0] || null;
								previousGroup = shortestPath[shortestPath.length - 1].group;
								
								if (process.env.debug) console.log(JSON.stringify(['referencings', 'SourceType.Relational', referencings]));
								
								if (referencings == null) {
									// TODO: find the proper way to cache.
			      			// cachedPermissions[cachedPermissionMD5Key] = '__FALSE__';
			      			flag = false;
			      			break;
			      		} else if (!cachedPermissions[cachedPermissionMD5Key]) {
			      			if (index == separatedSourceShortestPath.length - 1) {
			      				flag = (finalValue == referencings[targetEntity]);
			      			}
			      			
									// TODO: find the proper way to cache.
									// cachedPermissions[cachedPermissionMD5Key] = (!flag) ? '__FALSE__' : '__TRUE__';
			      		}
			      	} else {
		      			const cachedPermissionMD5Key = session.id + Md5.init(JSON.stringify([shortestPath, finalValue]));
								// TODO: find the proper way to cache.
								// if (!!cachedPermissions[cachedPermissionMD5Key]) {
			      		//	 flag = (cachedPermissions[cachedPermissionMD5Key] == '__TRUE__');
			      		//	 continue;
			      		// }
			      		
			      		for (let i=0; i < shortestPath.length; i++) {
			      			const current = shortestPath[i];
			      			const data = {};
			      			
			      			if (previousGroup != null) {
				      			for (const key in referencings) {
				      				if (referencings.hasOwnProperty(key)) {
												if (current.relations[previousGroup].targetEntity == key && !!referencings[key]) {
													data[`${current.group}.${current.relations[previousGroup].sourceEntity}`] = referencings[key].toString();
												}
				      				}
										}
										
										const baseSchema = ProjectConfigurationHelper.getDataSchema().tables[current.group];
										const query = RequestHelper.createInputs(data);
										const dataset = {};
										await DatabaseHelper.performRecursiveRetrieve(
											DatabaseHelper.prepareData(query, ActionType.Retrieve, baseSchema)[current.group],
											baseSchema,
											dataset,
											session,
											false,
											true,
											transaction
										);
										
										if (dataset[current.group].rows.length == 0) {
											referencings = null;
											break;
										} else {
											referencings = Object.assign({}, dataset[current.group].rows[0].columns, dataset[current.group].rows[0].keys);
										}
									}
									
									previousGroup = current.group;
			      		}
								
								if (process.env.debug) console.log(JSON.stringify(['referencings', 'SourceType.Others', referencings]));
								
			      		if (referencings == null) {
									// TODO: find the proper way to cache.
			      			// cachedPermissions[cachedPermissionMD5Key] = '__FALSE__';
			      			flag = false;
			      			break;
			      		} else if (!cachedPermissions[cachedPermissionMD5Key]) {
			      			if (index == separatedSourceShortestPath.length - 1) {
			      				flag = (finalValue == referencings[targetEntity]);
			      			}
			      			
									// TODO: find the proper way to cache.
									// cachedPermissions[cachedPermissionMD5Key] = (!flag) ? '__FALSE__' : '__TRUE__';
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
			
			if (action == ActionType.Retrieve && !!schema.retrievingPermission) {
				return true;
			} else if (action != ActionType.Retrieve && !!schema.modifyingPermission) {
				return true;
			}
			
			for (const key in schema.keys) {
				if (action == ActionType.Retrieve && !!schema.keys[key].retrievingPermission) {
					return true;
				} else if (action != ActionType.Retrieve && !!schema.keys[key].modifyingPermission) {
					return true;
				}
			}
			for (const key in schema.columns) {
				if (action == ActionType.Retrieve && !!schema.columns[key].retrievingPermission) {
					return true;
				} else if (action != ActionType.Retrieve && !!schema.columns[key].modifyingPermission) {
					return true;
				}
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