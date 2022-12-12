import {DataTableSchema, DataColumnSchema, FieldType, SchemaHelper} from "../../../../src/controllers/helpers/SchemaHelper";
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
		test('mismatch of table name', () => {
			let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
			
			data1.tables['Log'].group = '123';
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
		let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
		
		describe('Relation', () => {
			test('base', () => {
				let permission = {
					mode: null,
				  relationModeSourceGroup: null,
				  relationModeSourceEntity: null,
				  relationMatchingMode: null,
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceGroup = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceEntity = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingMode = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingConstantValue = NaN;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingConstantValue = NaN;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingConstantValue = NaN;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: 'session',
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: 'uid',
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingConstantValue = NaN;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingConstantValue = NaN;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
			});
			test('missing a source group name', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceGroup = null;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationModeSourceGroup = undefined;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationModeSourceGroup = '';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('missing a source entity name', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceEntity = null;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationModeSourceEntity = undefined;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationModeSourceEntity = '';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('wrong of source group name', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceGroup = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('wrong of source entity name', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceEntity = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('source group unavailable', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceGroup = 'abc';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('source entity unavailable', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceEntity = '123';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('missing a session name', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: 'session',
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: 'uid',
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingSessionName = null;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationMatchingSessionName = undefined;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationMatchingSessionName = '';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('wrong of session name', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: 'session',
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: 'uid',
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('missing a constant value', () => {
				let permission = {
					mode: 'relation',
				  relationModeSourceGroup: 'User',
				  relationModeSourceEntity: 'uid',
				  relationMatchingMode: null,
				  relationMatchingConstantValue: '123',
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: null,
				  sessionMatchingConstantValue: null
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingConstantValue = null;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationMatchingConstantValue = undefined;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.relationMatchingConstantValue = '';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
		});
		describe('Session', () => {
			test('base', () => {
				let permission = {
					mode: 'session',
				  relationModeSourceGroup: null,
				  relationModeSourceEntity: null,
				  relationMatchingMode: null,
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: 'uid',
				  sessionMatchingConstantValue: '123'
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceGroup = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationModeSourceEntity = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingMode = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingConstantValue = NaN;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.relationMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
			});
			test('missing a session name', () => {
				let permission = {
					mode: 'session',
				  relationModeSourceGroup: null,
				  relationModeSourceEntity: null,
				  relationMatchingMode: null,
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: 'uid',
				  sessionMatchingConstantValue: '123'
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingSessionName = null;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.sessionMatchingSessionName = undefined;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.sessionMatchingSessionName = '';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('wrong of session name', () => {
				let permission = {
					mode: 'session',
				  relationModeSourceGroup: null,
				  relationModeSourceEntity: null,
				  relationMatchingMode: null,
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: 'uid',
				  sessionMatchingConstantValue: '123'
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingSessionName = '#$%^&*(';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
			test('missing a constant value', () => {
				let permission = {
					mode: 'session',
				  relationModeSourceGroup: null,
				  relationModeSourceEntity: null,
				  relationMatchingMode: null,
				  relationMatchingConstantValue: null,
				  relationMatchingSessionName: null,
				  sessionMatchingSessionName: 'uid',
				  sessionMatchingConstantValue: '123'
				};
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).not.toThrow();
				
				permission.sessionMatchingConstantValue = null;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.sessionMatchingConstantValue = undefined;
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
				
				permission.sessionMatchingConstantValue = '';
				expect(() => { SchemaHelper.verifyPermission(permission, data1); }).toThrow();
			});
		});
	});
});

describe('Retrieving Information', () => {
	let data1 = {tables: ProjectConfigurationHelper.convertToSchema(JSON.parse(unlabel).flows.schema)};
	
	test('Field Type', () => {
		expect(SchemaHelper.getFieldType('auto')).toEqual(FieldType.AutoNumber);
		expect(SchemaHelper.getFieldType('number')).toEqual(FieldType.Number);
		expect(SchemaHelper.getFieldType('boolean')).toEqual(FieldType.Boolean);
		expect(SchemaHelper.getFieldType('datetime')).toEqual(FieldType.DateTime);
		expect(SchemaHelper.getFieldType(null)).toEqual(FieldType.String);
		
		expect(() => { SchemaHelper.getFieldType('Auto'); }).toThrow();
		expect(() => { SchemaHelper.getFieldType(''); }).toThrow();
	});
	test('DataTableSchema', () => {
		// Direct Table
		//
		expect(
			(SchemaHelper.getSchemaFromKey('Business',
				null,
				data1, false) as DataTableSchema).group
		).toEqual('Business');
		expect(
			(SchemaHelper.getSchemaFromKey('User',
				null,
				data1, false) as DataTableSchema).group
		).toEqual('User');
		expect(
			(SchemaHelper.getSchemaFromKey('Business', // Self Selecting Ability
				(SchemaHelper.getSchemaFromKey('Business',
					null,
					data1, false) as DataTableSchema),
				data1, false) as DataTableSchema).group
		).toEqual('Business');
		expect(
			(SchemaHelper.getSchemaFromKey('Log', // Fallback Ability
				(SchemaHelper.getSchemaFromKey('Business',
					null,
					data1, false) as DataTableSchema),
				data1, false) as DataTableSchema).group
		).toEqual('Log');
			
		expect(
			SchemaHelper.getSchemaFromKey('Abc',
				null,
				data1, false)
		).toEqual(null);
		
		// Relation Table
		//
		expect(
			(SchemaHelper.getSchemaFromKey('User',
				(SchemaHelper.getSchemaFromKey('Business',
					null,
					data1, false) as DataTableSchema),
				data1, false) as DataTableSchema).group
		).toEqual('User');
		expect(
			(SchemaHelper.getSchemaFromKey('Employee',
				(SchemaHelper.getSchemaFromKey('User',
					null,
					data1, false) as DataTableSchema),
				data1, false) as DataTableSchema).group
		).toEqual('Employee');
		
		expect(
			SchemaHelper.getSchemaFromKey('Abc',
				(SchemaHelper.getSchemaFromKey('User',
					null,
					data1, false) as DataTableSchema),
				data1, false)
		).toEqual(null);
		
		expect(() => { SchemaHelper.getSchemaFromKey('', null, data1, false); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('User.', null, data1, false); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('User.abc', null, data1, false); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('.Employee.User', null, data1, false); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('.Employee..User', null, data1, false); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('Business..', null, data1, false); }).toThrow();
	});
	test('DataColumnSchema', () => {
		// Direct Field
		//
		expect(
			SchemaHelper.getSchemaFromKey('bid',
				null,
				data1, true)
		).toEqual(null);
		expect(
			SchemaHelper.getSchemaFromKey('name',
				null,
				data1, true)
		).toEqual(null);
		expect(
			(SchemaHelper.getSchemaFromKey('bid',
				(SchemaHelper.getSchemaFromKey('Business',
					null,
					data1, false) as DataTableSchema),
				data1, true) as DataColumnSchema).name
		).toEqual('bid');
		expect(
			(SchemaHelper.getSchemaFromKey('name',
				(SchemaHelper.getSchemaFromKey('Business',
					null,
					data1, false) as DataTableSchema),
				data1, true) as DataColumnSchema).name
		).toEqual('name');
		
		expect(
			SchemaHelper.getSchemaFromKey('abc',
				null,
				data1, false)
		).toEqual(null);
		
		expect(() => { SchemaHelper.getSchemaFromKey('', null, data1, true); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('User.', null, data1, true); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('.Employee.User', null, data1, true); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('.Employee..User', null, data1, true); }).toThrow();
		expect(() => { SchemaHelper.getSchemaFromKey('Business..', null, data1, true); }).toThrow();
	});
});

describe('Searching Information', () => {
	test('Undefined', () => {
		
	});
});