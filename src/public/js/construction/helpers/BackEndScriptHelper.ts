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
  protected validate(data: Input[]): void {
  	// The message of thrown error will be the validation message.
  	//
 		ValidationHelper.validate(data);
  }
  
  protected async accessories(data: Input[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve({
          title: null,
          description: null,
          keywords: null,
          language: null,
          contentType: null,
          revisitAfter: null,
          robots: null,
          linkUrl: null,
          imageUrl: null,
          itemType: null,
          contentLocale: null
        });
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async get(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await super.get(data));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async post(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await super.post(data));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async put(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await super.put(data));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async delete(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await super.delete(data));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async insert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
      	let options = RequestHelper.getOptions(this.request);
        resolve(await DatabaseHelper.insert(data, schema, options.crossRelationUpsert));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async update(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
      	let options = RequestHelper.getOptions(this.request);
        resolve(await DatabaseHelper.update(data, schema, options.crossRelationUpsert));
      } catch(error) {
        reject(error);
      }
    });
    return ;
  }
  
  protected async remove(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await DatabaseHelper.delete(data, schema));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async retrieve(data: Input[], schema: DataTableSchema): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await DatabaseHelper.retrieve(data, schema));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async navigate(data: Input[], schema: DataTableSchema): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve('/');
      } catch(error) {
        reject(error);
      }
    });
  }`,
  ClassEnd: `

// Export variables here:
//
export default Controller;
`
}

const FULL_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {Request, Response} from "express";
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, Input, DatabaseHelper} from '../helpers/DatabaseHelper.js';
import {ValidationInfo, ValidationHelper} from '../helpers/ValidationHelper.js';
import {RequestHelper} from '../helpers/RequestHelper.js';
import {RenderHelper} from '../helpers/RenderHelper.js';
import {DataTableSchema} from '../helpers/SchemaHelper.js';
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
  Retrieve,
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
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
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
  constructor(request: Request, response: Response, template: string) {
  	super(request, response, template);
  	try {
	    let [action, schema, data] = this.initialize(request);
	    this.perform(action, schema, data);
   	} catch(error) {
	  	RenderHelper.error(response, error);
	  }
  }
  // <---Auto[ClassBegin]
 	
  // Auto[MergingBegin]--->  
  private initialize(request: Request): [ActionType, DataTableSchema, Input[]] {
  	let action: ActionType = RequestHelper.getAction(request);
  	let schema: DataTableSchema = RequestHelper.getSchema(request);
  	let data: Input[] = [];
  	let input: Input = null;
  	
	  // <---Auto[MergingBegin]
	  
	  // Auto[Merging]--->
	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	  
	  return [action, schema, data];
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]`;

const MERGING_BOILERPLATE = `// Auto[Merging:Begin]--->
// <---Auto[Merging:Begin]

// Auto[Merging:End]--->
// <---Auto[Merging:End]`;

const MAIN_MERGE_END_BEGIN = `	  // <---Auto[Merging]`;
const SUB_MERGE_END_BEGIN = `\n// Auto[Merging:End]--->`;
const FILE_BEGIN = `// Auto[File]--->`;
const FILE_END = `// <---Auto[File]`;

