import {RequestHelper} from "../../../../src/controllers/helpers/RequestHelper";

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
		test('GET', async () => {
			
		});
	});
});