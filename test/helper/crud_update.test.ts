import {DocumentDatabaseClient} from "../../src/controllers/helpers/ConnectionHelper";
import {DatabaseHelper} from "../../src/controllers/helpers/DatabaseHelper";
import {RequestHelper} from "../../src/controllers/helpers/RequestHelper";
import {ProjectConfigurationHelper} from "../../src/controllers/helpers/ProjectConfigurationHelper";
import {server} from "../../src/server";

describe('CR[U]D', () => {
	let id = (new Date()).toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric'}).
  replace(/[^\d]/g, '');
	let data = (new Date()).toString();
	
	describe('Relational', () => {
	  test('Create, update, and retrieve a record.', async () => {
	  	try {
		  	let inserted = await DatabaseHelper.insert(RequestHelper.createInputs({
	 		    'RelationalTesting.tid': null,
	 		    'RelationalTesting.data': data
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['RelationalTesting'], false);
	 		  
		  	await DatabaseHelper.update(RequestHelper.createInputs({
	 		    'RelationalTesting.tid': inserted[0].keys['tid'],
	 		    'RelationalTesting.data': data
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['RelationalTesting'], false);
	 		  
		  	let dataset = await DatabaseHelper.retrieve(RequestHelper.createInputs({
	 		    'RelationalTesting.tid': inserted[0].keys['tid']
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['RelationalTesting'], false);
	   		
	   		expect(dataset['RelationalTesting'].rows.length).toBe(1);
	   		expect(dataset['RelationalTesting'].rows[0].columns['data']).toBe(data);
	   	} finally {
	   		server.close();
	   	}
	  });
	});
	
	describe('Document', () => {
	  test('Create, update, and retrieve a record.', async () => {
	  	try {
	  		let inserted = await DatabaseHelper.insert(RequestHelper.createInputs({
	 		    'DocumentTesting.tid': id,
	 		    'DocumentTesting.data': 'none'
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['DocumentTesting'], false);
	 		  
		  	await DatabaseHelper.update(RequestHelper.createInputs({
	 		    'DocumentTesting.tid': inserted[0].keys['tid'],
	 		    'DocumentTesting.data': data
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['DocumentTesting'], false);
	 		  
		  	let dataset = await DatabaseHelper.retrieve(RequestHelper.createInputs({
	 		    'DocumentTesting.tid': inserted[0].keys['tid']
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['DocumentTesting'], false);
	   		
	   		expect(dataset['DocumentTesting'].rows.length).toBe(1);
	   		expect(dataset['DocumentTesting'].rows[0].columns['data']).toBe(data);
	   	} finally {
	   		server.close();
	   	}
	  });
	});
	
	describe('Volatile', () => {
	  test('Create, update, and retrieve a record.', async () => {
	  	try {
	  		await DatabaseHelper.insert(RequestHelper.createInputs({
	 		    'VolatileTesting.prefix': id
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['VolatileTesting'], false);
	 		  
		  	await DatabaseHelper.update(RequestHelper.createInputs({
	 		    'VolatileTesting.prefix': id
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['VolatileTesting'], false);
	 		  
		  	let dataset = await DatabaseHelper.retrieve(RequestHelper.createInputs({
	 		    'VolatileTesting.prefix': id
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['VolatileTesting'], false);
	   		
	   		expect(dataset['VolatileTesting'].rows.length).toBe(1);
	   		expect(dataset['VolatileTesting'].rows[0].columns['prefix']).toBe(id);
	   	} finally {
	   		server.close();
	   	}
	  });
	});
	
	describe('RESTful', () => {
	  test('Update a record.', async () => {
	  	try {
		  	let dataset = await DatabaseHelper.update(RequestHelper.createInputs({
	 		    'RESTfulTesting.post': id,
	 		  }), ProjectConfigurationHelper.getDataSchema().tables['RESTfulTesting'], false);
	   	} finally {
	   		server.close();
	   	}
	  });
	});
});