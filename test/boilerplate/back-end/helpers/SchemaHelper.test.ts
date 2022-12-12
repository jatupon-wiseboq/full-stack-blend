import {SchemaHelper} from "../../../../src/controllers/helpers/SchemaHelper";
import {ProjectConfigurationHelper} from "../../../../src/controllers/helpers/ProjectConfigurationHelper";
import {CodeHelper} from "../../../../src/controllers/helpers/CodeHelper";

const fs = require('fs');
const path = require('path');
const unlabel = fs.readFileSync(path.resolve(__dirname, '../files/unlabel.stackblend'), {encoding:'utf8', flag:'r'});
	
describe('Verification', () => {
	describe('Table', () => {
	  test('base', () => {
		  let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
		
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).not.toThrow();
		});
		test('missing a group name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].group = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].group = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].group = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].group = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a primary key', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].keys = {};
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].keys['id'] = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].keys = {};
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a key name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].keys['id'].name = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].keys['id'].name = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].keys['id'].name = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].keys['eid'].name = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a column name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].columns['message'].name = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].columns['message'].name = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].columns['message'].name = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].columns['note'].name = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a kind of value', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].keys['id'].fieldType = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].keys['id'].fieldType = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].columns['message'].fieldType = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].columns['message'].fieldType = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].keys['eid'].fieldType = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('wrong of key name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].keys['id'].name = 'id2';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].keys['eid'].name = 'eid2';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('wrong of column name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].columns['message'].name = 'message2';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Note'].columns['note'].name = 'note2';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
	});
	describe('Relation', () => {
		test('base', () => {
		  let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
		
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).not.toThrow();
		});
		test('missing a source group name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].sourceGroup = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].sourceGroup = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].sourceGroup = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].sourceGroup = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a source entity name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].sourceEntity = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].sourceEntity = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].sourceEntity = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].sourceEntity = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a target group name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].targetGroup = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].targetGroup = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].targetGroup = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].targetGroup = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('missing a target entity name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].targetEntity = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].targetEntity = null;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1.tables['Log'].relations['User'].targetEntity = undefined;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].targetEntity = '';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('wrong of source group name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].sourceGroup = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].sourceGroup = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('wrong of source entity name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].sourceEntity = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].sourceEntity = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('wrong of target group name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].targetGroup = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].targetGroup = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('wrong of target entity name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].relations['User'].targetEntity = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
			
			data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Business'].relations['User'].targetEntity = '123';
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
		test('unavailable of relation', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			let table = data1.tables['Log'].relations['User'];
			delete data1.tables['Log'].relations['User'];
			
			data1.tables['Log'].relations['abc'] = table;
			expect(() => { SchemaHelper.verifyDataSchema(data1); }).toThrow();
		});
	});
	describe('Permission', () => {
		describe('Relation', () => {
			test('base', () => {
			  let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
				expect(() => { SchemaHelper.verifyDataSchema(data1); }).not.toThrow();
			});
			test('missing a source group name', () => {
				
			});
			test('missing a source entity name', () => {
				
			});
			test('wrong of source group name', () => {
				
			});
			test('wrong of source entity name', () => {
				
			});
			test('source group unavailable', () => {
				
			});
			test('source entity unavailable', () => {
				
			});
			test('missing a session name', () => {
				
			});
			test('missing a constant value', () => {
				
			});
			test('wrong of session name', () => {
				
			});
		});
		describe('Session', () => {
			test('base', () => {
			  let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
				expect(() => { SchemaHelper.verifyDataSchema(data1); }).not.toThrow();
			});
			test('missing a session name', () => {
				
			});
			test('wrong of session name', () => {
				
			});
			test('missing a constant value', () => {
				
			});
		});
	});
});

describe('Searching Information', () => {
	test('Undefined', () => {
		
	});
});

describe('Retrieving Information', () => {
	test('Undefined', () => {
		
	});
});