// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataRow, ActionType} from "../helpers/DatabaseHelper";
import {DataTableSchema} from "../helpers/SchemaHelper";

const dictionary: {[Identifier: string]: (Event) => Promise<HierarchicalDataRow[]>} = {};

class Base {
	private source: DataTableSchema = null;
	private target: DataTableSchema = null;

	constructor(source: DataTableSchema, target: DataTableSchema) {
		this.source = source;
		this.target = target;
		
		this.setup();
  }
  
	protected register(action: ActionType, source: DataTableSchema, method: (Event) => Promise<HierarchicalDataRow[]>) {
  	if (source.group == this.source.group) {
  		dictionary[`${this.source.guid}:${this.target.guid}:${action}`] = method;
  	} else {
  		dictionary[`${this.target.guid}:${this.source.guid}:${action}`] = method;
  	}
	}
	
	protected setup() {
		void(0);
	}
	
	static async perform(action: ActionType, source: DataTableSchema, target: DataTableSchema, rows: HierarchicalDataRow[], transaction: any, crossRelationUpsert: boolean, session: any, leavePermission: boolean, innerCircleTags: string[]): Promise<HierarchicalDataRow[]> {
		let type: string = null;
		switch (action) {
			case ActionType.Insert:
				type = 'Insert';
				break;
			case ActionType.Update:
				type = 'Update';
				break;
			case ActionType.Upsert:
				type = 'Upsert';
				break;
			case ActionType.Delete:
				type = 'Delete';
				break;
			case ActionType.Retrieve:
				type = 'Retrieve';
				break;
			default:
				throw new Error('Wrong of an action.');
		}
		
		const event = new CustomEvent(type, {
			detail: {
				source: source,
				target: target,
				rows: rows,
				transaction: transaction,
				crossRelationUpsert: crossRelationUpsert,
				session: session,
				leavePermission: leavePermission,
				innerCircleTags: innerCircleTags
			}
		});
		
		return await dictionary[`${source.guid}:${target.guid}:${action}`](event);
	}
}

export {Base};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.