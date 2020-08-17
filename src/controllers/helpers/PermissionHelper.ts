// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {ActionType} from "./DatabaseHelper.js";
import {DataTableSchema, DataColumnSchema} from "./SchemaHelper.js";

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
	validate: (action: ActionType, schema: DataTableSchema): boolean => {
		return true;
	},
	allow: (schema: DataColumnSchema): boolean => {
		return true;
	}
};

export {Permission, PermissionHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.