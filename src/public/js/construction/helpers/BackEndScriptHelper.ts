import {USER_CODE_REGEX_GLOBAL, USER_CODE_REGEX_GROUP, SYSTEM_CODE_REGEX_BEGIN_GLOBAL, SYSTEM_CODE_REGEX_END_GLOBAL} from '../Constants.js';

const DEFAULTS = {
  Import: `

// Import additional modules here:
//
`,
  Declare: `

// Declare private static variables here:
//
`,
  Interface: `

// Declare or extend interfaces here:
//
`,
  ClassBegin: `
  
  // Declare class variables and functions here:
  //
  protected validate(data: [Input]): void {
  	// The message of thrown error will be the validation message.
  	//
 		ValidationHelper.validate(data);
  }
  
  protected insert(data: [Input]): HierarchicalDataRow {
 		return DatabaseHelper.insert(data);
  }
  
  protected update(data: [Input]): HierarchicalDataRow {
 		return DatabaseHelper.update(data);
  }
  
  protected delete(data: [Input]): boolean {
 		return DatabaseHelper.delete(data);
  }
  
  protected retrieve(data: [Input]): HierarchicalDataTable {
 		return DatabaseHelper.retrieve(data);
  }
  
  protected navigate(data: [Input]): string {
 		return '/';
  }`,
  ClassEnd: `

// Export variables here:
//
export {Controller};
`
}

const FULL_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, HierarchicalDataColumn, Input, DatabaseHelper} from './helpers/DatabaseHelper.js';
import {ValidationInfo, ValidationHelper} from './helpers/ValidationHelper.js';
import {RequestHelper} from './helpers/RequestHelper.js';
import {Base} from './Base.js';
// <---Auto[Import]
// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory
}
enum ActionType {
  Insert,
  Update,
  Delete,
  Retreive,
  Popup,
  Navigate
}
enum ValidationInfo {
  name: string;
  required: boolean;
  customMessage: string;
}*/
// <---Auto[Declare]
// Auto[Interface]--->
/*interface HierarchicalDataTable {
	group: string;
  rows: [HierarchicalDataRow];
}
interface HierarchicalDataRow {
  columns: [HierarchicalDataColumn];
  relations: [HierarchicalDataTable];
}
interface HierarchicalDataColumn {
	name: string;
  value: any;
  relations: [HierarchicalDataTable];
}
interface Input {
  target: SourceType;
  group: string;
  name: string;
  value: any;
  guid: string;
  validation: ValidationInfo;
}*/
// <---Auto[Interface]
// Auto[ClassBegin]--->
class Controller extends Base {
  constructor(request: Request, response: Response) {
  	super(request, response);
  	
    let [action, data] = this.initialize(request);
    this.perform(action, data);
  }
  // <---Auto[ClassBegin]
 	
