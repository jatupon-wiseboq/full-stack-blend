// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->

import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, DatabaseHelper} from './../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from './../helpers/ProjectConfigurationHelper';
import {RequestHelper} from './../helpers/RequestHelper';
import {SchemaHelper, DataTableSchema} from './../helpers/SchemaHelper';
import {Base as $Base} from './Base';

// Assign to an another one to override the base class.
// 
let Base: typeof $Base = $Base;

// <---Auto[Import]

// Import additional modules here:
//

// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
enum ActionType {
  Insert,
  Update,
  Upsert,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}*/
// <---Auto[Declare]

// Declare private static variables here:
//

// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
}*/
// <---Auto[Interface]

// Declare or extend interfaces here:
//

// Auto[ClassBegin]--->
class Connector extends Base {
  constructor() {
  	super(SchemaHelper.getSchemaFromKey('Employee'), SchemaHelper.getSchemaFromKey('Queue'));
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected setup() {
  	// Place your custom setup here (singleton):
  	//
    
	}
  
  // Auto[MergingBegin]--->  
  protected initialize(): void {
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  this.register(ActionType.Insert, SchemaHelper.getSchemaFromKey('Employee'), this.onConnectionSourceInsert_02699134);

	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[onConnectionSourceInsert_02699134:Begin]--->
  protected async onConnectionSourceInsert_02699134(info: any): Promise<HierarchicalDataRow[]> {
    // <---Auto[onConnectionSourceInsert_02699134:Begin]
    // Place your custom manipulation here:
    // 
    // const source: DataTableSchema = info.source;    					/* source of relation */
    // const target: DataTableSchema = info.target;    					/* target of relation */
    // const rows: HierarchicalDataRow[] = info.rows;    				/* data in-between */
    // const transaction: any = info.transaction;    						/* transaction context */
    // const crossRelationUpsert: boolean = info.crossRelationUpsert;    /* upsert for the next manipulation */
    // const session: any = info.session;    										/* request session */
    // const leavePermission: boolean = info.leavePermission;  	/* override permission */
    // const innerCircleTags: string[] = info.innerCircleTags;  /* circle tags */
    //
    
    return rows;
    
    // Auto[onConnectionSourceInsert_02699134:End]--->
  }
  // <---Auto[onConnectionSourceInsert_02699134:End]

  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]

// Export variables here:
//
export default Connector;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.