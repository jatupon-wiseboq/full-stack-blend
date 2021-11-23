import {DataFormationHelper} from "../../../../src/controllers/helpers/DataFormationHelper";
import {DataManipulationHelper} from "../../../../src/controllers/helpers/DataManipulationHelper";

describe('DataManipulationHelper', () => {
	test('Standard Structure', () => {
		
	});
	
	test('Complex Structure', () => {
		DataManipulationHelper.setData(DataFormationHelper.convertFromJSONToHierarchicalDataTable({
			Collection: {
				$a: 1,
				b: [2, 3],
				c: {$a: 4},
				d: {b: [5, 6]},
				e: {c: {$a: 7}, d: [8, 9]},
				f: {a: [[10, 11, 12]], b: [{$a: 13, b: [14, 15]}, {$a: 16, b: [17, 18]}, {$a: 19, b: [20, 21]}]}
			}
		}).rows[0].relations);
		
		expect(DataManipulationHelper.getDataFromNotation('Collection.a')).toEqual(1);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b')).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable([2, 3]).rows[0].relations['Children'].rows
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[0]')).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable([2, 3]).rows[0].relations['Children'].rows[0]
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[0]._')).toEqual(2);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[1]._')).toEqual(3);
		expect(DataManipulationHelper.getDataFromNotation('Collection.c')).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable({$a: 4}).rows
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.d.b[0]._')).toEqual(5);
		expect(DataManipulationHelper.getDataFromNotation('Collection.d.b[1]._')).toEqual(6);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.c.a')).toEqual(7);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.d[0]._')).toEqual(8);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.d[1]._')).toEqual(9);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[0]._')).toEqual(10);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[1]._')).toEqual(11);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[2]._')).toEqual(12);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b.a')).toEqual(13);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b.b[0]._')).toEqual(14);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b.b[1]._')).toEqual(15);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[1].a')).toEqual(16);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[1].b[0]._')).toEqual(17);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[1].b[1]._')).toEqual(18);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[2]')).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable({$a: 19, b: [20, 21]}).rows[0]
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[2].b[0]')).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable([20, 21]).rows[0].relations['Children'].rows[0]
		);
		
		expect(DataManipulationHelper.getDataFromNotation('Collection[[0]]')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection[0].[[0]]')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.aa')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.aa')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b.c')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[2]')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[0].__')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[2]._')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.cc.c')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.dd.b[0]._')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.dd[0]._')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[3]._')).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[4]._')).toEqual(null);
		
		expect(DataManipulationHelper.getDataFromNotation(null)).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation(undefined)).toEqual(null);
		expect(DataManipulationHelper.getDataFromNotation('')).toEqual(null);
	});
	
	test('Complex Structure {inArray=true}', () => {
		DataManipulationHelper.setData(DataFormationHelper.convertFromJSONToHierarchicalDataTable({
			Collection: {
				$a: 1,
				b: [2, 3],
				c: {$a: 4},
				d: {b: [5, 6]},
				e: {c: {$a: 7}, d: [8, 9]},
				f: {a: [[10, 11, 12]], b: [{$a: 13, b: [14, 15]}, {$a: 16, b: [17, 18]}, {$a: 19, b: [20, 21]}]}
			}
		}).rows[0].relations);
		
		expect(DataManipulationHelper.getDataFromNotation('Collection.a', undefined, true)).toEqual([1]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b', undefined, true)).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable([2, 3]).rows[0].relations['Children'].rows
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[0]', undefined, true)).toEqual(
			[DataFormationHelper.convertFromJSONToHierarchicalDataTable([2, 3]).rows[0].relations['Children'].rows[0]]
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[0]._', undefined, true)).toEqual([2]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[1]._', undefined, true)).toEqual([3]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.c', undefined, true)).toEqual(
			DataFormationHelper.convertFromJSONToHierarchicalDataTable({$a: 4}).rows
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.d.b[0]._', undefined, true)).toEqual([5]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.d.b[1]._', undefined, true)).toEqual([6]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.c.a', undefined, true)).toEqual([7]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.d[0]._', undefined, true)).toEqual([8]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.d[1]._', undefined, true)).toEqual([9]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[0]._', undefined, true)).toEqual([10]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[1]._', undefined, true)).toEqual([11]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[2]._', undefined, true)).toEqual([12]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b.a', undefined, true)).toEqual([13]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b.b[0]._', undefined, true)).toEqual([14]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b.b[1]._', undefined, true)).toEqual([15]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[1].a', undefined, true)).toEqual([16]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[1].b[0]._', undefined, true)).toEqual([17]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[1].b[1]._', undefined, true)).toEqual([18]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[2]', undefined, true)).toEqual(
			[DataFormationHelper.convertFromJSONToHierarchicalDataTable({$a: 19, b: [20, 21]}).rows[0]]
		);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.b[2].b[0]', undefined, true)).toEqual(
			[DataFormationHelper.convertFromJSONToHierarchicalDataTable([20, 21]).rows[0].relations['Children'].rows[0]]
		);
		
		expect(DataManipulationHelper.getDataFromNotation('Collection[[0]]', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection[0].[[0]]', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.aa', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b.c', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[2]', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[0].__', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.b[2]._', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.cc.c', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.dd.b[0]._', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.e.dd[0]._', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[3]._', undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('Collection.f.a[0].Children[4]._', undefined, true)).toEqual([]);
		
		expect(DataManipulationHelper.getDataFromNotation(null, undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation(undefined, undefined, true)).toEqual([]);
		expect(DataManipulationHelper.getDataFromNotation('', undefined, true)).toEqual([]);
	});
});