// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {RequestHelper} from './RequestHelper.js';
import {HTMLHelper} from './HTMLHelper.js';

declare let window: any;

enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory
}
interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: HierarchicalDataColumn};
  columns: {[Identifier: string]: HierarchicalDataColumn};
  relations: {[Identifier: string]: HierarchicalDataTable};
}
interface HierarchicalDataColumn {
	name: string;
  value: any;
}

const fieldManipulatorsInfoDict: any = {};
const actionManipulatorsInfoDict: any = {};
const optionsManipulatorsInfoDict: any = {};
const isDevelopmentMachine = ['localhost:3000', 'develop.stackblend.com', 'staging.stackblend.com', 'www.stackblend.com'].indexOf(location.host) != -1;
const registeredEndpoint: string = (isDevelopmentMachine) ? window.ENDPOINT || null : null;
const currentPath: string = (isDevelopmentMachine) ? window.PATH || null : null;

const DataManipulationHelper = {
	register: (guid: string, action: string, fields: string[], options: any) => {
		if (!fieldManipulatorsInfoDict[guid]) {
			fieldManipulatorsInfoDict[guid] = fields;
			actionManipulatorsInfoDict[guid] = action;
			optionsManipulatorsInfoDict[guid] = options;
		}
	},
	getInfo: (guid: string): any => {
		return {
			fields: fieldManipulatorsInfoDict[guid],
  		action: actionManipulatorsInfoDict[guid],
  		options: optionsManipulatorsInfoDict[guid]
		};
	},
  request: (guid: string, notation: string, event: Event, callback: any) => {
  	if (fieldManipulatorsInfoDict[guid]) {
  		const params = {};
  		const fields = fieldManipulatorsInfoDict[guid];
  		const action = actionManipulatorsInfoDict[guid];
  		const options = optionsManipulatorsInfoDict[guid];
  		
	  	for (const field of fields) {
	  		let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', field) as any;
	  		
	  		if (element.tagName != 'INPUT') {
	  			element = element.firstChild;
	  			while (element && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(element.tagName) == -1) {
	  				element = element.nextSibling;
	  			}
	  		}
	  		
	  		if (element) {
	  			switch (HTMLHelper.getAttribute(element, 'type')) {
	  				case 'radio':
	  					if (element.checked) {
	  						params[field] = element.value;
	  					}
	  					break;
	  				case 'checkbox':
	  					params[field] = element.checked ? '1' : '0';
	  					break;
  					default:
  						params[field] = element.value;
  						break;
  				}
	  		}
	  	}
	  	
	  	params['action'] = action;
	  	params['notation'] = notation;
	  	
	  	const button = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', guid);
	  	if (button && button.getAttribute('data-event-submitting')) {
	  		const event = new CustomEvent('submitting', {
					detail: {
						params: params
					}
				});
	  		if (button.getAttribute('data-event-submitting')(event) === false) {
	  			return;
	  		}
	  	}
	  	
	  	RequestHelper.post((registeredEndpoint || `${location.protocol}//${location.host}`) + (currentPath || `${location.pathname}`), params)
	  		.then((json) => {
	  			if (button && button.getAttribute('data-event-submitted')) {
						const event = new CustomEvent('submitted', {
							detail: {
								params: params,
								results: json
							}
						});
						if (button.getAttribute('data-event-submitted')(event) === false) {
							return;
						}
					}
	  			
	  			if (json.success) {
	  				if (button && button.getAttribute('data-event-success')) {
							const event = new CustomEvent('success', {
								detail: {
									params: params,
									results: json
								}
							});
							if (button.getAttribute('data-event-success')(event) === false) {
								return;
							}
						}
	  				
	  				if (json.redirect) {
	  				  window.location = json.redirect;
	  				} else {
	  				  if (callback) {
  	  				  callback(json.results);
  	  				} else {
  	  				  alert("The submit button should be containing in a react control, so that it can be fetched by using data notations.");
  	  				}
	  				}
	  			} else {
	  				if (button && button.getAttribute('data-event-failed')) {
							const event = new CustomEvent('failed', {
								detail: {
									params: params,
									results: json
								}
							});
							if (button.getAttribute('data-event-failed')(event) === false) {
								return;
							}
						}
	  				
	  				if (json.error) {
	  					console.log(json.error);
	  					alert(json.error);
	  				} else {
	  					console.error(json);
	  					alert("There is an error occured, please try again.");
	  				}
	  			}
	  		})
	  		.catch((status) => {
	  			console.error(status);
	  			alert("There is an error occured, please check your internet connection.");
	  		})
	  		.finally(() => {
	  			
	  		});
  	}
  },
  getDataFromKey: (key: string, current: any, index: number=-1): any => {
		if (Array.isArray(current)) {
			current = current[0] || {};
		}
		
  	// Search HierarchicalDataRow
		// 		
		let table = (current.relations || {})[key];
		if (table) {
			if (index != -1) {
				return table.rows[index];
			} else {
				return table.rows;
			}
		} else {
			// Search HierarchicalDataColumn
			// 
			let column = (current.keys || {})[key] || (current.columns || {})[key];
			if (column) {
				return column.value;
			} else {
				return null;
			}
		}
  },
  getDataFromNotation: (notation: string, data: {[Identifier: string]: HierarchicalDataTable}=window.data, inArray: boolean=false): any => {
    if (!notation) {
      console.error("The notation is null, undefined or empty.");
	  	alert("There is an error occured, please try again.");
      return [];
    }
    
    let splited = notation.split('.');
    let current = {
			keys: null,
			columns: null,
			relations: data
		};
		
		let shifted = splited.shift();
		while (current && shifted) {
		  let tokens = shifted.split('[');
		  if (tokens.length == 1) {
			  current = DataManipulationHelper.getDataFromKey(tokens[0], current);
			} else if (tokens.length == 2) {
			  current = DataManipulationHelper.getDataFromKey(tokens[0], current, parseInt(tokens[1].split(']')[0]));
			} else {
			  current = null;
			}
			shifted = splited.shift();
		}
		
		if (inArray) {
			if (Array.isArray(current)) {
				return current;
			} else if (current !== null && current !== undefined) {
				return [current];
			} else {
				return [];
			}
		} else {
			return current;
		}
  }
};

export {HierarchicalDataTable, HierarchicalDataRow, HierarchicalDataColumn, DataManipulationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.