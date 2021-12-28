// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable} from "../helpers/DatabaseHelper";
import {Base as Worker} from '../workers/Base';
import {queue} from '../../server';

const dictionary: {[Identifier: string]: any} = {};

const WorkerHelper = {
  register: <T extends Worker>(worker: new () => T, name: string) => {
  	dictionary[name] = worker;
  },
  enqueue: (table: HierarchicalDataTable) => {
  	queue.enqueue("general", "perform", [table]);
  },
  perform: async (table: HierarchicalDataTable): Promise<void> => {
  	const worker = new dictionary[table.group](table);
  	await worker.run();
  }
};

export {WorkerHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.