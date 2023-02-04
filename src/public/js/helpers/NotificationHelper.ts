// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable} from './DataManipulationHelper';
import {RequestHelper} from './RequestHelper';

const sockets = {};
const notificationInfos = {};
const bindedFunctions = {};
const instanceId = (((1 + Math.random()) * 0x100000) | 0).toString(16).substring(1);
let tmAcknowledge: any = null;

declare let window: any;

const NotificationHelper = {
  registerTableUpdates: (tables: {[Identifier: string]: HierarchicalDataTable}) => {
    for (const tableName in tables) {
      if (tables.hasOwnProperty(tableName)) {
        const table = tables[tableName];

        if (table.notification) {
          NotificationHelper.listenTableUpdates('https://' + window.location.hostname + '?instanceId=' + instanceId, table, table.notification);
        }

        for (const row of table.rows) {
          NotificationHelper.registerTableUpdates(row.relations);
        }
      }
    }
  },
  unregisterTableUpdates: (tables: {[Identifier: string]: HierarchicalDataTable}) => {
    for (const tableName in tables) {
      if (tables.hasOwnProperty(tableName)) {
        const table = tables[tableName];

        if (table.notification) {
          NotificationHelper.unlistenTableUpdates('https://' + window.location.hostname + '?instanceId=' + instanceId, table, table.notification);
        }

        for (const row of table.rows) {
          NotificationHelper.unregisterTableUpdates(row.relations);
        }
      }
    }
  },
  listenTableUpdates: (socketUrl: string, table: HierarchicalDataTable, identity: string) => {
    if (!window.io) return;

    const notificationURI = `${socketUrl}\#${identity}`;

    if (notificationInfos[notificationURI] && notificationInfos[notificationURI].indexOf(table) != -1) return;
    if (!sockets[socketUrl]) {
      sockets[socketUrl] = window.io(socketUrl);

      sockets[socketUrl].on('reconnect', async (message: any) => {
        // Server will send back a refresh command if it has restarted.
        // 
      });
      sockets[socketUrl].on('command', (command: string) => {
        switch (command) {
          case 'refresh':
            window.location.reload();
            break;
        }
      });
      window.document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible' && !sockets[socketUrl].connected) {
          sockets[socketUrl].connect();
        }
      });
      window.setInterval(() => {
        if (!sockets[socketUrl].connected) {
          sockets[socketUrl].connect();
        }
      }, 2000);
    }

    notificationInfos[notificationURI] = notificationInfos[notificationURI] || [];
    notificationInfos[notificationURI].push(table);
    bindedFunctions[notificationURI] = {};

    const socket = sockets[socketUrl];
    const acknowledge = (timestamp) => {
      window.clearTimeout(tmAcknowledge);
      tmAcknowledge = window.setTimeout(() => {
        socket.emit("acknowledge", {
          timestamp: timestamp
        });
      }, 500);
    };

    socket.on('insert_' + identity, bindedFunctions[notificationURI]['insert'] = (message: any) => {
      if (message.id == identity) {
        for (let result of message.results) {
          let found = null;

          for (let row of table.rows) {
            found = row;
            for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) {
                  found = null;
                  break;
                }
              }
            }
            if (found) break;
          }

          if (!found) {
            table.rows.push(result);
          } else {
            if (found.timestamp && result.timestamp && found.timestamp >= result.timestamp) continue;

            table.rows.splice(table.rows.indexOf(found), 1);
            table.rows.push(result);
          }
        }

        NotificationHelper.registerTableUpdates({
          collection: table
        });
        NotificationHelper.notifyTableUpdates(message);
      }
      
      acknowledge(message.timestamp);
    });
    socket.on('delete_' + identity, bindedFunctions[notificationURI]['delete'] = (message: any) => {
      if (message.id == identity) {
        for (let result of message.results) {
          let collection = table.rows.filter((row) => {
            for (let key in row.keys) {
              if (row.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) return false;
              }
            }
            return true;
          });
          for (let item of collection) {
            let index = table.rows.indexOf(item);
            table.rows.splice(index, 1);

            NotificationHelper.unregisterTableUpdates(item.relations);
          }
        }

        NotificationHelper.notifyTableUpdates(message);

        acknowledge(message.timestamp);
      }
    });
    socket.on('update_' + identity, bindedFunctions[notificationURI]['update'] = (message: any) => {
      if (message.id == identity) {
        let flag = false;
        for (let result of message.results) {
          let found = null;

          for (let row of table.rows) {
            found = row;
            for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) {
                  found = null;
                  break;
                }
              }
            }
            if (found) break;
          }

          if (found) {
            flag = true;
            
            if (found.timestamp && result.timestamp && found.timestamp >= result.timestamp) continue;
            found.timestamp = result.timestamp;

            for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                found.keys[key] = result.keys[key];
              }
            }
            for (let key in result.columns) {
              if (result.columns.hasOwnProperty(key)) {
                found.columns[key] = result.columns[key];
              }
            }
          }
        }

        if (flag) {
          NotificationHelper.registerTableUpdates({
            collection: table
          });
          NotificationHelper.notifyTableUpdates(message);
        }
        
        acknowledge(message.timestamp);
      }
    });
    socket.on('upsert_' + identity, bindedFunctions[notificationURI]['upsert'] = (message: any) => {
      if (message.id == identity) {
        for (let result of message.results) {
          let found = null;

          for (let row of table.rows) {
            found = row;
            for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) {
                  found = null;
                  break;
                }
              }
            }
            if (found) break;
          }

          if (found) {
            if (found.timestamp && result.timestamp && found.timestamp >= result.timestamp) continue;
            found.timestamp = result.timestamp;

            for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                found.keys[key] = result.keys[key];
              }
            }
            for (let key in result.columns) {
              if (result.columns.hasOwnProperty(key)) {
                found.columns[key] = result.columns[key];
              }
            }
          } else {
            table.rows.push(result);
          }
        }

        NotificationHelper.registerTableUpdates({
          collection: table
        });
        NotificationHelper.notifyTableUpdates(message);

        acknowledge(message.timestamp);
      }
    });
  },
  unlistenTableUpdates: (socketUrl: string, table: HierarchicalDataTable, identity: string) => {
    if (!window.io) return;

    const notificationURI = `${socketUrl}\#${identity}`;

    if (!notificationInfos[notificationURI] || notificationInfos[notificationURI].indexOf(table) == -1) return;
    if (!sockets[socketUrl]) return;

    const index = notificationInfos[notificationURI].indexOf(table);
    notificationInfos[notificationURI].splice(index, 1);

    if (notificationInfos[notificationURI].length == 0) {
      const socket = sockets[socketUrl];

      socket.off('insert_' + identity, bindedFunctions[notificationURI]['insert']);
      socket.off('delete_' + identity, bindedFunctions[notificationURI]['delete']);
      socket.off('update_' + identity, bindedFunctions[notificationURI]['update']);
      socket.off('upsert_' + identity, bindedFunctions[notificationURI]['upsert']);

      delete notificationInfos[notificationURI];
      delete bindedFunctions[notificationURI];
    }
  },
  notifyTableUpdates: (message) => {
    const event = new CustomEvent('tableUpdated', {
      detail: message,
      cancelable: true
    });
    window.dispatchEvent(event);
  }
};

export {NotificationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
