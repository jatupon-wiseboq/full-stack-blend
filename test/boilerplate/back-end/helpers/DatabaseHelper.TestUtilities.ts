import {ProjectConfigurationHelper, SourceType} from "../../../../src/controllers/helpers/ProjectConfigurationHelper";
import {DatabaseHelper, HierarchicalDataTable} from "../../../../src/controllers/helpers/DatabaseHelper";
import {CreateTransaction} from "../../../../src/controllers/helpers/ConnectionHelper";
import {Md5} from "md5-typescript";

enum CRUD {
  Create,
  Retrieve,
  Update,
  Upsert,
  Delete
}

const today = new Date();
const now = (new Date()).getTime();
let unique = Math.floor(Math.abs(Math.sin(now)) * 99999);
const createUniqueNumber = (n: number) => {
	return unique * 100 + n;
};
const createUniqueString = (seed: number=unique) => {
	return Md5.init(seed.toString()).substring(0, 6);
};
const next = () => {
	unique++;
};

// Testing relations
// **************************************************************************
// [primary-int01]     [primary-int03]     [primary-str10] ----> ref  check
// [column -bol02]     [primary-bol02]     [primary-int03] ----> ref  check
// [column -int03]  x  [column -int01]  x  [column -bol02] ----> ref  check
// [column -grp01]     [column -grp02]     [column -grp03] ----> comp check
// [column -str04]     [column -str07]     [column -str11] ----> diff check
// [column -dat05]     [column -dat08]     [column -dat12] ----> diff check
// [column -int06]     [column -int09]     [column -flt13] ----> diff check
// **************************************************************************

const primaryDict = {
	'int01': [0],
	'int03': [1, 2],
	'bol02': [1],
	'str10': [2]
};
const crossDict = {
	'grp01': [0, 1, 2],
	'int01': [0, 1],
	'bol02': [0, 1, 2],
	'int03': [0, 1, 2],
	'str04': [0],
	'dat05': [0],
	'int06': [0],
	'str07': [1],
	'dat08': [1],
	'int09': [1],
	'str10': [2],
	'str11': [2],
	'dat12': [2],
	'flt13': [2]
};

const tableMap = {};
tableMap[SourceType.Relational] = 'relational';
tableMap[SourceType.PrioritizedWorker] = 'PrioritizedWorker';
tableMap[SourceType.Document] = 'Document';
tableMap[SourceType.VolatileMemory] = 'VolatileMemory';
tableMap[SourceType.RESTful] = 'RESTful';
tableMap[SourceType.Dictionary] = 'Dictionary';
tableMap[SourceType.Collection] = 'Collection';

const createData = (set: number, crossingOrder: number, rowOrder: number, updatingRound: number=1, useDateInString: boolean=false, useGroupSelector: boolean=false) => {
	const max = 4096;
	if (rowOrder >= max) throw new Error('Maximum number of rows reached.');
	
	const uniqueForKey = createUniqueNumber(rowOrder + set * max) * max;
	const uniqueForCol = createUniqueNumber((3 + crossingOrder) * max * updatingRound + rowOrder + set * max) * max;
	
	const data = useGroupSelector && {
		'grp01': createUniqueNumber(set)
	} || {
		// keys
		'int01': uniqueForKey + 1,
		'int03': uniqueForKey + 3,
		'bol02': (rowOrder % 2) == 0,
		'str10': createUniqueString(uniqueForKey) + '-10',
		
		// columns
		'grp01': createUniqueNumber(set),
		'str04': createUniqueString(uniqueForCol) + '-04',
		'dat05': new Date(unique + uniqueForCol + 5) as any,
		'int06': uniqueForCol + 6,
		'str07': createUniqueString(uniqueForCol) + '-07',
		'dat08': new Date(unique + uniqueForCol + 8) as any,
		'int09': uniqueForCol + 9,
		'str11': createUniqueString(uniqueForCol) + '-11',
		'dat12': new Date(unique + uniqueForCol + 12) as any,
		'flt13': (uniqueForCol + 13) + (uniqueForCol % 100) / 100
	};
	
	if (useDateInString) {
		if (data['dat05']) {
			data['dat05'] = data['dat05'].toISOString();
		}
		if (data['dat08']) {
			data['dat08'] = data['dat08'].toISOString();
		}
		if (data['dat12']) {
			data['dat12'] = data['dat12'].toISOString();
		}
	}
	
	return data;
};