  // Auto[MergingBegin]--->  
  private initialize(request: Request): [action: ActionType, data: [Input]] {
  	let action: ActionType = RequestHelper.getAction(request);
  	let data: [Input] = [];
  	let input: Input = null;
  	
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  // <---Auto[Merging]
	  // Auto[MergingEnd]--->
	  
	  return [action, data];
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]`;

const MERGING_BOILERPLATE = `// Auto[Merging:Begin]--->
// <---Auto[Merging:Begin]

// Auto[Merging:End]--->
// <---Auto[Merging:End]`;

const MERGE_END_BEGIN = `\n// Auto[Merging:End]--->`;

var BackEndScriptHelper = {
		generateScriptCode: (info: any, previewReactClassName: string=null) => {
				let code = FULL_BOILERPLATE;
		    code = code.replace('// <---Auto[Import]', '// <---Auto[Import]' + (info['internal-fsb-data-code-import'] || DEFAULTS.Import));
		    code = code.replace('// <---Auto[Declare]', '// <---Auto[Declare]' + (info['internal-fsb-data-code-declare'] || DEFAULTS.Declare));
		    code = code.replace('// <---Auto[Interface]', '// <---Auto[Interface]' + (info['internal-fsb-data-code-interface'] || DEFAULTS.Interface));
		    code = code.replace('// <---Auto[ClassBegin]', '// <---Auto[ClassBegin]' + (info['internal-fsb-data-code-body'] || DEFAULTS.ClassBegin));
		    code = code.replace('// <---Auto[ClassEnd]', '// <---Auto[ClassEnd]' + (info['internal-fsb-data-code-footer'] || DEFAULTS.ClassEnd));
		        
				let functionNameMapping = {};
				
				return [code, functionNameMapping];
		},
		generateMergingCode: (info: any, executions: [string], removeAutoGeneratingWarning: boolean=false) => {
				let code = '';
	      let functionNameMapping = {};
	      
	      let SECTION_GUID = info['internal-fsb-guid'];
	      let SECTION_NAME = info['internal-fsb-name'];
	      let SECTION_TARGET = info['internal-fsb-data-source-type'];
	      let SECTION_TABLE_NAME= info['internal-fsb-data-source-name'];
	      let SECTION_COLUMN_NAME = info['internal-fsb-data-source-column'];
	      let SECTION_REQUIRED = info['required'];
	      let SECTION_VALIDATION_MESSAGE = info['internal-fsb-data-validation-message'];
        let SECTION_BEGIN_BEGIN = `    // Auto[${SECTION_GUID}:Begin]--->`;
        let SECTION_BEGIN_END = `    // <---Auto[${SECTION_GUID}:Begin]`;
        let SECTION_END_BEGIN = `    // Auto[${SECTION_GUID}:End]--->`;
        let SECTION_END_END = `    // <---Auto[${SECTION_GUID}:End]`;
        let SECTION_BODY = `
    // Override data parsing and manipulation of ${SECTION_NAME} here:
    // 
    
    `;
    
    		if (SECTION_NAME != null) SECTION_NAME = JSON.stringify(SECTION_NAME);
    		if (SECTION_VALIDATION_MESSAGE != null) SECTION_VALIDATION_MESSAGE = JSON.stringify(SECTION_VALIDATION_MESSAGE);
    		if (SECTION_TARGET != null) SECTION_TARGET = JSON.stringify(SECTION_TARGET);
    		if (SECTION_TABLE_NAME != null) SECTION_TABLE_NAME = JSON.stringify(SECTION_TABLE_NAME);
    		if (SECTION_COLUMN_NAME != null) SECTION_COLUMN_NAME = JSON.stringify(SECTION_COLUMN_NAME);

    		if (code == '') code = MERGING_BOILERPLATE;
    		
        if (code.indexOf(SECTION_BEGIN_BEGIN) == -1) {
            code = code.replace(MERGE_END_BEGIN,
`${SECTION_BEGIN_BEGIN}
		RequestHelper.registerInput('${SECTION_GUID}', ${SECTION_TARGET}, ${SECTION_TABLE_NAME}, ${SECTION_COLUMN_NAME});
		ValidationHelper.registerInput('${SECTION_GUID}', ${SECTION_NAME}, ${!!SECTION_REQUIRED}, ${SECTION_VALIDATION_MESSAGE});
    input = RequestHelper.getInput(request, '${SECTION_GUID}');
${SECTION_BEGIN_END}
${info['internal-fsb-data-code'] || SECTION_BODY}
${SECTION_END_BEGIN}
    if (input != null) data.push(input);
${SECTION_END_END}
${MERGE_END_BEGIN}`);
        } else {
            code = `${code.split(FUNCTION_END_BEGIN)[0]}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
}${FUNCTION_END_END}${code.split(FUNCTION_END_END)[1]}`;
        }
        
        if (executions) {
        		executions.push(`controller.register('${info['internal-fsb-guid']}', '${CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, '').toLowerCase()}', '${FUNCTION_NAME}');`);
        }
	      
	      if (removeAutoGeneratingWarning) {
	      		code = code.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
	      		code = code.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
	      		code = code.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
	      		code = code.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
	      }
	      
	      return [code, functionNameMapping];
		},	
	  extractCode: (code: string) => {
		    if (!code) return {};
		    
		    let resultDictionary = {};
		    let lines = code.match(USER_CODE_REGEX_GLOBAL);
		    
		    for (let line of lines) {
			      let matched = line.match(USER_CODE_REGEX_GROUP);
			      
			      if (matched[1].endsWith(':End')) continue;
			      
			      resultDictionary[matched[1]] = matched[2];
		    }
		    
		    return resultDictionary;
	  }
}

export {BackEndScriptHelper, DEFAULTS};