import {CodeHelper} from "../../../../src/controllers/helpers/CodeHelper";
import { strict as assert } from 'assert';

describe('recursiveEvaluate', () => {
	test('Primitive', () => {
		const value = 123;
		expect(() => { CodeHelper.recursiveEvaluate(value, (obj: any) => { assert(obj != 123, 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(value, (obj: any) => { assert(obj != 124, 'Error'); }); }).not.toThrow();
	});
	test('Structure', () => {
		const structure = {
			a: 123,
			b: 0.45,
			c: {
				x: {
					i: 'Abc',
					j: /123/,
					k: [124, false, undefined]
				},
				y: NaN
			},
			d: Infinity
		};
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 123, 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 0.45, 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 'Abc', 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(!(obj instanceof RegExp), 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(!(typeof obj === 'number' && isNaN(obj)), 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != Infinity, 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 124, 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != undefined, 'Error'); }); }).toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 125, 'Error'); }); }).not.toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 0.451, 'Error'); }); }).not.toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != 'Abc123', 'Error'); }); }).not.toThrow();
		expect(() => { CodeHelper.recursiveEvaluate(structure, (obj: any) => { assert(obj != -Infinity, 'Error'); }); }).not.toThrow();
	});
});
describe('Extra Assertion Tools', () => {
	test('generateInfo', () => {
		expect(CodeHelper.generateInfo(null)).toEqual('');
		expect(CodeHelper.generateInfo({a: 1})).toEqual(' {"a":1}');
	});
	test('assertOfSimpleType', () => {
		expect(() => { CodeHelper.assertOfSimpleType(1); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(1.0); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(-Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(NaN); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(false); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(true); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(''); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(' '); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType([]); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType({}); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(/123/); }).toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(null); }).not.toThrow();
		expect(() => { CodeHelper.assertOfSimpleType(undefined); }).not.toThrow();
	});
	test('assertOfPresent', () => {
		expect(() => { CodeHelper.assertOfPresent(1); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(1.0); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(-Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(NaN); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(false); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(true); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(''); }).toThrow();
		expect(() => { CodeHelper.assertOfPresent(' '); }).toThrow();
		expect(() => { CodeHelper.assertOfPresent([]); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent({}); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(/123/); }).not.toThrow();
		expect(() => { CodeHelper.assertOfPresent(null); }).toThrow();
		expect(() => { CodeHelper.assertOfPresent(undefined); }).toThrow();
	});
	test('assertOfNotUndefined', () => {
		expect(() => { CodeHelper.assertOfNotUndefined(1); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(1.0); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(-Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(NaN); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(false); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(true); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(''); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(' '); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined([]); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined({}); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(/123/); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(null); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotUndefined(undefined); }).toThrow();
	});
	test('assertOfNotInfinity', () => {
		expect(() => { CodeHelper.assertOfNotInfinity(1); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(1.0); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(Infinity); }).toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(-Infinity); }).toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(NaN); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(false); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(true); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(''); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(' '); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity([]); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity({}); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(/123/); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(null); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotInfinity(undefined); }).not.toThrow();
	});
	test('assertOfNotNaN', () => {
		expect(() => { CodeHelper.assertOfNotNaN(1); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(1.0); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(-Infinity); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(NaN); }).toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(false); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(true); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(''); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(' '); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN([]); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN({}); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(/123/); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(null); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotNaN(undefined); }).not.toThrow();
	});
	test('assertOfString', () => {
		expect(() => { CodeHelper.assertOfString(1); }).toThrow();
		expect(() => { CodeHelper.assertOfString(1.0); }).toThrow();
		expect(() => { CodeHelper.assertOfString(Infinity); }).toThrow();
		expect(() => { CodeHelper.assertOfString(-Infinity); }).toThrow();
		expect(() => { CodeHelper.assertOfString(NaN); }).toThrow();
		expect(() => { CodeHelper.assertOfString(false); }).toThrow();
		expect(() => { CodeHelper.assertOfString(true); }).toThrow();
		expect(() => { CodeHelper.assertOfString('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfString(''); }).not.toThrow();
		expect(() => { CodeHelper.assertOfString(' '); }).not.toThrow();
		expect(() => { CodeHelper.assertOfString([]); }).toThrow();
		expect(() => { CodeHelper.assertOfString({}); }).toThrow();
		expect(() => { CodeHelper.assertOfString(/123/); }).toThrow();
		expect(() => { CodeHelper.assertOfString(null); }).not.toThrow();
		expect(() => { CodeHelper.assertOfString(undefined); }).not.toThrow();
	});
	test('assertOfKeyName', () => {
		expect(() => { CodeHelper.assertOfKeyName('abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfKeyName('Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfKeyName('Abc09'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfKeyName('Abc09_'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfKeyName('0Abc09_'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfKeyName('_0Abc09_'); }).not.toThrow();
		
		expect(() => { CodeHelper.assertOfKeyName('a$bc'); }).toThrow();
		expect(() => { CodeHelper.assertOfKeyName('Abc '); }).toThrow();
		expect(() => { CodeHelper.assertOfKeyName('+Abc09_'); }).toThrow();
		expect(() => { CodeHelper.assertOfKeyName('Ab c09_'); }).toThrow();
	});
	test('assertOfNotationFormat', () => {
		expect(() => { CodeHelper.assertOfNotationFormat('abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[0]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].Abc'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].789'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('@abc[01].789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('!abc[01].789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].@!789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('!@abc[01].!@789[10]'); }).not.toThrow();
		
		expect(() => { CodeHelper.assertOfNotationFormat(' abc'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[]'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[+01]'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('ab$c[01]'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01]..Abc'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('.abc[01].789'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].'); }).toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('!@@abc[01].789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc![01].789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].!!789[10]'); }).not.toThrow();
		expect(() => { CodeHelper.assertOfNotationFormat('abc[01].789[!10]'); }).not.toThrow();
	});
});
describe('clone', () => {
	describe('Primitive', () => {
	  test('String', () => {
	  	expect(CodeHelper.clone('')).toEqual('');
	  	expect(CodeHelper.clone('Abc123')).toEqual('Abc123');
	  	expect(CodeHelper.clone('ภาษาอื่นๆ')).toEqual('ภาษาอื่นๆ');
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
	  	expect(() => { CodeHelper.clone(Infinity); }).toThrow();
	  	
	  	expect(CodeHelper.clone(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
	  	expect(CodeHelper.clone(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
	  	
	  	//expect(CodeHelper.clone(NaN)).toEqual(NaN);
	  	expect(() => { CodeHelper.clone(NaN); }).toThrow();
	  });
	  test('Boolean', () => {
	  	expect(CodeHelper.clone(false)).toEqual(false);
	  	expect(CodeHelper.clone(true)).toEqual(true);
	  });
	  test('Others', () => {
	  	//expect(CodeHelper.clone(undefined)).toEqual(undefined);
	  	expect(() => { CodeHelper.clone(undefined); }).toThrow();
	  	
	  	expect(CodeHelper.clone(null)).toEqual(null);
	  	
	  	const time = new Date();
	  	expect(new Date(CodeHelper.clone(time))).toEqual(time);
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
	  			y: 'Abc'
	  		}
	  	};
	  	expect(CodeHelper.clone(structure3)).toEqual(structure3);
	  	
	  	const structure4 = {
	  		a: 123,
	  		b: -Infinity,
	  		c: {
	  			x: 0.45
	  		}
	  	};
	  	//expect(CodeHelper.clone(structure4)).toEqual(structure4);
	  	expect(() => { CodeHelper.clone(structure4); }).toThrow();
	  	
	  	const structure5 = {
	  		a: 123,
	  		b: 0.45,
	  		c: {
	  			x: Infinity
	  		}
	  	};
	  	//expect(CodeHelper.clone(structure5)).toEqual(structure5);
	  	expect(() => { CodeHelper.clone(structure5); }).toThrow();
	  	
	  	const structure6 = {
	  		a: 123,
	  		b: 0.45,
	  		c: {
	  			x: NaN
	  		}
	  	};
	  	//expect(CodeHelper.clone(structure6)).toEqual(structure6);
	  	expect(() => { CodeHelper.clone(structure6); }).toThrow();
	  	
	  	const structure7 = {
	  		a: 123,
	  		b: 0.45,
	  		c: {
	  			x: {
	  				i: 'Abc',
	  				j: /123/
	  			}
	  		}
	  	};
	  	//expect(CodeHelper.clone(structure7)).toEqual(structure7);
	  	expect(() => { CodeHelper.clone(structure7); }).toThrow();
	  	
	  	const structure8 = {
	  		a: undefined
	  	};
	  	//expect(CodeHelper.clone(structure8)).toEqual(structure8);
	  	expect(() => { CodeHelper.clone(structure8); }).toThrow();
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
	  	expect(CodeHelper.equals('ภาษาอื่นๆ', 'ภาษาอื่นๆ')).toEqual(true);
	  	expect(CodeHelper.equals('ภาษาอื่นๆ', 'ภาษาอื่น')).toEqual(false);
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
	  	expect(() => { CodeHelper.equals(NaN, NaN); }).toThrow();
	  	
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
	  	
	  	expect(CodeHelper.equals(/123/, /123/)).toEqual(true);
	  	expect(CodeHelper.equals(/123/, /123/g)).toEqual(false);
	  	expect(CodeHelper.equals(Math.random, Math.random)).toEqual(true);
	  	expect(CodeHelper.equals(() => {}, () => {})).toEqual(false);
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

describe('escape', () => {
	test('Simple', () => {
		expect(CodeHelper.escape(undefined)).toEqual('');
		expect(CodeHelper.escape(null)).toEqual('');
		expect(CodeHelper.escape('& > < " \' &><"\' &  > \r\n <  " \t \'')).toEqual('&amp; &gt; &lt; &quot; &#039; &amp;&gt;&lt;&quot;&#039; &amp;  &gt; \r\n &lt;  &quot; \t &#039;');
	});
});

describe('sortHashtable', () => {
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
  		d: {
  			x: true,
  			y: 'Abc'
  		},
  		b: 0.45,
  		a: 123,
  		c: {
  			x: false,
  			z: [false, 1, 2, Infinity],
  			y: 'Abc',
  		}
  	};
  	const sortedStructure3 = {
  		a: 123,
  		b: 0.45,
  		c: {
  			x: false,
  			y: 'Abc',
  			z: [false, 1, 2, Infinity]
  		},
  		d: {
  			x: true,
  			y: 'Abc'
  		}
  	};
  	expect(CodeHelper.sortHashtable(structure3)).toEqual(sortedStructure3);
  	
  	const structure4 = {
  		b: [],
  		a: [false, {
  				z: 1,
  				y: 2
  			}, 2, {
	  			y: 123,
	  			z: 456,
	  			x: [-1, Infinity, {
	  				j: -2,
	  				i: -1,
	  				k: -3
	  			}, NaN]
  			}
  		]
  	};
  	const sortedStructure4 = {
  		a: [false, {
  				y: 2,
  				z: 1
  			}, 2, {
	  			x: [-1, Infinity, {
	  				i: -1,
	  				j: -2,
	  				k: -3
	  			}, NaN],
	  			y: 123,
	  			z: 456
  			}
  		],
  		b: []
  	};
  	expect(CodeHelper.sortHashtable(structure4)).toEqual(sortedStructure4);
  });
});

describe('label/unlabel', () => {
	const fs = require('fs');
	const path = require('path');
	const label = fs.readFileSync(path.resolve(__dirname, '../files/label.stackblend'), {encoding:'utf8', flag:'r'});
	const unlabel = fs.readFileSync(path.resolve(__dirname, '../files/unlabel.stackblend'), {encoding:'utf8', flag:'r'});
	
	test('Using project files', () => {
		expect(CodeHelper.unlabel(label).replace(/\r\n/g, '\n')).toEqual(unlabel.replace(/\r\n/g, '\n'));
		expect(CodeHelper.label(unlabel.replace(/\r\n/g, '\n'))).toEqual(label.replace(/\r\n/g, '\n'));
	});
});