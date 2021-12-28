// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
/* eslint-disable @typescript-eslint/camelcase */

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
class Worker extends Base {
  constructor(data: HierarchicalDataTable) {
  	super(data);
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected setup() {
  	// Place your custom setup here (instantaneous):
  	//
  	
	}
	
  protected perform(parameters: any[]) {
  	// Place your custom setup here (instantaneous):
  	//
    
	}
  
  // Auto[MergingBegin]--->  
  private initialize(data: HierarchicalDataTable): void {
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
    let count = 0;
    let value = undefined;
    for (const [index, row] of data.rows.entries()) {
      this.iterations[index] = this.iterations[index] || [];
      value = undefined;
      
      if (row.keys.hasOwnProperty('eid')) {
        value = row.keys['eid'];
      } else if (row.columns.hasOwnProperty('eid')) {
        value = row.columns['eid'];
      }
    
      // Override data parsing and manipulation of Parameter 1 here:
      // 
      
      this.iterations[index][count] = value;
      count += 1;
      value = undefined;
      
      if (row.keys.hasOwnProperty('message')) {
        value = row.keys['message'];
      } else if (row.columns.hasOwnProperty('message')) {
        value = row.columns['message'];
      }
    
      // Override data parsing and manipulation of Parameter 2 here:
      // 
      
      this.iterations[index][count] = value;
      count += 1;

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
export default Worker;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.