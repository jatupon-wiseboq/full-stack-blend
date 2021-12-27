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
  constructor(SchemaHelper.getSchemaFromKey('undefined'), SchemaHelper.getSchemaFromKey('undefined')) {
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

	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]

// Export variables here:
//
export default Connector;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.