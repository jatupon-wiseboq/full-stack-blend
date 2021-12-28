// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataRow, ActionType} from "../helpers/DatabaseHelper";
import {DataTableSchema} from "../helpers/SchemaHelper";
import {Base as Connector} from '../connectors/Base';

const ActionHelper = {
  register: <T extends Connector>(connector: new () => T) => {
  	new connector();
  },
  perform: async (action: ActionType, source: DataTableSchema, target: DataTableSchema, rows: HierarchicalDataRow[], transaction: any, crossRelationUpsert: boolean, session: any, leavePermission: boolean, innerCircleTags: string[]): Promise<HierarchicalDataRow[]> => {
  	return await Connector.perform(action, source, target, rows, transaction, crossRelationUpsert, session, leavePermission, innerCircleTags);
  }
};

export {ActionHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.