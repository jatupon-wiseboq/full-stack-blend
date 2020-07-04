// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import fs from "fs";
import path from "path";
import childProcess from "child_process";
import {Request, Response} from "express";

/**
 * POST /endpoint/update/content
 * Update the content of specific file in the repository.
 */
export const updateContent = (request: Request, response: Response) => {
		
		try {
			const json: any = request.body;
			if (json == null) {
				throw new Error("There was an error trying to obtain requesting parameters (missing).");
			}
			
			const fullPath = path.resolve(__dirname, json.path);
			if (fullPath.indexOf(__dirname) == -1) {
				throw new Error(`The specified path isn't under ${__dirname}.`);
			}
			
			childProcess.execSync("git stash");
			childProcess.execSync("git remote add boilerplate https://github.com/SoftenStorm/boilerplate.git &");
			childProcess.execSync("git pull boilerplate master");
			childProcess.execSync("git stash apply");
			fs.writeFileSync(fullPath, json.content, {encoding: "utf8", flag: "w"});
			
			response.json({
				success: true,
				error: null,
				results: true
			});
		} catch(error) {
			response.json({
				success: false,
				error: error,
				results: null
			});
		}
		
};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.