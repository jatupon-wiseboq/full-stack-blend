// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable, SourceType} from "../helpers/DatabaseHelper";
import {Base as Worker} from '../workers/Base';
import {queue} from '../../server';

const instanceDictionary: {[Identifier: string]: any} = {};
const groupDictionary: {[Identifier: string]: any} = {};

const WorkerHelper = {
  register: <T extends Worker>(worker: new (data: HierarchicalDataTable) => T, name: string, group: string = 'general') => {
    instanceDictionary[name] = worker;
    groupDictionary[name] = group || 'general';
  },
  enqueue: (table: HierarchicalDataTable) => {
    for (const row of table.rows) {
      queue && queue.enqueue(groupDictionary[table.group], "perform", [{
        source: SourceType.PrioritizedWorker,
        group: table.group,
        rows: [row]
      }]);
    }
  },
  perform: async (table: HierarchicalDataTable): Promise<void> => {
    if (!instanceDictionary[table.group]) {
      WorkerHelper.reject(groupDictionary[table.group], "perform", table);
    } else {
      const worker = new instanceDictionary[table.group](table);
      await worker.run();
    }
  },
  reject: async (q: string, func: string, table: HierarchicalDataTable): Promise<void> => {
    for (const row of table.rows) {
      await queue.connection.redis
        .multi()
        .sadd(queue.connection.key("queues"), q)
        .rpush(queue.connection.key("queue", q), queue.encode(q, func, [table]))
        .exec();
    }
  }
};

export {WorkerHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.