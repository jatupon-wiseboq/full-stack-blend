import {RequestHelper} from "../../../../src/controllers/helpers/RequestHelper";
import {ActionType} from "../../../../src/controllers/helpers/DatabaseHelper";

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
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', ['1'], {a: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', ['1'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId2', 'guid2', 'insert', ['1', '2'], {b: 1}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId2', 'guid2', 'insert', ['1', '2'], {b: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId3', 'guid3', 'update', ['1', '2'], {}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId3', 'guid3', 'update', ['1', '2'], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId4', 'guid4', 'upsert', ['3'], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId4', 'guid4', 'upsert', ['3'], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId5', 'guid5', 'delete', ['3'], {a: 1, b: 2}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId5', 'guid5', 'delete', ['3'], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId6', 'guid6', 'retrieve', ['4', '5', '6', '7'], {a: 2, b: 3}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId6', 'guid6', 'retrieve', ['4', '5', '6', '7'], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId7', 'guid7', 'popup', ['8'], {}); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId7', 'guid7', 'popup', ['8'], {a: 1}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId8', 'guid8', 'navigate', [], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId8', 'guid8', 'navigate', [], {a: 2, b: 3}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [], null); }).not.toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [null], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', ['1', undefined], null); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId9', 'guid9', 'unknown', [undefined, null], null); }).toThrow();
			
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', [], undefined); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', null, {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', 'test', undefined, {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', null, [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', 'guid1', undefined, [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', null, 'test', [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit('pageId1', undefined, 'test', [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit(null, 'guid1', 'test', [], {}); }).toThrow();
			expect(() => { RequestHelper.registerSubmit(undefined, 'guid1', 'test', [], {}); }).toThrow();
		});
		test('getAction', async () => {
			expect(() => { RequestHelper.getAction(null, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction(undefined, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', null); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', undefined); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest2); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest3); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest4); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest5); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest6); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', wrongRequest7); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId2', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId3', correctRequest2); }).toThrow();
			expect(() => { RequestHelper.getAction('pageId1', correctRequest3); }).toThrow();
			
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
			expect(() => { RequestHelper.getFields(null, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields(undefined, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', null); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', undefined); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest2); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest3); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest4); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest5); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest6); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', wrongRequest7); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId2', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId3', correctRequest2); }).toThrow();
			expect(() => { RequestHelper.getFields('pageId1', correctRequest3); }).toThrow();
			
			expect(RequestHelper.getFields('pageId1', correctRequest1)).toEqual(['1']);
			expect(RequestHelper.getFields('pageId2', correctRequest2)).toEqual(['1', '2']);
			expect(RequestHelper.getFields('pageId3', correctRequest3)).toEqual(['1', '2']);
			expect(RequestHelper.getFields('pageId4', correctRequest4)).toEqual(['3']);
			expect(RequestHelper.getFields('pageId5', correctRequest5)).toEqual(['3']);
			expect(RequestHelper.getFields('pageId6', correctRequest6)).toEqual(['4', '5', '6', '7']);
			expect(RequestHelper.getFields('pageId7', correctRequest7)).toEqual(['8']);
			expect(RequestHelper.getFields('pageId8', correctRequest8)).toEqual([]);
			expect(RequestHelper.getFields('pageId9', correctRequest9)).toEqual([]);
		});
		test('getOptions', async () => {
			expect(() => { RequestHelper.getOptions(null, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions(undefined, correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', null); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', undefined); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest2); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest3); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest4); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest5); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest6); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', wrongRequest7); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId2', correctRequest1); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId3', correctRequest2); }).toThrow();
			expect(() => { RequestHelper.getOptions('pageId1', correctRequest3); }).toThrow();
			
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
});