// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Request} from 'express';
import {SourceType, ActionType, Input} from './DatabaseHelper';
import {DataTableSchema, DataSchema, SchemaHelper, FieldType} from './SchemaHelper';
import {ValidationHelper} from './ValidationHelper';
import {ProjectConfigurationHelper} from './ProjectConfigurationHelper';
import {CodeHelper} from "./CodeHelper";
import {XMLHttpRequest} from 'xmlhttprequest-ts';
import { strict as assert } from 'assert';

interface RequestParamInfo {
  target: SourceType;
  group: boolean;
  name: string;
}

const requestParamInfoDict: any = {};
const requestSubmitInfoDict: any = {};

const RequestHelper = {
	request: async (method: string, url: string, body: string, responseType: string=null, retryCount=10): Promise<any> => {
		CodeHelper.assertOfPresent(method, 'method');
		CodeHelper.assertOfPresent(url, 'url');
		
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
  					    	console.log(`\x1b[35mRetrying...\x1b[0m`);
  					    	
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
		CodeHelper.assertOfPresent(guid, 'guid');
		
		if (!target && !group && !name) return;
		
		CodeHelper.assertOfPresent(target, 'target', undefined, {guid: guid});
		CodeHelper.assertOfPresent(group, 'group', undefined, {guid: guid});
		CodeHelper.assertOfPresent(name, 'name', undefined, {guid: guid});
		CodeHelper.assertOfNotationFormat(guid, 'guid');
		CodeHelper.assertOfNotationFormat(group, 'group');
		CodeHelper.assertOfNotationFormat(name, 'name');
		
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
				throw new Error(`target "${target}" isn\'t fall within the predefined set (guid: ${guid}).`);
		}
		
		const info = {
			target: _target,
			group: group,
			name: name
		};
		
		if (requestParamInfoDict[guid] && !CodeHelper.equals(requestParamInfoDict[guid], info)) {
			throw new Error(`There is a conflict of difference input definition of the same guid (guid: ${guid}).`);
		}
		
		requestParamInfoDict[guid] = info;
	},
	registerSubmit: (pageId: string, guid: string, action: string, fields: string[], options: any): void => {
		CodeHelper.assertOfPresent(pageId, 'pageId', undefined, {guid: guid});
		CodeHelper.assertOfPresent(guid, 'guid', undefined, {guid: guid});
		
		if (!action) return;
		
		CodeHelper.assertOfPresent(action, 'action', undefined, {guid: guid});
		CodeHelper.assertOfPresent(fields, 'fields', undefined, {guid: guid});
		
		CodeHelper.recursiveEvaluate(fields, (obj: any) => {
    	CodeHelper.assertOfKeyName(obj, 'fields');
    });
		
		CodeHelper.recursiveEvaluate(options, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'options', undefined, {guid: guid});
    });
    
    CodeHelper.assertOfKeyName(pageId, 'pageId');
		CodeHelper.assertOfNotationFormat(guid, 'guid');
		CodeHelper.assertOfKeyName(action, 'action');
    
    const info = {
			action: action,
			fields: fields,
			options: options
		};
    
    if (requestSubmitInfoDict[pageId + guid] && !CodeHelper.equals(requestSubmitInfoDict[pageId + guid], info)) {
			throw new Error(`There is a conflict of difference submit definition of the same page and guid (page: ${pageId}, guid: ${guid}).`);
		}
		
		requestSubmitInfoDict[pageId + guid] = info;
	},
	getAction: (pageId: string, request: Request): ActionType => {
		CodeHelper.assertOfPresent(pageId, 'pageId');
		CodeHelper.assertOfPresent(request, 'request');
		CodeHelper.assertOfKeyName(pageId, 'pageId');
		
		const json: any = request.body;
		
		CodeHelper.assertOfPresent(json, 'json');
		CodeHelper.recursiveEvaluate(json, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'json', undefined);
    });
		
		if (typeof json.guid === 'undefined') return null;
		
		CodeHelper.assertOfString(json.guid, 'guid');
		assert(requestSubmitInfoDict[pageId + json.guid], `The submit information isn\'t available (page: ${pageId}, guid: ${json.guid}).`);
		
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
	getFields: (pageId: string, request: Request): any => {
		CodeHelper.assertOfPresent(pageId, 'pageId');
		CodeHelper.assertOfPresent(request, 'request');
		CodeHelper.assertOfKeyName(pageId, 'pageId');
		
		const json: any = request.body;
		
		CodeHelper.assertOfPresent(json, 'json');
		CodeHelper.recursiveEvaluate(json, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'json', undefined);
    });
		
		if (typeof json.guid === 'undefined') return [];
		
		CodeHelper.assertOfString(json.guid, 'guid');
		assert(requestSubmitInfoDict[pageId + json.guid], `The submit information isn\'t available (page: ${pageId}, guid: ${json.guid}).`);
		
		return requestSubmitInfoDict[pageId + json.guid].fields;
	},
	getOptions: (pageId: string, request: Request): any => {
		CodeHelper.assertOfPresent(pageId, 'pageId');
		CodeHelper.assertOfPresent(request, 'request');
		CodeHelper.assertOfKeyName(pageId, 'pageId');
		
		const json: any = request.body;
		
		CodeHelper.assertOfPresent(json, 'json');
		CodeHelper.recursiveEvaluate(json, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'json', undefined);
    });
		
		if (typeof json.guid === 'undefined') return null;
		
		CodeHelper.assertOfString(json.guid, 'guid');
		assert(requestSubmitInfoDict[pageId + json.guid], `The submit information isn\'t available (page: ${pageId}, guid: ${json.guid}).`);
		
		return requestSubmitInfoDict[pageId + json.guid].options;
	},
	getParamInfos: (guid: string): any => {
		CodeHelper.assertOfPresent(guid, 'guid');
		CodeHelper.assertOfNotationFormat(guid, 'guid');
		
		const info = requestParamInfoDict[guid.split('[')[0]];
		
		if (info === undefined || info === null) {
			throw new Error(`There was an error trying to retrieve param info (target ${guid} doesn\'t exist).`);
		}
		
		return info;
	},
	getSchema: (pageId: string, request: Request, schemata: DataSchema = ProjectConfigurationHelper.getDataSchema()): DataTableSchema => {
		CodeHelper.assertOfPresent(pageId, 'pageId');
		CodeHelper.assertOfPresent(request, 'request');
		CodeHelper.assertOfKeyName(pageId, 'pageId');
		
		const fields = RequestHelper.getFields(pageId, request);
		
		if (fields.length == 0) return null;
		
		const info = RequestHelper.getParamInfos(fields[0]);
		
		return SchemaHelper.getDataTableSchemaFromNotation(info.group.split('.')[0], schemata);
	},
	getInput: (pageId: string, request: Request, guid: string): Input => {
		CodeHelper.assertOfPresent(pageId, 'pageId', undefined, {guid: guid});
		CodeHelper.assertOfPresent(guid, 'guid', undefined, {guid: guid});
		CodeHelper.assertOfPresent(request, 'request', undefined, {guid: guid});
		CodeHelper.assertOfKeyName(pageId, 'pageId');
		CodeHelper.assertOfNotationFormat(guid, 'guid');
		
		const json: any = request.body;
		
		CodeHelper.assertOfPresent(json, 'json');
		CodeHelper.recursiveEvaluate(json, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'json', undefined, {guid: guid});
    });
		
		if (typeof json.guid === 'undefined') return null;
		
		const paramInfo = RequestHelper.getParamInfos(guid);
		const fields = RequestHelper.getFields(pageId, request);
		
		if (fields.indexOf(guid.split('[')[0]) == -1) {
			throw new Error('There was an error trying to obtain requesting parameters (found a prohibited requesting parameter).');
		}
		
		const namespace = guid.split('[')[0];
		const indexes = JSON.parse('[' + (guid.split('[')[1] || ']'));
		const splited = paramInfo.group.split('.');
		const group = splited.pop();
		const premise = splited.join('.') || null;
		
		const input: Input = {
		  target: paramInfo.target,
  		group: group.replace(/[@!]/g, ''),
  		name: paramInfo.name.replace(/[@!]/g, ''),
  		value: json[guid],
  		guid: guid,
  		premise: premise && premise.replace(/[@!]/g, '') || null,
  		division: indexes,
  		associate: paramInfo.group.indexOf('@') != -1,
  		notify: paramInfo.group.indexOf('!') != -1,
  		validation: null
		};
		
		if (input != null) {
			ValidationHelper.attachInfo(input);
		}
		
		return input;
	},
	getInputs: (pageId: string, request: Request, guid: string): Input[] => {
		CodeHelper.assertOfPresent(pageId, 'pageId', undefined, {guid: guid});
		CodeHelper.assertOfPresent(guid, 'guid', undefined, {guid: guid});
		CodeHelper.assertOfPresent(request, 'request', undefined, {guid: guid});
		CodeHelper.assertOfKeyName(pageId, 'pageId');
		CodeHelper.assertOfNotationFormat(guid, 'guid');
		
		const json: any = request.body;
		
		CodeHelper.assertOfPresent(json, 'json');
		CodeHelper.recursiveEvaluate(json, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'json', undefined, {guid: guid});
    });
		
		if (typeof json.guid === 'undefined') [];
		
		// TODO: undo and enforce strictness.
		// assert(json.guid === guid, `guid doesn't match (guid: ${guid}).`);
		
		const inputs = [];
		
		for (const key in json) {
			if (key.indexOf(guid) != 0) continue;
			
			// TODO: undo and enforce strictness.
			// CodeHelper.assertOfKeyName(key, 'key');
			
			if (key == 'notation') {
				console.log("\x1b[33mnotation is no longer used due to a security issue, please use a newer version of StackBlend to remove this warning.\x1b[0m");
			}
			if (json.hasOwnProperty(key) && key != 'guid' && key != 'notation') {
				const input = RequestHelper.getInput(pageId, request, key);
				
				if (input) inputs.push(input);
			}
		}
		
		return inputs;
	},
	createInputs: (values: {[Identifier: string]: any}, schemata: DataSchema=ProjectConfigurationHelper.getDataSchema()): Input[] => {
		CodeHelper.assertOfPresent(values, 'values');
		CodeHelper.recursiveEvaluate(values, (obj: any) => {
    	CodeHelper.assertOfSimpleType(obj, 'values', undefined);
    });
		
		const results = [];
		const _values = {};
		
		for (const key in values) {
			CodeHelper.assertOfNotationFormat(key, 'key');
			
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
				CodeHelper.assertOfNotationFormat(key, 'key');
				
				const namespace = key.split('[')[0];
				const splited = namespace.split('.');
				const indexes = JSON.parse('[' + (key.split('[')[1] || ']'));
				const name = splited.pop() || null;
				const _group = splited.pop() || null;
				const group = _group.replace(/[@!]/g, '');
				const _premise = splited.join('.') || null;
				const premise = _premise && _premise.replace(/[@!]/g, '');
				const associate = namespace.indexOf('@') != -1;
				const notify = namespace.indexOf('!') != -1;
				const guid = `${namespace}${indexes.length != 0 && '[' + indexes.join(',') + ']' || ''}`;
				
				if (name == null || group == null) throw new Error('There was an error trying to create a list of inputs (${key}).');
				if (!schemata.tables[group]) throw new Error(`There was an error trying to create a list of inputs (couldn't find a group, named ${group}).`);
				if (!schemata.tables[group].keys[name] && !schemata.tables[group].columns[name]) throw new Error(`There was an error trying to create a list of inputs (couldn't find a field, named ${name}; choices are ${[...Object.keys(schemata.tables[group].keys), ...Object.keys(schemata.tables[group].columns)].join(', ')}).`);
				
				const target = schemata.tables[group].source;
				const type = schemata.tables[group].keys[name] && schemata.tables[group].keys[name].fieldType ||
					schemata.tables[group].columns[name] && schemata.tables[group].columns[name].fieldType;
				
				let value = values[key];
				
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
					  target: target,
			  		group: group,
			  		name: name,
			  		value: value,
		  			guid: guid,
			  		premise: premise,
		  			division: indexes,
  					associate: associate,
  					notify: notify,
			  		validation: null
					};
					
					results.push(input);
				} else if (Array.isArray(value)) {
					let index = 0;
					for (const _value of value) {
						const input: Input = {
						  target: target,
				  		group: group,
				  		name: name,
				  		value: _value,
				  		guid: `${namespace}[${index++}]`,
				  		premise: premise,
		  				division: indexes,
  						associate: associate,
  						notify: notify,
				  		validation: null
						};
						
						results.push(input);
					}
				} else {
					const input: Input = {
					  target: target,
			  		group: group,
			  		name: name,
			  		value: value,
		  			guid: guid,
			  		premise: premise,
		  			division: indexes,
  					associate: associate,
  					notify: notify,
			  		validation: null
					};
					
					results.push(input);
				}
			}
		}
		
		return results;
	},
  sortInputs: (inputs: Input[]) => {
  	CodeHelper.assertOfPresent(inputs, 'inputs');
  	
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
      
      return (a.name < b.name) ? -1 : 1;
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