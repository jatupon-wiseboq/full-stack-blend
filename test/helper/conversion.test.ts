import {DataFormationHelper} from "../../src/controllers/helpers/DataFormationHelper";

describe('Conversion', () => {
  describe('Back and forth between JSONToHierarchicalDataTable and JSON', () => {
    test('Back and forth 1', () => {
      let input = {
        a: 1,
        b: [0, 1],
        c: {a: 1},
        d: {b: [0, 1]},
        e: {c: {a: 1}, d: [0, 1]},
        f: {a: [[0, 1, 2]], b: [{a: 1, b: [0, 1]}, {a: 2, b: [0, 2]}, {a: 3, b: [0, 3]}]}
      };
      
      let table = DataFormationHelper.convertFromJSONToHierarchicalDataTable(input, 'testing');
      let output = DataFormationHelper.convertFromHierarchicalDataTableToJSON(table);
      
      expect(output).toEqual(input);
    });
  });
});