// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import fs from "fs";
import path from "path";
import {DataSchema, SchemaHelper} from "./SchemaHelper";
import {DatabaseHelper} from "./DatabaseHelper";
import {CodeHelper} from "./CodeHelper";

let file, data;
let cachedSchema = null;

const ProjectConfigurationHelper = {
	reload: () => {
		try {
			file = fs.readFileSync(path.resolve(__dirname, "../../../project.stackblend"), "utf8");
			data = JSON.parse(CodeHelper.unlabel(file));
		} catch(error) {
			if (process.env.JEST_WORKER_ID !== undefined) {
				console.log("\x1b[33m", error, "\x1b[0m");
			} else {
				console.log("\x1b[31m", error, "\x1b[0m");
			}
			data = {};
		}
	},
  convertToSchema: (tables: any) => {
    for (const tableKey in tables) {
      if (tables.hasOwnProperty(tableKey)) {
        tables[tableKey].source = DatabaseHelper.getSourceType(tables[tableKey].source);
      }
      
      for (const columnKey in tables[tableKey].keys) {
        if (tables[tableKey].keys.hasOwnProperty(columnKey)) {
          tables[tableKey].keys[columnKey].fieldType = SchemaHelper.getFieldType(tables[tableKey].keys[columnKey].fieldType);
        }
      }
      
      for (const columnKey in tables[tableKey].columns) {
        if (tables[tableKey].columns.hasOwnProperty(columnKey)) {
          tables[tableKey].columns[columnKey].fieldType = SchemaHelper.getFieldType(tables[tableKey].columns[columnKey].fieldType);
        }
      }
    }
    
    return tables;
  },
	getDataSchema: (): DataSchema => {
	  if (!cachedSchema) cachedSchema = ProjectConfigurationHelper.convertToSchema(data.flows && data.flows.schema || {});
	  
	  return {
	    tables: cachedSchema
	  };
	},
	getDotNotationPossibilities: (page: string): any => {
	  return data.sites && data.sites[page] && data.sites[page].notations || [];
	}
};

ProjectConfigurationHelper.reload();

export {ProjectConfigurationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.