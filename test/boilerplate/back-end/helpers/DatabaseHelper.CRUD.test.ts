import {CodeHelper} from "../../../../src/controllers/helpers/CodeHelper";
import {createRows, crud, CRUD, SourceType, next, tableMap, establishTransaction} from "./DatabaseHelper.TestUtilities";
import flushPromises from "flush-promises";

describe('DatabaseHelper', () => {
	describe('Uniform Operation', () => {
		describe('T', () => {
			describe('Without Transaction', () => {
				describe('Single', () => {
					for (const type of [SourceType.Relational, SourceType.Document]) {
						test(tableMap[type], async () => {
							await flushPromises();
							
							let control0 = createRows(1, type, 0, 1, 1, undefined, true);
							
							// Create --> Retrieve
							await crud(
								1,
								CRUD.Create,
								createRows(1, type, 0, 1, 1),
								createRows(1, type, 0, 1, 1),
								control0,
								createRows(1, type, 0, 1, 1)
							);
							
							// Update --> Retrieve
							await crud(
								1,
								CRUD.Update,
								createRows(1, type, 0, 1, 2),
								createRows(1, type, 0, 1, 2),
								control0,
								createRows(1, type, 0, 1, 2)
							);
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									control0,
									createRows(1, type, 0, 1, 1),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Upsert --> Retrieve
							await crud(
								1,
								CRUD.Upsert,
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3),
								control0,
								createRows(1, type, 0, 1, 3)
							);
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									control0,
									createRows(1, type, 0, 1, 1),
									null,
									null
								);
							}).rejects.toThrow();
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									control0,
									createRows(1, type, 0, 1, 2),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Delete --> Retrieve
							await crud(
								1,
								CRUD.Delete,
								control0,
								createRows(1, type, 0, 1, 3),
								control0,
								[]
							);
							
							// Upsert --> Retrieve
							await crud(
								1,
								CRUD.Upsert,
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								control0,
								createRows(1, type, 0, 1, 5)
							);
							
							// Delete --> Retrieve
							await crud(
								1,
								CRUD.Delete,
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								control0,
								[]
							);
						});
					}
					for (const type of [SourceType.VolatileMemory]) {
						test(tableMap[type], async () => {
							await flushPromises();
							
							// Create --> Retrieve
							await crud(
								1,
								CRUD.Create,
								createRows(1, type, 0, 1, 1),
								createRows(1, type, 0, 1, 1),
								createRows(1, type, 0, 1, 1),
								createRows(1, type, 0, 1, 1)
							);
							
							// Update --> Retrieve
							await crud(
								1,
								CRUD.Update,
								createRows(1, type, 0, 1, 2),
								createRows(1, type, 0, 1, 2),
								createRows(1, type, 0, 1, 2),
								createRows(1, type, 0, 1, 2)
							);
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									createRows(1, type, 0, 1, 1),
									createRows(1, type, 0, 1, 1),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Upsert --> Retrieve
							await crud(
								1,
								CRUD.Upsert,
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3)
							);
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									createRows(1, type, 0, 1, 1),
									createRows(1, type, 0, 1, 1),
									null,
									null
								);
							}).rejects.toThrow();
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									createRows(1, type, 0, 1, 2),
									createRows(1, type, 0, 1, 2),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Delete --> Retrieve
							await crud(
								1,
								CRUD.Delete,
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3),
								[]
							);
							
							// Upsert --> Retrieve
							await crud(
								1,
								CRUD.Upsert,
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5)
							);
							
							// Delete --> Retrieve
							await crud(
								1,
								CRUD.Delete,
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								[]
							);
						});
					}
				});
				describe('Multiple', () => {
					for (const type of [SourceType.Relational, SourceType.Document]) {
						test(tableMap[type], async () => {
							await flushPromises();
							
							const control0 = createRows(2, type, 0, 1, 1, undefined, true);
							
							// Create --> Retrieve
							await crud(
								2,
								CRUD.Create,
								createRows(2, type, 0, 5, 6),
								createRows(2, type, 0, 5, 6),
								control0,
								createRows(2, type, 0, 5, 6)
							);
							
							// Update --> Retrieve
							await crud(
								2,
								CRUD.Update,
								createRows(2, type, 0, 5, 7),
								createRows(2, type, 0, 5, 7),
								control0,
								createRows(2, type, 0, 5, 7)
							);
							expect(async () => {
								await crud(
									2,
									CRUD.Retrieve,
									control0,
									createRows(2, type, 0, 5, 6),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Upsert --> Retrieve
							await crud(
								2,
								CRUD.Upsert,
								createRows(2, type, 0, 10, 8),
								createRows(2, type, 0, 10, 8),
								control0,
								createRows(2, type, 0, 10, 8)
							);
							expect(async () => {
								await crud(
									2,
									CRUD.Retrieve,
									control0,
									createRows(2, type, 0, 5, 6),
									null,
									null
								);
							}).rejects.toThrow();
							expect(async () => {
								await crud(
									2,
									CRUD.Retrieve,
									control0,
									createRows(2, type, 0, 5, 7),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Delete --> Retrieve
							await crud(
								2,
								CRUD.Delete,
								control0,
								createRows(2, type, 0, 10, 8),
								control0,
								[]
							);
							
							// Exclusive Upsert --> Retrieve
							await crud(
								2,
								CRUD.Upsert,
								createRows(2, type, 0, 15, 10),
								createRows(2, type, 0, 15, 10),
								control0,
								createRows(2, type, 0, 15, 10)
							);
							
							// Exclusive Delete --> Retrieve
							await crud(
								2,
								CRUD.Delete,
								createRows(2, type, 0, 15, 10),
								createRows(2, type, 0, 15, 10),
								control0,
								[]
							);
							
							// Mutually Exclusive Retrieve
							// 
							await crud(
								21,
								CRUD.Create,
								createRows(21, type, 0, 10, 9),
								createRows(21, type, 0, 10, 9),
								createRows(21, type, 0, 1, 9),
								createRows(21, type, 0, 1, 9)
							);
							await crud(
								21,
								CRUD.Retrieve,
								createRows(21, type, 0, 3, 9),
								createRows(21, type, 0, 3, 9),
								null,
								null
							);
							const partial = createRows(21, type, 0, 10, 9);
							partial[tableMap[type] + '0'].rows = partial[tableMap[type] + '0'].rows.splice(3, 3);
							await crud(
								21,
								CRUD.Retrieve,
								partial,
								partial,
								null,
								null
							);
						});
					}
				});
			});
			describe('With Transaction', () => {
				describe('Single', () => {
					for (const type of [SourceType.Relational, SourceType.Document]) {
						test(tableMap[type], async () => {
							await flushPromises();
						  await establishTransaction(true);
							
							let control0 = createRows(1, type, 0, 1, 1, undefined, true);
							
							// Create --> Retrieve
							await crud(
								1,
								CRUD.Create,
								createRows(1, type, 0, 1, 1),
								createRows(1, type, 0, 1, 1),
								control0,
								createRows(1, type, 0, 1, 1)
							);
							
							// Update --> Retrieve
							await crud(
								1,
								CRUD.Update,
								createRows(1, type, 0, 1, 2),
								createRows(1, type, 0, 1, 2),
								control0,
								createRows(1, type, 0, 1, 2)
							);
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									control0,
									createRows(1, type, 0, 1, 1),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Upsert --> Retrieve
							await crud(
								1,
								CRUD.Upsert,
								createRows(1, type, 0, 1, 3),
								createRows(1, type, 0, 1, 3),
								control0,
								createRows(1, type, 0, 1, 3)
							);
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									control0,
									createRows(1, type, 0, 1, 1),
									null,
									null
								);
							}).rejects.toThrow();
							expect(async () => {
								await crud(
									1,
									CRUD.Retrieve,
									control0,
									createRows(1, type, 0, 1, 2),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Delete --> Retrieve
							await crud(
								1,
								CRUD.Delete,
								control0,
								createRows(1, type, 0, 1, 3),
								control0,
								[]
							);
							
							// Upsert --> Retrieve
							await crud(
								1,
								CRUD.Upsert,
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								control0,
								createRows(1, type, 0, 1, 5)
							);
							
							// Delete --> Retrieve
							await crud(
								1,
								CRUD.Delete,
								createRows(1, type, 0, 1, 5),
								createRows(1, type, 0, 1, 5),
								control0,
								[]
							);
						});
					}
				});
				describe('Multiple', () => {
					for (const type of [SourceType.Relational, SourceType.Document]) {
						test(tableMap[type], async () => {
							await flushPromises();
						  await establishTransaction(true);
							
							const control0 = createRows(2, type, 0, 1, 1, undefined, true);
							
							// Create --> Retrieve
							await crud(
								2,
								CRUD.Create,
								createRows(2, type, 0, 5, 6),
								createRows(2, type, 0, 5, 6),
								control0,
								createRows(2, type, 0, 5, 6)
							);
							
							// Update --> Retrieve
							await crud(
								2,
								CRUD.Update,
								createRows(2, type, 0, 5, 7),
								createRows(2, type, 0, 5, 7),
								control0,
								createRows(2, type, 0, 5, 7)
							);
							expect(async () => {
								await crud(
									2,
									CRUD.Retrieve,
									control0,
									createRows(2, type, 0, 5, 6),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Upsert --> Retrieve
							await crud(
								2,
								CRUD.Upsert,
								createRows(2, type, 0, 10, 8),
								createRows(2, type, 0, 10, 8),
								control0,
								createRows(2, type, 0, 10, 8)
							);
							expect(async () => {
								await crud(
									2,
									CRUD.Retrieve,
									control0,
									createRows(2, type, 0, 5, 6),
									null,
									null
								);
							}).rejects.toThrow();
							expect(async () => {
								await crud(
									2,
									CRUD.Retrieve,
									control0,
									createRows(2, type, 0, 5, 7),
									null,
									null
								);
							}).rejects.toThrow();
							
							// Delete --> Retrieve
							await crud(
								2,
								CRUD.Delete,
								control0,
								createRows(2, type, 0, 10, 8),
								control0,
								[]
							);
							
							// Exclusive Upsert --> Retrieve
							await crud(
								2,
								CRUD.Upsert,
								createRows(2, type, 0, 15, 10),
								createRows(2, type, 0, 15, 10),
								control0,
								createRows(2, type, 0, 15, 10)
							);
							
							// Exclusive Delete --> Retrieve
							await crud(
								2,
								CRUD.Delete,
								createRows(2, type, 0, 15, 10),
								createRows(2, type, 0, 15, 10),
								control0,
								[]
							);
						});
					}
				});
			});
		});
		describe('T x T', () => {
			describe('Single', () => {
				for (const type of [SourceType.Relational, SourceType.Document]) {
					test(tableMap[type], async () => {
						await flushPromises();
						await establishTransaction(false);
						
						let control0 = createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1, undefined, true), true);
						let control00 = createRows(3, type, 0, 1, 1, undefined, true);
						let control01 = createRows(3, type, 1, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							3,
							CRUD.Create,
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
							control0,
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1))
						);
						
						// Update --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							3,
							CRUD.Update,
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
							control0,
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2))
						);
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								control0,
								createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Upsert --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							3,
							CRUD.Upsert,
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							control0,
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3))
						);
						await crud(
							3,
							CRUD.Retrieve,
							control00,
							createRows(3, type, 0, 1, 3),
							null,
							null
						);
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								control0,
								createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
								null,
								null
							);
						}).rejects.toThrow();
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								control0,
								createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Delete --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							3,
							CRUD.Delete,
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							control0,
							[]
						);
						
						// Upsert --> Retrieve
						control0 = createRows(30, type, 1, 1, 1, createRows(30, type, 0, 1, 1, undefined, true), true);
						control00 = createRows(30, type, 0, 1, 1, undefined, true);
						control01 = createRows(30, type, 1, 1, 1, undefined, true);
						
						await crud(
							30,
							CRUD.Upsert,
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							control0,
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5))
						);
						
						// Delete --> Retrieve
						await crud(
							30,
							CRUD.Delete,
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							control0,
							[]
						);
						expect(async () => {
							await crud(
								30,
								CRUD.Delete,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						await crud(
							30,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
					});
				}
				for (const type of [SourceType.VolatileMemory]) {
					test(tableMap[type], async () => {
						await flushPromises();
						
						// Create --> Retrieve
						await crud(
							3,
							CRUD.Create,
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
							createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1))
						);
						
						// Update --> Retrieve
						await crud(
							3,
							CRUD.Update,
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
							createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2))
						);
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
								createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Upsert --> Retrieve
						await crud(
							3,
							CRUD.Upsert,
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3))
						);
						await crud(
							3,
							CRUD.Retrieve,
							createRows(3, type, 0, 1, 3),
							createRows(3, type, 0, 1, 3),
							null,
							null
						);
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								createRows(3, type, 1, 1, 3),
								[],
								null,
								null
							);
						}).rejects.toThrow();
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
								createRows(3, type, 1, 1, 1, createRows(3, type, 0, 1, 1)),
								null,
								null
							);
						}).rejects.toThrow();
						expect(async () => {
							await crud(
								3,
								CRUD.Retrieve,
								createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
								createRows(3, type, 1, 1, 2, createRows(3, type, 0, 1, 2)),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Delete --> Retrieve
						await crud(
							3,
							CRUD.Delete,
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							createRows(3, type, 1, 1, 3, createRows(3, type, 0, 1, 3)),
							[]
						);
						
						await crud(
							30,
							CRUD.Upsert,
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5))
						);
						
						// Delete --> Retrieve
						await crud(
							30,
							CRUD.Delete,
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							createRows(30, type, 1, 1, 5, createRows(30, type, 0, 1, 5)),
							[]
						);
						expect(async () => {
							await crud(
								30,
								CRUD.Delete,
								createRows(30, type, 1, 1, 5),
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						await crud(
							30,
							CRUD.Retrieve,
							createRows(30, type, 1, 1, 5),
							[],
							null,
							null
						);
					});
				}
			});
			describe('Multiple', () => {
				for (const type of [SourceType.Relational, SourceType.Document]) {
					test(tableMap[type], async () => {
						await flushPromises();
						
						let control0 = createRows(4, type, 1, 1, 1, createRows(4, type, 0, 1, 1, undefined, true), true);
						let control00 = createRows(4, type, 0, 1, 1, undefined, true);
						let control01 = createRows(4, type, 1, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							4,
							CRUD.Create,
							createRows(4, type, 1, 5, 6, createRows(4, type, 0, 10, 6)),
							createRows(4, type, 1, 5, 6, createRows(4, type, 0, 10, 6)),
							control0,
							createRows(4, type, 1, 5, 6, createRows(4, type, 0, 10, 6))
						);
						
						// Update --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							4,
							CRUD.Update,
							createRows(4, type, 1, 5, 7, createRows(4, type, 0, 10, 7)),
							createRows(4, type, 1, 5, 7, createRows(4, type, 0, 10, 7)),
							control0,
							createRows(4, type, 1, 5, 7, createRows(4, type, 0, 10, 7))
						);
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								4,
								CRUD.Retrieve,
								control0,
								createRows(4, type, 1, 5, 6, createRows(4, type, 0, 10, 6)),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Upsert --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							4,
							CRUD.Upsert,
							createRows(4, type, 1, 10, 8, createRows(4, type, 0, 10, 8)),
							createRows(4, type, 1, 10, 8, createRows(4, type, 0, 10, 8)),
							control0,
							createRows(4, type, 1, 10, 8, createRows(4, type, 0, 10, 8))
						);
						await crud(
							4,
							CRUD.Retrieve,
							control00,
							createRows(4, type, 0, 10, 8),
							null,
							null
						);
						expect(async () => {
							await crud(
								4,
								CRUD.Retrieve,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								4,
								CRUD.Retrieve,
								control0,
								createRows(4, type, 1, 10, 6, createRows(4, type, 0, 10, 6)),
								null,
								null
							);
						}).rejects.toThrow();
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								4,
								CRUD.Retrieve,
								control0,
								createRows(4, type, 1, 10, 7, createRows(4, type, 0, 10, 7)),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Delete --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							4,
							CRUD.Delete,
							createRows(4, type, 1, 10, 8, createRows(4, type, 0, 10, 8)),
							createRows(4, type, 1, 10, 8, createRows(4, type, 0, 10, 8)),
							control0,
							[]
						);
						
						// Exclusive Upsert --> Retrieve
						control0 = createRows(40, type, 1, 1, 1, createRows(40, type, 0, 1, 1, undefined, true), true);
						control00 = createRows(40, type, 0, 1, 1, undefined, true);
						control01 = createRows(40, type, 1, 1, 1, undefined, true);
						
						await crud(
							40,
							CRUD.Upsert,
							createRows(40, type, 1, 15, 10, createRows(40, type, 0, 10, 10)),
							createRows(40, type, 1, 15, 10, createRows(40, type, 0, 10, 10)),
							control0,
							createRows(40, type, 1, 15, 10, createRows(40, type, 0, 10, 10))
						);
						
						// Exclusive Delete --> Retrieve
						await crud(
							40,
							CRUD.Delete,
							createRows(40, type, 1, 15, 10, createRows(40, type, 0, 10, 10)),
							createRows(40, type, 1, 15, 10, createRows(40, type, 0, 10, 10)),
							control00,
							[]
						);
						await crud(
							40,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
							
						// Mutually Exclusive Retrieve
						// 
						await crud(
							41,
							CRUD.Create,
							createRows(41, type, 1, 15, 9, createRows(41, type, 0, 20, 9)),
							createRows(41, type, 1, 15, 9, createRows(41, type, 0, 20, 9)),
							createRows(41, type, 1, 1, 9, createRows(41, type, 0, 1, 9)),
							createRows(41, type, 1, 1, 9, createRows(41, type, 0, 1, 9)),
						);
						await crud(
							41,
							CRUD.Retrieve,
							createRows(41, type, 0, 10, 9),
							createRows(41, type, 0, 10, 9),
							null,
							null
						);
						const partial = createRows(41, type, 1, 15, 9, createRows(41, type, 0, 20, 9));
						partial[tableMap[type] + '0'].rows = partial[tableMap[type] + '0'].rows.splice(5, 10);
						partial[tableMap[type] + '0'].rows.forEach(data => {
							data.relations[tableMap[type] + '1'].rows = data.relations[tableMap[type] + '1'].rows.splice(5, 5);
						});
						await crud(
							41,
							CRUD.Retrieve,
							partial,
							partial,
							null,
							null
						);
					});
				}
			});
		});
		describe('T x T x T', () => {
			describe('Single', () => {
				for (const type of [SourceType.Relational, SourceType.Document]) {
					test(tableMap[type], async () => {
						await flushPromises();
						
						let control0 = createRows(5, type, 2, 1, 1, createRows(5, type, 1, 1, 1, createRows(5, type, 0, 1, 1, undefined, true), true), true);
						let control00 = createRows(5, type, 0, 1, 1, undefined, true);
						let control01 = createRows(5, type, 1, 1, 1, undefined, true);
						let control02 = createRows(5, type, 2, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							5,
							CRUD.Create,
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
							control0,
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11)))
						);
						
						// Update --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							5,
							CRUD.Update,
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
							control0,
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12)))
						);
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								5,
								CRUD.Retrieve,
								control0,
								createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Upsert --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							5,
							CRUD.Upsert,
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							control0,
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13)))
						);
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								5,
								CRUD.Retrieve,
								control0,
								createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
								null,
								null
							);
						}).rejects.toThrow();
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								5,
								CRUD.Retrieve,
								control0,
								createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Delete --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							5,
							CRUD.Delete,
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							control0,
							[]
						);
						await crud(
							5,
							CRUD.Retrieve,
							control00,
							[],
							null,
							null
						);
						await crud(
							5,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							5,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
						
						// Upsert --> Retrieve
						control0 = createRows(50, type, 2, 1, 1, createRows(50, type, 1, 1, 1, createRows(50, type, 0, 1, 1, undefined, true), true), true);
						control00 = createRows(50, type, 0, 1, 1, undefined, true);
						control01 = createRows(50, type, 1, 1, 1, undefined, true);
						control02 = createRows(50, type, 2, 1, 1, undefined, true);
						
						await crud(
							50,
							CRUD.Upsert,
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							control0,
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15)))
						);
						
						// Delete --> Retrieve
						await crud(
							5,
							CRUD.Delete,
							control0,
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 0, 1, 1),
							[]
						);
						await crud(
							50,
							CRUD.Retrieve,
							control00,
							[],
							null,
							null
						);
						await crud(
							50,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							50,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
					});
				}
				for (const type of [SourceType.VolatileMemory]) {
					test(tableMap[type], async () => {
						await flushPromises();
						
						// Create --> Retrieve
						await crud(
							5,
							CRUD.Create,
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
							createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11)))
						);
						
						// Update --> Retrieve
						await crud(
							5,
							CRUD.Update,
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
							createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12)))
						);
						expect(async () => {
							await crud(
								5,
								CRUD.Retrieve,
								createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
								createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Upsert --> Retrieve
						await crud(
							5,
							CRUD.Upsert,
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13)))
						);
						expect(async () => {
							await crud(
								5,
								CRUD.Retrieve,
								createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
								createRows(5, type, 2, 1, 11, createRows(5, type, 1, 1, 11, createRows(5, type, 0, 1, 11))),
								null,
								null
							);
						}).rejects.toThrow();
						expect(async () => {
							await crud(
								5,
								CRUD.Retrieve,
								createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
								createRows(5, type, 2, 1, 12, createRows(5, type, 1, 1, 12, createRows(5, type, 0, 1, 12))),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Delete --> Retrieve
						await crud(
							5,
							CRUD.Delete,
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							createRows(5, type, 2, 1, 13, createRows(5, type, 1, 1, 13, createRows(5, type, 0, 1, 13))),
							[]
						);
						await crud(
							5,
							CRUD.Retrieve,
							createRows(5, type, 0, 1, 12),
							[],
							null,
							null
						);
						await crud(
							5,
							CRUD.Retrieve,
							createRows(5, type, 1, 1, 12),
							[],
							null,
							null
						);
						await crud(
							5,
							CRUD.Retrieve,
							createRows(5, type, 2, 1, 12),
							[],
							null,
							null
						);
						
						await crud(
							50,
							CRUD.Upsert,
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15)))
						);
						
						// Delete --> Retrieve
						await crud(
							5,
							CRUD.Delete,
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 2, 1, 15, createRows(50, type, 1, 1, 15, createRows(50, type, 0, 1, 15))),
							createRows(50, type, 0, 1, 1),
							[]
						);
						await crud(
							50,
							CRUD.Retrieve,
							createRows(50, type, 0, 1, 15),
							[],
							null,
							null
						);
						await crud(
							50,
							CRUD.Retrieve,
							createRows(50, type, 1, 1, 15),
							[],
							null,
							null
						);
						await crud(
							50,
							CRUD.Retrieve,
							createRows(50, type, 2, 1, 15),
							[],
							null,
							null
						);
					});
				}
			});
			describe('Multiple', () => {
				for (const type of [SourceType.Relational, SourceType.Document]) {
					test(tableMap[type], async () => {
						await flushPromises();
						
						let control0 = createRows(6, type, 2, 1, 1, createRows(6, type, 1, 1, 1, createRows(6, type, 0, 1, 1, undefined, true), true), true);
						let control00 = createRows(6, type, 0, 1, 1, undefined, true);
						let control01 = createRows(6, type, 1, 1, 1, undefined, true);
						let control02 = createRows(6, type, 2, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							6,
							CRUD.Create,
							createRows(6, type, 2, 3, 20, createRows(6, type, 1, 5, 20, createRows(6, type, 0, 2, 20))),
							createRows(6, type, 2, 3, 20, createRows(6, type, 1, 5, 20, createRows(6, type, 0, 2, 20))),
							control0,
							createRows(6, type, 2, 3, 20, createRows(6, type, 1, 5, 20, createRows(6, type, 0, 2, 20)))
						);
						
						// Update --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							6,
							CRUD.Update,
							createRows(6, type, 2, 3, 21, createRows(6, type, 1, 5, 21, createRows(6, type, 0, 2, 21))),
							createRows(6, type, 2, 3, 21, createRows(6, type, 1, 5, 21, createRows(6, type, 0, 2, 21))),
							control0,
							createRows(6, type, 2, 3, 21, createRows(6, type, 1, 5, 21, createRows(6, type, 0, 2, 21)))
						);
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								6,
								CRUD.Retrieve,
								control0,
								createRows(6, type, 2, 3, 20, createRows(6, type, 1, 5, 20, createRows(6, type, 0, 2, 20))),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Upsert --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							6,
							CRUD.Upsert,
							createRows(6, type, 2, 3, 22, createRows(6, type, 1, 5, 22, createRows(6, type, 0, 2, 22))),
							createRows(6, type, 2, 3, 22, createRows(6, type, 1, 5, 22, createRows(6, type, 0, 2, 22))),
							control0,
							createRows(6, type, 2, 3, 22, createRows(6, type, 1, 5, 22, createRows(6, type, 0, 2, 22)))
						);
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								6,
								CRUD.Retrieve,
								control0,
								createRows(6, type, 2, 3, 20, createRows(6, type, 1, 5, 20, createRows(6, type, 0, 2, 20))),
								null,
								null
							);
						}).rejects.toThrow();
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						expect(async () => {
							await crud(
								6,
								CRUD.Retrieve,
								control0,
								createRows(6, type, 2, 3, 21, createRows(6, type, 1, 5, 21, createRows(6, type, 0, 2, 21))),
								null,
								null
							);
						}).rejects.toThrow();
						
						// Delete --> Retrieve
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						await crud(
							6,
							CRUD.Delete,
							createRows(6, type, 2, 3, 22, createRows(6, type, 1, 5, 22, createRows(6, type, 0, 2, 22))),
							createRows(6, type, 2, 3, 22, createRows(6, type, 1, 5, 22, createRows(6, type, 0, 2, 22))),
							control0,
							[]
						);
						await crud(
							6,
							CRUD.Retrieve,
							control00,
							[],
							null,
							null
						);
						await crud(
							6,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							6,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
						
						// Exclusive Upsert --> Retrieve
						control0 = createRows(60, type, 2, 1, 1, createRows(60, type, 1, 1, 1, createRows(60, type, 0, 1, 1, undefined, true), true), true);
						control00 = createRows(60, type, 0, 1, 1, undefined, true);
						control01 = createRows(60, type, 1, 1, 1, undefined, true);
						control02 = createRows(60, type, 2, 1, 1, undefined, true);
						
						await crud(
							60,
							CRUD.Upsert,
							createRows(60, type, 2, 10, 24, createRows(60, type, 1, 15, 24, createRows(60, type, 0, 20, 24))),
							createRows(60, type, 2, 10, 24, createRows(60, type, 1, 15, 24, createRows(60, type, 0, 20, 24))),
							control0,
							createRows(60, type, 2, 10, 24, createRows(60, type, 1, 15, 24, createRows(60, type, 0, 20, 24)))
						);
						
						// Exclusive Delete --> Retrieve
						await crud(
							60,
							CRUD.Delete,
							control0,
							createRows(60, type, 2, 10, 24, createRows(60, type, 1, 15, 24, createRows(60, type, 0, 20, 24))),
							control00,
							[]
						);
						await crud(
							60,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							60,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
							
						// Mutually Exclusive Retrieve
						// 
						await crud(
							61,
							CRUD.Create,
							createRows(61, type, 2, 10, 23, createRows(61, type, 1, 7, 23, createRows(61, type, 0, 5, 23))),
							createRows(61, type, 2, 10, 23, createRows(61, type, 1, 7, 23, createRows(61, type, 0, 5, 23))),
							createRows(61, type, 2, 1, 23, createRows(61, type, 1, 1, 23, createRows(61, type, 0, 1, 23))),
							createRows(61, type, 2, 1, 23, createRows(61, type, 1, 1, 23, createRows(61, type, 0, 1, 23)))
						);
						await crud(
							61,
							CRUD.Retrieve,
							createRows(61, type, 0, 3, 23),
							createRows(61, type, 0, 3, 23),
							null,
							null
						);
						await crud(
							61,
							CRUD.Retrieve,
							createRows(61, type, 1, 7, 23, createRows(61, type, 0, 5, 23)),
							createRows(61, type, 1, 7, 23, createRows(61, type, 0, 5, 23)),
							null,
							null
						);
						const partial = createRows(61, type, 2, 10, 23, createRows(61, type, 1, 7, 23, createRows(61, type, 0, 5, 23)));
						partial[tableMap[type] + '0'].rows = partial[tableMap[type] + '0'].rows.splice(2, 2);
						partial[tableMap[type] + '0'].rows.forEach(data => {
							data.relations[tableMap[type] + '1'].rows = data.relations[tableMap[type] + '1'].rows.splice(2, 3);
							data.relations[tableMap[type] + '1'].rows.forEach(data => {
								data.relations[tableMap[type] + '2'].rows = data.relations[tableMap[type] + '2'].rows.splice(5, 4);
							});
						});
						await crud(
							61,
							CRUD.Retrieve,
							partial,
							partial,
							null,
							null
						);
					});
				}
			});
		});
	});
	describe('Across Operation', () => {
		describe('T x T', () => {
			describe('Single', () => {
				const crossPairs = [
					[SourceType.Relational, SourceType.Document],
					[SourceType.Document, SourceType.Relational]
				];
				
				for (const pair of crossPairs) {
					const type1 = pair[0];
					const type2 = pair[1];
				
					test(`${tableMap[type1]} x ${tableMap[type2]}`, async () => {
						await flushPromises();
							
						let control0 = createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1, undefined, true), true);
						let control00 = createRows(7, type1, 0, 1, 1, undefined, true);
						let control01 = createRows(7, type2, 1, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							7,
							CRUD.Create,
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1)),
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1)),
							control0,
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Update --> Retrieve
						await crud(
							7,
							CRUD.Update,
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2)),
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2)),
							control0,
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Upsert --> Retrieve
						await crud(
							7,
							CRUD.Upsert,
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							control0,
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3))
						);
						await crud(
							7,
							CRUD.Retrieve,
							control00,
							createRows(7, type1, 0, 1, 3),
							null,
							null
						);
						expect(async () => {
							await crud(
								7,
								CRUD.Retrieve,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Delete --> Retrieve
						await crud(
							7,
							CRUD.Delete,
							control0,
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							null,
							null
						);
						
						// Upsert --> Retrieve
						control0 = createRows(70, type2, 1, 1, 1, createRows(70, type1, 0, 1, 1, undefined, true), true);
						control00 = createRows(70, type1, 0, 1, 1, undefined, true);
						control01 = createRows(70, type2, 1, 1, 1, undefined, true);
						
						await crud(
							70,
							CRUD.Upsert,
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							control0,
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5))
						);
						
						// Delete --> Retrieve
						await crud(
							70,
							CRUD.Delete,
							control0,
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							null,
							null
						);
						expect(async () => {
							await crud(
								70,
								CRUD.Delete,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						await crud(
							70,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
					});
				}
				
				const noGrpCrossPairs = [
					[SourceType.Relational, SourceType.VolatileMemory],
					[SourceType.VolatileMemory, SourceType.Relational],
					[SourceType.VolatileMemory, SourceType.Document],
					[SourceType.Document, SourceType.VolatileMemory]
				];
				
				for (const pair of noGrpCrossPairs) {
					const type1 = pair[0];
					const type2 = pair[1];
				
					test(`${tableMap[type1]} x ${tableMap[type2]}`, async () => {
						await flushPromises();
						
						// Create --> Retrieve
						await crud(
							7,
							CRUD.Create,
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1)),
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1)),
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1)),
							createRows(7, type2, 1, 1, 1, createRows(7, type1, 0, 1, 1))
						);
						
						// Update --> Retrieve
						await crud(
							7,
							CRUD.Update,
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2)),
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2)),
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2)),
							createRows(7, type2, 1, 1, 2, createRows(7, type1, 0, 1, 2))
						);
						
						// Upsert --> Retrieve
						await crud(
							7,
							CRUD.Upsert,
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3))
						);
						await crud(
							7,
							CRUD.Retrieve,
							createRows(7, type1, 0, 1, 3),
							createRows(7, type1, 0, 1, 3),
							null,
							null
						);
						
						// Delete --> Retrieve
						await crud(
							7,
							CRUD.Delete,
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							createRows(7, type2, 1, 1, 3, createRows(7, type1, 0, 1, 3)),
							null,
							null
						);
						
						// Upsert --> Retrieve
						await crud(
							70,
							CRUD.Upsert,
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5))
						);
						
						// Delete --> Retrieve
						await crud(
							70,
							CRUD.Delete,
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							createRows(70, type2, 1, 1, 5, createRows(70, type1, 0, 1, 5)),
							null,
							null
						);
						expect(async () => {
							await crud(
								70,
								CRUD.Delete,
								createRows(70, type1, 1, 1, 5),
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						await crud(
							70,
							CRUD.Retrieve,
							createRows(70, type1, 1, 1, 5),
							[],
							null,
							null
						);
					});
				}
			});
			
			describe('Multiple', () => {
				const crossPairs = [
					[SourceType.Relational, SourceType.Document],
					[SourceType.Document, SourceType.Relational]
				];
				
				for (const pair of crossPairs) {
					const type1 = pair[0];
					const type2 = pair[1];
				
					test(`${tableMap[type1]} x ${tableMap[type2]}`, async () => {
						await flushPromises();
							
						let control0 = createRows(8, type2, 1, 1, 1, createRows(8, type1, 0, 1, 1, undefined, true), true);
						let control00 = createRows(8, type1, 0, 1, 1, undefined, true);
						let control01 = createRows(8, type2, 1, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							8,
							CRUD.Create,
							createRows(8, type2, 1, 5, 6, createRows(8, type1, 0, 5, 6)),
							createRows(8, type2, 1, 5, 6, createRows(8, type1, 0, 5, 6)),
							control0,
							createRows(8, type2, 1, 5, 6, createRows(8, type1, 0, 5, 6))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Update --> Retrieve
						await crud(
							8,
							CRUD.Update,
							createRows(8, type2, 1, 5, 7, createRows(8, type1, 0, 5, 7)),
							createRows(8, type2, 1, 5, 7, createRows(8, type1, 0, 5, 7)),
							control0,
							createRows(8, type2, 1, 5, 7, createRows(8, type1, 0, 5, 7))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Upsert --> Retrieve
						await crud(
							8,
							CRUD.Upsert,
							createRows(8, type2, 1, 5, 8, createRows(8, type1, 0, 5, 8)),
							createRows(8, type2, 1, 5, 8, createRows(8, type1, 0, 5, 8)),
							control0,
							createRows(8, type2, 1, 5, 8, createRows(8, type1, 0, 5, 8))
						);
						await crud(
							8,
							CRUD.Retrieve,
							control00,
							createRows(8, type1, 0, 5, 8),
							null,
							null
						);
						expect(async () => {
							await crud(
								8,
								CRUD.Retrieve,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Delete --> Retrieve
						await crud(
							8,
							CRUD.Delete,
							control0,
							createRows(8, type2, 1, 5, 8, createRows(8, type1, 0, 5, 8)),
							null,
							null	
						);
						
						// Exclusive Upsert --> Retrieve
						control0 = createRows(80, type2, 1, 1, 1, createRows(80, type1, 0, 1, 1, undefined, true), true);
						control00 = createRows(80, type1, 0, 1, 1, undefined, true);
						control01 = createRows(80, type2, 1, 1, 1, undefined, true);
						
						await crud(
							80,
							CRUD.Upsert,
							createRows(80, type2, 1, 15, 10, createRows(80, type1, 0, 10, 10)),
							createRows(80, type2, 1, 15, 10, createRows(80, type1, 0, 10, 10)),
							control0,
							createRows(80, type2, 1, 15, 10, createRows(80, type1, 0, 10, 10))
						);
						
						// Exclusive Delete --> Retrieve
						await crud(
							80,
							CRUD.Delete,
							control0,
							createRows(80, type2, 1, 15, 10, createRows(80, type1, 0, 10, 10)),
							null,
							null
						);
						await crud(
							80,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
					});
				}
			});
		});
		describe('T x T x T', () => {
			describe('Single', () => {
				const crossTribles = [
					[SourceType.Relational, SourceType.Document, SourceType.Relational],
					[SourceType.Document, SourceType.Relational, SourceType.Document],
					[SourceType.Relational, SourceType.Relational, SourceType.Document],
					[SourceType.Document, SourceType.Relational, SourceType.Relational]
				];
				
				for (const trible of crossTribles) {
					const type1 = trible[0];
					const type2 = trible[1];
					const type3 = trible[2];
					
					test(`${tableMap[type1]} x ${tableMap[type2]} x ${tableMap[type3]}`, async () => {
						await flushPromises();
						
						let control0 = createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1, undefined, true), true), true);
						let control00 = createRows(9, type1, 0, 1, 1, undefined, true);
						let control01 = createRows(9, type2, 1, 1, 1, undefined, true);
						let control02 = createRows(9, type3, 2, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
						
						// Create --> Retrieve
						await crud(
							9,
							CRUD.Create,
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1))),
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1))),
							control0,
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1)))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Update --> Retrieve
						await crud(
							9,
							CRUD.Update,
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2))),
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2))),
							control0,
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2)))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Upsert --> Retrieve
						await crud(
							9,
							CRUD.Upsert,
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							control0,
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3)))
						);
						await crud(
							9,
							CRUD.Retrieve,
							control00,
							createRows(9, type1, 0, 1, 3),
							null,
							null
						);
						expect(async () => {
							await crud(
								9,
								CRUD.Retrieve,
								control01,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						expect(async () => {
							await crud(
								9,
								CRUD.Retrieve,
								control02,
								[],
								null,
								null
							);
						}).rejects.toThrow();
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Delete --> Retrieve
						await crud(
							9,
							CRUD.Delete,
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							control00,
							[]
						);
						await crud(
							90,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							90,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
						
						// Upsert --> Retrieve
						control0 = createRows(90, type3, 2, 1, 1, createRows(90, type2, 1, 1, 1, createRows(90, type1, 0, 1, 1, undefined, true), true), true);
						control00 = createRows(90, type1, 0, 1, 1, undefined, true);
						control01 = createRows(90, type2, 1, 1, 1, undefined, true);
						control02 = createRows(90, type3, 2, 1, 1, undefined, true);
						
						await crud(
							90,
							CRUD.Upsert,
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							control0,
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5)))
						);
						
						// Delete --> Retrieve
						await crud(
							90,
							CRUD.Delete,
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							control00,
							[]
						);
						await crud(
							90,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							90,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
					});
				}
				
				const noGrpCrossTribles = [
					[SourceType.VolatileMemory, SourceType.Document, SourceType.Relational],
					[SourceType.Document, SourceType.Relational, SourceType.VolatileMemory],
					[SourceType.Relational, SourceType.VolatileMemory, SourceType.Document],
					[SourceType.Document, SourceType.VolatileMemory, SourceType.VolatileMemory]
				];
				
				for (const trible of noGrpCrossTribles) {
					const type1 = trible[0];
					const type2 = trible[1];
					const type3 = trible[2];
					
					test(`${tableMap[type1]} x ${tableMap[type2]} x ${tableMap[type3]}`, async () => {
						await flushPromises();
						
						// Create --> Retrieve
						await crud(
							9,
							CRUD.Create,
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1))),
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1))),
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1))),
							createRows(9, type3, 2, 1, 1, createRows(9, type2, 1, 1, 1, createRows(9, type1, 0, 1, 1)))
						);
						
						// Update --> Retrieve
						await crud(
							9,
							CRUD.Update,
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2))),
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2))),
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2))),
							createRows(9, type3, 2, 1, 2, createRows(9, type2, 1, 1, 2, createRows(9, type1, 0, 1, 2)))
						);
						
						// Upsert --> Retrieve
						await crud(
							9,
							CRUD.Upsert,
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3)))
						);
						await crud(
							9,
							CRUD.Retrieve,
							createRows(9, type1, 0, 1, 3),
							createRows(9, type1, 0, 1, 3),
							null,
							null
						);
						
						// Delete --> Retrieve
						await crud(
							9,
							CRUD.Delete,
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type3, 2, 1, 3, createRows(9, type2, 1, 1, 3, createRows(9, type1, 0, 1, 3))),
							createRows(9, type1, 0, 1, 3),
							[]
						);
						await crud(
							90,
							CRUD.Retrieve,
							createRows(9, type1, 1, 1, 3),
							[],
							null,
							null
						);
						await crud(
							90,
							CRUD.Retrieve,
							createRows(9, type1, 2, 1, 3),
							[],
							null,
							null
						);
						
						// Upsert --> Retrieve
						await crud(
							90,
							CRUD.Upsert,
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5)))
						);
						
						// Delete --> Retrieve
						await crud(
							90,
							CRUD.Delete,
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							createRows(90, type3, 2, 1, 5, createRows(90, type2, 1, 1, 5, createRows(90, type1, 0, 1, 5))),
							[]
						);
						await crud(
							90,
							CRUD.Retrieve,
							createRows(90, type1, 1, 1, 5),
							[],
							null,
							null
						);
						await crud(
							90,
							CRUD.Retrieve,
							createRows(90, type1, 2, 1, 5),
							[],
							null,
							null
						);
					});
				}
			});
			
			describe('Multiple', () => {
				const crossTribles = [
					[SourceType.Relational, SourceType.Document, SourceType.Relational],
					[SourceType.Document, SourceType.Relational, SourceType.Document],
					[SourceType.Relational, SourceType.Relational, SourceType.Document],
					[SourceType.Document, SourceType.Relational, SourceType.Relational]
				];
				
				for (const trible of crossTribles) {
					const type1 = trible[0];
					const type2 = trible[1];
					const type3 = trible[2];
					
					test(`${tableMap[type1]} x ${tableMap[type2]} x ${tableMap[type3]}`, async () => {
						await flushPromises();
						
						let control0 = createRows(10, type3, 2, 1, 1, createRows(10, type2, 1, 1, 1, createRows(10, type1, 0, 1, 1, undefined, true), true), true);
						let control00 = createRows(10, type1, 0, 1, 1, undefined, true);
						let control01 = createRows(10, type2, 1, 1, 1, undefined, true);
						let control02 = createRows(10, type3, 2, 1, 1, undefined, true);
						
						const copiedControl0 = CodeHelper.clone(control0); // Prevent control changing
						control0 = CodeHelper.clone(copiedControl0);
					
						// Create --> Retrieve
						await crud(
							10,
							CRUD.Create,
							createRows(10, type3, 2, 3, 1, createRows(10, type2, 1, 5, 1, createRows(10, type1, 0, 2, 1))),
							createRows(10, type3, 2, 3, 1, createRows(10, type2, 1, 5, 1, createRows(10, type1, 0, 2, 1))),
							control0,
							createRows(10, type3, 2, 3, 1, createRows(10, type2, 1, 5, 1, createRows(10, type1, 0, 2, 1)))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Update --> Retrieve
						await crud(
							10,
							CRUD.Update,
							createRows(10, type3, 2, 3, 2, createRows(10, type2, 1, 5, 2, createRows(10, type1, 0, 2, 2))),
							createRows(10, type3, 2, 3, 2, createRows(10, type2, 1, 5, 2, createRows(10, type1, 0, 2, 2))),
							control0,
							createRows(10, type3, 2, 3, 2, createRows(10, type2, 1, 5, 2, createRows(10, type1, 0, 2, 2)))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Upsert --> Retrieve
						await crud(
							10,
							CRUD.Upsert,
							createRows(10, type3, 2, 3, 3, createRows(10, type2, 1, 5, 3, createRows(10, type1, 0, 2, 3))),
							createRows(10, type3, 2, 3, 3, createRows(10, type2, 1, 5, 3, createRows(10, type1, 0, 2, 3))),
							control0,
							createRows(10, type3, 2, 3, 3, createRows(10, type2, 1, 5, 3, createRows(10, type1, 0, 2, 3)))
						);
						
						control0 = CodeHelper.clone(copiedControl0); // Prevent control changing
						
						// Delete --> Retrieve
						await crud(
							10,
							CRUD.Delete,
							createRows(10, type3, 2, 3, 3, createRows(10, type2, 1, 5, 3, createRows(10, type1, 0, 2, 3))),
							createRows(10, type3, 2, 3, 3, createRows(10, type2, 1, 5, 3, createRows(10, type1, 0, 2, 3))),
							control00,
							[]
						);
						await crud(
							10,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							10,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
						
						// Exclusive Upsert --> Retrieve
						control0 = createRows(100, type3, 2, 1, 1, createRows(100, type2, 1, 1, 1, createRows(100, type1, 0, 1, 1, undefined, true), true), true);
						control00 = createRows(100, type1, 0, 1, 1, undefined, true);
						control01 = createRows(100, type2, 1, 1, 1, undefined, true);
						control02 = createRows(100, type3, 2, 1, 1, undefined, true);
						
						await crud(
							100,
							CRUD.Upsert,
							createRows(100, type3, 2, 5, 5, createRows(100, type2, 1, 7, 5, createRows(100, type1, 0, 5, 5))),
							createRows(100, type3, 2, 5, 5, createRows(100, type2, 1, 7, 5, createRows(100, type1, 0, 5, 5))),
							control0,
							createRows(100, type3, 2, 5, 5, createRows(100, type2, 1, 7, 5, createRows(100, type1, 0, 5, 5)))
						);
						
						// Exclusive Delete --> Retrieve
						await crud(
							100,
							CRUD.Delete,
							control0,
							createRows(100, type3, 2, 5, 5, createRows(100, type2, 1, 7, 5, createRows(100, type1, 0, 5, 5))),
							control00,
							[]
						);
						await crud(
							100,
							CRUD.Retrieve,
							control01,
							[],
							null,
							null
						);
						await crud(
							100,
							CRUD.Retrieve,
							control02,
							[],
							null,
							null
						);
					});
				}
			});
		});
	});
});