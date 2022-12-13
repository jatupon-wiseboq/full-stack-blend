import {createData, createRows, SourceType, createUniqueNumber, createUniqueString, primaryDict} from "./DatabaseHelper.TestUtilities";
import flushPromises from "flush-promises";

describe('DatabaseHelper', () => {
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
						const data = createData(1, i, j, k);
						
						expect(Object.keys(data).length).toEqual(14);
						expect(Array.from(new Set(Object.keys(data).map(key => data[key]))).length).toEqual(14);
						
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
			expect(createRows(1, SourceType.Relational, 0, 2)).toEqual(createRows(1, SourceType.Relational, 0, 2));
			expect(createRows(2, SourceType.Relational, 1, 2)).toEqual(createRows(2, SourceType.Relational, 1, 2));
			expect(createRows(1, SourceType.Relational, 1, 2)).not.toEqual(createRows(2, SourceType.Relational, 1, 2));
			expect(createRows(1, SourceType.Relational, 0, 2)).not.toEqual(createRows(1, SourceType.Relational, 1, 2));
			expect(createRows(1, SourceType.Relational, 0, 2)).not.toEqual(createRows(1, SourceType.Document, 0, 2));
			
			expect(createRows(1, SourceType.Relational, 0, 5)['relational0'].rows.length).toEqual(5);
			expect(createRows(1, SourceType.Document, 1, 3)['Document1'].rows.length).toEqual(3);
			
			expect(createRows(1, SourceType.Document, 1, 3)['Document1'].rows[1].columns['int01']).toEqual(createData(1, 1, 1)['int01']);
			expect(createRows(1, SourceType.Relational, 1, 10, 1, createRows(1, SourceType.Document, 0, 2))['Document0'].rows[1].relations['relational1'].rows.length).toEqual(10);
			expect(createRows(1, SourceType.Relational, 1, 10, 1, createRows(1, SourceType.Document, 0, 2))['Document0'].rows[1].relations['relational1'].rows[5].columns['dat08']).toEqual(createData(1, 1, 1 * 10 + 5)['dat08']);
			expect(createRows(1, SourceType.Relational, 1, 5, 1, createRows(1, SourceType.Document, 0, 10))['Document0'].rows[5].relations['relational1'].rows[4].columns['dat08']).toEqual(createData(1, 1, 5 * 5 + 4)['dat08']);
			
			expect(createRows(1, SourceType.Relational, 1, 5, 1, undefined)['relational1'].rows[4].columns['int01']).toEqual(createData(1, 1, 4)['int01']);
			expect(createRows(1, SourceType.Relational, 1, 5, 1, undefined, true)['relational1'].rows[4].columns['int01']).toEqual(undefined);
			expect(createRows(1, SourceType.Relational, 1, 5, 1, undefined, true)['relational1'].rows[4].columns['grp01']).toEqual(createData(1, 1, 4)['grp01']);
			
			expect(createRows(1, SourceType.Relational, 1, 5, 1, createRows(1, SourceType.Document, 0, 10))['Document0'].rows[5].relations['relational1'].rows[4].keys['int03']).toEqual(createData(1, 1, 5 * 5 + 4)['int03']);
			expect(createRows(1, SourceType.Relational, 1, 5, 1, createRows(1, SourceType.Document, 0, 10), true)['Document0'].rows[5].relations['relational1'].rows[4].keys['int03']).toEqual(undefined);
			expect(createRows(1, SourceType.Relational, 1, 5, 1, createRows(1, SourceType.Document, 0, 10), true)['Document0'].rows[5].relations['relational1'].rows[4].columns['int01']).toEqual(undefined);
			expect(createRows(1, SourceType.Relational, 1, 5, 1, createRows(1, SourceType.Document, 0, 10), true)['Document0'].rows[5].relations['relational1'].rows[4].columns['grp01']).toEqual(createData(1, 1, 5 * 5 + 4)['grp01']);
			
			expect(typeof createRows(1, SourceType.Document, 1, 5, 1, createRows(1, SourceType.Document, 0, 10))['Document0'].rows[5].relations['Document1'].rows[4].columns['dat08']).not.toEqual('string');
			expect(typeof createRows(1, SourceType.VolatileMemory, 1, 5, 1, createRows(1, SourceType.Document, 0, 10))['Document0'].rows[5].relations['VolatileMemory1'].rows[4].columns['dat08']).toEqual('string');
			expect(typeof createRows(1, SourceType.Document, 1, 5, 1, createRows(1, SourceType.Document, 0, 10))['Document0'].rows[5].columns['dat05']).not.toEqual('string');
			expect(typeof createRows(1, SourceType.Document, 1, 5, 1, createRows(1, SourceType.VolatileMemory, 0, 10))['VolatileMemory0'].rows[5].columns['dat05']).toEqual('string');
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
});