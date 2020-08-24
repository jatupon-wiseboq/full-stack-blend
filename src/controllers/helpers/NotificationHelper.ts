// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {CodeHelper} from "./CodeHelper.js";
import {DataTableSchema} from "./SchemaHelper.js";
import {ActionType, HierarchicalDataRow} from "./DatabaseHelper.js";
import {socket} from "../../app.js";
import {Md5} from "md5-typescript";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const notificationInfos = {};
const reverseLookupTable = {};

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

socket.sockets.on("connection", (socket) => {
	const req = {headers: socket.handshake.headers};
	const parser = cookieParser(process.env.SESSION_SECRET);
	
	parser(req, {}, () => {});
	
  const sessionId = req.signedCookies['connect.sid'];
  
	if (reverseLookupTable.hasOwnProperty(sessionId)) {
		for (const combinationInfo of reverseLookupTable[sessionId]) {
			combinationInfo[sessionId] = socket.id;
		}
		
		socket.on("disconnect", (socket) => {
			for (const combinationInfo of reverseLookupTable[sessionId]) {
				delete combinationInfo[sessionId];
			}
			delete reverseLookupTable[sessionId];
		});
	}
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
  		combinationInfo[session.id] = null;
  		
  		reverseLookupTable[session.id] = reverseLookupTable[session.id] || [];
  		reverseLookupTable[session.id].push(combinationInfo);
  	}
  	
  	return md5OfClientTableUpdatingIdentity;
  },
  getUniqueListOfIdentities: (schema: DataTableSchema, results: HierarchicalDataRow[]): {[Identifier: string]: {listeners: string; results: HierarchicalDataRow[]}} => {
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
  						listeners: [],
  						results: []
  					};
  					
  					const combinationInfo = combinations[md5OfClientTableUpdatingIdentity];
  					const identitiesInfo = identities[md5OfClientTableUpdatingIdentity];
  					
  					for (const sessionId in combinationInfo) {
  						if (combinationInfo.hasOwnProperty(sessionId)) {
  							if (combinationInfo[sessionId] != null) {
  								identitiesInfo.listeners.push(combinationInfo[sessionId]);
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
  notifyUpdates: (action: ActionType, schema: DataTableSchema, results: HierarchicalDataRow[]): string => {
  	if (socket == null) return;
  	
  	const identities = NotificationHelper.getUniqueListOfIdentities(schema, results);
  	
  	switch (action) {
  		case ActionType.Insert:
  			for (const identity in identities) {
  				if (identities.hasOwnProperty(identity)) {
  					for (const socketId of identities[identity].listeners) {
  						socket.sockets.sockets[socketId] && socket.sockets.sockets[socketId]
  							.emit("insert_" + identity, {
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
	  				for (const socketId of identities[identity].listeners) {
  						socket.sockets.sockets[socketId] && socket.sockets.sockets[socketId]
  							.emit("update_" + identity, {
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
		  			for (const socketId of identities[identity].listeners) {
  						socket.sockets.sockets[socketId] && socket.sockets.sockets[socketId]
  							.emit("upsert_" + identity, {
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
		  			for (const socketId of identities[identity].listeners) {
  						socket.sockets.sockets[socketId] && socket.sockets.sockets[socketId]
  							.emit("delete_" + identity, {
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