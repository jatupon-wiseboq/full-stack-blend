import {CodeHelper} from "../../../../src/controllers/helpers/CodeHelper";
import {ActionType} from "../../../../src/controllers/helpers/DatabaseHelper";
import {PermissionHelper} from "../../../../src/controllers/helpers/PermissionHelper";
import {createRows, crud, crud_base, CRUD, SourceType, next, tableMap, establishTransaction, establishPermissionChecking} from "./DatabaseHelper.TestUtilities";
import flushPromises from "flush-promises";

describe('PermissionHelper', () => {
  describe('Unit', () => {
    test('hasPermissionDefining', () => {
      expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 0, 1))).toEqual(false); // modification of columns / keys
      expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 1, 1))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 3, 1))).toEqual(true);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Update, createRows(1, SourceType.Relational, 1, 1))).toEqual(false); // various of modification of columns / keys
      expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.Relational, 1, 1))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Delete, createRows(1, SourceType.Relational, 1, 1))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Update, createRows(1, SourceType.Relational, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.Relational, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Delete, createRows(1, SourceType.Relational, 2, 1))).toEqual(true);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Relational, 0, 1))).toEqual(false); // retrieval of columns / keys
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Relational, 1, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Relational, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Relational, 3, 1))).toEqual(true);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Update, createRows(1, SourceType.Document, 0, 1))).toEqual(false); // modification of columns / keys in Document
      expect(PermissionHelper.hasPermissionDefining(ActionType.Update, createRows(1, SourceType.Document, 1, 1))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Update, createRows(1, SourceType.Document, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Update, createRows(1, SourceType.Document, 3, 1))).toEqual(true);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Document, 0, 1))).toEqual(false); // retrieval of columns / keys in Document
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Document, 1, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Document, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Document, 3, 1))).toEqual(true);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 0, 1))).toEqual(false); // modification of table
      expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 1, 1))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 3, 1))).toEqual(false);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 0, 1))).toEqual(false); // retrieval of table
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 1, 1))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 2, 1))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 3, 1))).toEqual(true);
      
      expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 0, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(false); // recursive (control)
      expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 2, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true); // recursive (check)
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 1, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(false);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 2, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true);
      expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 3, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true); // no path
    });
  });
  describe('Integration', () => {
    describe('T', () => {
      describe('Retrieval of Blocking Key / Column', () => {
        test('One-Hop Referencing', async () => {
          await flushPromises();
            
          establishPermissionChecking(true);
          const transaction = await establishTransaction(true);
          
          // Relational
          // 
          let control1 = createRows(20, SourceType.Relational, 1, 5, 6);
          await crud_base(
            20,
            CRUD.Create,
            control1
          );
          let results = await crud_base(
            20,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational1'].rows[0].keys['int03']).toBeDefined(); // no session
          expect(results['relational1'].rows[2].keys['int03']).toBeDefined();
          expect(results['relational1'].rows[3].keys['int03']).toBeDefined();
          
          expect(results['relational1'].rows[0].keys['bol02']).toBeDefined();
          expect(results['relational1'].rows[0].columns['int01']).toBeDefined();
          expect(results['relational1'].rows[0].columns['grp01']).toBeDefined();
          expect(results['relational1'].rows[0].columns['str07']).not.toBeDefined();
          
          expect(results['relational1'].rows[0].columns['int09']).not.toBeDefined(); // control for with session
          expect(results['relational1'].rows[1].columns['int09']).not.toBeDefined();
          expect(results['relational1'].rows[4].columns['int09']).not.toBeDefined();
          
          expect(results['relational1'].rows[0].columns['dat08']).not.toBeDefined(); // control for with relation
          expect(results['relational1'].rows[1].columns['dat08']).not.toBeDefined();
          expect(results['relational1'].rows[2].columns['dat08']).not.toBeDefined();
          expect(results['relational1'].rows[3].columns['dat08']).not.toBeDefined();
          expect(results['relational1'].rows[4].columns['dat08']).not.toBeDefined();
          
          establishPermissionChecking(true, {int09: 123});
          
          results = await crud_base(
            20,
            CRUD.Retrieve,
            createRows(20, SourceType.Relational, 1, 5, 6)
          );
          
          expect(results['relational1'].rows[0].columns['int09']).toBeDefined(); // with session
          expect(results['relational1'].rows[1].columns['int09']).toBeDefined();
          expect(results['relational1'].rows[4].columns['int09']).toBeDefined();
          
          let data1 = createRows(20, SourceType.Relational, 0, 5, 6);
          data1['relational0'].rows[1].columns['int06'] = 456;
          data1['relational0'].rows[2].columns['int06'] = 456;
          
          await crud_base(
            20,
            CRUD.Create,
            data1
          );
          
          results = await crud_base(
            20,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational1'].rows[0].columns['dat08']).not.toBeDefined(); // with relation to a relational table
          expect(results['relational1'].rows[1].columns['dat08']).toBeDefined();
          expect(results['relational1'].rows[2].columns['dat08']).toBeDefined();
          expect(results['relational1'].rows[3].columns['dat08']).not.toBeDefined();
          expect(results['relational1'].rows[4].columns['dat08']).not.toBeDefined();
          
          // Document
          // 
          establishPermissionChecking(true);
          
          control1 = createRows(20, SourceType.Document, 1, 10, 7);
          await crud_base(
            20,
            CRUD.Create,
            control1
          );
          results = await crud_base(
            20,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['Document1'].rows[5].keys['int03']).toBeDefined(); // no session
          expect(results['Document1'].rows[6].keys['int03']).toBeDefined();
          expect(results['Document1'].rows[8].keys['int03']).toBeDefined();
          
          expect(results['Document1'].rows[1].keys['bol02']).toBeDefined();
          expect(results['Document1'].rows[1].columns['int01']).toBeDefined();
          expect(results['Document1'].rows[1].columns['grp01']).toBeDefined();
          expect(results['Document1'].rows[1].columns['str07']).not.toBeDefined();
          
          expect(results['Document1'].rows[2].columns['int09']).not.toBeDefined(); // control for with session
          expect(results['Document1'].rows[3].columns['int09']).not.toBeDefined();
          expect(results['Document1'].rows[5].columns['int09']).not.toBeDefined();
          
          expect(results['Document1'].rows[0].columns['dat08']).not.toBeDefined(); // control for with relation
          expect(results['Document1'].rows[1].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[2].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[3].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[4].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[5].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[6].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[7].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[8].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[9].columns['dat08']).not.toBeDefined();
          
          establishPermissionChecking(true, {int09: 123});
          
          results = await crud_base(
            20,
            CRUD.Retrieve,
            createRows(20, SourceType.Document, 1, 10, 7)
          );
          
          expect(results['Document1'].rows[2].columns['int09']).toBeDefined(); // with session
          expect(results['Document1'].rows[3].columns['int09']).toBeDefined();
          expect(results['Document1'].rows[5].columns['int09']).toBeDefined();
          
          data1 = createRows(20, SourceType.Document, 0, 10, 7);
          data1['Document0'].rows[4].columns['int06'] = 789;
          data1['Document0'].rows[5].columns['int06'] = 789;
          data1['Document0'].rows[6].columns['int06'] = 789;
          data1['Document0'].rows[8].columns['int06'] = 789;
          
          await crud_base(
            20,
            CRUD.Create,
            data1
          );
          
          results = await crud_base(
            20,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['Document1'].rows[0].columns['dat08']).not.toBeDefined(); // with relation to a document table
          expect(results['Document1'].rows[1].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[2].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[3].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[4].columns['dat08']).toBeDefined();
          expect(results['Document1'].rows[5].columns['dat08']).toBeDefined();
          expect(results['Document1'].rows[6].columns['dat08']).toBeDefined();
          expect(results['Document1'].rows[7].columns['dat08']).not.toBeDefined();
          expect(results['Document1'].rows[8].columns['dat08']).toBeDefined();
          expect(results['Document1'].rows[9].columns['dat08']).not.toBeDefined();
          
          await transaction.commit();
        });
        test('Two-Hops Referencing', async () => {
          await flushPromises();
          
          // Relational
          // 
          const control1 = createRows(21, SourceType.Relational, 2, 5, 6);
          establishPermissionChecking(false);
          const transaction = await establishTransaction(true);
          
          await crud_base(
            21,
            CRUD.Create,
            control1
          );
          establishPermissionChecking(true);
          let results = await crud_base(
            21,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational2'].rows[0].keys['int03']).toBeDefined(); // no session
          expect(results['relational2'].rows[2].keys['int03']).toBeDefined();
          expect(results['relational2'].rows[3].keys['int03']).toBeDefined();
          
          expect(results['relational2'].rows[0].keys['str10']).toBeDefined();
          expect(results['relational2'].rows[0].columns['bol02']).toBeDefined();
          expect(results['relational2'].rows[0].columns['grp01']).toBeDefined();
          expect(results['relational2'].rows[0].columns['str11']).toBeDefined();
          expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[0].columns['flt13']).toBeDefined();
          
          expect(results['relational2'].rows[1].columns['str11']).toBeDefined();
          expect(results['relational2'].rows[2].columns['str11']).toBeDefined();
          expect(results['relational2'].rows[4].columns['str11']).toBeDefined();
          
          expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // control for with relation
          expect(results['relational2'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[2].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[3].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[4].columns['dat12']).not.toBeDefined();
          
          const data1 = createRows(21, SourceType.Relational, 0, 5, 6);
          data1['relational0'].rows[1].columns['int06'] = 789;
          data1['relational0'].rows[2].columns['int06'] = 789;
          
          await crud_base(
            21,
            CRUD.Create,
            data1
          );
          
          results = await crud_base(
            21,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // with relation to a relational table (no in-between)
          expect(results['relational2'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[2].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[3].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[4].columns['dat12']).not.toBeDefined();
          
          await crud_base(
            21,
            CRUD.Create,
            createRows(21, SourceType.Relational, 1, 5, 6)
          );
          
          results = await crud_base(
            21,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // with relation to a relational table (has in-between)
          expect(results['relational2'].rows[1].columns['dat12']).toBeDefined();
          expect(results['relational2'].rows[2].columns['dat12']).toBeDefined();
          expect(results['relational2'].rows[3].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[4].columns['dat12']).not.toBeDefined();
          
          await transaction.commit();
        });
        test('Cross-Hops Referencing', async () => {
          await flushPromises();
          
          // Document --> Relational
          // 
          const control1 = createRows(22, SourceType.Document, 2, 5, 6);
          establishPermissionChecking(false);
          const transaction = await establishTransaction(true);
          
          await crud_base(
            22,
            CRUD.Create,
            control1
          );
          establishPermissionChecking(true);
          let results = await crud_base(
            22,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['Document2'].rows[0].keys['int03']).toBeDefined(); // no session
          expect(results['Document2'].rows[2].keys['int03']).toBeDefined();
          expect(results['Document2'].rows[3].keys['int03']).toBeDefined();
          
          expect(results['Document2'].rows[0].keys['str10']).toBeDefined();
          expect(results['Document2'].rows[0].columns['bol02']).toBeDefined();
          expect(results['Document2'].rows[0].columns['grp01']).toBeDefined();
          expect(results['Document2'].rows[0].columns['str11']).not.toBeDefined();
          expect(results['Document2'].rows[0].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[0].columns['flt13']).not.toBeDefined();
          
          expect(results['Document2'].rows[1].columns['str11']).not.toBeDefined(); // always blocked
          expect(results['Document2'].rows[2].columns['str11']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['str11']).not.toBeDefined();
          
          expect(results['Document2'].rows[2].columns['flt13']).not.toBeDefined();
          expect(results['Document2'].rows[3].columns['flt13']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['flt13']).not.toBeDefined();
          
          expect(results['Document2'].rows[0].columns['dat12']).not.toBeDefined(); // control for with relation
          expect(results['Document2'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[2].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[3].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['dat12']).not.toBeDefined();
          
          establishPermissionChecking(true, {int09: 123, int06: 234});
          
          results = await crud_base(
            22,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['Document2'].rows[1].columns['str11']).not.toBeDefined(); // always blocked
          expect(results['Document2'].rows[2].columns['str11']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['str11']).not.toBeDefined();
          
          expect(results['Document2'].rows[2].columns['flt13']).toBeDefined(); // with session
          expect(results['Document2'].rows[3].columns['flt13']).toBeDefined();
          expect(results['Document2'].rows[4].columns['flt13']).toBeDefined();
          
          expect(results['Document2'].rows[1].columns['dat12']).not.toBeDefined(); // with relation
          expect(results['Document2'].rows[2].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['dat12']).not.toBeDefined();
          
          const data1 = createRows(22, SourceType.Relational, 0, 5, 6);
          data1['relational0'].rows[1].columns['int06'] = '234';
          data1['relational0'].rows[2].columns['int06'] = '234';
          
          await crud_base(
            22,
            CRUD.Create,
            data1
          );
          
          results = await crud_base(
            22,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['Document2'].rows[0].columns['dat12']).not.toBeDefined(); // with relation to a relational table (no in-between)
          expect(results['Document2'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[2].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[3].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['dat12']).not.toBeDefined();
          
          await crud_base(
            22,
            CRUD.Create,
            createRows(22, SourceType.Document, 1, 5, 6)
          );
          
          results = await crud_base(
            22,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['Document2'].rows[0].columns['dat12']).not.toBeDefined(); // with relation to a relational table (has in-between)
          expect(results['Document2'].rows[1].columns['dat12']).toBeDefined();
          expect(results['Document2'].rows[2].columns['dat12']).toBeDefined();
          expect(results['Document2'].rows[3].columns['dat12']).not.toBeDefined();
          expect(results['Document2'].rows[4].columns['dat12']).not.toBeDefined();
          
          // VolatileMemory --> Document --> Relational
          // 
          const control2 = createRows(24, SourceType.VolatileMemory, 2, 1, 1);
          establishPermissionChecking(false);
          await crud_base(
            24,
            CRUD.Create,
            control2
          );
          establishPermissionChecking(true);
          results = await crud_base(
            24,
            CRUD.Retrieve,
            control2
          );
          
          expect(results['VolatileMemory2'].rows[0].keys['int03']).toBeDefined(); // no session
          
          expect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();
          
          expect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // control for with relation
          
          establishPermissionChecking(true, {int09: 123, int06: 567});
          
          results = await crud_base(
            24,
            CRUD.Retrieve,
            control2
          );
          
          expect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();
          
          expect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // with session (no in-between)
          
          const data2 = createRows(24, SourceType.Document, 1, 1, 1);
          
          await crud_base(
            24,
            CRUD.Create,
            data2
          );
          
          results = await crud_base(
            24,
            CRUD.Retrieve,
            control2
          );
          
          expect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();
          
          expect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // with session (have some in-between)
          
          const data3 = createRows(24, SourceType.Relational, 0, 1, 1);
          data3['relational0'].rows[0].columns['str04'] = '567';
          
          await crud_base(
            24,
            CRUD.Create,
            data3
          );
          
          results = await crud_base(
            24,
            CRUD.Retrieve,
            control2
          );
          
          expect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();
          expect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();
          
          expect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // with session (have all in-between)
          
          await transaction.commit();
        });
        test('Unavailable-Hop Referencing', async () => {
          await flushPromises();
            
          establishPermissionChecking(true);
          
          // Relational
          // 
          const control1 = createRows(23, SourceType.Relational, 2, 3, 7);
          establishPermissionChecking(false);
          const transaction = await establishTransaction(true);
          
          await crud_base(
            23,
            CRUD.Create,
            control1
          );
          await crud_base(
            23,
            CRUD.Create,
            createRows(23, SourceType.Relational, 3, 3, 7)
          );
          establishPermissionChecking(true);
          const data1 = createRows(23, SourceType.Relational, 0, 3, 7);
          data1['relational0'].rows[2].columns['int06'] = 789;
          await crud_base(
            23,
            CRUD.Create,
            data1
          );
          let results = await crud_base(
            23,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // control (no in-between)
          expect(results['relational2'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[2].columns['dat12']).not.toBeDefined();
          
          await crud_base(
            23,
            CRUD.Create,
            createRows(23, SourceType.Relational, 1, 3, 7)
          );
          results = await crud_base(
            23,
            CRUD.Retrieve,
            control1
          );
          
          expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // control (have in-between)
          expect(results['relational2'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['relational2'].rows[2].columns['dat12']).toBeDefined();
          
          results = await crud_base(
            23,
            CRUD.Retrieve,
            createRows(23, SourceType.Relational, 3, 3, 7)
          );
          
          expect(results['relational3'].rows[0].columns['dat12']).not.toBeDefined();
          expect(results['relational3'].rows[1].columns['dat12']).not.toBeDefined();
          expect(results['relational3'].rows[2].columns['dat12']).not.toBeDefined();
          
          await transaction.commit();
        });
      });
      describe('Modification of Blocking Key / Column', () => {
        test('Any-Hop Referencing', async () => {
          await flushPromises();
          
          // Relational
          // 
          establishPermissionChecking(false);
          let transaction = await establishTransaction(true); // permanent any changes
          await crud_base(
            25,
            CRUD.Create,
            createRows(25, SourceType.Relational, 2, 5, 6)
          );
          establishPermissionChecking(true);
          const control1 = createRows(25, SourceType.Relational, 2, 5, 7);
          await transaction.commit();
          
          transaction = await establishTransaction(true); // will reset changes
          expect(async () => {
            await crud_base(
              25,
              CRUD.Update,
              control1
            );
          }).rejects.toThrow();
          
          delete control1['relational2'].rows[0].columns['str11']; // deleted field will pass
          delete control1['relational2'].rows[0].columns['dat12'];
          delete control1['relational2'].rows[0].columns['flt13'];
          delete control1['relational2'].rows[1].columns['str11'];
          delete control1['relational2'].rows[1].columns['dat12'];
          delete control1['relational2'].rows[1].columns['flt13'];
          delete control1['relational2'].rows[2].columns['str11'];
          delete control1['relational2'].rows[2].columns['dat12'];
          delete control1['relational2'].rows[2].columns['flt13'];
          delete control1['relational2'].rows[3].columns['str11'];
          delete control1['relational2'].rows[3].columns['dat12'];
          delete control1['relational2'].rows[3].columns['flt13'];
          delete control1['relational2'].rows[4].columns['str11'];
          delete control1['relational2'].rows[4].columns['dat12'];
          delete control1['relational2'].rows[4].columns['flt13'];
          
          transaction = await establishTransaction(true); // will reset changes
          await crud_base(
            25,
            CRUD.Update,
            control1
          );
          
          const data1 = createRows(25, SourceType.Relational, 0, 5, 7); // with relation and all right value
          data1['relational0'].rows[0].columns['int06'] = 456;
          data1['relational0'].rows[1].columns['int06'] = 456;
          data1['relational0'].rows[2].columns['int06'] = 456;
          data1['relational0'].rows[3].columns['int06'] = 456;
          data1['relational0'].rows[4].columns['int06'] = 456;
          
          transaction = await establishTransaction(true); // permanent any changes
          await crud_base(
            25,
            CRUD.Create,
            data1
          );
          
          await crud_base(
            25,
            CRUD.Create,
            createRows(25, SourceType.Relational, 1, 5, 7)
          );
          
          transaction = await establishTransaction(true); // will reset changes
          expect(async () => {
            await crud_base(
              25,
              CRUD.Update,
              control1
            );
          }).rejects.toThrow();
          
          transaction = await establishTransaction(true); // permanent any changes
          await crud_base(
            25,
            CRUD.Update,
            data1
          );
          
          data1['relational0'].rows[3].columns['int06'] = 789; // with relation and some wrong value
          data1['relational0'].rows[4].columns['int06'] = 789;
          
          await crud_base(
            25,
            CRUD.Update,
            control1
          );
          await transaction.commit();
        });
        test('Unavailable-Hop Referencing', async () => { // relational3 (=~ relational2)
          await flushPromises();
            
          establishPermissionChecking(false);
          const transaction = await establishTransaction(true);
          
          await crud_base(
            26,
            CRUD.Create,
            createRows(26, SourceType.Relational, 3, 5, 6)
          );
          establishPermissionChecking(true);
          const control1 = createRows(26, SourceType.Relational, 3, 5, 7);
          
          expect(async () => {
            await crud_base(
              26,
              CRUD.Update,
              control1
            );
          }).rejects.toThrow();
          
          expect(async () => {
            await crud_base(
              26,
              CRUD.Update,
              control1
            );
          }).rejects.toThrow();
          
          const data1 = createRows(26, SourceType.Relational, 0, 5, 7); // with relation and all right value
          data1['relational0'].rows[0].columns['int06'] = 456;
          data1['relational0'].rows[1].columns['int06'] = 456;
          data1['relational0'].rows[2].columns['int06'] = 456;
          data1['relational0'].rows[3].columns['int06'] = 456;
          data1['relational0'].rows[4].columns['int06'] = 456;
          
          await crud_base(
            26,
            CRUD.Create,
            data1
          );
          
          await crud_base(
            26,
            CRUD.Create,
            createRows(26, SourceType.Relational, 1, 5, 7)
          );
          
          expect(async () => {
            await crud_base(
              26,
              CRUD.Update,
              control1
            );
          }).rejects.toThrow();
          
          expect(async () => {
            await crud(
              26,
              CRUD.Retrieve,
              control1,
              control1,
              null,
              null
            );
          }).rejects.toThrow();
          
          establishPermissionChecking(false);
          
          await crud_base(
            26,
            CRUD.Update,
            control1
          );
          
          await crud(
            26,
            CRUD.Retrieve,
            control1,
            control1,
            null,
            null
          );
          
          await transaction.commit();
        });
      });
      test('Retrieval of Blocking Table', async () => {
        await flushPromises();
        
        establishPermissionChecking(true);
        
        const control0 = createRows(28, SourceType.Document, 4, 3, 1);
        
        const transaction = await establishTransaction(true); // will reset changes
        await crud_base( // none of data will pass
          28,
          CRUD.Retrieve,
          control0
        );
        
        await crud_base(
          28,
          CRUD.Create,
          control0
        );
        
        expect(async () => { // any data won't pass
          await crud_base(
            28,
            CRUD.Retrieve,
            control0
          );
        }).rejects.toThrow();
        
        expect(async () => { // with data, no relation
          await crud_base(
            28,
            CRUD.Retrieve,
            control0
          );
        }).rejects.toThrow();
        
        await crud_base(
          28,
          CRUD.Create,
          createRows(28, SourceType.Relational, 1, 3, 1)
        );
        
        await crud_base(
          28,
          CRUD.Create,
          createRows(28, SourceType.Relational, 0, 3, 1)
        );
        
        expect(async () => { // with data, with all relations, but no session
          await crud_base(
            28,
            CRUD.Retrieve,
            control0
          );
        }).rejects.toThrow();
        
        const data1 = createRows(28, SourceType.Relational, 0, 3, 1);
        establishPermissionChecking(false, {dat05: data1['relational0'].rows[0].columns['dat05']});
        
        await crud_base( // with all of mentions
          28,
          CRUD.Retrieve,
          control0
        );
        
        data1['relational0'].rows[0].columns['dat05'] = new Date();
        
        await crud_base(
          28,
          CRUD.Update,
          data1
        );
        
        expect(async () => { // missing one of equal field
          await crud_base(
            28,
            CRUD.Retrieve,
            control0
          );
        }).rejects.toThrow();
      });
      test('Modification of Blocking Table', async () => {
        await flushPromises();
        
        establishPermissionChecking(true);
        
        // TODO: VolatileMemory doesn't have full transaction support.
        // 
        const control0 = createRows(27, SourceType.VolatileMemory, 2, 1, 1);
        
        let transaction = await establishTransaction(true); // will reset changes
        expect(async () => { // any data won't pass
          await crud_base(
            27,
            CRUD.Create,
            control0
          );
        }).rejects.toThrow();
        
        expect(async () => { // any data won't pass
          await crud_base(
            27,
            CRUD.Update,
            control0
          );
        }).rejects.toThrow();
        
        expect(async () => { // any data won't pass
          await crud_base(
            27,
            CRUD.Upsert,
            control0
          );
        }).rejects.toThrow();
        
        await crud( // control = empty
          27,
          CRUD.Retrieve,
          control0,
          [],
          null,
          null
        );
        
        await crud_base( // none of data will pass
          27,
          CRUD.Delete,
          control0
        );
        
        transaction = await establishTransaction(true); // permanent any changes
        establishPermissionChecking(false);
        await crud_base(
          27,
          CRUD.Create,
          control0
        );
        await crud(
          27,
          CRUD.Retrieve,
          control0,
          control0,
          null,
          null
        );
        await transaction.commit();
        
        transaction = await establishTransaction(true); // will reset changes
        establishPermissionChecking(true);
        
        expect(async () => {
          await crud_base( // any data won't pass
            27,
            CRUD.Update,
            control0
          );
        }).rejects.toThrow();
        
        expect(async () => {
          await crud_base( // any data won't pass
            27,
            CRUD.Upsert,
            control0
          );
        }).rejects.toThrow();
        
        expect(async () => {
          await crud_base( // any data won't pass
            27,
            CRUD.Delete,
            control0
          );
        }).rejects.toThrow();
        
        // Relational
        // 
        const control1 = createRows(27, SourceType.Relational, 4, 1, 1);
        
        transaction = await establishTransaction(true); // will reset changes
        expect(async () => { // any data won't pass
          await crud_base(
            27,
            CRUD.Create,
            control1
          );
        }).rejects.toThrow();
        
        transaction = await establishTransaction(true); // will reset changes
        expect(async () => { // any data won't pass (1)
          await crud_base(
            27,
            CRUD.Update,
            control1
          );
        }).rejects.toThrow();
        
        transaction = await establishTransaction(true); // will reset changes
        expect(async () => { // any data won't pass (2)
          await crud_base(
            27,
            CRUD.Upsert,
            control1
          );
        }).rejects.toThrow();
        
        transaction = await establishTransaction(true); // will reset changes
        await crud( // control = empty
          27,
          CRUD.Retrieve,
          control1,
          [],
          null,
          null
        );
        
        await crud_base( // none of data will pass (3)
          27,
          CRUD.Delete,
          control1
        );
        
        transaction = await establishTransaction(true); // permanent any changes
        establishPermissionChecking(false);
        await crud_base(
          27,
          CRUD.Create,
          control1
        );
        await crud(
          27,
          CRUD.Retrieve,
          control1,
          control1,
          null,
          null
        );
        await transaction.commit();
        
        transaction = await establishTransaction(true); // will reset changes
        establishPermissionChecking(true);
        
        expect(async () => {
          await crud_base( // any data won't pass (1)
            27,
            CRUD.Update,
            control1
          );
        }).rejects.toThrow();
        
        expect(async () => {
          await crud_base( // any data won't pass (2)
            27,
            CRUD.Upsert,
            control1
          );
        }).rejects.toThrow();
        
        expect(async () => {
          await crud_base( // any data won't pass (3)
            27,
            CRUD.Delete,
            control1
          );
        }).rejects.toThrow();
      });
      test('Accessing T x T x T[P]', async () => {
        await flushPromises();
        
        // Relational
        // 
        const control1 = createRows(29, SourceType.Relational, 2, 1, 1);
        establishPermissionChecking(false);
        const transaction = await establishTransaction(true);
        
        await crud_base(
          29,
          CRUD.Create,
          control1
        );
        establishPermissionChecking(true);
        let results = await crud_base(
          29,
          CRUD.Retrieve,
          control1
        );
        
        expect(results['relational2'].rows[0].keys['int03']).toBeDefined(); // no session
        
        expect(results['relational2'].rows[0].keys['str10']).toBeDefined();
        expect(results['relational2'].rows[0].columns['bol02']).toBeDefined();
        expect(results['relational2'].rows[0].columns['grp01']).toBeDefined();
        expect(results['relational2'].rows[0].columns['str11']).toBeDefined();
        expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined();
        expect(results['relational2'].rows[0].columns['flt13']).toBeDefined();
        
        expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // control for with relation
        
        const data1 = createRows(29, SourceType.Relational, 0, 1, 1);
        data1['relational0'].rows[0].columns['int06'] = 789;
        
        await crud_base(
          29,
          CRUD.Create,
          data1
        );
        
        results = await crud_base(
          29,
          CRUD.Retrieve,
          control1
        );
        
        expect(results['relational2'].rows[0].columns['dat12']).not.toBeDefined(); // with relation to a relational table (no in-between)
        
        await crud_base(
          29,
          CRUD.Create,
          createRows(29, SourceType.Relational, 1, 1, 1)
        );
        
        results = await crud_base(
          29,
          CRUD.Retrieve,
          control1
        );
        
        expect(results['relational2'].rows[0].columns['dat12']).toBeDefined(); // with relation to a relational table (has in-between)
        
        let data = await crud_base(
          29,
          CRUD.Retrieve,
          createRows(29, SourceType.Relational, 2, 1, 1, createRows(29, SourceType.Relational, 1, 1, 1, createRows(29, SourceType.Relational, 0, 1, 1, undefined, true), true), true)
        );
        
        expect(data['relational0'].rows[0].relations['relational1'].rows[0].relations['relational2'].rows[0].columns['dat12']).toBeDefined();
        
        establishPermissionChecking(false);
        data1['relational0'].rows[0].columns['int06'] = 123;
        await crud_base(
          29,
          CRUD.Update,
          data1
        );
        establishPermissionChecking(true);
        
        data = await crud_base(
          29,
          CRUD.Retrieve,
          createRows(29, SourceType.Relational, 2, 1, 1, createRows(29, SourceType.Relational, 1, 1, 1, createRows(29, SourceType.Relational, 0, 1, 1, undefined, true), true), true)
        );
        
        expect(data['relational0'].rows[0].relations['relational1'].rows[0].relations['relational2'].rows[0].columns['dat12']).not.toBeDefined();
        
        await transaction.commit();
      });
    });
  });
});