import {createRows, SourceType} from "./DatabaseHelper.TestUtilities";
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
	describe('Satisfy Checker', () => {
		test('Premise', () => {
			expect(1+2).toEqual(3);
		});
		test('Division', () => {
			expect(1+2).toEqual(3);
		});
		test('Associate', () => {
			expect(1+2).toEqual(3);
		});
		describe('Satisfy', () => {
			describe('Relational', () => {
				test('Relational', () => {
					// Create --> Retrieve
					
					// Update --> Retrieve
					
					// Upsert --> Retrieve
					
					// Delete --> Retrieve
					
					// Upsert --> Retrieve
				});
				test('Relational x Relational', () => {
					expect(1+2).toEqual(3);
				});
				test('Relational x Relational x Relational', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document', () => {
				test('Document', () => {
					expect(1+2).toEqual(3);
				});
				test('Document x Document', () => {
					expect(1+2).toEqual(3);
				});
				test('Document x Document x Document', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile', () => {
				test('Volatile', () => {
					expect(1+2).toEqual(3);
				});
				test('Volatile x Volatile', () => {
					expect(1+2).toEqual(3);
				});
				test('Volatile x Volatile x Volatile', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Worker', () => {
				test('Worker', () => {
					expect(1+2).toEqual(3);
				});
				test('Worker x Worker', () => {
					expect(1+2).toEqual(3);
				});
				test('Worker x Worker x Worker', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Document', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Relational x Document x Volatile', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Document x Volatile x Worker', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
			describe('Volatile x Worker x Relational', () => {
				test('Single', () => {
					expect(1+2).toEqual(3);
				});
				test('Multiple', () => {
					expect(1+2).toEqual(3);
				});
			});
		});
	});
});