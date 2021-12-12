import {DataFormationHelper} from "../../../../src/controllers/helpers/DataFormationHelper";
import {DataManipulationHelper} from "../../../../src/controllers/helpers/DataManipulationHelper";

describe('DataManipulationHelper', () => {
	test('Standard Structure', () => {
		const data = {
	    "CollectionA": {
	      "source": 6,
	      "group": "CollectionA",
	      "rows": [
	        {
	          "keys": {
	            "keyA": 1,
	            "keyB": "string 1"
	          },
	          "columns": {
	            "keyC": 2,
	            "keyD": false
	          },
	          "relations": {
	            "CollectionB": {
	              "source": 6,
	              "group": "CollectionB",
	              "rows": [
	                {
	                  "keys": {
	                    "keyA": 3,
	                    "keyB": "string 2"
	                  },
	                  "columns": {
	                    "keyC": 4,
	                    "keyD": true
	                  },
	                  "relations": {
	                    "CollectionC": {
	                      "source": 6,
	                      "group": "CollectionC",
	                      "rows": [
	                        {
	                          "keys": {
	                            "keyA": 5,
	                            "keyB": "string 3"
	                          },
	                          "columns": {
	                            "keyC": 6,
	                            "keyD": false
	                          },
	                          "relations": {}
	                        }
	                      ]
	                    },
	                    "CollectionD": {
	                      "source": 6,
	                      "group": "CollectionD",
	                      "rows": [
	                        {
	                          "keys": {
	                            "keyA": 55,
	                            "keyB": "string 33"
	                          },
	                          "columns": {
	                            "keyC": 66,
	                            "keyD": true
	                          },
	                          "relations": {}
	                        }
	                      ]
	                    }
	                  }
	                },
	                {
	                  "keys": {
	                    "keyA": 7,
	                    "keyB": "string 4"
	                  },
	                  "columns": {
	                    "keyC": 8,
	                    "keyD": false
	                  },
	                  "relations": {
	                    "CollectionC": {
	                      "source": 6,
	                      "group": "CollectionC",
	                      "rows": [
	                        {
	                          "keys": {
	                            "keyA": 9,
	                            "keyB": "string 5"
	                          },
	                          "columns": {
	                            "keyC": 10,
	                            "keyD": true
	                          },
	                          "relations": {}
	                        }
	                      ]
	                    }, 
	                    "CollectionD": {
	                      "source": 6,
	                      "group": "CollectionD",
	                      "rows": [
	                        {
	                          "keys": {
	                            "keyA": 99,
	                            "keyB": "string 55"
	                          },
	                          "columns": {
	                            "keyC": 100,
	                            "keyD": false
	                          },
	                          "relations": {}
	                        }
	                      ]
	                    }
	                  }
	                }
	              ]
	            }
	          }
	        },
	        {
	          "keys": {
	            "keyA": 11,
	            "keyB": "string 6"
	          },
	          "columns": {
	            "keyC": 12,
	            "keyD": true
	          },
	          "relations": {
	            "CollectionB": {
	              "source": 6,
	              "group": "CollectionB",
	              "rows": [
	                {
	                  "keys": {
	                    "keyA": 13,
	                    "keyB": "string 7"
	                  },
	                  "columns": {
	                    "keyC": 14,
	                    "keyD": false
	                  },
	                  "relations": {
	                    "CollectionC": {
	                      "source": 6,
	                      "group": "CollectionC",
	                      "rows": [
	                        {
	                          "keys": {
	                            "keyA": 15,
	                            "keyB": "string 8"
	                          },
	                          "columns": {
	                            "keyC": 16,
	                            "keyD": true
	                          },
	                          "relations": {}
	                        }
	                      ]
	                    }
	                  }
	                },
	                {
	                  "keys": {
	                    "keyA": 17,
	                    "keyB": "string 9"
	                  },
	                  "columns": {
	                    "keyC": 18,
	                    "keyD": false
	                  },
	                  "relations": {
	                    "CollectionC": {
	                      "source": 6,
	                      "group": "CollectionC",
	                      "rows": [
	                        {
	                          "keys": {
	                            "keyA": 19,
	                            "keyB": "string 10"
	                          },
	                          "columns": {
	                            "keyC": 20,
	                            "keyD": true
	                          },
	                          "relations": {}
	                        }
	                      ]
	                    }
	                  }
	                }
	              ]
	            }
	          }
	        }
	      ]
	    },
	    "CollectionD": {
        "source": 6,
        "group": "CollectionD",
        "rows": [
          {
            "keys": {
              "keyA": 11,
              "keyB": "string 11"
            },
            "columns": {
              "keyC": 22,
              "keyD": false
            },
            "relations": {}
          }
        ]
      }
	  };
		DataManipulationHelper.setData(data);
		
		expect(DataManipulationHelper.getDataFromNotation('CollectionA')).toEqual(data['CollectionA'].rows);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].keyA')).toEqual(1);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].keyB')).toEqual("string 1");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].keyC')).toEqual(2);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].keyD')).toEqual(false);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.keyA')).toEqual(3);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.keyB')).toEqual("string 2");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.keyC')).toEqual(4);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.keyD')).toEqual(true);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionC.keyA')).toEqual(5);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionC.keyB')).toEqual("string 3");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionC.keyC')).toEqual(6);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionC.keyD')).toEqual(false);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionD.keyA')).toEqual(55);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionD.keyB')).toEqual("string 33");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionD.keyC')).toEqual(66);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB.CollectionD.keyD')).toEqual(true);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].keyA')).toEqual(7);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].keyB')).toEqual("string 4");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].keyC')).toEqual(8);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].keyD')).toEqual(false);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionC.keyA')).toEqual(9);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionC.keyB')).toEqual("string 5");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionC.keyC')).toEqual(10);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionC.keyD')).toEqual(true);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionD.keyA')).toEqual(99);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionD.keyB')).toEqual("string 55");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionD.keyC')).toEqual(100);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[0].CollectionB[1].CollectionD.keyD')).toEqual(false);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].keyA')).toEqual(11);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].keyB')).toEqual("string 6");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].keyC')).toEqual(12);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].keyD')).toEqual(true);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].keyA')).toEqual(13);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].keyB')).toEqual("string 7");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].keyC')).toEqual(14);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].keyD')).toEqual(false);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].CollectionC.keyA')).toEqual(15);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].CollectionC.keyB')).toEqual("string 8");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].CollectionC.keyC')).toEqual(16);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[0].CollectionC.keyD')).toEqual(true);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].keyA')).toEqual(17);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].keyB')).toEqual("string 9");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].keyC')).toEqual(18);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].keyD')).toEqual(false);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].CollectionC.keyA')).toEqual(19);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].CollectionC.keyB')).toEqual("string 10");
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].CollectionC.keyC')).toEqual(20);
		expect(DataManipulationHelper.getDataFromNotation('CollectionA[1].CollectionB[1].CollectionC.keyD')).toEqual(true);
		expect(DataManipulationHelper.getDataFromNotation('CollectionD')).toEqual(data['CollectionD'].rows);
		expect(DataManipulationHelper.getDataFromNotation('CollectionD[0]')).toEqual(data['CollectionD'].rows[0]);
		expect(DataManipulationHelper.getDataFromNotation('CollectionD.keyA')).toEqual(11);
		expect(DataManipulationHelper.getDataFromNotation('CollectionD.keyB')).toEqual('string 11');
		expect(DataManipulationHelper.getDataFromNotation('CollectionD.keyC')).toEqual(22);
		expect(DataManipulationHelper.getDataFromNotation('CollectionD.keyD')).toEqual(false);
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
		
		expect(() => { DataManipulationHelper.getDataFromNotation('Collection[[0]]'); }).toThrow();
		expect(() => { DataManipulationHelper.getDataFromNotation('Collection[0].[[0]]'); }).toThrow();
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
		
		expect(() => { DataManipulationHelper.getDataFromNotation(null); }).toThrow();
		expect(() => { DataManipulationHelper.getDataFromNotation(undefined); }).toThrow();
		expect(() => { DataManipulationHelper.getDataFromNotation(''); }).toThrow();
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
		
		expect(() => { DataManipulationHelper.getDataFromNotation('Collection[[0]]', undefined, true); }).toThrow();
		expect(() => { DataManipulationHelper.getDataFromNotation('Collection[0].[[0]]', undefined, true); }).toThrow();
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
		
		expect(() => { DataManipulationHelper.getDataFromNotation(null, undefined, true); }).toThrow();
		expect(() => { DataManipulationHelper.getDataFromNotation(undefined, undefined, true); }).toThrow();
		expect(() => { DataManipulationHelper.getDataFromNotation('', undefined, true); }).toThrow();
	});
});