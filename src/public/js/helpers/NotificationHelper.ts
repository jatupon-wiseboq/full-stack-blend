// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataTable} from './DataManipulationHelper';
import {RequestHelper} from './RequestHelper';

const sockets = {};
const notificationInfos = {};
const bindedFunctions = {};

declare let window: any;

const NotificationHelper = {
  registerTableUpdates: (tables: {[Identifier: string]: HierarchicalDataTable}) => {
  	for (const tableName in tables) {
  		if (tables.hasOwnProperty(tableName)) {
  			const table = tables[tableName];
  			
  			if (table.notification) {
  				NotificationHelper.listenTableUpdates('https://' + window.location.hostname, table, table.notification);
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
  				NotificationHelper.unlistenTableUpdates('https://' + window.location.hostname, table, table.notification);
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
  	}
  	
  	notificationInfos[notificationURI] = notificationInfos[notificationURI] || [];
  	notificationInfos[notificationURI].push(table);
  	bindedFunctions[notificationURI] = {};
  	
  	const socket = sockets[socketUrl];
  	
  	socket.on('insert_' + identity, bindedFunctions[notificationURI]['insert'] = (message: any) => {
  		if (message.id == identity) {
  			for (let result of message.results) {
          table.rows.push(result);
        }
        NotificationHelper.notifyTableUpdates(message);
  		}
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
          }
        }
        NotificationHelper.notifyTableUpdates(message);
  		}
    });
  	socket.on('update_' + identity, bindedFunctions[notificationURI]['update'] = (message: any) => {
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
        NotificationHelper.notifyTableUpdates(message);
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
        NotificationHelper.notifyTableUpdates(message);
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