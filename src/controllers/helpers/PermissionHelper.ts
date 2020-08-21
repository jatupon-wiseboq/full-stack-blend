// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {ActionType} from "./DatabaseHelper.js";
import {DataTableSchema, DataColumnSchema, DataSchema, SchemaHelper} from "./SchemaHelper.js";
import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper.js";
import {RelationalDatabaseClient} from "./ConnectionHelper.js";

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
		if (action == ActionType.Insert || action == ActionType.Upsert) {
			if (schema.modifyingPermission && schema.modifyingPermission.mode == "relation" && schema.modifyingPermission.relationModeSourceGroup != schema.group) {
				if (await !PermissionHelper.allowPermission(schema.modifyingPermission, schema, modifyingColumns, session, data)) return false;
			}
		} else {
			if (await !PermissionHelper.allowPermission((action == ActionType.Retrieve) ? schema.retrievingPermission : schema.modifyingPermission, schema, modifyingColumns, session, data)) return false;
			
			for (const key in schema.keys) {
				if (schema.keys.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
					if (await !PermissionHelper.allowPermission((action == ActionType.Retrieve) ? schema.keys[key].retrievingPermission : schema.keys[key].modifyingPermission, schema, modifyingColumns, session, data)) return false;
				}
			}
			for (const key in schema.columns) {
				if (schema.columns.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
					if (await !PermissionHelper.allowPermission((action == ActionType.Retrieve) ? schema.columns[key].retrievingPermission : schema.columns[key].modifyingPermission, schema, modifyingColumns, session, data)) return false;
				}
			}
		}
		
		return true;
	},
	allowOutputOfColumn: async (column: DataColumnSchema, schema: DataTableSchema, modifyingColumns: any, session: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		return PermissionHelper.allowPermission(column.retrievingPermission, schema, modifyingColumns, session, data);
	},
	allowPermission: async (permission: Permission, target: DataTableSchema, modifyingColumns, session: any=null, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Promise<boolean> => {
		if (permission == null) return true;
		
		switch (permission.mode) {
			case "relation":
				const shortestPath = SchemaHelper.findShortestPathOfRelations(target, data.tables[permission.relationModeSourceGroup], data);
				let value;
				
				switch (permission.relationMatchingMode) {
					case "session":
						if (session == null) throw new Error("There was an error authorizing a permission (the request session variable was null).");
						value = session[permission.relationMatchingSessionName];
						break;
					default:
						value = permission.relationMatchingConstantValue;
						break;
				}
				
				return await new Promise((resolve, reject) => {
					const INNER_JOIN = [];
					const WHERE_CLAUSE = [];
					const VALUES = [];
					
					let current = shortestPath[0];
					for (let i=1; i<shortestPath.length; i++) {
						const next = shortestPath[i];
						
						INNER_JOIN.push(`INNER JOIN ${next.group} ON ${current.group}.${current.relations[next.group].sourceEntity} = ${next.group}.${current.relations[next.group].targetEntity}`);
						
						current = next;
					}
					
					WHERE_CLAUSE.push(`CONVERT(${permission.relationModeSourceGroup}.${permission.relationModeSourceEntity}, char) = CONVERT(?, char)`);
					VALUES.push(value);
					
					const from = shortestPath[shortestPath.length - 1];
					for (const key in from.keys) {
						if (from.keys.hasOwnProperty(key) && modifyingColumns[key] !== undefined) {
							WHERE_CLAUSE.push(`${from.group}.${key} = ?`);
							VALUES.push(modifyingColumns[key]);
						}
					}
					
					const COMMAND = `SELECT * FROM ${permission.relationModeSourceGroup} ${INNER_JOIN.join(" ")} WHERE ${WHERE_CLAUSE.join(" AND ")} LIMIT 1`;
      		console.log(COMMAND);
					
					RelationalDatabaseClient.query(COMMAND, VALUES, (function(error, results, fields) {
            if (error) {
              reject(error);
      			} else if (results.length > 0) {
      			  resolve(true);
      			} else {
      			  resolve(false);
      			}
      		}).bind(this));
				});
				
				break;
			case "session":
				if (session == null) throw new Error("There was an error authorizing a permission (the request session variable was null).");
				return (session[permission.sessionMatchingSessionName] == permission.sessionMatchingConstantValue);
			default:
				return true;
		}
	},
};

export {Permission, PermissionHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.