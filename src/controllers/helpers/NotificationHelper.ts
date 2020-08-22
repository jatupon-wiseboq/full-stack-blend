// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {CodeHelper} from "./CodeHelper.js";
import {DataTableSchema} from "./SchemaHelper.js";
import {ActionType, HierarchicalDataRow} from "./DatabaseHelper.js";
import {socket} from "../../app.js";
import {Md5} from "md5-typescript";

const notificationInfos = {};

const NotificationHelper = {
  getTableUpdatingIdentity: (schema: DataTableSchema, query: any): string => {
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
  	
  	notificationInfos[schema.group][md5OfServerTableUpdatingIdentity]["combinations"][md5OfClientTableUpdatingIdentity] = true;
  	
  	return md5OfClientTableUpdatingIdentity;
  },
  getUniqueListOfIdentities: (schema: DataTableSchema, results: HierarchicalDataRow[]): {[Identifier: string]: HierarchicalDataRow[]} => {
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
  					identities[md5OfClientTableUpdatingIdentity] = identities[md5OfClientTableUpdatingIdentity] || [];
  					identities[md5OfClientTableUpdatingIdentity].push(clonedResult);
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
		  			socket.emit("insert", {
		  				id: identity,
		  				results: identities[identity]
		  			});
		  		}
	  		}
  			break;
  		case ActionType.Update:
  			for (const identity in identities) {
	  			if (identities.hasOwnProperty(identity)) {
		  			socket.emit("update", {
		  				id: identity,
		  				results: identities[identity]
		  			});
		  		}
	  		}
  			break;
  		case ActionType.Upsert:
  			for (const identity in identities) {
	  			if (identities.hasOwnProperty(identity)) {
		  			socket.emit("upsert", {
		  				id: identity,
		  				results: identities[identity]
		  			});
		  		}
	  		}
  			break;
  		case ActionType.Delete:
  			for (const identity in identities) {
	  			if (identities.hasOwnProperty(identity)) {
		  			socket.emit("delete", {
		  				id: identity,
		  				results: identities[identity]
		  			});
		  		}
	  		}
  			break;
  	}
  }
};

export {NotificationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.