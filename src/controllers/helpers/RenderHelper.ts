// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Response} from "express";
import {DataManipulationHelper} from "./DataManipulationHelper";

const RenderHelper = {
	json: (response: Response, data: any) => {
	  if (response.headersSent) return;
	  response.json({
			success: true,
			error: null,
			results: data,
			redirect: null
		});
	},
	navigate: (response: Response, data: string) => {
	  if (response.headersSent) return;
		response.json({
			success: true,
			error: null,
			results: null,
			redirect: data
		});
	},
	page: (response: Response, path: string, data: any, headers: any={}) => {
	  if (response.headersSent) return;
	  
	  DataManipulationHelper.setData(data || null);
	  
	  response.render(path, {
	  	DataManipulationHelper: DataManipulationHelper,
	    data: data || null,
	    headers: headers || null
	  });
	},
	error: (response: Response, error: Error) => {
	  if (response.headersSent) return;
	  response.json({
			success: false,
			error: `${error.message} ${(process.env.NODE_ENV != 'production') ? error.stack : ''}`.trim(),
			results: null,
			redirect: null
		});
	}
};

export {RenderHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
