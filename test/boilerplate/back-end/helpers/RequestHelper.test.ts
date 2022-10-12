import {RequestHelper} from "../../../../src/controllers/helpers/RequestHelper";
import {ActionType, SourceType} from "../../../../src/controllers/helpers/DatabaseHelper";
import {DataTableSchema, DataSchema, FieldType} from "../../../../src/controllers/helpers/SchemaHelper";

import {Request} from "express";
import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const controller = require("../../../../src/controllers/components/Test");
const app = express();

app.set("views", path.join(__dirname, "../../../../views"));
app.set("view engine", "pug");

app.get("/test/api", controller.index);
app.post("/test/api", controller.index);
app.put("/test/api", controller.index);
app.delete("/test/api", controller.index);

const https = require("https");
const sslkey = fs.readFileSync(path.resolve(__dirname, "../../../../localhost.key"));
const sslcert = fs.readFileSync(path.resolve(__dirname, "../../../../localhost.crt"));
const options = {
  key: sslkey,
  cert: sslcert
};
const httpsPort = 1000 + Math.floor(Math.random() * 8999);
const httpsServer = https.createServer(options, app).listen(httpsPort);

const http = require("http");
const httpPort = 1000 + Math.floor(Math.random() * 8999);
const httpServer = http.createServer(app).listen(httpPort);

afterAll(async () => {
  httpsServer.close();
	httpServer.close();
});

describe('HTTP(s) Requests', () => {
	let perform = async (func: any, protocal: string, port: number, method: string, data: any) => {
		let output: any;
		let random: any;
		
		if (method == 'GET') {
			random = Math.random();
			output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}`, 'json');
			expect(output && output['success']).toEqual(true);
			expect(output['results']['Test'].rows[0].keys['method']).toEqual(method);
			expect(output['results']['Test'].rows[0].columns['header']).toEqual(undefined);
			expect(output['results']['Test'].rows[0].columns['query']).toEqual(random.toString());
			
			random = Math.random();
			output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}`);
			expect(() => { output = JSON.parse(output); }).not.toThrow();
			expect(output && output['success']).toEqual(true);
			expect(output['results']['Test'].rows[0].keys['method']).toEqual(method);
			expect(output['results']['Test'].rows[0].columns['header']).toEqual(undefined);
			expect(output['results']['Test'].rows[0].columns['query']).toEqual(random.toString());
			
			random = Math.random();
			output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?error=${random}`, 'json');
			expect(output && output['success']).toEqual(false);
			expect(output && output['error']).toEqual(random.toString());
			
			expect(async () => {
				random = Math.random();
				output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}&json_error_check=1`, 'json');
			}).rejects.toThrow();
			
			expect(async () => {
				random = Math.random();
				output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}&forever_retry_check=1`, 'json');
			}).rejects.toThrow();
		} else {
			random = Math.random();
			output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}`, data, 'json');
			expect(output && output['success']).toEqual(true);
			expect(output['results']['Test'].rows[0].keys['method']).toEqual(method);
			expect(output['results']['Test'].rows[0].columns['header']).toEqual(undefined);
			expect(output['results']['Test'].rows[0].columns['query']).toEqual(random.toString());
			
			random = Math.random();
			output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}`, data);
			expect(() => { output = JSON.parse(output); }).not.toThrow();
			expect(output && output['success']).toEqual(true);
			expect(output['results']['Test'].rows[0].keys['method']).toEqual(method);
			expect(output['results']['Test'].rows[0].columns['header']).toEqual(undefined);
			expect(output['results']['Test'].rows[0].columns['query']).toEqual(random.toString());
			
			random = Math.random();
			output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?error=${random}`, data, 'json');
			expect(output && output['success']).toEqual(false);
			expect(output && output['error']).toEqual(random.toString());
			
			expect(async () => {
				random = Math.random();
				output = await func(`${protocal}//localhost.stackblend.org:${port}/test/api?query=${random}&json_error_check=1`, data, 'json');
			}).rejects.toThrow();
		}
	};
	
	describe('HTTP', () => {
		test('GET', async () => {
			await(perform(RequestHelper.get, 'http:', httpPort, 'GET', {}));
		});
		test('POST', async () => {
			await(perform(RequestHelper.post, 'http:', httpPort, 'POST', {}));
		});
		test('PUT', async () => {
			await(perform(RequestHelper.put, 'http:', httpPort, 'PUT', {}));
		});
		test('DELETE', async () => {
			await(perform(RequestHelper.delete, 'http:', httpPort, 'DELETE', {}));
		});
	});
	describe('HTTPS', () => {
		test('GET', async () => {
			await(perform(RequestHelper.get, 'https:', httpsPort, 'GET', {}));
		});
		test('POST', async () => {
			await(perform(RequestHelper.post, 'https:', httpsPort, 'POST', {}));
		});
		test('PUT', async () => {
			await(perform(RequestHelper.put, 'https:', httpsPort, 'PUT', {}));
		});
		test('DELETE', async () => {
			await(perform(RequestHelper.delete, 'https:', httpsPort, 'DELETE', {}));
		});
	});
});

