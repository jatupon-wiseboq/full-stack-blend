// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {CodeHelper} from "./CodeHelper";
import {DataTableSchema, SchemaHelper} from "./SchemaHelper";
import {ActionType, HierarchicalDataRow} from "./DatabaseHelper";
import {socket} from "../../server";
import {Md5} from "md5-typescript";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const notificationInfos = {};
const sessionLookupTable: {[Identifier: string]: any[]} = {};

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

socket.sockets.on("connection", (socket) => {
	const req: any = {headers: socket.handshake.headers};
	const parser = cookieParser(process.env.SESSION_SECRET);
	
	parser(req, {}, () => {});
	
  const sessionId = req.signedCookies["connect.sid"];
	if (!sessionId) return;
  
  const setSocket = (sockets: any[]): boolean => {
  	let hasState: boolean = false;
  	
  	for (const group in notificationInfos) {
	  	if (notificationInfos.hasOwnProperty(group)) {
	  		const notificationInfo = notificationInfos[group];
	  		
	  		for (const md5OfServerTableUpdatingIdentity in notificationInfo) {
			  	if (notificationInfo.hasOwnProperty(md5OfServerTableUpdatingIdentity)) {
	  				const combinations = notificationInfo[md5OfServerTableUpdatingIdentity].combinations;
	  				
	  				for (const md5OfClientTableUpdatingIdentity in combinations) {
					  	if (combinations.hasOwnProperty(md5OfClientTableUpdatingIdentity)) {
			  				const combinationInfo = combinations[md5OfClientTableUpdatingIdentity];
			  				
			  				if (combinationInfo.hasOwnProperty(sessionId)) {
			  					if (sockets != null) {
				  					if (combinationInfo[sessionId] === false) {
				  						setSocket(null);
				  						return false;
				  					} else {
				  						for (const socket of sockets) {
				  							if (Array.isArray(combinationInfo[sessionId])) {
						  						for (const item of combinationInfo[sessionId]) {
						  							switch (item.action) {
												  		case ActionType.Insert:
												  			socket.emit("insert_" + md5OfClientTableUpdatingIdentity, {
												  				id: md5OfClientTableUpdatingIdentity,
												  				results: item.results
												  			});
												  			break;
												  		case ActionType.Update:
												  			socket.emit("update_" + md5OfClientTableUpdatingIdentity, {
												  				id: md5OfClientTableUpdatingIdentity,
												  				results: item.results
												  			});
												  			break;
												  		case ActionType.Upsert:
												  			socket.emit("upsert_" + md5OfClientTableUpdatingIdentity, {
												  				id: md5OfClientTableUpdatingIdentity,
												  				results: item.results
												  			});
												  			break;
												  		case ActionType.Delete:
												  			socket.emit("delete_" + md5OfClientTableUpdatingIdentity, {
												  				id: md5OfClientTableUpdatingIdentity,
												  				results: item.results
												  			});
												  			break;
												  	}
						  						}
						  					}
				  						}
					  					
				  						hasState = true;
							  		combinationInfo[sessionId] = sockets && {sockets: [...sockets]} || null;
				  					}
				  				} else {
				  					combinationInfo[sessionId] = null;
				  				}
						  	}
					  	}
					  }
			  	}
			  }
	  	}
	  }
	  
	  return hasState;
  };
  
  if (!sessionLookupTable[sessionId] || sessionLookupTable[sessionId].indexOf(socket) == -1) {
  	sessionLookupTable[sessionId] = sessionLookupTable[sessionId] || [];
  	sessionLookupTable[sessionId].push(socket);
  }
  if (!setSocket(sessionLookupTable[sessionId])) {
  	for (const socket of sessionLookupTable[sessionId]) {
  		socket.emit("command", "refresh");
  	}
  }
  
  socket.on("disconnect", (socket) => {
  	if (!socket.connected) {
  		const index = sessionLookupTable[sessionId] && sessionLookupTable[sessionId].indexOf(socket) || -1;
  		if (index != -1) {
  			sessionLookupTable[sessionId].splice(index, 1);
  		}
  		
  		if (!sessionLookupTable[sessionId] || sessionLookupTable[sessionId].length == 0) {
  			sessionLookupTable[sessionId] = null;
  			setSocket(null);
  		} else {
  			setSocket(sessionLookupTable[sessionId]);
  		}
	  }
  });
  
  socket.on("reconnect", (socket) => {
  	if (!sessionLookupTable[sessionId] || sessionLookupTable[sessionId].indexOf(socket) == -1) {
	  	sessionLookupTable[sessionId] = sessionLookupTable[sessionId] || [];
  		sessionLookupTable[sessionId].push(socket);
	  }
  	setSocket(sessionLookupTable[sessionId]);
  });
});

