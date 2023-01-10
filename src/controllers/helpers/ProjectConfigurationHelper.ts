// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import fs from "fs";
import path from "path";
import {DataSchema, SchemaHelper} from "./SchemaHelper";
import {DatabaseHelper} from "./DatabaseHelper";
import {CodeHelper} from "./CodeHelper";

let file, data;
let cachedSchema = null;

enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}

const settings: {[Identifier: string]: any} = {};
const Project = {
  Settings: settings
};
const ProjectConfigurationHelper = {
  reload: () => {
    try {
      file = fs.readFileSync(path.resolve(__dirname, "../../../project.stackblend"), "utf8");
      data = JSON.parse(CodeHelper.unlabel(file));

      Project.Settings = {};
      if (data.globalSettings && data.globalSettings.customBackEndSettings) {
        const items = data.globalSettings.customBackEndSettings.split('`');

        for (const item of items) {
          const tokens = item.split('~');
          Project.Settings[tokens[0]] = tokens[1];
        }
      }
    } catch (error) {
      if (process.env.JEST_WORKER_ID !== undefined) {
        console.log("\x1b[33m", error, "\x1b[0m");
      } else {
        console.log("\x1b[31m", error, "\x1b[0m");
      }
      Project.Settings = {};
    }
  },
  convertToSchema: (tables: any) => {
    for (const tableKey in tables) {
      if (tables.hasOwnProperty(tableKey)) {
        tables[tableKey].source = ProjectConfigurationHelper.getSourceType(tables[tableKey].source);
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
  },
  getSourceType: (value: string): SourceType => {
    switch (value) {
      case 'relational':
        return SourceType.Relational;
      case 'document':
        return SourceType.Document;
      case 'volatile-memory':
        return SourceType.VolatileMemory;
      case 'RESTful':
        return SourceType.RESTful;
      case 'worker':
        return SourceType.PrioritizedWorker;
      default:
        throw new Error(`There was an error preparing data for manipulation (invalid type of available data source, '${value}').`);
    }
  },
  getLanguageData: (): any => {
    return data.globalSettings && data.globalSettings.customLocalizedStrings || null;
  },
  getSecondaryLanguage: (): any => {
    return data.globalSettings && data.globalSettings.defaultLocalizedLanguage && data.globalSettings.defaultLocalizedLanguage.toLowerCase() || null;
  }
};

ProjectConfigurationHelper.reload();

export {ProjectConfigurationHelper, SourceType, Project};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.