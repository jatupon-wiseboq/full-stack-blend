import {CodeHelper} from "../../../../src/controllers/helpers/CodeHelper";

describe('clone', () => {
	describe('Primitive', () => {
	  test('String', () => {
	  	expect(CodeHelper.clone('')).toEqual('');
	  	expect(CodeHelper.clone('Abc123')).toEqual('Abc123');
	  	expect(CodeHelper.clone('��������')).toEqual('��������');
	  	expect(CodeHelper.clone('0.0000125')).toEqual('0.0000125');
	  	expect(CodeHelper.clone('false')).toEqual('false');
	  	expect(CodeHelper.clone('\r\n')).toEqual('\r\n');
	  	expect(CodeHelper.clone('&nbsp;')).toEqual('&nbsp;');
	  });
	  test('Number', () => {
	  	expect(CodeHelper.clone(125)).toEqual(125);
	  	expect(CodeHelper.clone(-10)).toEqual(-10);
	  	expect(CodeHelper.clone(0.000012)).toEqual(0.000012);
	  	expect(CodeHelper.clone(-125.025)).toEqual(-125.025);
	  	//expect(CodeHelper.clone(Infinity)).toEqual(Infinity);
	  	//expect(CodeHelper.clone(-Infinity)).toEqual(-Infinity);
	  	expect(CodeHelper.clone(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
	  	expect(CodeHelper.clone(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
	  	//expect(CodeHelper.clone(NaN)).toEqual(NaN);
	  });
	  test('Boolean', () => {
	  	expect(CodeHelper.clone(false)).toEqual(false);
	  	expect(CodeHelper.clone(true)).toEqual(true);
	  });
	  test('Others', () => {
	  	//expect(CodeHelper.clone(undefined)).toEqual(undefined);
	  	expect(CodeHelper.clone(null)).toEqual(null);
	  	
	  	//const time = new Date();
	  	//expect(CodeHelper.clone(time)).toEqual(time);
	  });
	});
	describe('Structure', () => {
		test('Array', () => {
			expect(CodeHelper.clone([])).toEqual([]);
			expect(CodeHelper.clone([123, 456.50, false])).toEqual([123, 456.50, false]);
		});
	  test('Object', () => {
	  	const structure1 = {
	  	};
	  	expect(CodeHelper.clone(structure1)).toEqual(structure1);
	  	
	  	const structure2 = {
	  		a: 123
	  	};
	  	expect(CodeHelper.clone(structure2)).toEqual(structure2);
	  	
	  	const structure3 = {
	  		a: 123,
	  		b: 0.45,
	  		c: {
	  			x: false,
	  			y: 'Abc',
	  			z: [null]
	  		},
	  		d: {
	  			x: true,
	  			y: 'Abc',
	  			z: undefined
	  		}
	  	};
	  	expect(CodeHelper.clone(structure3)).toEqual(structure3);
	  });
	});
	describe('Property', () => {
	  test('Unreferencable - Array', () => {
	  	const input = [123, 456.50, false];
	  	const output = CodeHelper.clone(input);
	  	
	  	output[0] = 0;
	  	output[1] = 'Abc';
	  	
	  	expect(input).toEqual([123, 456.50, false]);
	  });
	  test('Unreferencable - Object', () => {
	  	const input = {
	  		a: 123,
	  		b: 0.45,
	  		c: {
	  			x: false,
	  			y: 'Abc',
	  			z: [null]
	  		}
	  	};
	  	const output = CodeHelper.clone(input);
	  	
	  	output['a'] = 0;
	  	output['c']['x'] = true;
	  	
	  	expect(input).toEqual({
	  		a: 123,
	  		b: 0.45,
	  		c: {
	  			x: false,
	  			y: 'Abc',
	  			z: [null]
	  		}
	  	});
	  });
	});
});

describe('equals', () => {
	describe('Primitive', () => {
	  test('String', () => {
	  	expect(CodeHelper.equals('', '')).toEqual(true);
	  	expect(CodeHelper.equals('', 'Abc')).toEqual(false);
	  	expect(CodeHelper.equals('Abc123', 'Abc123')).toEqual(true);
	  	expect(CodeHelper.equals('Abc123', '123')).toEqual(false);
	  	expect(CodeHelper.equals('��������', '��������')).toEqual(true);
	  	expect(CodeHelper.equals('��������', '�������')).toEqual(false);
	  	expect(CodeHelper.equals('0.0000125', '0.0000125')).toEqual(true);
	  	expect(CodeHelper.equals('0.0000125', '0.000012500')).toEqual(false);
	  	expect(CodeHelper.equals('false', 'false')).toEqual(true);
	  	expect(CodeHelper.equals('false', 'true')).toEqual(false);
	  	expect(CodeHelper.equals('\r\n', '\r\n')).toEqual(true);
	  	expect(CodeHelper.equals('\r\n', '\r')).toEqual(false);
	  	expect(CodeHelper.equals('&nbsp;', '&nbsp;')).toEqual(true);
	  	expect(CodeHelper.equals('&nbsp;', ' ')).toEqual(false);
	  });
	  test('Number', () => {
	  	expect(CodeHelper.equals(125, 125)).toEqual(true);
	  	expect(CodeHelper.equals(125, 125.0)).toEqual(true);
	  	expect(CodeHelper.equals(125.0, 125)).toEqual(true);
	  	expect(CodeHelper.equals(125, 125.1)).toEqual(false);
	  	expect(CodeHelper.equals(-10, -10)).toEqual(true);
	  	expect(CodeHelper.equals(-10, 10)).toEqual(false);
	  	expect(CodeHelper.equals(0.000012, 0.000012)).toEqual(true);
	  	expect(CodeHelper.equals(0.000012, 0.00001200)).toEqual(true);
	  	expect(CodeHelper.equals(0.00001200, 0.000012)).toEqual(true);
	  	expect(CodeHelper.equals(0.000012, 0.00001201)).toEqual(false);
	  	expect(CodeHelper.equals(-125.025, -125.025)).toEqual(true);
	  	expect(CodeHelper.equals(-125.025, -125.0250)).toEqual(true);
	  	expect(CodeHelper.equals(-125.02500, -125.0250)).toEqual(true);
	  	expect(CodeHelper.equals(-125.025, -125.0251)).toEqual(false);
	  	expect(CodeHelper.equals(Infinity, Infinity)).toEqual(true);
	  	expect(CodeHelper.equals(Infinity, -Infinity)).toEqual(false);
	  	expect(CodeHelper.equals(-Infinity, -Infinity)).toEqual(true);
	  	expect(CodeHelper.equals(-Infinity, Infinity)).toEqual(false);
	  	expect(CodeHelper.equals(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toEqual(true);
	  	expect(CodeHelper.equals(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER+0.00)).toEqual(true);
	  	expect(CodeHelper.equals(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER-1)).toEqual(false);
	  	//expect(CodeHelper.equals(NaN, NaN)).toEqual(true);
	  	expect(CodeHelper.equals(NaN, 123)).toEqual(false);
	  });
	  test('Boolean', () => {
	  	expect(CodeHelper.equals(true, true)).toEqual(true);
	  	expect(CodeHelper.equals(false, false)).toEqual(true);
	  	expect(CodeHelper.equals(true, false)).toEqual(false);
	  	expect(CodeHelper.equals(false, true)).toEqual(false);
	  });
	  test('Others', () => {
	  	expect(CodeHelper.equals(undefined, undefined)).toEqual(true);
	  	expect(CodeHelper.equals(undefined, null)).toEqual(false);
	  	expect(CodeHelper.equals(undefined, 0)).toEqual(false);
	  	expect(CodeHelper.equals(undefined, '')).toEqual(false);
	  	expect(CodeHelper.equals(null, null)).toEqual(true);
	  	expect(CodeHelper.equals(null, false)).toEqual(false);
	  	expect(CodeHelper.equals(null, 0)).toEqual(false);
	  	expect(CodeHelper.equals(null, '')).toEqual(false);
	  	
	  	const time1 = new Date();
	  	const time2 = new Date(time1.toISOString());
	  	expect(CodeHelper.equals(time1, time2)).toEqual(true);
	  	expect(CodeHelper.equals(time1, new Date(1000, 1, 1))).toEqual(false);
	  });
	});
	describe('Structure', () => {
		test('Array', () => {
	  	expect(CodeHelper.equals([], [])).toEqual(true);
	  	expect(CodeHelper.equals([], [1])).toEqual(false);
	  	expect(CodeHelper.equals([123, 456.50, false], [123, 456.50, false])).toEqual(true);
	  	expect(CodeHelper.equals([123, 456.50, false], [123, 456.50, true])).toEqual(false);
		});
	  test('Object', () => {
	  	expect(CodeHelper.equals({}, {})).toEqual(true);
	  	expect(CodeHelper.equals({}, null)).toEqual(false);
	  	expect(CodeHelper.equals({}, undefined)).toEqual(false);
	  	expect(CodeHelper.equals({}, '')).toEqual(false);
	  	expect(CodeHelper.equals({}, {a: 1})).toEqual(false);
	  	
	  	expect(CodeHelper.equals({a: 123}, {a: 123})).toEqual(true);
	  	expect(CodeHelper.equals({a: 123}, {a: 123.00})).toEqual(true);
	  	expect(CodeHelper.equals({a: 123.00}, {a: 123})).toEqual(true);
	  	expect(CodeHelper.equals({a: 123}, {a: 123.01})).toEqual(false);
	  	
	  	expect(CodeHelper.equals({a: 123, c: {x: false}}, {a: 123, c: {x: false}})).toEqual(true);
	  	expect(CodeHelper.equals({a: 123, c: {x: false}}, {a: 123, c: {x: 1}})).toEqual(false);
	  	expect(CodeHelper.equals({a: 123, c: {x: 1}}, {a: 123, c: {x: false}})).toEqual(false);
	  });
	});
});