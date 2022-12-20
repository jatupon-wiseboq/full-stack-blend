warning: in the working copy of 'test/boilerplate/back-end/helpers/PermissionHelper.test.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/controllers/helpers/PermissionHelper.ts b/src/controllers/helpers/PermissionHelper.ts[m
[1mindex 8aaa6e57..c123cc3f 100644[m
[1m--- a/src/controllers/helpers/PermissionHelper.ts[m
[1m+++ b/src/controllers/helpers/PermissionHelper.ts[m
[36m@@ -148,15 +148,20 @@[m [mconst PermissionHelper = {[m
 								INNER_JOIN.reverse();[m
 								[m
 								const from = shortestPath[0];[m
[31m-								for (const key in from.keys) {[m
[31m-									if (from.keys.hasOwnProperty(key) && referencings[key] !== undefined && referencings[key] !== null) {[m
[31m-										WHERE_CLAUSE.push(`${from.group}.${key} = ?`);[m
[31m-										VALUES.push(referencings[key]);[m
[31m-									}[m
[32m+[m								[32mfor (const key in referencings) {[m
[32m+[m		[41m      [m				[32mif (referencings.hasOwnProperty(key)) {[m
[32m+[m										[32mif (current.relations[previousGroup].sourceEntity == key && !!referencings[key]) {[m
[32m+[m											[32mdata[`${current.group}.${current.relations[previousGroup].sourceEntity}`] = referencings[key].toString();[m
[32m+[m										[32m}[m
[32m+[m		[41m      [m				[32m}[m
 								}[m
 								[m
[32m+[m								[32mif (WHERE_CLAUSE.length == 0) throw new Error('Functional Error: must have at least one condition.');[m
[32m+[m[41m								[m
 								const COMMAND = `SELECT * FROM ${shortestPath[shortestPath.length - 1].group} ${INNER_JOIN.join(' ')} WHERE ${WHERE_CLAUSE.join(' AND ')} LIMIT 1`;[m
 								[m
[32m+[m								[32mconsole.log('COMMAND', COMMAND);[m
[32m+[m[41m								[m
 			      		const cachedPermissionMD5Key = session.id + Md5.init(JSON.stringify([COMMAND, finalValue]));[m
 								// TODO: find the proper way to cache.[m
 			      		// if (!!cachedPermissions[cachedPermissionMD5Key]) {[m
[1mdiff --git a/test/boilerplate/back-end/helpers/PermissionHelper.test.ts b/test/boilerplate/back-end/helpers/PermissionHelper.test.ts[m
[1mindex 677d0374..06578c1f 100644[m
[1m--- a/test/boilerplate/back-end/helpers/PermissionHelper.test.ts[m
[1m+++ b/test/boilerplate/back-end/helpers/PermissionHelper.test.ts[m
[36m@@ -34,20 +34,20 @@[m [mdescribe('PermissionHelper', () => {[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Document, 2, 1))).toEqual(true);[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.Document, 3, 1))).toEqual(true);[m
 			[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 0, 1))).toEqual(true); // modification of table[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 1, 1))).toEqual(true);[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 0, 1))).toEqual(false); // modification of table[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 1, 1))).toEqual(false);[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 2, 1))).toEqual(true);[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Upsert, createRows(1, SourceType.VolatileMemory, 3, 1))).toEqual(false);[m
 			[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 0, 1))).toEqual(true); // retrieval of table[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 1, 1))).toEqual(true);[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 2, 1))).toEqual(false);[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 0, 1))).toEqual(false); // retrieval of table[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 1, 1))).toEqual(false);[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 2, 1))).toEqual(true);[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 3, 1))).toEqual(true);[m
 			[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 0, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(false); // recursive (control)[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Insert, createRows(1, SourceType.Relational, 2, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true); // recursive (check)[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 2, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(false);[m
[31m-			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 1, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true);[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 1, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(false);[m
[32m+[m			[32mexpect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 2, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true);[m
 			expect(PermissionHelper.hasPermissionDefining(ActionType.Retrieve, createRows(1, SourceType.VolatileMemory, 3, 1, 1, createRows(1, SourceType.Relational, 0, 1)))).toEqual(true); // no path[m
 		});[m
 	});[m
[36m@@ -292,7 +292,7 @@[m [mdescribe('PermissionHelper', () => {[m
 						[m
 					establishPermissionChecking(true);[m
 					[m
[31m-					// Relational[m
[32m+[m					[32m// Document --> Relational[m
 					// [m
 					let control1 = createRows(22, SourceType.Document, 2, 5, 6);[m
 					await crud_base([m
[36m@@ -390,6 +390,91 @@[m [mdescribe('PermissionHelper', () => {[m
 					expect(results['Document2'].rows[2].columns['dat12']).toBeDefined();[m
 					expect(results['Document2'].rows[3].columns['dat12']).not.toBeDefined();[m
 					expect(results['Document2'].rows[4].columns['dat12']).not.toBeDefined();[m
[32m+[m[41m					[m
[32m+[m					[32m// VolatileMemory --> Document --> Relational[m
[32m+[m					[32m//[m[41m [m
[32m+[m					[32mlet control2 = createRows(24, SourceType.VolatileMemory, 2, 1, 1);[m
[32m+[m					[32mawait crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Create,[m
[32m+[m						[32mcontrol2[m
[32m+[m					[32m);[m
[32m+[m					[32mresults = await crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Retrieve,[m
[32m+[m						[32mcontrol2[m
[32m+[m					[32m);[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].keys['int03']).toBeDefined(); // no session[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // control for with relation[m
[32m+[m[41m					[m
[32m+[m					[32mestablishPermissionChecking(true, {int09: 123, int06: 567});[m
[32m+[m[41m					[m
[32m+[m					[32mresults = await crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Retrieve,[m
[32m+[m						[32mcontrol1[m
[32m+[m					[32m);[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // with session (no in-between)[m
[32m+[m[41m					[m
[32m+[m					[32mlet data2 = createRows(24, SourceType.Document, 1, 1, 1);[m
[32m+[m[41m					[m
[32m+[m					[32mawait crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Create,[m
[32m+[m						[32mdata2[m
[32m+[m					[32m);[m
[32m+[m[41m					[m
[32m+[m					[32mresults = await crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Retrieve,[m
[32m+[m						[32mcontrol1[m
[32m+[m					[32m);[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // with session (have some in-between)[m
[32m+[m[41m					[m
[32m+[m					[32mlet data3 = createRows(24, SourceType.Relational, 0, 1, 1);[m
[32m+[m					[32mdata3['relational0'].rows[0].columns['str04'] = '567';[m
[32m+[m[41m					[m
[32m+[m					[32mawait crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Create,[m
[32m+[m						[32mdata3[m
[32m+[m					[32m);[m
[32m+[m[41m					[m
[32m+[m					[32mresults = await crud_base([m
[32m+[m						[32m24,[m
[32m+[m						[32mCRUD.Retrieve,[m
[32m+[m						[32mcontrol1[m
[32m+[m					[32m);[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].keys['str10']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['bol02']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['grp01']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['str11']).toBeDefined();[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['flt13']).toBeDefined();[m
[32m+[m[41m					[m
[32m+[m					[32mexpect(results['VolatileMemory2'].rows[0].columns['dat12']).not.toBeDefined(); // with session (have all in-between)[m
 				});[m
 				test('Unavailable-Hop Referencing', async () => {[m
 					await flushPromises();[m
