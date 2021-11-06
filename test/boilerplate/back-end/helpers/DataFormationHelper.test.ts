import {DataFormationHelper} from "../../../../src/controllers/helpers/DataFormationHelper";

describe('DataFormationHelper', () => {
	test('Simple Object', () => {
		let data = null;
		data = {};
		expect(DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data))).toEqual(data);
		
		data = [];
		expect(DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data))).toEqual(data);
		
		data = null;
		expect(() => { DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data)); }).toThrow();
		
		data = undefined;
		expect(() => { DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data)); }).toThrow();
		
		data = '';
		expect(() => { DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data)); }).toThrow();
	});
	
	test('Complex Structure', () => {
		let data = null;
		data = {
			$a: 1,
			b: [0, 1],
			c: {$a: 1},
			d: {b: [0, 1]},
			e: {c: {$a: 1}, d: [0, 1]},
			f: {a: [[0, 1, 2]], b: [{$a: 1, b: [0, 1]}, {$a: 2, b: [0, 2]}, {$a: 3, b: [0, 3]}]}
		};
		expect(DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data))).toEqual(data);
		
		data = {
			$a: null,
			b: [0.0, undefined],
			c: {$a: 1.125},
			d: {b: [NaN, Number.MAX_SAFE_INTEGER]},
			e: {c: {$a: ''}, d: [0, 1]},
			f: {a: [[0, 'undefined', 'null']], b: [{$a: Infinity, b: [0, -Infinity]}, {$a: '', b: [null, '']}, {$a: '3.00541', b: ['0', 3]}]}
		};
		expect(DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data))).toEqual(data);
	});
	
	test('Special & Unicode Characters', () => {
		let data = null;
		data = {
			'!@#$%': 0,
			'^&*()': {
				'abc': 'null',
				'°¢§': {
					'1': 1,
					'2': 2,
					'3': 3,
					'true': [{
						'L:"|}': 4,
						'<?>":': 5
					}, ['øÀ°¥', 'Ë“ «']]
				}
			},
			'*()_|\'': 6
		};
		expect(DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data))).toEqual(data);
	});
});