// Expanding rowOrder
// **************************************************************************
// 2 * 2 * 3  =  12 rows       
// 
// 0 x 0 x 0 --> 0 x 0 x 0
// 0 x 0 x 1 --> 0 x 0 x 1
// 0 x 0 x 2 --> 0 x 0 x 2
// 0 x 1 x 0 --> 0 x 1 x 3
// 0 x 1 x 1 --> 0 x 1 x 4
// 0 x 1 x 2 --> 0 x 1 x 5
// 1 x 0 x 0 --> 1 x 2 x 6
// 1 x 0 x 1 --> 1 x 2 x 7
// 1 x 0 x 2 --> 1 x 2 x 8
// 1 x 1 x 0 --> 1 x 3 x 9
// 1 x 1 x 1 --> 1 x 3 x 10
// 1 x 1 x 2 --> 1 x 3 x 11
// **************************************************************************
const createRows = (set: number, type: SourceType, crossingOrder: number, numberOfRows: number, updatingRound: number=1, originate: any=null, hasOnlyGroupColumn: boolean=false, k: number=0) => {
	let results = originate;
	if (originate == null) {
		results = {};
		results['Collection'] = {
			source: SourceType.Collection,
			group: 'Collection',
		  rows: [{
		  	keys: {},
			  columns: {},
			  relations: {}
		  }]
		};
	}
	
	for (const key in results) {
		for (let j=0; j<results[key].rows.length; j++) {
			const keys = Object.keys(results[key].rows[j].relations);
			if (keys.length != 0) {
				createRows(set, type, crossingOrder, numberOfRows, updatingRound, results[key].rows[j].relations, hasOnlyGroupColumn, (k + j) * results[key].rows[j].relations[keys[0]].rows.length);
			} else {
				const tableKey = tableMap[type] + crossingOrder;
				results[key].rows[j].relations[tableKey] = {
					source: type,
					group: tableKey,
				  rows: []
				};
				const table = results[key].rows[j].relations[tableKey];
				
				for (let i=0; i<numberOfRows; i++) {
					table.rows[i] = {
						keys: {},
					  columns: {},
					  relations: {}
					};
					
					const data = createData(set, crossingOrder, (k + j) * numberOfRows + i, updatingRound, type == SourceType.VolatileMemory, hasOnlyGroupColumn);
					
					for (const _key in data) {
						if (crossDict[_key].indexOf(crossingOrder) != -1) {
							let value = data[_key];
							
							// Key Forwarding Ability
							if (crossingOrder - 1 >= 0) {
								if (primaryDict[_key] && primaryDict[_key].indexOf(crossingOrder - 1) != -1) {
									if (results[key].rows[j].keys[_key] !== undefined) {
										value = results[key].rows[j].keys[_key];
									}
								}
							}
							
							if (primaryDict[_key] && primaryDict[_key].indexOf(crossingOrder) != -1) {
								table.rows[i].keys[_key] = value;
							} else {
								table.rows[i].columns[_key] = value;
							}
						}
					}
				}
			}
		}
	}
	
	if (originate == null) {
		return results['Collection'].rows[0].relations;
	} else {
		return results;
	}
};
const prepareDataForComparing = (data: any) => {
	if (Array.isArray(data)) {
		data = data.sort((row1, row2) => {
			if (row1.columns['dat08']) return (row1.columns['dat08'] > row2.columns['dat08']) ? 1 : -1;
			else if (row1.columns['int06']) return (row1.columns['int06'] > row2.columns['int06']) ? 1 : -1;
			else if (row1.columns['flt13']) return (row1.columns['flt13'] > row2.columns['flt13']) ? 1 : -1;
			else return 0;
		});
		
		for (const item of data) {
			prepareDataForComparing(item);
		}
	} else if (typeof data === 'object' && data != null && data != undefined) {
		for (const key in data) {
			// Remove extra fields
			if (['notification', 'timestamp'].indexOf(key) != -1) {
				delete data[key];
			} else {
				data[key] = prepareDataForComparing(data[key]);
			}
		}
	}
	
	return data;
};
let transaction = null
const crud = async (set: number, type: CRUD, operation_input: any, operation_output: any, retrieve_input: any, retrieve_output: any) => {
	transaction = transaction || await CreateTransaction({manual: true});
	
	let arrayResults = [];
	let dictResults = {};
	let group = Object.keys(operation_input)[0];
	
	console.log('\x1b[32mcrud', set, type, group, '\x1b[0m');
	try {
		if (type == CRUD.Create) {
			await DatabaseHelper.performRecursiveInsert(
				operation_input[group],
				ProjectConfigurationHelper.getDataSchema().tables[group],
				arrayResults,
				transaction,
				undefined,
				true);
			expect(prepareDataForComparing(arrayResults)).toEqual(operation_output[group].rows);
		} else if (type == CRUD.Retrieve) {
			dictResults = {};
			await DatabaseHelper.performRecursiveRetrieve(
				operation_input[group],
				ProjectConfigurationHelper.getDataSchema().tables[group],
				dictResults,
				{},
				undefined,
				true,
				transaction);
			
			const output = prepareDataForComparing(dictResults);
			
			if (Array.isArray(operation_output)) {
				expect(output[group].rows).toEqual(operation_output);
			} else {
				expect(output).toEqual(operation_output);
			}
		} else if (type == CRUD.Update) {
			await DatabaseHelper.performRecursiveUpdate(
				operation_input[group],
				ProjectConfigurationHelper.getDataSchema().tables[group],
				arrayResults,
				transaction,
				undefined,
				undefined,
				true);
			expect(prepareDataForComparing(arrayResults)).toEqual(operation_output[group].rows);
		} else if (type == CRUD.Upsert) {
			await DatabaseHelper.performRecursiveUpsert(
				operation_input[group],
				ProjectConfigurationHelper.getDataSchema().tables[group],
				arrayResults,
				transaction,
				undefined,
				true);
			
			expect(prepareDataForComparing(arrayResults)).toEqual(operation_output[group].rows);
		} else if (type == CRUD.Delete) {
			await DatabaseHelper.performRecursiveDelete(
				operation_input[group],
				ProjectConfigurationHelper.getDataSchema().tables[group],
				arrayResults,
				transaction,
				undefined,
				true);
			
			expect(prepareDataForComparing(arrayResults)).toEqual(operation_output[group].rows);
		}
		
		if (retrieve_input && retrieve_input[group]) {
			group = Object.keys(retrieve_input)[0];
		
			dictResults = {};
			await DatabaseHelper.performRecursiveRetrieve(
				retrieve_input[group],
				ProjectConfigurationHelper.getDataSchema().tables[group],
				dictResults,
				{},
				undefined,
				true,
				transaction);
			
			const output = prepareDataForComparing(dictResults);
			
			if (Array.isArray(retrieve_output)) {
				expect(output[group].rows).toEqual(retrieve_output);
			} else {
				expect(output).toEqual(retrieve_output);
			}
		}
	} catch(error) {
		throw error;
	}
};
const establishTransaction = async (enable: boolean) => {
  transaction = await CreateTransaction({manual: !enable, share: false});
};

export {createUniqueNumber, createUniqueString, next, createData, createRows, prepareDataForComparing, crud, CRUD, SourceType, primaryDict, tableMap, establishTransaction};