// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow} from '../../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from '../../helpers/ProjectConfigurationHelper';
import {SchemaHelper, DataTableSchema} from '../../helpers/SchemaHelper';
import {Base as $Base} from '../Base';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

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
  constructor(SchemaHelper.getSchemaFromKey('Employee'), SchemaHelper.getSchemaFromKey('Queue')) {
  	super();
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected setup() {
  	// Place your custom setup here (singleton):
  	//
    
	}
  
  // Auto[MergingBegin]--->  
  private initialize(): void {
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  this.register(ActionType.Insert, SchemaHelper.getSchemaFromKey('Employee'), this.onConnectionSourceInsert_02699134);

	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[onConnectionSourceInsert_02699134:Begin]--->
  protected async onConnectionSourceInsert_02699134(event: Event) {
    // <---Auto[onConnectionSourceInsert_02699134:Begin]
    // Place your custom manipulation here:
    // 
    // const customEvent: CustomEvent = event as CustomEvent;
    // const source: DataTableSchema = customEvent.detail.source;    					/* source of relation */
    // const target: DataTableSchema = customEvent.detail.target;    					/* target of relation */
    // const rows: HierarchicalDataRow[] = customEvent.detail.rows;    				/* data in-between */
    // const transaction: any = customEvent.detail.transaction;    						/* transaction context */
    // const crossRelationUpsert: boolean = customEvent.detail.crossRelationUpsert;    /* upsert for the next manipulation */
    // const session: any = customEvent.detail.session;    										/* request session */
    // const leavePermission: boolean = customEvent.detail.leavePermission;  	/* override permission */
    // const innerCircleTags: string[] = customEvent.detail.innerCircleTags;  /* circle tags */
    //
    
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