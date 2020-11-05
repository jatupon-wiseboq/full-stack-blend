// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Request} from "express";
import {SourceType, ActionType, Input} from "./DatabaseHelper.js";
import {DataTableSchema, DataSchema, SchemaHelper} from "./SchemaHelper.js";
import {ValidationHelper} from "./ValidationHelper.js";
import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper.js";

interface RequestParamInfo {
  target: SourceType;
  group: boolean;
  name: string;
}

const requestParamInfoDict: any = {};
const requestSubmitInfoDict: any = {};

const RequestHelper = {
	registerInput: (guid: string, target: string, group: string, name: string): void => {
		if (!guid || !target || !group || !name) return;
		
		let _target: SourceType;
		switch (target) {
			case "relational":
				_target = SourceType.Relational;
				break;
			case "worker":
				_target = SourceType.PrioritizedWorker;
				break;
			case "document":
				_target = SourceType.Document;
				break;
			case "volatile-memory":
				_target = SourceType.VolatileMemory;
				break;
			default:
				throw new Error("There was an error trying to retrieve input info (target value isn't in the predefined set).");
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
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		const action = requestSubmitInfoDict[pageId + json.guid] && requestSubmitInfoDict[pageId + json.guid].action || null;
		
		switch (action) {
			case "insert":
				return ActionType.Insert;
			case "update":
				return ActionType.Update;
			case "upsert":
				return ActionType.Upsert;
			case "delete":
				return ActionType.Delete;
			case "retrieve":
				return ActionType.Retrieve;
			case "popup":
				return ActionType.Popup;
			case "navigate":
				return ActionType.Navigate;
			case "test":
				return ActionType.Test;
			default:
				return null;
		}
	},
	getOptions: (pageId: string, request: Request): any => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		return requestSubmitInfoDict[pageId + json.guid].options;
	},
	getSchema: (pageId: string, request: Request): DataTableSchema => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		return SchemaHelper.getDataTableSchemaFromNotation(json.notation, ProjectConfigurationHelper.getDataSchema());
	},
	getInput: (pageId: string, request: Request, guid: string): Input => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		if (!json.hasOwnProperty(guid)) {
		  return null;
		}
		
		const paramInfo = requestParamInfoDict[guid.split("[")[0]];
		const submitInfo = requestSubmitInfoDict[pageId + json.guid];
		
		if (submitInfo.fields.indexOf(guid.split("[")[0]) == -1) {
			throw new Error("There was an error trying to obtain requesting parameters (found a prohibited requesting parameter).");
		}
		
		const splited = paramInfo.group.split(".");
		const group = splited.pop();
		const premise = splited.join(".") || null;
		
		const input: Input = {
		  target: paramInfo.target,
  		group: group,
  		name: paramInfo.name,
  		value: json[guid],
  		guid: guid,
  		premise: premise || null,
  		validation: null
		};
		
		if (input != null) {
			ValidationHelper.attachInfo(input);
		}
		
		return input;
	},
	createInputs: (values: {[Identifier: string]: any}, data: DataSchema=ProjectConfigurationHelper.getDataSchema()): Input[] => {
		const results = [];
		
		for (const key in values) {
			if (values.hasOwnProperty(key)) {
				const splited = key.split("[")[0].split(".");
				const name = splited.pop() || null;
				const group = splited.pop() || null;
				const premise = splited.join(".") || null;
				
				if (name == null || group == null) throw new Error("There was an error trying to create a list of inputs (${key}).");
				if (!data.tables[group]) throw new Error(`There was an error trying to create a list of inputs (couldn't find a group, named ${group}).`);
				if (!data.tables[group].keys[name] && !data.tables[group].columns[name]) throw new Error(`There was an error trying to create a list of inputs (couldn't find a field, named ${name}; choices are ${[...Object.keys(data.tables[group].keys), ...Object.keys(data.tables[group].columns)].join(", ")}).`);
				
				const input: Input = {
				  target: data.tables[group].source,
		  		group: group,
		  		name: name,
		  		value: values[key],
		  		guid: key,
		  		premise: premise,
		  		validation: null
				};
				
				if (input != null) {
					results.push(input);
				}
			}
		}
		
		return results;
	}
};

export {RequestHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.