describe('Ingress Gate', () => {
	describe('registerSubmit', () => {
		const wrongRequest1 = null as Request;
		const wrongRequest2 = ({body: null} as any) as Request;
		const wrongRequest3 = ({body: undefined} as any) as Request;
		const wrongRequest4 = ({body: ''} as any) as Request;
		const wrongRequest5 = ({body: {}} as any) as Request;
		const wrongRequest6 = ({body: {guid: 'guid0'}} as any) as Request;
		const wrongRequest7 = ({body: {guid: []}} as any) as Request;
		const correctRequest1 = ({body: {guid: 'guid1'}} as any) as Request;
		const correctRequest2 = ({body: {guid: 'guid2'}} as any) as Request;
		const correctRequest3 = ({body: {guid: 'guid3'}} as any) as Request;
		const correctRequest4 = ({body: {guid: 'guid4'}} as any) as Request;
		const correctRequest5 = ({body: {guid: 'guid5'}} as any) as Request;
		const correctRequest6 = ({body: {guid: 'guid6'}} as any) as Request;
		const correctRequest7 = ({body: {guid: 'guid7'}} as any) as Request;
		const correctRequest8 = ({body: {guid: 'guid8'}} as any) as Request;
		const correctRequest9 = ({body: {guid: 'guid9'}} as any) as Request;
		
		test('registerSubmit', async () => {
			expect(() => { RequestHelper.registerSubmit(' pageId1', 'guid1', 'test', ['field1'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'gu..id1', 'test', ['field1'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 't$est', ['field1'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', ['fi eld1'], {a: 1}); }).toThrow();
			
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', ['field1'], {a: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid2', 'test', ['field0'], {a: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid3', 'test', ['field0'], {a: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', ['field1'], {a: 2}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId2', 'guid2', 'insert', ['field1', 'field2'], {b: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId2', 'guid3', 'insert', ['field0', 'field2'], {b: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId2', 'guid4', 'insert', ['field0', 'field2'], {b: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId2', 'guid2', 'insert', ['field1', 'field2'], {b: 2}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId3', 'guid3', 'update', ['field1', 'field2'], {}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId3', 'guid3', 'update', ['field1', 'field2'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId4', 'guid4', 'upsert', ['field3'], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId4', 'guid4', 'upsert', ['field3'], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId5', 'guid5', 'delete', ['field3'], {a: 1, b: 2}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId5', 'guid5', 'delete', ['field3'], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId6', 'guid6', 'retrieve', ['field4', 'field5', 'field6', 'field7'], {a: 2, b: 3}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId6', 'guid6', 'retrieve', ['field4', 'field5', 'field6', 'field7'], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId7', 'guid7', 'popup', ['field8'], {}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId7', 'guid7', 'popup', ['field8'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId8', 'guid8', 'navigate', [], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId8', 'guid8', 'navigate', [], {a: 2, b: 3}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [], undefined); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [null], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', ['field1', undefined], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [undefined, null], null); }).toThrow();
			
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', [], undefined); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', null, {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', undefined, {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', null, [], {}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', undefined, [], {}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', null, 'test', [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', undefined, 'test', [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit(null, 'guid1', 'test', [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit(undefined, 'guid1', 'test', [], {}); }).toThrow();
		});
		test('getAction', async () => {
			expect(() => { RequestHelper.getAction('#$%^', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction(null, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction(undefined, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', null); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', undefined); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest2); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest3); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest4); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest5); }).not.toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest6); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest7); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId2', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId3', correctRequest2); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', correctRequest3); }).not.toThrow();
			
			expect(RequestHelper.getAction('pageId1', wrongRequest5)).toEqual(null);
			
			expect(RequestHelper.getAction('pageId1', correctRequest1)).toEqual(ActionType.Test);
			expect(RequestHelper.getAction('pageId2', correctRequest2)).toEqual(ActionType.Insert);
			expect(RequestHelper.getAction('pageId3', correctRequest3)).toEqual(ActionType.Update);
			expect(RequestHelper.getAction('pageId4', correctRequest4)).toEqual(ActionType.Upsert);
			expect(RequestHelper.getAction('pageId5', correctRequest5)).toEqual(ActionType.Delete);
			expect(RequestHelper.getAction('pageId6', correctRequest6)).toEqual(ActionType.Retrieve);
			expect(RequestHelper.getAction('pageId7', correctRequest7)).toEqual(ActionType.Popup);
			expect(RequestHelper.getAction('pageId8', correctRequest8)).toEqual(ActionType.Navigate);
			expect(RequestHelper.getAction('pageId9', correctRequest9)).toEqual(null);
		});
		test('getFields', async () => {
			expect(() => { RequestHelper.getFields('#$%^', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields(null, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields(undefined, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', null); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', undefined); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest2); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest3); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest4); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest5); }).not.toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest6); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest7); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId2', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId3', correctRequest2); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', correctRequest3); }).not.toThrow();
			
			expect(RequestHelper.getFields('pageId1', wrongRequest5)).toEqual([]);
			
			expect(RequestHelper.getFields('pageId1', correctRequest1)).toEqual(['field1']);
			expect(RequestHelper.getFields('pageId2', correctRequest2)).toEqual(['field1', 'field2']);
			expect(RequestHelper.getFields('pageId3', correctRequest3)).toEqual(['field1', 'field2']);
			expect(RequestHelper.getFields('pageId4', correctRequest4)).toEqual(['field3']);
			expect(RequestHelper.getFields('pageId5', correctRequest5)).toEqual(['field3']);
			expect(RequestHelper.getFields('pageId6', correctRequest6)).toEqual(['field4', 'field5', 'field6', 'field7']);
			expect(RequestHelper.getFields('pageId7', correctRequest7)).toEqual(['field8']);
			expect(RequestHelper.getFields('pageId8', correctRequest8)).toEqual([]);
			expect(RequestHelper.getFields('pageId9', correctRequest9)).toEqual([]);
		});
		test('getOptions', async () => {
			expect(() => { RequestHelper.getOptions('#$%^', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions(null, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions(undefined, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', null); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', undefined); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest2); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest3); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest4); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest5); }).not.toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest6); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest7); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId2', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId3', correctRequest2); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', correctRequest3); }).not.toThrow();
			
			expect(RequestHelper.getOptions('pageId1', wrongRequest5)).toEqual(null);
			
			expect(RequestHelper.getOptions('pageId1', correctRequest1)).toEqual({a: 1});
			expect(RequestHelper.getOptions('pageId2', correctRequest2)).toEqual({b: 1});
			expect(RequestHelper.getOptions('pageId3', correctRequest3)).toEqual({});
			expect(RequestHelper.getOptions('pageId4', correctRequest4)).toEqual(null);
			expect(RequestHelper.getOptions('pageId5', correctRequest5)).toEqual({a: 1, b: 2});
			expect(RequestHelper.getOptions('pageId6', correctRequest6)).toEqual({a: 2, b: 3});
			expect(RequestHelper.getOptions('pageId7', correctRequest7)).toEqual({});
			expect(RequestHelper.getOptions('pageId8', correctRequest8)).toEqual(null);
			expect(RequestHelper.getOptions('pageId9', correctRequest9)).toEqual(null);
		});
	});
	describe('registerInput', () => {
		test('registerInput', async () => {
			expect(() => { RequestHelper.registerInput(' field1', 'relational', 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'rel$ational', 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1.', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', 'nam e1'); }).toThrow();
			
			expect(() => { RequestHelper.registerInput('', 'relational', 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput(null, 'relational', 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput(undefined, 'relational', 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', '', 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', null, 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', undefined, 'collection1', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', '', 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', null, 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', undefined, 'name1'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', ''); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', null); }).toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', undefined); }).toThrow();

			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', 'name1'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', 'name1'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field1', 'relational', 'collection1', 'name2'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field2', 'worker', 'collection2.collection3', 'name2'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field2', 'worker', 'collection2.collection3', 'name2'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field2', 'worker', 'collection3', 'name2'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field3', 'document', 'collection3', 'collection4.name3'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field3', 'document', 'collection3', 'collection4.name3'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field3', 'volatile-memory', 'collection3', 'name3'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field4', 'volatile-memory', 'collection4', 'name4'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field4', 'volatile-memory', 'collection4', 'name4'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field4', '', 'collection4', 'name4'); }).toThrow();
			expect(() => { RequestHelper.registerInput('field5', 'RESTful', 'collection5.collection6', 'collection7.name5'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field5', 'RESTful', 'collection5.collection6', 'collection7.name5'); }).not.toThrow();
			expect(() => { RequestHelper.registerInput('field5', 'RESTful', 'collection5', ''); }).toThrow();
			expect(() => { RequestHelper.registerInput('field6', 'unknown', 'collection6', 'name6'); }).toThrow();
		});
		test('getParamInfos', async () => {
			expect(() => { RequestHelper.getParamInfos('#$%^'); }).toThrow();
			expect(() => { RequestHelper.getParamInfos(''); }).toThrow();
			expect(() => { RequestHelper.getParamInfos(null); }).toThrow();
			expect(() => { RequestHelper.getParamInfos(undefined); }).toThrow();
			expect(() => { RequestHelper.getParamInfos('field0'); }).toThrow();
			expect(() => { RequestHelper.getParamInfos('field7'); }).toThrow();
			expect(() => { RequestHelper.getParamInfos('field8'); }).toThrow();
			
			expect(RequestHelper.getParamInfos('field1')).toEqual({"group": "collection1", "name": "name1", "target": 0});
			expect(RequestHelper.getParamInfos('field2')).toEqual({"group": "collection2.collection3", "name": "name2", "target": 1});
			expect(RequestHelper.getParamInfos('field3')).toEqual({"group": "collection3", "name": "collection4.name3", "target": 2});
			expect(RequestHelper.getParamInfos('field4')).toEqual({"group": "collection4", "name": "name4", "target": 3});
			expect(RequestHelper.getParamInfos('field5')).toEqual({"group": "collection5.collection6", "name": "collection7.name5", "target": 4});
			
			expect(() => { RequestHelper.getParamInfos('guid6'); }).toThrow();
		});
		test('getSchema', async () => {
			const wrongRequest1 = null as Request;
			const wrongRequest2 = ({body: null} as any) as Request;
			const wrongRequest3 = ({body: undefined} as any) as Request;
			const wrongRequest4 = ({body: ''} as any) as Request;
			const wrongRequest5 = ({body: {}} as any) as Request;
			const wrongRequest6 = ({body: {guid: 'guid0'}} as any) as Request;
			const wrongRequest7 = ({body: {guid: []}} as any) as Request;
			const correctRequest1 = ({body: {guid: 'guid1'}} as any) as Request;
			const correctRequest2 = ({body: {guid: 'guid2'}} as any) as Request;
			const correctRequest3 = ({body: {guid: 'guid3'}} as any) as Request;
			const correctRequest4 = ({body: {guid: 'guid4'}} as any) as Request;
			const correctRequest6 = ({body: {guid: 'guid6'}} as any) as Request;
			const correctRequest8 = ({body: {guid: 'guid8'}} as any) as Request;
			
			const tables: {[Identifier: string]: DataTableSchema} = {};
			const schemata: DataSchema = {
				tables: tables
			};
			tables['collection1'] = {
				source: SourceType.Relational,
				group: 'collection1',
				guid: 'guidCollection1',
			  keys: {},
			  columns: {},
			  relations: {},
			  modifyingPermission: null,
			  retrievingPermission: null
			};
			tables['collection2'] = {
				source: SourceType.PrioritizedWorker,
				group: 'collection2',
				guid: 'guidCollection2',
			  keys: {},
			  columns: {},
			  relations: {},
			  modifyingPermission: null,
			  retrievingPermission: null
			};
			tables['collection3'] = {
				source: SourceType.Document,
				group: 'collection3',
				guid: 'guidCollection3',
			  keys: {},
			  columns: {},
			  relations: {},
			  modifyingPermission: null,
			  retrievingPermission: null
			};
			tables['collection4'] = {
				source: SourceType.VolatileMemory,
				group: 'collection4',
				guid: 'guidCollection4',
			  keys: {},
			  columns: {},
			  relations: {},
			  modifyingPermission: null,
			  retrievingPermission: null
			};
			tables['collection5'] = {
				source: SourceType.RESTful,
				group: 'collection5',
				guid: 'guidCollection5',
			  keys: {},
			  columns: {},
			  relations: {},
			  modifyingPermission: null,
			  retrievingPermission: null
			};
			
			expect(() => { RequestHelper.getSchema('#$%^', correctRequest1, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('', correctRequest1, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema(null, correctRequest1, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema(undefined, correctRequest1, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest1, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest2, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest3, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest4, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest5, schemata); }).not.toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest6, schemata); }).toThrow();
			expect(() => { RequestHelper.getSchema('pageId1', wrongRequest7, schemata); }).toThrow();
			
			expect(RequestHelper.getSchema('pageId1', correctRequest1, schemata)).toEqual(tables['collection1']);
			expect(RequestHelper.getSchema('pageId2', correctRequest2, schemata)).toEqual(tables['collection1']);
			expect(RequestHelper.getSchema('pageId4', correctRequest4, schemata)).toEqual(tables['collection3']);
			expect(RequestHelper.getSchema('pageId6', correctRequest6, schemata)).toEqual(tables['collection4']);
			expect(RequestHelper.getSchema('pageId8', correctRequest8, schemata)).toEqual(null);
		});
	});
});
describe('Extract Inputs', () => {
	const correctRequest1 = ({body: {guid: 'guid1n1', field2n1: '123'}} as any) as Request;
	RequestHelper.registerSubmit('pageId1n1', 'guid1n1', 'test', [], {});
	
	const correctRequest2 = ({body: {guid: 'guid2n1'}} as any) as Request;
	RequestHelper.registerSubmit('pageId2n1', 'guid2n1', 'test', ['field2n1'], {});
	RequestHelper.registerInput('field2n1', 'relational', 'collection2n1', 'name2n1');
	RequestHelper.registerInput('field2n2', 'relational', 'collection2n1', 'name2n2');
	RequestHelper.registerInput('field2n3', 'relational', 'collection2n1', 'name2n3');
	
	const correctRequest3 = ({body: {guid: 'guid3n1', field3n1: '123', field3n2: 'true', field3n3: '0.00123', field3n4: '!@#$%[^&]*(', field3n5: '2021-11-05T10:28:25.361Z', field3n6: ''}} as any) as Request;
	RequestHelper.registerSubmit('pageId3n1', 'guid3n1', 'test', ['field3n1', 'field3n2', 'field3n3', 'field3n4', 'field3n5', 'field3n6'], {});
	RequestHelper.registerInput('field3n1', 'worker', '!collection3n1', 'name3n1');
	RequestHelper.registerInput('field3n2', 'worker', '@collection3n1', 'name3n2');
	RequestHelper.registerInput('field3n3', 'worker', '!@collection3n1', 'name3n3');
	RequestHelper.registerInput('field3n4', 'worker', '@!collection3n1', 'name3n4');
	
	const correctRequest4 = ({body: {guid: 'guid4n1'}} as any) as Request;
	RequestHelper.registerSubmit('pageId4n1', 'guid4n1', 'test', ['field4n1', 'field4n2', 'field4n3', 'field4n4'], {});
	RequestHelper.registerInput('field4n1', 'document', 'collection4n1.collection4n2', 'name4n1');
	RequestHelper.registerInput('field4n2', 'document', 'collection4n1', 'name4n2');
	RequestHelper.registerInput('field4n3', 'document', 'collection4n1.collection4n3.collection4n4', 'name4n3');
	RequestHelper.registerInput('field4n4', 'document', 'collection4n1.collection4n4', 'name4n4');
	
	const correctRequest5 = ({body: {guid: 'guid5n1'}} as any) as Request;
	const correctRequest6 = ({body: {guid: 'guid6n1'}} as any) as Request;
	RequestHelper.registerSubmit('pageId5n1', 'guid5n1', 'test', ['field5n1', 'field5n2', 'field5n3', 'field5n4'], {});
	RequestHelper.registerSubmit('pageId6n1', 'guid6n1', 'test', ['field5n1', 'field5n2', 'field6n1', 'field6n2'], {});
	RequestHelper.registerInput('field5n1', 'relational', 'collection5n1', 'name5n1');
	RequestHelper.registerInput('field5n2', 'relational', '!@collection5n1.collection5n2', 'name5n2');
	RequestHelper.registerInput('field5n3', 'worker', '!collection5n2', 'name5n1');
	RequestHelper.registerInput('field5n4', 'document', 'collection5n2.collection5n3.@collection5n4', 'name5n2');
	RequestHelper.registerInput('field6n1', 'volatile-memory', 'collection6n1.!@collection6n2.collection6n3.!collection6n4', 'name5n1');
	RequestHelper.registerInput('field6n2', 'RESTful', '@!collection6n2', 'name5n2');
	
	const correctRequest7 = ({body: {guid: 'guid6n1', field5n1: '1', field5n2: '2', field6n1: '3', field6n2: '4'}} as any) as Request;
	const correctRequest8 = ({body: {guid: 'guid6n1', field5n1: '1', field5n2: '2', field7n1: '3', field7n2: '4'}} as any) as Request;
	
	const tables: {[Identifier: string]: DataTableSchema} = {};
	const schemata: DataSchema = {
		tables: tables
	};
	schemata.tables['collection2n1'] = {
		source: SourceType.Relational,
		group: 'collection2n1',
		guid: 'collection2n1',
	  keys: {
	  	field2n1: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  columns: {
	  	field2n2: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field2n3: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection3n1'] = {
		source: SourceType.PrioritizedWorker,
		group: 'collection3n1',
		guid: 'collection3n1',
	  keys: {
	  	field3n3: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field3n4: {fieldType: FieldType.String, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  columns: {
	  	field3n1: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field3n2: {fieldType: FieldType.Boolean, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection4n1'] = {
		source: SourceType.Document,
		group: 'collection4n1',
		guid: 'collection4n1',
	  keys: {
	  	field4n2: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field4n5: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  columns: {
	  	field4n6: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field4n7: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection4n2'] = {
		source: SourceType.Document,
		group: 'collection4n2',
		guid: 'collection4n2',
	  keys: {},
	  columns: {field4n1: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}},
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection4n3'] = {
		source: SourceType.Document,
		group: 'collection4n3',
		guid: 'collection4n3',
	  keys: {},
	  columns: {},
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection4n4'] = {
		source: SourceType.Document,
		group: 'collection4n4',
		guid: 'collection4n4',
	  keys: {},
	  columns: {
	  	field4n3: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field4n4: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection5n1'] = {
		source: SourceType.Relational,
		group: 'collection5n1',
		guid: 'collection5n1',
	  keys: {
	  	field5n1: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field5n5: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  columns: {
	  	field5n6: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field5n7: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection5n2'] = {
		source: SourceType.Relational,
		group: 'collection5n2',
		guid: 'collection5n2',
	  keys: {},
	  columns: {
	  	field5n1: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null},
	  	field5n2: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection5n3'] = {
		source: SourceType.PrioritizedWorker,
		group: 'collection5n3',
		guid: 'collection5n3',
	  keys: {},
	  columns: {},
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection5n4'] = {
		source: SourceType.Document,
		group: 'collection5n4',
		guid: 'collection5n4',
	  keys: {},
	  columns: {
	  	field5n2: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection6n1'] = {
		source: SourceType.Document,
		group: 'collection6n1',
		guid: 'collection6n1',
	  keys: {},
	  columns: {},
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection6n2'] = {
		source: SourceType.RESTful,
		group: 'collection6n2',
		guid: 'collection6n2',
	  keys: {},
	  columns: {
	  	field6n2: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection6n3'] = {
		source: SourceType.Document,
		group: 'collection6n3',
		guid: 'collection6n3',
	  keys: {},
	  columns: {},
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	schemata.tables['collection6n4'] = {
		source: SourceType.VolatileMemory,
		group: 'collection6n4',
		guid: 'collection6n4',
	  keys: {},
	  columns: {
	  	field6n1: {fieldType: FieldType.Number, name: null, guid: null, required: false, unique: false, verb: null, url: null, modifyingPermission: null, retrievingPermission: null}
	  },
	  relations: {},
	  modifyingPermission: null,
	  retrievingPermission: null
	};
	
	test('getInput', () => {
		expect(() => { RequestHelper.getInput('page.Id2n1', correctRequest2, 'field2n1'); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', correctRequest2, 'fie ld2n1'); }).toThrow();
		
		expect(() => { RequestHelper.getInput('pageId1n1', correctRequest1, 'field1n1[0]'); }).toThrow();
		expect(() => { RequestHelper.getInput(null, correctRequest2, 'field2n1'); }).toThrow();
		expect(() => { RequestHelper.getInput(undefined, correctRequest2, 'field2n1'); }).toThrow();
		expect(() => { RequestHelper.getInput('', correctRequest2, 'field2n1'); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', null, 'field2n1'); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', undefined, 'field2n1'); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', correctRequest2, null); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', correctRequest2, undefined); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', correctRequest2, ''); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId2n1', correctRequest2, 'field2n1_1'); }).toThrow();
		
		// Test division
		// 
		expect(RequestHelper.getInput('pageId2n1', correctRequest2, 'field2n1')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'name2n1',
  		value: undefined,
  		guid: 'field2n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId2n1', correctRequest2, 'field2n1[0]')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'name2n1',
  		value: undefined,
  		guid: 'field2n1[0]',
  		premise: null,
  		division: [0],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId2n1', correctRequest2, 'field2n1[0,2]')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'name2n1',
  		value: undefined,
  		guid: 'field2n1[0,2]',
  		premise: null,
  		division: [0, 2],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId2n1', correctRequest2, 'field2n1[0,2,1]')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'name2n1',
  		value: undefined,
  		guid: 'field2n1[0,2,1]',
  		premise: null,
  		division: [0, 2, 1],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId2n1', correctRequest2, 'field2n1[0,-2,1]')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'name2n1',
  		value: undefined,
  		guid: 'field2n1[0,-2,1]',
  		premise: null,
  		division: [0, -2, 1],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		
		// Test associate, notify, present and absent value
		// 
		expect(RequestHelper.getInput('pageId3n1', correctRequest3, 'field3n1')).toEqual({
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'name3n1',
  		value: '123',
  		guid: 'field3n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: true,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId3n1', correctRequest3, 'field3n2')).toEqual({
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'name3n2',
  		value: 'true',
  		guid: 'field3n2',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId3n1', correctRequest3, 'field3n3')).toEqual({
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'name3n3',
  		value: '0.00123',
  		guid: 'field3n3',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId3n1', correctRequest3, 'field3n4')).toEqual({
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'name3n4',
  		value: '!@#$%[^&]*(',
  		guid: 'field3n4',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		});
		expect(() => { RequestHelper.getInput('pageId3n1', correctRequest3, 'field3n5'); }).toThrow();
		expect(() => { RequestHelper.getInput('pageId3n1', correctRequest3, 'field3n6'); }).toThrow();
		
		// Test premise
		// 
		expect(RequestHelper.getInput('pageId4n1', correctRequest4, 'field4n1')).toEqual({
		  target: SourceType.Document,
  		group: 'collection4n2',
  		name: 'name4n1',
  		value: undefined,
  		guid: 'field4n1',
  		premise: 'collection4n1',
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId4n1', correctRequest4, 'field4n2')).toEqual({
		  target: SourceType.Document,
  		group: 'collection4n1',
  		name: 'name4n2',
  		value: undefined,
  		guid: 'field4n2',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId4n1', correctRequest4, 'field4n3')).toEqual({
		  target: SourceType.Document,
  		group: 'collection4n4',
  		name: 'name4n3',
  		value: undefined,
  		guid: 'field4n3',
  		premise: 'collection4n1.collection4n3',
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId4n1', correctRequest4, 'field4n4')).toEqual({
		  target: SourceType.Document,
  		group: 'collection4n4',
  		name: 'name4n4',
  		value: undefined,
  		guid: 'field4n4',
  		premise: 'collection4n1',
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		
		// Test SourceType, and sharing of same inputs, advanced associate and notify
		//
		expect(RequestHelper.getInput('pageId5n1', correctRequest5, 'field5n1')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection5n1',
  		name: 'name5n1',
  		value: undefined,
  		guid: 'field5n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId5n1', correctRequest5, 'field5n2')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection5n2',
  		name: 'name5n2',
  		value: undefined,
  		guid: 'field5n2',
  		premise: 'collection5n1',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId5n1', correctRequest5, 'field5n3')).toEqual({
		  target: SourceType.PrioritizedWorker,
  		group: 'collection5n2',
  		name: 'name5n1',
  		value: undefined,
  		guid: 'field5n3',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: true,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId5n1', correctRequest5, 'field5n4')).toEqual({
		  target: SourceType.Document,
  		group: 'collection5n4',
  		name: 'name5n2',
  		value: undefined,
  		guid: 'field5n4',
  		premise: 'collection5n2.collection5n3',
  		division: [],
  		associate: true,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId6n1', correctRequest6, 'field5n1')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection5n1',
  		name: 'name5n1',
  		value: undefined,
  		guid: 'field5n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId6n1', correctRequest6, 'field5n2')).toEqual({
		  target: SourceType.Relational,
  		group: 'collection5n2',
  		name: 'name5n2',
  		value: undefined,
  		guid: 'field5n2',
  		premise: 'collection5n1',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId6n1', correctRequest6, 'field6n1')).toEqual({
		  target: SourceType.VolatileMemory,
  		group: 'collection6n4',
  		name: 'name5n1',
  		value: undefined,
  		guid: 'field6n1',
  		premise: 'collection6n1.collection6n2.collection6n3',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		});
		expect(RequestHelper.getInput('pageId6n1', correctRequest6, 'field6n2')).toEqual({
		  target: SourceType.RESTful,
  		group: 'collection6n2',
  		name: 'name5n2',
  		value: undefined,
  		guid: 'field6n2',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		});
	});
	test('getInputs', () => {
		expect(() => { RequestHelper.getInputs('page.Id6n1', correctRequest7, 'guid6n1'); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', correctRequest7, 'guid 6n1'); }).toThrow();
		
		expect(() => { RequestHelper.getInputs(undefined, correctRequest7, 'guid6n1'); }).toThrow();
		expect(() => { RequestHelper.getInputs(null, correctRequest7, 'guid6n1'); }).toThrow();
		expect(() => { RequestHelper.getInputs('', correctRequest7, 'guid6n1'); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', null, 'guid6n1'); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', undefined, 'guid6n1'); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', correctRequest7, undefined); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', correctRequest7, null); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', correctRequest7, ''); }).toThrow();
		
		expect(RequestHelper.getInputs('pageId6n1', correctRequest7, 'guid6n1')).toEqual([{
		  target: SourceType.Relational,
  		group: 'collection5n1',
  		name: 'name5n1',
  		value: '1',
  		guid: 'field5n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: undefined
		},{
		  target: SourceType.Relational,
  		group: 'collection5n2',
  		name: 'name5n2',
  		value: '2',
  		guid: 'field5n2',
  		premise: 'collection5n1',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		},{
		  target: SourceType.VolatileMemory,
  		group: 'collection6n4',
  		name: 'name5n1',
  		value: '3',
  		guid: 'field6n1',
  		premise: 'collection6n1.collection6n2.collection6n3',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		},{
		  target: SourceType.RESTful,
  		group: 'collection6n2',
  		name: 'name5n2',
  		value: '4',
  		guid: 'field6n2',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: undefined
		}]);
		
		expect(() => { RequestHelper.getInputs('pageId6n1', correctRequest7, 'guid6n2'); }).toThrow();
		expect(() => { RequestHelper.getInputs('pageId6n1', correctRequest8, 'guid6n1'); }).toThrow();
	});
	test('createInputs', () => {
		expect(() => { RequestHelper.createInputs({
			'@!co$llection6n2.field6n2': undefined
		}, schemata); }).toThrow();
		
		expect(() => { RequestHelper.createInputs({}, schemata); }).not.toThrow();
		expect(() => { RequestHelper.createInputs({'field2n1': undefined}, schemata); }).toThrow();
		expect(() => { RequestHelper.createInputs({'collection2n5.field2n1': undefined}, schemata); }).toThrow();
		expect(() => { RequestHelper.createInputs({'collection2n1.field2n1': undefined}, schemata); }).not.toThrow();
		
		expect(RequestHelper.createInputs({
			'collection2n1.field2n1': undefined,
			'collection2n1.field2n1[0]': undefined,
			'collection2n1.field2n1[0,2]': undefined,
			'collection2n1.field2n1[0,2,1]': undefined,
			'collection2n1.field2n1[0,-2,1]': 'null',
			'!collection3n1.field3n1': null,
			'@collection3n1.field3n2': 'true',
			'!@collection3n1.field3n3': '0.00123',
			'@!collection3n1.field3n4': '!@#$%[^&]*(',
			'collection4n1.collection4n2.field4n1': undefined,
			'collection4n1.field4n2': undefined,
			'collection4n1.collection4n3.collection4n4.field4n3': undefined,
			'collection4n1.collection4n4.field4n4': undefined,
			'collection5n1.field5n1': undefined,
			'!@collection5n1.collection5n2.field5n2': undefined,
			'!collection5n2.field5n1': undefined,
			'collection5n2.collection5n3.@collection5n4.field5n2': undefined,
			'collection6n1.!@collection6n2.collection6n3.!collection6n4.field6n1': undefined,
			'@!collection6n2.field6n2': undefined
		}, schemata)).toEqual([{
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: undefined,
  		guid: 'collection2n1.field2n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: undefined,
  		guid: 'collection2n1.field2n1[0]',
  		premise: null,
  		division: [0],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: undefined,
  		guid: 'collection2n1.field2n1[0,2]',
  		premise: null,
  		division: [0, 2],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: undefined,
  		guid: 'collection2n1.field2n1[0,2,1]',
  		premise: null,
  		division: [0, 2, 1],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: null,
  		guid: 'collection2n1.field2n1[0,-2,1]',
  		premise: null,
  		division: [0, -2, 1],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'field3n1',
  		value: null,
  		guid: '!collection3n1.field3n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: true,
  		validation: null
		}, {
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'field3n2',
  		value: 'true',
  		guid: '@collection3n1.field3n2',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'field3n3',
  		value: 0.00123,
  		guid: '!@collection3n1.field3n3',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: null
		}, {
		  target: SourceType.PrioritizedWorker,
  		group: 'collection3n1',
  		name: 'field3n4',
  		value: '!@#$%[^&]*(',
  		guid: '@!collection3n1.field3n4',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: null
		}, {
		  target: SourceType.Document,
  		group: 'collection4n2',
  		name: 'field4n1',
  		value: undefined,
  		guid: 'collection4n1.collection4n2.field4n1',
  		premise: 'collection4n1',
  		division: [],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Document,
  		group: 'collection4n1',
  		name: 'field4n2',
  		value: undefined,
  		guid: 'collection4n1.field4n2',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Document,
  		group: 'collection4n4',
  		name: 'field4n3',
  		value: undefined,
  		guid: 'collection4n1.collection4n3.collection4n4.field4n3',
  		premise: 'collection4n1.collection4n3',
  		division: [],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Document,
  		group: 'collection4n4',
  		name: 'field4n4',
  		value: undefined,
  		guid: 'collection4n1.collection4n4.field4n4',
  		premise: 'collection4n1',
  		division: [],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection5n1',
  		name: 'field5n1',
  		value: undefined,
  		guid: 'collection5n1.field5n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection5n2',
  		name: 'field5n2',
  		value: undefined,
  		guid: '!@collection5n1.collection5n2.field5n2',
  		premise: 'collection5n1',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection5n2',
  		name: 'field5n1',
  		value: undefined,
  		guid: '!collection5n2.field5n1',
  		premise: null,
  		division: [],
  		associate: false,
  		notify: true,
  		validation: null
		}, {
		  target: SourceType.Document,
  		group: 'collection5n4',
  		name: 'field5n2',
  		value: undefined,
  		guid: 'collection5n2.collection5n3.@collection5n4.field5n2',
  		premise: 'collection5n2.collection5n3',
  		division: [],
  		associate: true,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.VolatileMemory,
  		group: 'collection6n4',
  		name: 'field6n1',
  		value: undefined,
  		guid: 'collection6n1.!@collection6n2.collection6n3.!collection6n4.field6n1',
  		premise: 'collection6n1.collection6n2.collection6n3',
  		division: [],
  		associate: true,
  		notify: true,
  		validation: null
		}, {
		  target: SourceType.RESTful,
  		group: 'collection6n2',
  		name: 'field6n2',
  		value: undefined,
  		guid: '@!collection6n2.field6n2',
  		premise: null,
  		division: [],
  		associate: true,
  		notify: true,
  		validation: null
		}]);
		
		expect(RequestHelper.createInputs({
			'collection2n1.field2n1': [0,1,3]
		}, schemata)).toEqual([{
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: 0,
  		guid: 'collection2n1.field2n1[0]',
  		premise: null,
  		division: [0],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: 1,
  		guid: 'collection2n1.field2n1[1]',
  		premise: null,
  		division: [1],
  		associate: false,
  		notify: false,
  		validation: null
		}, {
		  target: SourceType.Relational,
  		group: 'collection2n1',
  		name: 'field2n1',
  		value: 3,
  		guid: 'collection2n1.field2n1[2]',
  		premise: null,
  		division: [2],
  		associate: false,
  		notify: false,
  		validation: null
		}]);
	});
	test('sortInputs', () => {
		RequestHelper.registerInput('field4n5', 'document', 'collection4n1', 'name4n5');
		RequestHelper.registerInput('field4n6', 'document', 'collection4n1', 'name4n6');
		RequestHelper.registerInput('field4n7', 'document', 'collection4n1', 'name4n7');
		RequestHelper.registerInput('field5n5', 'relational', 'collection5n1', 'name5n5');
		RequestHelper.registerInput('field5n6', 'relational', 'collection5n1', 'name5n6');
		RequestHelper.registerInput('field5n7', 'relational', 'collection5n1', 'name5n7');
		
		let data: any = null;
		let expected: any = null;
		
		data = RequestHelper.createInputs({
			'collection2n1.field2n1': undefined,
			'collection2n1.field2n2': undefined,
			'collection2n1.field2n3': undefined,
			'collection3n1.field3n1': undefined,
			'collection3n1.field3n2': undefined,
			'collection3n1.field3n3': undefined,
			'collection2n1.field2n1[0]': undefined,
			'collection3n1.field3n1[0]': undefined,
			'collection2n1.field2n2[1]': undefined,
			'collection3n1.field3n2[1]': undefined,
			'collection2n1.field2n3[2]': undefined,
			'collection3n1.field3n3[2]': undefined
		}, schemata);
		expected = data.map((input) => input['guid']);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		
		data = RequestHelper.createInputs({
			'collection2n1.field2n1': undefined,
			'collection2n1.field2n2': undefined,
			'collection2n1.field2n3': undefined,
			'collection3n1.field3n1': undefined,
			'collection3n1.field3n2': undefined,
			'collection3n1.field3n3': undefined,
			'collection4n1.field4n5': undefined,
			'collection4n1.field4n6': undefined,
			'collection4n1.field4n7': undefined,
			'collection5n1.field5n5': undefined,
			'collection5n1.field5n6': undefined,
			'collection5n1.field5n7': undefined,
			'collection2n1.field2n1[0]': undefined,
			'collection3n1.field3n1[0,1]': undefined,
			'collection4n1.field4n5[0,1]': undefined,
			'collection5n1.field5n5[0,1,0]': undefined,
			'collection2n1.field2n2[1]': undefined,
			'collection3n1.field3n2[1,0,0]': undefined,
			'collection4n1.field4n6[1,0,1]': undefined,
			'collection5n1.field5n6[1,0,1]': undefined,
			'collection2n1.field2n3[2,-1,-1]': undefined,
			'collection3n1.field3n3[2,-1]': undefined,
			'collection4n1.field4n7[2,0,-2]': undefined,
			'collection5n1.field5n7[2,0,-1]': undefined,
			'collection2n1.field2n3[3,-1]': undefined,
			'collection3n1.field3n3[3]': undefined,
			'collection4n1.field4n7[3,0,-2]': undefined,
			'collection5n1.field5n7[3,1]': undefined
		}, schemata);0
		expected = data.map((input) => input['guid']);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
		data.sort(() => .5 - Math.random());
		expect(data.map((input) => input['guid'])).not.toEqual(expected);
		RequestHelper.sortInputs(data);
		expect(data.map((input) => input['guid'])).toEqual(expected);
	});
});