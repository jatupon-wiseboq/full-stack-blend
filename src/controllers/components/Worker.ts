// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable} from "../helpers/DatabaseHelper";

class Worker {
	protected iterations: any[] = [];
	
	constructor(data: HierarchicalDataTable) {
		this.initialize(data);
	  this.setup();
	  for (const parameters of this.iterations) {
      this.perform.apply(this, parameters);
    }
  }
  
	protected register(action: ActionType, source: DataTableSchema, method: (Event) => Promise<any>) {
  	if (source.group == this.source.group) {
  		dictionary[`${this.source.guid}:${this.target.guid}:${action}`] = method;
  	} else {
  		dictionary[`${this.target.guid}:${this.source.guid}:${action}`] = method;
  	}
	}
	
	protected setup() {
	}
	
	protected perform() {
	}
}

export {Worker};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.