const NotificationHelper = {
  getTableUpdatingIdentity: (schema: DataTableSchema, query: any, session: any): string => {
  	if (!session) return null;
  	
  	notificationInfos[schema.group] = notificationInfos[schema.group] || {};
  	
  	const sortedCombinationKeys = [];
  	const sortedCustomQueryValues = [];
  	
  	for (const key in query) {
  		if (query.hasOwnProperty(key)) {
  			sortedCombinationKeys.push(key);
  			sortedCustomQueryValues.push(key + ":" + query[key]);
  		}
  	}
  	
  	sortedCombinationKeys.sort();
  	sortedCustomQueryValues.sort();
  	
  	const serverTableUpdatingIdentity = sortedCombinationKeys.join("+");
  	const md5OfServerTableUpdatingIdentity = Md5.init(serverTableUpdatingIdentity);
  	
  	notificationInfos[schema.group][md5OfServerTableUpdatingIdentity] = notificationInfos[schema.group][md5OfServerTableUpdatingIdentity] || {
  		keys: sortedCombinationKeys,
  		combinations: {}
  	};
  	
  	const clientTableUpdatingIdentity = [schema.group, ...sortedCustomQueryValues].join();
  	const md5OfClientTableUpdatingIdentity = Md5.init(clientTableUpdatingIdentity);
  	
  	const combinations = notificationInfos[schema.group][md5OfServerTableUpdatingIdentity]["combinations"];
  	
  	combinations[md5OfClientTableUpdatingIdentity] = combinations[md5OfClientTableUpdatingIdentity] || {};
  	
  	const combinationInfo = combinations[md5OfClientTableUpdatingIdentity];
  	
  	if (!combinationInfo.hasOwnProperty(session.id)) {
  		combinationInfo[session.id] = sessionLookupTable[session.id] && [...sessionLookupTable[session.id]] || null;
  	}
  	
  	return md5OfClientTableUpdatingIdentity;
  },
  getUniqueListOfIdentities: (action: ActionType, schema: DataTableSchema, results: HierarchicalDataRow[]): {[Identifier: string]: {sessions: string[]; listeners: any; results: HierarchicalDataRow[]}} => {
  	const notificationInfo = notificationInfos[schema.group] || {};
  	const identities = {};
  	
  	for (const md5OfServerTableUpdatingIdentity in notificationInfo) {
  		if (notificationInfo.hasOwnProperty(md5OfServerTableUpdatingIdentity)) {
  			const keys = notificationInfo[md5OfServerTableUpdatingIdentity].keys;
  			const combinations = notificationInfo[md5OfServerTableUpdatingIdentity].combinations;
  			
  			for (const result of results) {
  				const clonedResult = CodeHelper.clone(result);
  				const sortedCustomQueryValues = [];
  				
  				for (const key of keys) {
  					if (schema.keys[key]) {
  						sortedCustomQueryValues.push(key + ":" + clonedResult.keys[key]);
  					}
  					if (schema.columns[key]) {
  						sortedCustomQueryValues.push(key + ":" + clonedResult.columns[key]);
  					}
  				}
  				
  				sortedCustomQueryValues.sort();
  				
  				for (const key in schema.keys) {
  					if (schema.keys.hasOwnProperty(key)) {
		  				if (schema.keys[key] && schema.keys[key].retrievingPermission) {
		  					clonedResult.keys[key] = null;
		  				}
		  			}
  				}
  				for (const key in schema.columns) {
  					if (schema.columns.hasOwnProperty(key)) {
		  				if (schema.columns[key] && schema.columns[key].retrievingPermission) {
		  					clonedResult.columns[key] = null;
		  				}
		  			}
  				}
  				
  				const clientTableUpdatingIdentity = [schema.group, ...sortedCustomQueryValues].join();
  				const md5OfClientTableUpdatingIdentity = Md5.init(clientTableUpdatingIdentity);
  				
  				if (combinations[md5OfClientTableUpdatingIdentity]) {
  					identities[md5OfClientTableUpdatingIdentity] = identities[md5OfClientTableUpdatingIdentity] || {
  						sessions: [],
  						listeners: [],
  						results: []
  					};
  					
  					const combinationInfo = combinations[md5OfClientTableUpdatingIdentity];
  					const identitiesInfo = identities[md5OfClientTableUpdatingIdentity];
  					
  					for (const sessionId in combinationInfo) {
  						if (combinationInfo.hasOwnProperty(sessionId)) {
  							if (combinationInfo[sessionId] === false) {
  								// Force refresh
  								//
  							}
  							else if (combinationInfo[sessionId] != null && !Array.isArray(combinationInfo[sessionId])) {
  								identitiesInfo.sessions.push(sessionId);
  								for (const socket of combinationInfo[sessionId].sockets) {
  									identitiesInfo.listeners.push(socket);
  								}
  							} else {
  								// For socket initializing delay
  								//
  								if (combinationInfo[sessionId] == null) combinationInfo[sessionId] = [];
  								if (combinationInfo[sessionId].length < 128) {
	  								combinationInfo[sessionId].push({
	  									action: action,
	  									results: clonedResult
	  								});
	  							} else {
	  								combinationInfo[sessionId] = false;
	  							}
  							}
  						}
  					}
  					identitiesInfo.results.push(clonedResult);
  				}
  			}
  		}
  	}
  	
  	return identities;
  },
  recursiveTagDerivableSubsequenceNotification: (baseSchema: DataTableSchema, results: any, sessionId: string) => {
  	for (const result of results) {
			for (const group in result.relations) {
				if (result.relations.hasOwnProperty(group)) {
					const firstRow = result.relations[group].rows[0];
					if (!firstRow) continue;
					
					const nextSchema = SchemaHelper.getDataTableSchemaFromNotation(group);
					const query = {};
					const targetEntity = baseSchema.relations[nextSchema.group].targetEntity;
					
					if (firstRow.columns[targetEntity]) query[targetEntity] = firstRow.columns[targetEntity];
					if (firstRow.keys[targetEntity]) query[targetEntity] = firstRow.keys[targetEntity];
					
					console.log(baseSchema.group, nextSchema.group, targetEntity, sessionId);
					
					if (Object.keys(query).length != 0) {
						result.relations[group].notification = NotificationHelper.getTableUpdatingIdentity(nextSchema, query, {id: sessionId});
					}
					
					NotificationHelper.recursiveTagDerivableSubsequenceNotification(nextSchema, result.relations[group].rows, sessionId);
				}
			}
		}
  },
  notifyUpdates: (action: ActionType, schema: DataTableSchema, results: HierarchicalDataRow[]): string => {
  	if (socket == null) return;
  	
  	const identities = NotificationHelper.getUniqueListOfIdentities(action, schema, results);
  	
  	for (const identity in identities) {
			if (identities.hasOwnProperty(identity)) {
				for (const sessionId of identities[identity].sessions) {
					NotificationHelper.recursiveTagDerivableSubsequenceNotification(schema, identities[identity].results, sessionId);
		  	}
			}
  	}
  	
  	switch (action) {
  		case ActionType.Insert:
  			for (const identity in identities) {
  				if (identities.hasOwnProperty(identity)) {
  					for (const socket of identities[identity].listeners) {
  						socket.emit("insert_" + identity, {
			  				id: identity,
			  				results: identities[identity].results
			  			});
  					}
		  		}
	  		}
  			break;
  		case ActionType.Update:
  			for (const identity in identities) {
	  			if (identities.hasOwnProperty(identity)) {
	  				for (const socket of identities[identity].listeners) {
  						socket.emit("update_" + identity, {
			  				id: identity,
			  				results: identities[identity].results
			  			});
			  		}
		  		}
	  		}
  			break;
  		case ActionType.Upsert:
  			for (const identity in identities) {
	  			if (identities.hasOwnProperty(identity)) {
		  			for (const socket of identities[identity].listeners) {
  						socket.emit("upsert_" + identity, {
			  				id: identity,
			  				results: identities[identity].results
		  				});
		  			}
		  		}
	  		}
  			break;
  		case ActionType.Delete:
  			for (const identity in identities) {
	  			if (identities.hasOwnProperty(identity)) {
		  			for (const socket of identities[identity].listeners) {
  						socket.emit("delete_" + identity, {
			  				id: identity,
			  				results: identities[identity].results
		  				});
		  			}
		  		}
	  		}
  			break;
  	}
  }
};

export {NotificationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.