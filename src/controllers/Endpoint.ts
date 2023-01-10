// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import fs from "fs";
import * as shell from "shelljs";
import path from "path";
import * as child from "child_process";
import {Request, Response} from "express";

let recentError = [];
export const clearRecentError = () => {
  recentError = [];
};
export const addRecentError = (error: any) => {
  recentError.push("[back-end]: " + (error && error.message || error.toString()));
};

const convertUnixIntoWindowPathIfNeed = (path: any) => {
  if (__dirname.indexOf('\\') != -1) {
    path = path.replace(/\//g, '\\');
  }

  return path;
};

/**
 * POST /endpoint/update/content
 * Update the content of specific file in the repository.
 */
export const updateContent = (request: Request, response: Response) => {
  try {
    const json: any = request.body;
    if (json == null) {
      throw new Error("There was an error trying to obtain requesting parameters (JSON object is null).");
    }

    const dirname = __dirname.replace(convertUnixIntoWindowPathIfNeed("/dist/"), convertUnixIntoWindowPathIfNeed("/src/"));
    const rootPath = path.resolve(dirname, convertUnixIntoWindowPathIfNeed("../../"));

    for (const file of json.files) {
      const fullPath = path.resolve(dirname, convertUnixIntoWindowPathIfNeed(file.path));
      if (fullPath.indexOf(rootPath) == -1) {
        throw new Error(`The specified path isn't under ${rootPath}.`);
      }
    }

    clearRecentError();

    response.json({
      success: true,
      error: null,
      results: true
    });
    response.end();

    setTimeout(() => {
      for (const file of json.files) {
        const fullPath = path.resolve(dirname, convertUnixIntoWindowPathIfNeed(file.path));

        fs.writeFileSync(fullPath, file.content, {encoding: "utf8", flag: "w"});
      }

      const {ProjectConfigurationHelper} = require('./helpers/ProjectConfigurationHelper');
      ProjectConfigurationHelper.reload();
    }, 1000);
  } catch (error) {
    response.json({
      success: false,
      error: error.message,
      results: null
    });
  }
};
export const resetContent = async (request: Request, response: Response) => {
  try {
    const dirname = __dirname.replace(convertUnixIntoWindowPathIfNeed("/dist/"), convertUnixIntoWindowPathIfNeed("/src/"));
    const rootPath = path.resolve(dirname, convertUnixIntoWindowPathIfNeed("../../"));

    const {stdout, stderr} = await child.exec(convertUnixIntoWindowPathIfNeed(`git restore -s@ -SW -- ${rootPath}/src/controllers/components ; git restore -s@ -SW -- ${rootPath}/src/public/js/components ; git restore -s@ -SW -- ${rootPath}/views/home ; git restore -s@ -SW -- ${rootPath}/project.stackblend ; git clean -f -d`));
    if (stderr && stderr["_hadError"]) throw stderr;

    response.json({
      success: true,
      error: null,
      results: true
    });
    response.end();
  } catch (error) {
    response.json({
      success: false,
      error: error,
      results: null
    });
  }
};
export const pullContent = async (request: Request, response: Response) => {
  try {
    const {stdout, stderr} = await child.exec("npm run reset && git pull");
    if (stderr && stderr["_hadError"]) throw stderr;

    response.json({
      success: true,
      error: null,
      results: true
    });
    response.end();

    const {ProjectConfigurationHelper} = require('./helpers/ProjectConfigurationHelper');
    ProjectConfigurationHelper.reload();
  } catch (error) {
    response.json({
      success: false,
      error: error,
      results: null
    });
  }
};
export const getRecentError = (request: Request, response: Response) => {
  if (recentError.length == 0) {
    response.json({
      success: true,
      error: null,
      results: null
    });
  } else {
    response.json({
      success: false,
      error: recentError.join("\n"),
      results: null
    });
  }

  clearRecentError();
};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.