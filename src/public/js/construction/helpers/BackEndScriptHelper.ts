const DEFAULTS = {
	Import: `

// Import additional modules here:
//
// import * as module from '...';

`
}

const FULL_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
// <---Auto[Import]`;

var BackEndScriptHelper = {
	generateScriptCode: (info: any, previewReactClassName: string=null) => {
		let code = FULL_BOILERPLATE;
		let functionNameMapping = {};
		
		return [code, functionNameMapping];
	},
	generateMergingCode: (info: any, executions: [string], removeAutoGeneratingWarning: boolean=false) => {
		let code = 'Merging';
    let functionNameMapping = {};
    
    return [code, functionNameMapping];
	}
}

export {BackEndScriptHelper, DEFAULTS};