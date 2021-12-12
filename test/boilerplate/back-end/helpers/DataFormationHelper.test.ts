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
	  
	  expect(DataFormationHelper.convertFromJSONToHierarchicalDataTable({
	  	CollectionA: [{
	  		$keyA: 1,
	  		$keyB: "string 1",
	  		keyC: 2,
	  		keyD: false,
	  		CollectionB: [{
	  			$keyA: 3,
		  		$keyB: "string 2",
		  		keyC: 4,
		  		keyD: true,
		  		CollectionC: [{
		  			$keyA: 5,
			  		$keyB: "string 3",
			  		keyC: 6,
			  		keyD: false
		  		}],
		  		CollectionD: [{
		  			$keyA: 55,
			  		$keyB: "string 33",
			  		keyC: 66,
			  		keyD: true
		  		}]
	  		}, {
	  			$keyA: 7,
		  		$keyB: "string 4",
		  		keyC: 8,
		  		keyD: false,
		  		CollectionC: [{
		  			$keyA: 9,
			  		$keyB: "string 5",
			  		keyC: 10,
			  		keyD: true
		  		}],
		  		CollectionD: [{
		  			$keyA: 99,
			  		$keyB: "string 55",
			  		keyC: 100,
			  		keyD: false
		  		}]
	  		}]
	  	}, {
	  		$keyA: 11,
	  		$keyB: "string 6",
	  		keyC: 12,
	  		keyD: true,
	  		CollectionB: [{
	  			$keyA: 13,
		  		$keyB: "string 7",
		  		keyC: 14,
		  		keyD: false,
		  		CollectionC: [{
		  			$keyA: 15,
			  		$keyB: "string 8",
			  		keyC: 16,
			  		keyD: true
		  		}]
	  		}, {
	  			$keyA: 17,
		  		$keyB: "string 9",
		  		keyC: 18,
		  		keyD: false,
		  		CollectionC: [{
		  			$keyA: 19,
			  		$keyB: "string 10",
			  		keyC: 20,
			  		keyD: true
		  		}]
	  		}]
	  	}],
	  	CollectionD: [{
	  		$keyA: 11,
	  		$keyB: "string 11",
	  		keyC: 22,
	  		keyD: false
	  	}]
	  }).rows[0].relations).toEqual(data);
	});
	
	test('Complex Structure', () => {
		let data = null;
		data = {
			a: 1,
			b: [0, 1],
			c: {$a: 1},
			d: {b: [0, 1]},
			e: {c: {$a: 1}, d: [0, 1]},
			f: {a: [[0, 1, 2]], b: [{$a: 1, b: [0, 1]}, {$a: 2, b: [0, 2]}, {$a: 3, b: [0, 3]}]}
		};
		expect(DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data))).toEqual(data);
		
		data = {
			a: null,
			b: [0.0, ''],
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
				'¡¢¤': {
					'1': 1,
					'2': 2,
					'3': 3,
					'true': [{
						'L:"|}': 4,
						'<?>":': 5
					}, ['¿Ë¡´', 'èÒÊÇ']]
				}
			},
			'*()_|\'': 6
		};
		expect(() => { DataFormationHelper.convertFromHierarchicalDataTableToJSON(DataFormationHelper.convertFromJSONToHierarchicalDataTable(data)); }).toThrow();
	});
});