import {CAMEL_OF_EVENTS_DICTIONARY, CUSTOM_EVENT_TYPE_OF_CAMEL_OF_EVENTS, USER_CODE_REGEX_GLOBAL, USER_CODE_REGEX_GROUP, SYSTEM_CODE_REGEX_BEGIN_GLOBAL, SYSTEM_CODE_REGEX_END_GLOBAL} from '../Constants';

enum TemplateCode {
	Controller,
	Connector,
	Worker,
	Scheduler
};

const CONTROLLER_DEFAULTS = {
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
  
  // ---------------------------------------------------------------
  // Metadata (SEO)
  // ---------------------------------------------------------------
  
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
  
  // ---------------------------------------------------------------
  // Example Code of Express Parameters
  // ---------------------------------------------------------------
  // 
  // Access path parameters of "/path/:a/:b" using:
  // this.request.params['a'], this.request.params['b']
  // 
  // Access query-string parameters of "/path/a/b?c=123" using:
  // this.request.query['c']
  // 
  // Access session variables "token" using:
  // this.request.session.token
  // 
  // Saving session variables "token" using:
  // this.request.session.token = 'abc';
  // this.request.session.save(() => {
  //   resolve(...);
  // });
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Traditional HTTP Request Methods
  // ---------------------------------------------------------------
  
  protected async get(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await DatabaseHelper.retrieve(@{
            'collection.column': 'abc',
            'collection.column': 123,
            'collection.collection.column': null
          }, 'collection',
          this.request.session,   // session variables
          false,                  // real-time updates
          false                   // skip permission settings
        ));
      } catch(error) {
        reject(error);
      } */
      try {
        resolve(await super.get(data));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async post(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await DatabaseHelper.update(@{
            'collection.column': 'abc',
            'collection.column': 123,
            'collection.collection.column': null
          }, 'collection',
          false,                  // recusive upsert in sub-collection
          this.request.session,   // session variables
          false                   // skip permission settings
        ));
      } catch(error) {
        reject(error);
      } */
      reject(new Error("Not Implemented Error"));
    });
  }
  
  protected async put(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await DatabaseHelper.insert(@{
            'collection.column': 'abc',
            'collection.column': 123,
            'collection.collection.column': null
          }, 'collection',
          false,                  // recusive upsert in sub-collection
          this.request.session,   // session variables
          false                   // skip permission settings
        ));
      } catch(error) {
        reject(error);
      } */
      /* try {
        resolve(await DatabaseHelper.upsert(@{
            'collection.column': 'abc',
            'collection.column': 123,
            'collection.collection.column': null
          }, 'collection',
          this.request.session,   // session variables
          false                   // skip permission settings
        ));
      } catch(error) {
        reject(error);
      } */
      reject(new Error("Not Implemented Error"));
    });
  }
  
  protected async delete(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await DatabaseHelper.delete(@{
            'collection.column': 'abc',
            'collection.column': 123,
            'collection.collection.column': null
          }, 'collection',
          this.request.session,   // session variables
          false                   // leavePermission
        ));
      } catch(error) {
        reject(error);
      } */
      reject(new Error("Not Implemented Error"));
    });
  }
  
  // ---------------------------------------------------------------
  // StackBlend Button Request Actions
  // ---------------------------------------------------------------
  
  protected async insert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = RequestHelper.getOptions(this.pageId, this.request); /* submit options */
        const name = options.name;                                           /* button name */
        
        // You may generate data and schema on the fly using:
        //
        // data = RequestHelper.createInputs({...});
        // schema = SchemaHelper.getDataTableSchemaFromNotation('collection');
        // 
        
        resolve(await DatabaseHelper.insert(data, schema, options.crossRelationUpsert, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async update(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = RequestHelper.getOptions(this.pageId, this.request); /* submit options */
        const name = options.name;                                           /* button name */
        
        // You may generate data and schema on the fly using:
        //
        // data = RequestHelper.createInputs({...});
        // schema = SchemaHelper.getDataTableSchemaFromNotation('collection');
        // 
        
        resolve(await DatabaseHelper.update(data, schema, options.crossRelationUpsert, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async upsert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = RequestHelper.getOptions(this.pageId, this.request); /* submit options */
        const name = options.name;                                           /* button name */
        
        // You may generate data and schema on the fly using:
        //
        // data = RequestHelper.createInputs({...});
        // schema = SchemaHelper.getDataTableSchemaFromNotation('collection');
        // 
        
        resolve(await DatabaseHelper.upsert(data, schema, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async remove(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = RequestHelper.getOptions(this.pageId, this.request); /* submit options */
        const name = options.name;                                           /* button name */
        
        // You may generate data and schema on the fly using:
        //
        // data = RequestHelper.createInputs({...});
        // schema = SchemaHelper.getDataTableSchemaFromNotation('collection');
        // 
        
        resolve(await DatabaseHelper.delete(data, schema, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async retrieve(data: Input[], schema: DataTableSchema): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = RequestHelper.getOptions(this.pageId, this.request); /* submit options */
        const name = options.name;                                           /* button name */
        
        // You may generate data and schema on the fly using:
        //
        // data = RequestHelper.createInputs({...});
        // schema = SchemaHelper.getDataTableSchemaFromNotation('collection');
        // 
        
        resolve(await DatabaseHelper.retrieve(data, schema, this.request.session, options.enabledRealTimeUpdate));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async navigate(data: Input[], schema: DataTableSchema): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = RequestHelper.getOptions(this.pageId, this.request); /* submit options */
        const name = options.name;                                           /* button name */
        
        // You may generate data and schema on the fly using:
        //
        // data = RequestHelper.createInputs({...});
        // schema = SchemaHelper.getDataTableSchemaFromNotation('collection');
        // 
        
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
};

const CONNECTOR_DEFAULTS = {
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
  protected setup() {
  	// Place your custom setup here (singleton):
    
	}
  `,
  ClassEnd: `

// Export variables here:
//
export default Connector;
`
};

const WORKER_DEFAULTS = {
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
  protected setup() {
  	// Place your custom setup here (singleton):
    
	}
  `,
  ClassEnd: `

// Export variables here:
//
export default Worker;
`
};

const SCHEDULER_DEFAULTS = {
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
  protected setup() {
  	// Place your custom setup here (singleton):
    
	}
  `,
  ClassEnd: `

// Export variables here:
//
export default Scheduler;
`
};

const FULL_CONTROLLER_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {Request, Response} from "express";
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, Input, DatabaseHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/ProjectConfigurationHelper';
import {ValidationInfo, ValidationHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/ValidationHelper';
import {RequestHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/RequestHelper';
import {RenderHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/RenderHelper';
import {SchemaHelper, DataTableSchema} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/SchemaHelper';
import {Base as $Base} from '{__IMPORT_DIRECTORY_PREFIX__}Base';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]
// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
enum ActionType {
  Insert,
  Update,
  Upsert,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}*/
// <---Auto[Declare]
// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
}
interface Input {
  target: SourceType;
  group: string;
  name: string;
  value: any;
  guid: string;
  premise: string;
  validation: ValidationInfo;
  division?: number[];
}
interface ValidationInfo {
  name: string;
  required: boolean;
  customMessage: string;
  format?: string;
  regex?: string;
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
  	let schema: DataTableSchema = RequestHelper.getSchema(this.pageId, request);
  	let data: Input[] = [];
  	let input: Input = null;
  	
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	  
  	let action: ActionType = RequestHelper.getAction(this.pageId, request);
	  return [action, schema, data];
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]`;

const FULL_CONNECTOR_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/ProjectConfigurationHelper';
import {SchemaHelper, DataTableSchema} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/SchemaHelper';
import {Base as $Base} from '{__IMPORT_DIRECTORY_PREFIX__}Connector';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]
// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
enum ActionType {
  Insert,
  Update,
  Upsert,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}*/
// <---Auto[Declare]
// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
}*/
// <---Auto[Interface]
// Auto[ClassBegin]--->
class Connector extends Base {
  constructor() {
  	super();
  }
  // <---Auto[ClassBegin]
 	
  // Auto[MergingBegin]--->  
  private initialize(): void {
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]`;

const FULL_WORKER_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/ProjectConfigurationHelper';
import {SchemaHelper, DataTableSchema} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/SchemaHelper';
import {Base as $Base} from '{__IMPORT_DIRECTORY_PREFIX__}Worker';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]
// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
enum ActionType {
  Insert,
  Update,
  Upsert,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}*/
// <---Auto[Declare]
// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
}*/
// <---Auto[Interface]
// Auto[ClassBegin]--->
class Worker extends Base {
  constructor() {
  	super();
  }
  // <---Auto[ClassBegin]
 	
  // Auto[MergingBegin]--->  
  private initialize(): void {
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]`;

const FULL_SCHEDULER_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/ProjectConfigurationHelper';
import {SchemaHelper, DataTableSchema} from '{__IMPORT_DIRECTORY_PREFIX__}../helpers/SchemaHelper';
import {Base as $Base} from '{__IMPORT_DIRECTORY_PREFIX__}Scheduler';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]
// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
enum ActionType {
  Insert,
  Update,
  Upsert,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}*/
// <---Auto[Declare]
// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
}*/
// <---Auto[Interface]
// Auto[ClassBegin]--->
class Scheduler extends Base {
  constructor() {
  	super();
  }
  // <---Auto[ClassBegin]
 	
  // Auto[MergingBegin]--->  
  private initialize(): void {
	  // <---Auto[MergingBegin]
	  // Auto[Merging]--->
	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]`;

const MERGING_BOILERPLATE = `// Auto[Merging:Begin]--->
// <---Auto[Merging:Begin]

// Auto[Merging:End]--->
// <---Auto[Merging:End]`;

const CLASS_END_BEGIN = `\n  // Auto[ClassEnd]--->`;
const MAIN_MERGE_END_BEGIN = `	  // <---Auto[Merging]`;
const SUB_MERGE_END_BEGIN = `\n// Auto[Merging:End]--->`;
const FILE_BEGIN = `// Auto[File]--->`;
const FILE_END = `// <---Auto[File]`;

var BackEndScriptHelper = {
		generateScriptCode: (info: any, boilerplate: string=FULL_CONTROLLER_BOILERPLATE, defaults: any=CONTROLLER_DEFAULTS, templateCode: TemplateCode=TemplateCode.Controller) => {
				let code = boilerplate;
				const executions = [];
				
		    code = code.replace('// <---Auto[Import]', '// <---Auto[Import]' + (info['internal-fsb-data-code-import'] || defaults.Import));
		    code = code.replace('// <---Auto[Declare]', '// <---Auto[Declare]' + (info['internal-fsb-data-code-declare'] || defaults.Declare));
		    code = code.replace('// <---Auto[Interface]', '// <---Auto[Interface]' + (info['internal-fsb-data-code-interface'] || defaults.Interface));
		    code = code.replace('// <---Auto[ClassBegin]', '// <---Auto[ClassBegin]' + (info['internal-fsb-data-code-body'] || defaults.ClassBegin));
		    code = code.replace('// <---Auto[ClassEnd]', '// <---Auto[ClassEnd]' + (info['internal-fsb-data-code-footer'] || defaults.ClassEnd));
		        
				let functionNameMapping = {};
				
				for (let name of Object.keys(CAMEL_OF_EVENTS_DICTIONARY)) {
            let value = info[name];
            if (value) value = JSON.parse(value);
            else value = {};
            
            let FUNCTION_NAME = CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + info['internal-fsb-class']) + '_' + info['internal-fsb-guid'];
            let FUNCTION_COMPREHEND_NAME = CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + info['internal-fsb-class']) + ' (' + info['internal-fsb-name'] + ')';
            let FUNCTION_EVENT_TYPE = (CUSTOM_EVENT_TYPE_OF_CAMEL_OF_EVENTS.indexOf(name) == -1) ? 'Event' : 'CustomEvent';
            let FUNCTION_CUSTOM_EVENT_CODING_GUIDE_1 = (FUNCTION_EVENT_TYPE == 'CustomEvent') ? `
    // const params = event.detail.params;                  /* manipulation parameters */
    // const response = event.detail.response;              /* manipulation response */` : '';
            let FUNCTION_CUSTOM_EVENT_CODING_GUIDE_2 = (FUNCTION_EVENT_TYPE == 'CustomEvent') ? `
    // return EventHelper.cancel(event);                    /* cancelling this manipulation */
    // ` : '';
            let FUNCTION_BEGIN_BEGIN = `\n  // Auto[${FUNCTION_NAME}:Begin]--->`;
            let FUNCTION_BEGIN_END = `\n    // <---Auto[${FUNCTION_NAME}:Begin]`;
            let FUNCTION_END_BEGIN = `// Auto[${FUNCTION_NAME}:End]--->`;
            let FUNCTION_END_END = `\n  // <---Auto[${FUNCTION_NAME}:End]`;
            let FUNCTION_BODY = `

    // Handle the event of ${FUNCTION_COMPREHEND_NAME} here:
    // ${FUNCTION_CUSTOM_EVENT_CODING_GUIDE_1}
    // const target = EventHelper.getCurrentElement(event); /* current invoking element */
    // const element1 = HTMLHelper.getElementById('ID');    /* accessing an element */
    // const control1 = ReactDOM.findDOMNode(this.refs.ID); /* accessing a component */
    // ${FUNCTION_CUSTOM_EVENT_CODING_GUIDE_2}
    
    `;
    				if (templateCode == TemplateCode.Connector) FUNCTION_BODY = `
    // Place your custom manipulation here:
    // 
    // const customEvent: CustomEvent = event as CustomEvent;
    // const source: DataTableSchema = customEvent.detail.source;    					/* source of relation */
    // const target: DataTableSchema = customEvent.detail.target;    					/* target of relation */
    // const rows: HierarchicalDataRow[] = customEvent.detail.rows;    				/* data in-between */
    // const transaction: any = customEvent.detail.transaction;    						/* transaction context */
    // const crossRelationUpsert: boolean = customEvent.detail.crossRelationUpsert;    /* upsert for the next manipulation */
    // const session: any = customEvent.detail.session;    										/* request session */
    // const leavePermission: boolean = customEvent.detail.leavePermission;  	/* override permission */
    // const innerCircleTags: string[] = customEvent.detail.innerCircleTags;  /* circle tags */
    //
    
    `;
            
            if (value.event) {
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) == -1) {
                    code = code.replace(CLASS_END_BEGIN,
`${FUNCTION_BEGIN_BEGIN}
  protected ${templateCode != TemplateCode.Controller ? 'async ' : ''}${FUNCTION_NAME}(event: ${FUNCTION_EVENT_TYPE}) {${FUNCTION_BEGIN_END}${info['internal-fsb-react-code-' + name] || FUNCTION_BODY}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}
${CLASS_END_BEGIN}`);
                } else {
                    code = `${code.split(FUNCTION_END_BEGIN)[0]}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}${code.split(FUNCTION_END_END)[1]}`;
                }
        				
        				if (templateCode != TemplateCode.Controller) {
	        				let type: string;
	            		let destination: string;
	            		
	            		switch (name) {
	            			case 'onfsbsourceinsert':
	            				type = 'Insert';
	            				destination = info['data-source-group-name'];
	            				break;
	            			case 'onfsbtargetinsert':
	            				type = 'Insert';
	            				destination = info['data-target-group-name'];
	            				break;
	            			case 'onfsbsourceupsert':
	            				type = 'Upsert';
	            				destination = info['data-source-group-name'];
	            				break;
	            			case 'onfsbtargetupsert':
	            				type = 'Upsert';
	            				destination = info['data-target-group-name'];
	            				break;
	            			case 'onfsbsourceupdate':
	            				type = 'Update';
	            				destination = info['data-source-group-name'];
	            				break;
	            			case 'onfsbtargetupdate':
	            				type = 'Update';
	            				destination = info['data-target-group-name'];
	            				break;
	            			case 'onfsbsourcedelete':
	            				type = 'Delete';
	            				destination = info['data-source-group-name'];
	            				break;
	            			case 'onfsbtargetdelete':
	            				type = 'Delete';
	            				destination = info['data-target-group-name'];
	            				break;
	            			case 'onfsbsourceretrieve':
	            				type = 'Retrieve';
	            				destination = info['data-source-group-name'];
	            				break;
	            			case 'onfsbtargetretrieve':
	            				type = 'Retrieve';
	            				destination = info['data-target-group-name'];
	            				break;
	            			default:
	            				type = null;
	            				break;
	            		}
	            		
	            		if (type) executions.push(`	  this.register(ActionType.${type}, SchemaHelper.getSchemaFromKey('${destination}'), this.${FUNCTION_NAME});`);
	              }
            } else {
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) != -1) {
                    code = code.split(FUNCTION_BEGIN_BEGIN)[0] + code.split(FUNCTION_END_END + '\n')[1];
                }
            }
            
            functionNameMapping[`${FUNCTION_NAME}:Begin`] = 'internal-fsb-react-code-' + name;
        }
        
        if (templateCode == TemplateCode.Connector) {
					code = code.replace('constructor()', `constructor(SchemaHelper.getSchemaFromKey('${info['data-source-group-name']}'), SchemaHelper.getSchemaFromKey('${info['data-target-group-name']}'))`);
				} else if (templateCode == TemplateCode.Worker) {
					
				} else if (templateCode == TemplateCode.Scheduler) {
					
				}
				
				let prerequisiteCode = info['autoGeneratedCodeForMergingBackEndScript'][0];
				let mergingCode = info['autoGeneratedCodeForMergingBackEndScript'][1];
				mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
    		mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
    		mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_BEGIN_GLOBAL, '');
    		mergingCode = mergingCode.replace(SYSTEM_CODE_REGEX_END_GLOBAL, '');
    		
    		mergingCode = mergingCode.replace(/(\n)+/g, '\n');
				
				code = code.replace(MAIN_MERGE_END_BEGIN, `${prerequisiteCode}${executions.join('\n')}
${mergingCode}
${MAIN_MERGE_END_BEGIN}`);
				
				code = `${code.split(FILE_END)[0]}
${info['editingPageID']}
${FILE_END}${code.split(FILE_END)[1]}`;

				code = code.split('{__IMPORT_DIRECTORY_PREFIX__}').join('../'.repeat(info['editingPagePath'].split('/').length - 1) || './');
				
				return [code, functionNameMapping];
		},
		generateMergingCode: (info: any, executions: string[], removeAutoGeneratingWarning: boolean=false, templateCode: TemplateCode=TemplateCode.Controller) => {
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
	      let SECTION_VALIDATION_FORMAT = info['internal-fsb-data-validation-format'];
	      let SECTION_VALIDATION_REGEX = info['internal-fsb-data-validation-regex'];
        let SECTION_BEGIN_BEGIN = `    // Auto[${SECTION_GUID}:Begin]--->`;
        let SECTION_BEGIN_END = `\n      // <---Auto[${SECTION_GUID}:Begin]`;
        let SECTION_END_BEGIN = `// Auto[${SECTION_GUID}:End]--->`;
        let SECTION_END_END = `    // <---Auto[${SECTION_GUID}:End]`;
        
        if (SECTION_VALIDATION_FORMAT != 'custom') SECTION_VALIDATION_REGEX = null;
        
        let SECTION_BODY = `
    
      // Override data parsing and manipulation of ${SECTION_NAME} here:
      // 
      
      `;
    
    		if (SECTION_NAME != null) SECTION_NAME = JSON.stringify(SECTION_NAME);
    		if (SECTION_VALIDATION_MESSAGE != null) SECTION_VALIDATION_MESSAGE = JSON.stringify(SECTION_VALIDATION_MESSAGE);
    		if (SECTION_VALIDATION_FORMAT != null) SECTION_VALIDATION_FORMAT = JSON.stringify(SECTION_VALIDATION_FORMAT);
    		if (SECTION_VALIDATION_REGEX != null) SECTION_VALIDATION_REGEX = JSON.stringify(SECTION_VALIDATION_REGEX);
    		if (SECTION_TARGET != null) SECTION_TARGET = JSON.stringify(SECTION_TARGET);
    		if (SECTION_TABLE_NAME != null) SECTION_TABLE_NAME = JSON.stringify(SECTION_TABLE_NAME);
    		if (SECTION_COLUMN_NAME != null) SECTION_COLUMN_NAME = JSON.stringify(SECTION_COLUMN_NAME);
    		if (SECTION_VALUE_SOURCE != null) SECTION_VALUE_SOURCE = `
      if (input) input.value = request.session['${SECTION_VALUE_SOURCE_SESSION_NAME}'];
`;

    		if (code == '') code = MERGING_BOILERPLATE;
    		
        if (templateCode == TemplateCode.Controller && code.indexOf(SECTION_BEGIN_BEGIN) == -1) {
            code = code.replace(SUB_MERGE_END_BEGIN,
`${SECTION_BEGIN_BEGIN}
		RequestHelper.registerInput('${SECTION_GUID}', ${SECTION_TARGET}, ${SECTION_TABLE_NAME}, ${SECTION_COLUMN_NAME});
		ValidationHelper.registerInput('${SECTION_GUID}', ${SECTION_NAME}, ${!!SECTION_REQUIRED}, ${SECTION_VALIDATION_MESSAGE}, ${SECTION_VALIDATION_FORMAT}, ${SECTION_VALIDATION_REGEX});
    for (let input of RequestHelper.getInputs(this.pageId, request, '${SECTION_GUID}')) {${SECTION_VALUE_SOURCE || ''}${SECTION_BEGIN_END}${info['internal-fsb-data-code'] || SECTION_BODY}${SECTION_END_BEGIN}
      if (input != null) data.push(input);
    }
${SECTION_END_END}
${SUB_MERGE_END_BEGIN}`);
        } else if (templateCode == TemplateCode.Worker || templateCode == TemplateCode.Connector) {
        		code = code.replace(SUB_MERGE_END_BEGIN,
`${SECTION_BEGIN_BEGIN}
		RequestHelper.registerInput('${SECTION_GUID}', ${SECTION_TARGET}, ${SECTION_TABLE_NAME}, ${SECTION_COLUMN_NAME});
		ValidationHelper.registerInput('${SECTION_GUID}', ${SECTION_NAME}, ${!!SECTION_REQUIRED}, ${SECTION_VALIDATION_MESSAGE}, ${SECTION_VALIDATION_FORMAT}, ${SECTION_VALIDATION_REGEX});
    for (let input of RequestHelper.getInputs(this.pageId, request, '${SECTION_GUID}')) {${SECTION_VALUE_SOURCE || ''}${SECTION_BEGIN_END}${info['internal-fsb-data-code'] || SECTION_BODY}${SECTION_END_BEGIN}
      if (input != null) data.push(input);
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
	  },
		generateConnectorCode: (info: any) => {
				return BackEndScriptHelper.generateScriptCode(info, FULL_CONNECTOR_BOILERPLATE, CONNECTOR_DEFAULTS, TemplateCode.Connector);
		},
		generateWorkerCode: (info: any) => {
				return BackEndScriptHelper.generateScriptCode(info, FULL_WORKER_BOILERPLATE, WORKER_DEFAULTS, TemplateCode.Worker);
		},
		generateSchedulerCode: (info: any) => {
				return BackEndScriptHelper.generateScriptCode(info, FULL_SCHEDULER_BOILERPLATE, SCHEDULER_DEFAULTS, TemplateCode.Scheduler);
		}
}

export {BackEndScriptHelper, CONTROLLER_DEFAULTS, CONNECTOR_DEFAULTS, WORKER_DEFAULTS, SCHEDULER_DEFAULTS, TemplateCode};