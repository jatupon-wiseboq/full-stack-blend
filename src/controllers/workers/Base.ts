// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable, ActionType} from "../helpers/DatabaseHelper";

class Base {
	protected iterations: any[] = [];
	
	constructor(data: HierarchicalDataTable) {
		this.initialize(data);
	  this.setup();
	  for (const parameters of this.iterations) {
      this.perform(parameters);
    }
  }
  
	protected register() {
		void(0);
	}
	
	protected initialize(data: HierarchicalDataTable) {
		void(0);
	}
	
	protected setup() {
		void(0);
	}
	
	protected perform(parameters) {
		void(0);
	}
}

export {Base};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.