var BackEndScriptHelper = {
		generateScriptCode: (info: any) => {
				let code = FULL_BOILERPLATE;
		    code = code.replace('// <---Auto[Import]', '// <---Auto[Import]' + (info['internal-fsb-data-code-import'] || DEFAULTS.Import));
		    code = code.replace('// <---Auto[Declare]', '// <---Auto[Declare]' + (info['internal-fsb-data-code-declare'] || DEFAULTS.Declare));
		    code = code.replace('// <---Auto[Interface]', '// <---Auto[Interface]' + (info['internal-fsb-data-code-interface'] || DEFAULTS.Interface));
		    code = code.replace('// <---Auto[ClassBegin]', '// <---Auto[ClassBegin]' + (info['internal-fsb-data-code-body'] || DEFAULTS.ClassBegin));
		    code = code.replace('// <---Auto[ClassEnd]', '// <---Auto[ClassEnd]' + (info['internal-fsb-data-code-footer'] || DEFAULTS.ClassEnd));
		        
				let functionNameMapping = {};
				
				let prerequisiteCode = info['autoGeneratedCodeForMergingBackEndScript'][0];
				let mergingCode = info['autoGeneratedCodeForMergingBackEndScript'][1];
				mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
    		mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
    		mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
    		mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
    		
    		mergingCode = mergingCode.replace(/(\n)+/g, '\n');
				
				code = code.replace(MAIN_MERGE_END_BEGIN, `${prerequisiteCode}
${mergingCode}
${MAIN_MERGE_END_BEGIN}`);
				
				code = `${code.split(FILE_END)[0]}
${info['editingPageID']}
${FILE_END}${code.split(FILE_END)[1]}`;
				
				return [code, functionNameMapping];
		},
		generateMergingCode: (info: any, executions: string[], removeAutoGeneratingWarning: boolean=false) => {
				let code = '';
	      let functionNameMapping = {};
	      
	      let SECTION_GUID = info['internal-fsb-guid'];
	      let SECTION_NAME = info['internal-fsb-name'];
	      let SECTION_TARGET = info['internal-fsb-data-source-type'];
	      let SECTION_TABLE_NAME= info['internal-fsb-data-source-name'];
	      let SECTION_COLUMN_NAME = info['internal-fsb-data-source-column'];
	      let SECTION_REQUIRED = info['required'];
	      let SECTION_VALUE_SOURCE = info['internal-fsb-data-value-source'];
	      let SECTION_VALUE_SOURCE_SESSION_NAME = info['internal-fsb-data-session-name'];
	      let SECTION_VALIDATION_MESSAGE = info['internal-fsb-data-validation-message'];
        let SECTION_BEGIN_BEGIN = `    // Auto[${SECTION_GUID}:Begin]--->`;
        let SECTION_BEGIN_END = `\n      // <---Auto[${SECTION_GUID}:Begin]`;
        let SECTION_END_BEGIN = `// Auto[${SECTION_GUID}:End]--->`;
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
    		if (SECTION_VALUE_SOURCE != null) SECTION_VALUE_SOURCE = `
      if (input) input.value = request.session['${SECTION_VALUE_SOURCE_SESSION_NAME}'];
`;

    		if (code == '') code = MERGING_BOILERPLATE;
    		
        if (code.indexOf(SECTION_BEGIN_BEGIN) == -1) {
            code = code.replace(SUB_MERGE_END_BEGIN,
`${SECTION_BEGIN_BEGIN}
		RequestHelper.registerInput('${SECTION_GUID}', ${SECTION_TARGET}, ${SECTION_TABLE_NAME}, ${SECTION_COLUMN_NAME});
		ValidationHelper.registerInput('${SECTION_GUID}', ${SECTION_NAME}, ${!!SECTION_REQUIRED}, ${SECTION_VALIDATION_MESSAGE});
    for (let i=-1; i<1024; i++) {
      input = RequestHelper.getInput(request, '${SECTION_GUID}' + ((i == -1) ? '' : '[' + i + ']'));${SECTION_VALUE_SOURCE || ''}${SECTION_BEGIN_END}${info['internal-fsb-data-code'] || SECTION_BODY}${SECTION_END_BEGIN}
      if (input != null) data.push(input);
      else if (i > -1) break;
    }
${SECTION_END_END}
${SUB_MERGE_END_BEGIN}`);
        } else {
            code = `${code.split(FUNCTION_END_BEGIN)[0]}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
}${FUNCTION_END_END}${code.split(FUNCTION_END_END)[1]}`;
        }
	      
	      if (removeAutoGeneratingWarning) {
	      		code = code.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
	      		code = code.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
	      		code = code.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
	      		code = code.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
	      }
	      
	      functionNameMapping[`${SECTION_GUID}:Begin`] = 'internal-fsb-data-code';
	      
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