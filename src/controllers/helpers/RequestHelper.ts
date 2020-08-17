// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Request} from "express";
import {SourceType, ActionType, Input} from "./DatabaseHelper.js";
import {DataTableSchema, SchemaHelper} from "./SchemaHelper.js";
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
		if (!guid || !target || !group || !name) throw new Error("There was an error trying to retrieve input info (guid, target, group, or name is empty).");
		
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
	registerSubmit: (guid: string, action: string, fields: string[], options: any): void => {
		requestSubmitInfoDict[guid] = {
			action: action,
			fields: fields,
			options: options
		};
	},
	getAction: (request: Request): ActionType => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		const action = requestSubmitInfoDict[json.guid] && requestSubmitInfoDict[json.guid].action || null;
		
		switch (action) {
			case "insert":
				return ActionType.Insert;
			case "update":
				return ActionType.Update;
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
	getOptions: (request: Request): any => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		return requestSubmitInfoDict[json.guid].options;
	},
	getSchema: (request: Request): DataTableSchema => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		return SchemaHelper.getDataTableSchemaFromNotation(json.notation, ProjectConfigurationHelper.getDataSchema());
	},
	getInput: (request: Request, guid: string): Input => {
		const json: any = request.body;
		
		if (json == null) {
			throw new Error("There was an error trying to obtain requesting parameters (requesting body is null).");
		}
		
		if (!json.hasOwnProperty(guid)) {
		  return null;
		}
		
		const paramInfo = requestParamInfoDict[guid.split("[")[0]];
		const submitInfo = requestSubmitInfoDict[json.guid];
		
		if (submitInfo.fields.indexOf(guid.split("[")[0]) == -1) {
			throw new Error("There was an error trying to obtain requesting parameters (found a prohibited requesting parameter).");
		}
		
		const splited = paramInfo.group.split(".");
		
		const input: Input = {
		  target: paramInfo.target,
  		group: splited.pop(),
  		name: paramInfo.name,
  		value: json[guid],
  		guid: guid,
  		premise: splited.pop() || null,
  		validation: null
		};
		
		if (input != null) {
			ValidationHelper.attachInfo(input);
		}
		
		return input;
	}
};

export {RequestHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.