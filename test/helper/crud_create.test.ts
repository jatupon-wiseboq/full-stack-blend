import {DocumentDatabaseClient} from "../../src/controllers/helpers/ConnectionHelper";
import {DatabaseHelper} from "../../src/controllers/helpers/DatabaseHelper";
import {RequestHelper} from "../../src/controllers/helpers/RequestHelper";
import {ProjectConfigurationHelper} from "../../src/controllers/helpers/ProjectConfigurationHelper";
import {server} from "../../src/server";

describe('[C]RUD', () => {
  let id = (new Date()).toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric'}).
  replace(/[^\d]/g, '');
  let data = (new Date()).toString();
  
  describe('Relational', () => {
    test('Create a record.', async () => {
      try {
        let dataset = await DatabaseHelper.insert(RequestHelper.createInputs({
           'RelationalTesting.tid': id,
           'RelationalTesting.data': data
         }), ProjectConfigurationHelper.getDataSchema().tables['RelationalTesting'], false);
         
         expect(dataset.length).toBe(1);
       } finally {
         server.close();
       }
    });
  });
  
  describe('Document', () => {
    test('Create a record.', async () => {
      try {
        let dataset = await DatabaseHelper.insert(RequestHelper.createInputs({
           'DocumentTesting.tid': id,
           'DocumentTesting.data': data
         }), ProjectConfigurationHelper.getDataSchema().tables['DocumentTesting'], false);
         
         expect(dataset.length).toBe(1);
       } finally {
         server.close();
       }
    });
  });
  
  describe('Volatile', () => {
    test('Create a record.', async () => {
      try {
        let dataset = await DatabaseHelper.insert(RequestHelper.createInputs({
           'VolatileTesting.prefix': id
         }), ProjectConfigurationHelper.getDataSchema().tables['VolatileTesting'], false);
         
         expect(dataset.length).toBe(1);
       } finally {
         server.close();
       }
    });
  });
  
  describe('RESTful', () => {
    test('Create a record.', async () => {
      try {
        let dataset = await DatabaseHelper.insert(RequestHelper.createInputs({
           'RESTfulTesting.put': id,
         }), ProjectConfigurationHelper.getDataSchema().tables['RESTfulTesting'], false);
         
         expect(dataset.length).toBe(1);
       } finally {
         server.close();
       }
    });
  });
});