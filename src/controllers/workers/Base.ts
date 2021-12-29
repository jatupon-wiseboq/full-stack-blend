// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable, ActionType} from "../helpers/DatabaseHelper";

class Base {
	protected iterations: any[] = [];
	
	constructor(data: HierarchicalDataTable) {
		this.setup();
		this.initialize(data);
  }
  
	protected setup() {
		void(0);
	}
	
	protected initialize(data: HierarchicalDataTable) {
		void(0);
	}
	
	protected async run(): Promise<void> {
		for (const parameters of this.iterations) {
      await this.perform(parameters);
    }
	}
	
	protected async perform(parameters: any[]): Promise<void> {
		void(0);
	}
}

export {Base};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.