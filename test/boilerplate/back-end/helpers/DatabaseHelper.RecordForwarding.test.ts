import {createRows, crud, CRUD, SourceType, next} from "./DatabaseHelper.TestUtilities";
import flushPromises from "flush-promises";

enum Operation {
  Single,
  Multiple
}
enum CRUD {
  Create,
  Retrieve,
  Update,
  Upsert,
  Delete
}

describe('DatabaseHelper', () => {
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