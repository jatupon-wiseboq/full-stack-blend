import {SourceType} from "../../../../src/controllers/helpers/ProjectConfigurationHelper";
import {DatabaseHelper, HierarchicalDataTable} from "../../../../src/controllers/helpers/DatabaseHelper";
import {Md5} from "md5-typescript";

enum Operation {
  Single,
  Multiple
}

describe('DatabaseHelper', () => {
	const today = new Date();
	const now = (new Date()).getTime();
	const createUniqueNumber = (n: number) => {
		const reduced = today.getFullYear() + today.getMonth() * 100 + today.getDate();
		return reduced * 100 + n;
	};
	const createUniqueString = (seed: number=now) => {
		return Md5.init(seed.toString()).substring(0, 6);
	};
	
	// **************************************************************************
	// [primary-int01]     [primary-int03]     [primary-str10] ----> ref  check
	// [column -bol02]     [primary-bol02]     [column -int03] ----> ref  check
	// [column -int03]  x  [column -int01]  x  [column -bol02] ----> ref  check
	// [column -str04]     [column -str07]     [column -str11] ----> diff check
	// [column -dat05]     [column -dat08]     [column -dat12] ----> diff check
	// [column -int06]     [column -int09]     [column -flt13] ----> diff check
	// **************************************************************************
	const primaryDict = {
		'int01': 0,
		'int03': 1,
		'bol02': 1,
		'str10': 2
	};
	const crossDict = {
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
	tableMap[SourceType.Relational] = 'Relational';
	tableMap[SourceType.PrioritizedWorker] = 'PrioritizedWorker';
	tableMap[SourceType.Document] = 'Document';
	tableMap[SourceType.VolatileMemory] = 'VolatileMemory';
	tableMap[SourceType.RESTful] = 'RESTful';
	tableMap[SourceType.Dictionary] = 'Dictionary';
	tableMap[SourceType.Collection] = 'Collection';
	
	const createData = (crossingOrder: number, rowOrder: number, updatingRound: number=1) => {
		const max = 128;
		if (rowOrder >= max) throw new Error('Maximum number of rows reached.');
		
		const uniqueForKey = createUniqueNumber(rowOrder) * 10;
		const uniqueForCol = createUniqueNumber((3 + crossingOrder) * max * updatingRound + rowOrder) * 10;
		
		const data = {
			// keys
			'int01': uniqueForKey + 1,
			'int03': uniqueForKey + 3,
			'bol02': (rowOrder % 2) == 0,
			'str10': createUniqueString(uniqueForKey) + '-10',
			
			// columns
			'str04': createUniqueString(uniqueForCol) + '-04',
			'dat05': new Date(now + uniqueForCol + 5),
			'int06': uniqueForCol + 6,
			'str07': createUniqueString(uniqueForCol) + '-07',
			'dat08': new Date(now + uniqueForCol + 8),
			'int09': uniqueForCol + 9,
			'str11': createUniqueString(uniqueForCol) + '-11',
			'dat12': new Date(now + uniqueForCol + 12),
			'flt13': (uniqueForCol + 13) + (uniqueForCol % 100) / 100
		};
		
		return data;
	};
	
	const createRows = (type: SourceType, crossingOrder: number, numberOfRows: number, updatingRound: number=1, originate: any=null) => {
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
			for (let i=0; i<results[key].rows.length; i++) {			
				const tableKey = tableMap[type] + crossingOrder;
				results[key].rows[i].relations[tableKey] = {
					source: type,
					group: tableKey,
				  rows: []
				};
				const table = results[key].rows[i].relations[tableKey];
				
				for (let j=0; j<numberOfRows; j++) {
					table.rows[j] = {
						keys: {},
					  columns: {},
					  relations: {}
					};
					
					const data = createData(crossingOrder, (i + 1) * numberOfRows + j, updatingRound);
					
					for (const _key in data) {
						if (crossDict[_key].indexOf(crossingOrder) != -1) {
							if (primaryDict[_key] == crossingOrder) {
								table.rows[j].keys[_key] = data[_key];
							} else {
								table.rows[j].columns[_key] = data[_key];
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

	describe('Testing Helpers', () => {
		test('createUniqueNumber', () => {
			for (let i=0; i<128; i++) {
				expect(createUniqueNumber(i)).toEqual(createUniqueNumber(i));
				
				for (let j=-128; j<128; j++) {
					if (i == i + j) continue;
					expect(createUniqueNumber(i)).not.toEqual(createUniqueNumber(i + j));
				}
			}
		});
		test('createUniqueString', () => {
			for (let i=0; i<128; i++) {
				expect(createUniqueString(i)).toEqual(createUniqueString(i));
				
				for (let j=-128; j<128; j++) {
					if (i == i + j) continue;
					expect(createUniqueString(i)).not.toEqual(createUniqueString(i + j));
				}
			}
		});
		test('createData', () => {
			const checkingDict = {};
			
			for (let i=0; i<3; i++) { // crossing order
				for (let j=0; j<3; j++) { // row order
					for (let k=1; k<=3; k++) { // updating round
						const data = createData(i, j, k);
						
						expect(Object.keys(data).length).toEqual(13);
						expect(Array.from(new Set(Object.keys(data).map(key => data[key]))).length).toEqual(13);
						
						for (const key in data) {
							if (primaryDict[key] !== undefined) { // crossing order & updating round won't effect
								const _key = `${key}:${j}`;
								
								if (checkingDict[_key] !== undefined && j != 0) expect(checkingDict[_key].indexOf(data[key])).not.toEqual(-1);
								
								checkingDict[_key] = [] || checkingDict[_key];
								checkingDict[_key].push(data[key]);
							} else {
								checkingDict[key] = [] || checkingDict[key];
								expect(checkingDict[key].indexOf(data[key])).toEqual(-1);
									
								checkingDict[key].push(data[key]);
							}
						}
					}
				}
			}
		});
		test('createRows', () => {
			expect(createRows(SourceType.Relational, 0, 2)).toEqual(createRows(SourceType.Relational, 0, 2));
			expect(createRows(SourceType.Relational, 1, 2)).toEqual(createRows(SourceType.Relational, 1, 2));
			expect(createRows(SourceType.Relational, 0, 2)).not.toEqual(createRows(SourceType.Relational, 1, 2));
			expect(createRows(SourceType.Relational, 0, 2)).not.toEqual(createRows(SourceType.Document, 0, 2));
			
			expect(createRows(SourceType.Relational, 0, 5)['Relational0'].rows.length).toEqual(5);
			expect(createRows(SourceType.Document, 1, 3)['Document1'].rows.length).toEqual(3);
			
			expect(createRows(SourceType.Document, 1, 3)['Document1'].rows[1].columns['int01']).toEqual(createData(1, 1 * 3 + 1)['int01']);
			expect(createRows(SourceType.Relational, 1, 10, 1, createRows(SourceType.Document, 0, 2))['Document0'].rows[1].relations['Relational1'].rows.length).toEqual(10);
			expect(createRows(SourceType.Relational, 1, 10, 1, createRows(SourceType.Document, 0, 2))['Document0'].rows[1].relations['Relational1'].rows[5].columns['dat08']).toEqual(createData(1, 2 * 10 + 5)['dat08']);
		});
	});
	describe('Utilities', () => {
		test('distinct', () => {
			expect(1+2).toEqual(3);
		});
		test('fixType', () => {
			expect(1+2).toEqual(3);
		});
	});
	describe('Satisfy Checker', () => {
		test('Premise', () => {
			expect(1+2).toEqual(3);
		});
		test('Division', () => {
			expect(1+2).toEqual(3);
		});
		test('Associate', () => {
			expect(1+2).toEqual(3);
		});
		describe('Satisfy', () => {
			describe('Relational', () => {
				test('Relational', () => {
					expect(1+2).toEqual(3);
				});
				test('Relational x Relational', () => {
					expect(1+2).toEqual(3);
				});
				test('Relational x Relational x Relational', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document', () => {
				test('Document', () => {
					expect(1+2).toEqual(3);
				});
				test('Document x Document', () => {
					expect(1+2).toEqual(3);
				});
				test('Document x Document x Document', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile', () => {
				test('Volatile', () => {
					expect(1+2).toEqual(3);
				});
				test('Volatile x Volatile', () => {
					expect(1+2).toEqual(3);
				});
				test('Volatile x Volatile x Volatile', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Worker', () => {
				test('Worker', () => {
					expect(1+2).toEqual(3);
				});
				test('Worker x Worker', () => {
					expect(1+2).toEqual(3);
				});
				test('Worker x Worker x Worker', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Document', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Document x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Volatile x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Worker x Relational', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
	});
	describe('Input Preparation', () => {
		test('getRows', () => {
			expect(1+2).toEqual(3);
		});
		test('prepareData', () => {
			expect(1+2).toEqual(3);
		});
		test('ormMap', () => {
			expect(1+2).toEqual(3);
		});
		test('formatKeysAndColumns', () => {
			expect(1+2).toEqual(3);
		});
	});
	describe('Uniform Operation', () => {
		describe('Relational', () => {
			describe('Relational', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Relational', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Relational x Relational', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
		describe('Document', () => {
			describe('Document', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Document', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Document x Document', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
		describe('Volatile', () => {
			describe('Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Volatile x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
		describe('Worker', () => {
			describe('Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Worker x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Worker x Worker x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
	});
	describe('Across Operation', () => {
		describe('Test', () => {
			describe('Relational x Document', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Document x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Volatile x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Worker x Relational', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
	});
	describe('Recordset Forwarding', () => {
		describe('Recursive', () => {
			describe('Document', () => {
				test('Single Record', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple Records', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Document', () => {
				test('Single Record', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple Records', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Document x Document', () => {
				test('Single Record', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple Records', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
		describe('Recurrent', () => {
			describe('Document', () => {
				test('Single Record', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple Records', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Document', () => {
				test('Single Record', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple Records', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Document x Document', () => {
				test('Single Record', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple Records', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
	});
});