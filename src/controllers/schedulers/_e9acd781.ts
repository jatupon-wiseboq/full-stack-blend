// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->

import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, DatabaseHelper} from './../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from './../helpers/ProjectConfigurationHelper';
import {RequestHelper} from './../helpers/RequestHelper';
import {SchemaHelper, DataTableSchema} from './../helpers/SchemaHelper';
import {SchedulerHelper} from './../helpers/SchedulerHelper';
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
class Scheduler extends Base {
  constructor() {
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
  protected initialize() {
  	let days: number = 0;
  	let minutes: number = 0;
  	let delegate: () => Promise<void> = null;
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->

		days = 42;
		minutes = 720;
		delegate = null;
		
    if (days != 0) {
    
      // Override data parsing and manipulation of Timing 2 here:
      // 
      
      if (delegate != null) SchedulerHelper.scheduling(days, minutes, delegate);
    }

	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]

// Export variables here:
//
export default Scheduler;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.