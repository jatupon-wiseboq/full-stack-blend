// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Request} from 'express';
import {SourceType, ActionType, Input} from './DatabaseHelper';
import {DataTableSchema, DataSchema, SchemaHelper, FieldType} from './SchemaHelper';
import {ValidationHelper} from './ValidationHelper';
import {ProjectConfigurationHelper} from './ProjectConfigurationHelper';
import {XMLHttpRequest} from 'xmlhttprequest-ts';

interface RequestParamInfo {
  target: SourceType;
  group: boolean;
  name: string;
}

const requestParamInfoDict: any = {};
const requestSubmitInfoDict: any = {};

const RequestHelper = {
	request: async (method: string, url: string, body: string, responseType: string=null, retryCount=10): Promise<any> => {
		return new Promise((resolve, reject) => {
			const process = (() => {
			  const xmlhttp = new XMLHttpRequest();
  	    xmlhttp.onreadystatechange = function() {
  				if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
  					if (xmlhttp.status == 200) {
  						let output = xmlhttp.responseText;
  						
  						console.log(`\x1b[35mResults... ${JSON.stringify(output)}\x1b[0m`);
  						
			  	    switch (responseType) {
			  	    	case 'json':
			  	    		try {
			  	    			output = JSON.parse(xmlhttp.responseText);
			  	    		} catch(error) {
			  	    			reject(error);
			  	    			
			  	    			return;
			  	    		}
			  	    		break;
			  	    	default:
			  	    		output = xmlhttp.responseText;
			  	    		break;
			  	    }
			  	    
  						resolve(output);
  					} else {
  					  setTimeout((() => {
  					    if (--retryCount >= 0) {
  					      process();
  					    } else {
  						    reject(xmlhttp.status);
  						  }
  						}).bind(this), 1000);
  					}
  				}
  	    };
  	    xmlhttp.onerror = function(error) {
  				console.log(`\x1b[31mResults... ${error}\x1b[0m`);
  	    };
  	    
  	    console.log(`\x1b[32m${JSON.stringify(method)} Requesting ${url}... ${JSON.stringify(body)}\x1b[0m`);
  	    
  	    xmlhttp.open(method, url, true);
  	    if (body) {
  	    	xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  	    	xmlhttp.send(body);
  	    }
  	    else xmlhttp.send();
  	  });
  	  process();
		});
	},
  get: (url: string, responseType: string=null): Promise<any> => {
  	const method = 'GET';
  	const bodyString = null;
  	
  	return RequestHelper.request(method, url, bodyString, responseType);
  },
  post: (url: string, body: any, responseType: string=null): Promise<any> => {
  	const method = 'POST';
  	const bodyString = JSON.stringify(body);
  	
  	return RequestHelper.request(method, url, bodyString, responseType);
  },
  put: (url: string, body: any, responseType: string=null): Promise<any> => {
  	const method = 'PUT';
  	const bodyString = JSON.stringify(body);
  	
  	return RequestHelper.request(method, url, bodyString, responseType);
  },
  delete: (url: string, body: any, responseType: string=null): Promise<any> => {
  	const method = 'DELETE';
  	const bodyString = JSON.stringify(body);
  	
  	return RequestHelper.request(method, url, bodyString, responseType);
  },
	registerInput: (guid: string, target: string, group: string, name: string): void => {
		if (!guid || !target || !group || !name) return;
		
		let _target: SourceType;
		switch (target) {
			case 'relational':
				_target = SourceType.Relational;
				break;
			case 'worker':
				_target = SourceType.PrioritizedWorker;
				break;
			case 'document':
				_target = SourceType.Document;
				break;
			case 'volatile-memory':
				_target = SourceType.VolatileMemory;
				break;
			case 'RESTful':
				_target = SourceType.RESTful;
				break;
			default:
				throw new Error('There was an error trying to retrieve input info (target value isn\'t in the predefined set).');
		}
		
		requestParamInfoDict[guid] = {
			target: _target,
			group: group,
			name: name
		};
	},
	registerSubmit: (pageId: string, guid: string, action: string, fields: string[], options: any): void => {
		requestSubmitInfoDict[pageId + guid] = {
			action: action,
			fields: fields,
			options: options
		};
	},
	getAction: (pageId: string, request: Request): ActionType => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error('There was an error trying to obtain requesting parameters (requesting body is null).');
		}
		
		const action = requestSubmitInfoDict[pageId + json.guid] && requestSubmitInfoDict[pageId + json.guid].action || null;
		
		switch (action) {
			case 'insert':
				return ActionType.Insert;
			case 'update':
				return ActionType.Update;
			case 'upsert':
				return ActionType.Upsert;
			case 'delete':
				return ActionType.Delete;
			case 'retrieve':
				return ActionType.Retrieve;
			case 'popup':
				return ActionType.Popup;
			case 'navigate':
				return ActionType.Navigate;
			case 'test':
				return ActionType.Test;
			default:
				return null;
		}
	},
	getOptions: (pageId: string, request: Request): any => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error('There was an error trying to obtain requesting parameters (requesting body is null).');
		}
		
		return requestSubmitInfoDict[pageId + json.guid].options;
	},
	getSchema: (pageId: string, request: Request): DataTableSchema => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error('There was an error trying to obtain requesting parameters (requesting body is null).');
		}
		
		return SchemaHelper.getDataTableSchemaFromNotation(json.notation, ProjectConfigurationHelper.getDataSchema());
	},
	getInput: (pageId: string, request: Request, guid: string): Input => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error('There was an error trying to obtain requesting parameters (requesting body is null).');
		}
		
		if (!json.hasOwnProperty(guid)) {
		  return null;
		}
		
		const paramInfo = requestParamInfoDict[guid.split('[')[0]];
		const submitInfo = requestSubmitInfoDict[pageId + json.guid];
		
		if (submitInfo.fields.indexOf(guid.split('[')[0]) == -1) {
			throw new Error('There was an error trying to obtain requesting parameters (found a prohibited requesting parameter).');
		}
		
		const namespace = guid.split('[')[0];
		const indexes = JSON.parse('[' + (guid.split('[')[1] || ']'));
		const splited = paramInfo.group.split('.');
		const group = splited.pop();
		const premise = splited.join('.') || null;
		
		const input: Input = {
		  target: paramInfo.target,
  		group: group,
  		name: paramInfo.name,
  		value: json[guid],
  		guid: guid,
  		premise: premise || null,
  		division: indexes,
  		validation: null
		};
		
		if (input != null) {
			ValidationHelper.attachInfo(input);
		}
		
		return input;
	},
	getInputs: (pageId: string, request: Request, guid: string): Input[] => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error('There was an error trying to obtain requesting parameters (requesting body is null).');
		}
		
		const inputs = [];
		
		for (const key in json) {
			if (json.hasOwnProperty(key) && key.indexOf(guid) == 0) {
				const input = RequestHelper.getInput(pageId, request, key);
				
				if (input) inputs.push(input);
			}
		}
		
		return inputs;
	},
	createInputs: (values: {[Identifier: string]: any}, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Input[] => {
		const results = [];
		const _values = {};
		
		for (const key in values) {
			if (values.hasOwnProperty(key)) {
				if (values[key] != null && typeof values[key] == 'object' && !(values[key] instanceof Date)) {
					for (const indexes in values[key]) {
						_values[`${key}[${indexes}]`] = values[key][indexes];
					}
				}
				else _values[key] = values[key];
			}
		}
		
		values = _values;
		
		for (const key in values) {
			if (values.hasOwnProperty(key)) {
				const namespace = key.split('[')[0];
				const splited = namespace.split('.');
				const indexes = JSON.parse('[' + (key.split('[')[1] || ']'));
				const name = splited.pop() || null;
				const group = splited.pop() || null;
				const premise = splited.join('.') || null;
				
				if (name == null || group == null) throw new Error('There was an error trying to create a list of inputs (${key}).');
				if (!data.tables[group]) throw new Error(`There was an error trying to create a list of inputs (couldn't find a group, named ${group}).`);
				if (!data.tables[group].keys[name] && !data.tables[group].columns[name]) throw new Error(`There was an error trying to create a list of inputs (couldn't find a field, named ${name}; choices are ${[...Object.keys(data.tables[group].keys), ...Object.keys(data.tables[group].columns)].join(', ')}).`);
				
				let value = values[key];
				const type = data.tables[group].keys[name] && data.tables[group].keys[name].fieldType ||
					data.tables[group].columns[name] && data.tables[group].columns[name].fieldType;
				
				if (value === null) value = 'null';
				if (typeof value === 'string') {
					if (value == 'null') value = null;
					else {
						switch (type) {
							case FieldType.AutoNumber:
							case FieldType.Number: 
								value = parseFloat(value);
								break;
						}
					}
				
					const input: Input = {
					  target: data.tables[group].source,
			  		group: group,
			  		name: name,
			  		value: value,
		  			guid: `${namespace}${indexes.length != 0 && '[' + indexes.join(',') + ']' || ''}`,
			  		premise: premise,
		  			division: indexes,
			  		validation: null
					};
					
					results.push(input);
				} else if (Array.isArray(value)) {
					let index = 0;
					for (const _value of value) {
						const input: Input = {
						  target: data.tables[group].source,
				  		group: group,
				  		name: name,
				  		value: _value,
				  		guid: `${namespace}[${index++}]`,
				  		premise: premise,
		  				division: indexes,
				  		validation: null
						};
						
						results.push(input);
					}
				} else {
					const input: Input = {
					  target: data.tables[group].source,
			  		group: group,
			  		name: name,
			  		value: value,
		  			guid: `${namespace}${indexes.length != 0 && '[' + indexes.join(',') + ']' || ''}`,
			  		premise: premise,
		  			division: indexes,
			  		validation: null
					};
					
					results.push(input);
				}
			}
		}
		
		return results;
	},
  sortInputs: (inputs: Input[]) => {
    for (const input of inputs) {
      input.division = input.division || [];
    }
    
    let foundEmptied = false;
    let foundSingle = false;
    for (let i=0; i<inputs.length; i++) {
      foundEmptied = foundEmptied || (inputs[i].division.length == 0);
      foundSingle = foundSingle || (inputs[i].division.length == 1);
    }
    
    if (foundEmptied) {
      for (let i=0; i<inputs.length; i++) {
        inputs[i].division.splice(0, 0, 0);
      }
      foundSingle = true;
    }
    
    inputs.sort((a, b) => {
      const _a = [].concat(a.division);
      const _b = [].concat(b.division);
      
      if (_a.length != _b.length) {
        const max = Math.max(_a.length, _b.length);
        
        for (let i=_a.length; i<=max; i++) {
          _a.push(-1);
        }
        for (let i=_b.length; i<=max; i++) {
          _b.push(-1);
        }
      }
      
      for (let i=0; i<_a.length; i++) {
        if (_a[i] != _b[i]) return (_a[i] < _b[i]) ? -1 : 1;
      }
      
      return 0;
    });
    
    const registers = [];
    const multiple = [];
    let latest: string = null;
    let length = 0;
    
    for (let i=0; i<inputs.length; i++) {
    	const division = inputs[i].division;
    	
    	if (division.length > length) {
    		for (let j=length; j<division.length; j++) {
    			registers[j] = 0;
    			if (multiple[j] === undefined) multiple[j] = false;
    		}
    	} else if (division.length == length) {
    		if (latest != division.join(',')) {
    			registers[length - 1] += 1;
    			multiple[length - 1] = true;
    		}
    	} else {
    		registers[division.length - 1] += 1;
    		multiple[division.length - 1] = true;
    	}
    	
    	length = division.length;
    	latest = division.join(',');
    	
  		for (let j=0; j<division.length; j++) {
  			division[j] = registers[j];
  		}
    }
    
	  let concurring = 0;
	  while (multiple[concurring] === false) concurring++;
	  concurring = Math.min(concurring, multiple.length - 1);
	  
	  if (multiple.length > 1) {
		  for (let i=0; i<inputs.length; i++) {
		  	inputs[i].division.splice(0, concurring);
		  }
		}
		
		foundEmptied = false;
    for (let i=0; i<inputs.length; i++) {
      foundEmptied = foundEmptied || (inputs[i].division.length == 0);
    }
    
    if (foundEmptied) {
      for (let i=0; i<inputs.length; i++) {
        inputs[i].division.splice(0, 0, 0);
      }
    }
  }
};

export {RequestHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.