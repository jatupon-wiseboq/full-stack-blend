import {CAMEL_OF_EVENTS_DICTIONARY, CUSTOM_EVENT_TYPE_OF_CAMEL_OF_EVENTS, USER_CODE_REGEX_GLOBAL, USER_CODE_REGEX_GROUP, SYSTEM_CODE_REGEX_BEGIN_GLOBAL, SYSTEM_CODE_REGEX_END_GLOBAL, FORWARD_PROPS_AND_EVENTS_TO_CHILDREN_CLASS_LIST} from '../Constants';

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
interface IProps extends IAutoBaseProps {
  
}
interface IState extends IAutoBaseState { 
}

let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  
});

`,
  ClassBegin: `
  
  // Declare class variables and functions here:
  //
  protected initialize(): void {
    // This is an example of creating a static collection and use in data binding:
    // 
    /* this.state.data = this.state.data || this.props.data || window.data || {};
    const staticCollection: HierarchicalDataTable = {
      source: SourceType.Collection,
      group: 'collection',
      rows: [{
        keys: {...}
        columns: {...}
        relations: {...}
      },
      ...]
    };
    this.state.data['collection'] = staticCollection; */
    //
    // Don't forget to create the mockup's schemata in Explore / Data.
    // 
  }
  
  protected componentDidMount(): void {
  	this.register();
  }
  
  protected componentWillUnmount(): void {
  }
  
  protected componentWillReceiveProps(nextProps: any): void {
    // This is an example of creating a dynamic collection and use in data binding:
    // 
    /* this.state.data = this.state.data || this.props.data || window.data || {};
    const dynamicCollection: HierarchicalDataTable = {
      source: SourceType.Collection,
      group: 'collection',
      rows: nextProps.items.map((item) => {
        return {
          keys: {...}
          columns: {...}
          relations: {...}
        };
      })
    };
    this.state.data['collection'] = dynamicCollection; */
    //
    // Don't forget to create the mockup's schemata in Explore / Data.
    // 
  }
  
  // Providing data array base on dot notation:
  // 
  protected getDataFromNotation(notation: string, inArray: boolean=false, always: boolean=false): any {
    // Redirect the target by overriding the notation value, for example:
    // 
    // notation = \`collection[\${notation.split(',')[1]}].collection\`;
    //
    
    return super.getDataFromNotation(notation, inArray, always);
  }
  `,
  ClassEnd: `

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};
`
}

const FULL_BOILERPLATE = `// Auto[File]--->// <---Auto[File]
// Auto[Import]--->
import {Project as $Project, DeclarationHelper} from '../helpers/DeclarationHelper';
import {CodeHelper} from '../helpers/CodeHelper';
import {EventHelper} from '../helpers/EventHelper';
import {HTMLHelper} from '../helpers/HTMLHelper';
import {AnimationHelper} from '../helpers/AnimationHelper';
import {TestHelper} from '../helpers/TestHelper';
import {SourceType, HierarchicalDataTable, HierarchicalDataRow} from '../helpers/DataManipulationHelper';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Button as $Button, Base as $Base} from './Base';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]// Auto[Declare]--->

declare let React: any;
declare let ReactDOM: any;
declare let window: any;
declare let DataManipulationHelper: any;
declare let pug: any;

let Button = $Button;
let Project = $Project;

/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}*/
// <---Auto[Declare]// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
}*/
interface IAutoBaseProps extends IBaseProps {
  forward: {classes: String, styles: any};
}
interface IAutoBaseState extends IBaseState {
}
// <---Auto[Interface]// Auto[ClassBegin]--->
class KlassA extends Base {
  state: IState = null;
  protected static defaultProps: IProps = DefaultProps;
  
  constructor(props) {
    super(props);
    this.state = CodeHelper.clone(DefaultState);
    
    this.initialize();
  }
  
  register() {
  }
  // <---Auto[ClassBegin]
  
  // Auto[Merging]--->
  // <---Auto[Merging]
  
  // Auto[ClassEnd]--->
  protected render(): any {
    TestHelper.identify();
    return pug \`
    \`
  }
}
DeclarationHelper.declare();
// <---Auto[ClassEnd]`;

const MERGING_BOILERPLATE = `// Auto[Merging:Begin]--->
// <---Auto[Merging:Begin]

// Auto[Merging:End]--->
// <---Auto[Merging:End]`;

const CLASS_END_BEGIN = `\n  // Auto[ClassEnd]--->`;
const MERGE_END_BEGIN = `\n// Auto[Merging:End]--->`;
const NO_PROPAGATION = `\n    return EventHelper.cancel(event);`;

const DECLARATION_BEGIN = `DeclarationHelper.declare(`;
const DECLARATION_END = `);\n// <---Auto[ClassEnd]`;

const CLASS_BEGIN = `// Auto[ClassBegin]--->\nclass `;
const CLASS_END = ` extends Base {`;

const LOAD_BEGIN = `super(props);
    this.state = CodeHelper.clone(DefaultState);
    `;
const LOAD_END = `
  }
  // <---Auto[ClassBegin]`;

const RENDER_BEGIN = `protected render(): any {
    TestHelper.identify();
    return pug \``;
const RENDER_END = `
    \`
  }
}
DeclarationHelper.declare(`;
const FILE_BEGIN = `// Auto[File]--->`;
const FILE_END = `// <---Auto[File]`;

// This code generator doesn't rely on elements in construction area and use in both
// construction area and editor.
// 
var FrontEndReactHelper = {
    generateReactCode: (info: any, previewReactClassName: string=null) => {
        let klass = previewReactClassName || info['internal-fsb-react-class'] || info['internal-fsb-class'] + '_' + info['internal-fsb-guid'];
        let namespace = info['internal-fsb-react-namespace'] || 'Project.Controls';
        let fullnamespace = namespace + '.' + klass;
        let dotNotation = info['internal-fsb-react-data'] || null;
        let mode = info['internal-fsb-react-mode'];
        
        let code = FULL_BOILERPLATE;
        code = code.replace('// <---Auto[Import]', '// <---Auto[Import]' + (info['internal-fsb-react-code-import'] || DEFAULTS.Import));
        code = code.replace('// <---Auto[Declare]', '// <---Auto[Declare]' + (info['internal-fsb-react-code-declare'] || DEFAULTS.Declare));
        code = code.replace('// <---Auto[Interface]', '// <---Auto[Interface]' + (info['internal-fsb-react-code-interface'] || DEFAULTS.Interface));
        code = code.replace('// <---Auto[ClassBegin]', '// <---Auto[ClassBegin]' + (info['internal-fsb-react-code-body'] || DEFAULTS.ClassBegin));
        code = code.replace('// <---Auto[ClassEnd]', '// <---Auto[ClassEnd]' + (info['internal-fsb-react-code-footer'] || DEFAULTS.ClassEnd));
        
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
            
            if (value.event) {
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) == -1) {
                    code = code.replace(CLASS_END_BEGIN,
`${FUNCTION_BEGIN_BEGIN}
  protected ${FUNCTION_NAME}(event: ${FUNCTION_EVENT_TYPE}) {${FUNCTION_BEGIN_END}${info['internal-fsb-react-code-' + name] || FUNCTION_BODY}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}
${CLASS_END_BEGIN}`);
                } else {
                    code = `${code.split(FUNCTION_END_BEGIN)[0]}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}${code.split(FUNCTION_END_END)[1]}`;
                }
            } else {
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) != -1) {
                    code = code.split(FUNCTION_BEGIN_BEGIN)[0] + code.split(FUNCTION_END_END + '\n')[1];
                }
            }
            
            functionNameMapping[`${FUNCTION_NAME}:Begin`] = 'internal-fsb-react-code-' + name;
        }
        
        code = code.replace('// Auto[Merging]--->\n', '// Auto[Merging]--->' + (info['autoGeneratedCodeForMergingRenderMethod'][1] || '\n'));
        
        code = `${code.split(DECLARATION_BEGIN)[0]}${DECLARATION_BEGIN}'${mode}', '${fullnamespace.replace(/^Project\./, '')}', ${klass}${DECLARATION_END}${code.split(DECLARATION_END)[1]}`;
        code = `${code.split(CLASS_BEGIN)[0]}${CLASS_BEGIN}${klass}${CLASS_END}${code.split(CLASS_END)[1]}`;
        
        /*if (dotNotation) {
            code = `${code.split(LOAD_BEGIN)[0]}${LOAD_BEGIN}
    // Load and assign to this.state.data:
    // 
    this.load(${JSON.stringify(dotNotation)});
    
    // Make changes to this.state.data and save using:
    // 
    // this.save(${JSON.stringify(dotNotation)});
    ${LOAD_END}${code.split(LOAD_END)[1]}`;
        }*/
        
        code = `${code.split(LOAD_END)[0]}${info['autoGeneratedCodeForRenderMethod'][0]}${LOAD_END}${code.split(LOAD_END)[1]}`;
        code = `${code.split(RENDER_BEGIN)[0]}${RENDER_BEGIN}${info['autoGeneratedCodeForRenderMethod'][1]}${RENDER_END}${code.split(RENDER_END)[1]}`;
        
        if (previewReactClassName != null) {
        		code = `${code}

// Auto[Export]--->
export {${previewReactClassName}};
// <---Auto[Export]`;
        }
        
        code = `${code.split(FILE_END)[0]}
${fullnamespace}
${FILE_END}${code.split(FILE_END)[1]}`;
        
        return [code, functionNameMapping];
    },
    generateMergingCode: (info: any, executions: string[], removeAutoGeneratingWarning: boolean=false) => {
        let code = '';
        let functionNameMapping = {};
        
        for (let name of Object.keys(CAMEL_OF_EVENTS_DICTIONARY)) {
            let value = info[name];
            if (value) value = JSON.parse(value);
            else value = {};
                
            let FUNCTION_NAME = (info['internal-fsb-class']) ?
            	CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + info['internal-fsb-class']) + '_' + info['internal-fsb-guid'] :
            	CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'onDocument');
            let FUNCTION_COMPREHEND_NAME = (info['internal-fsb-class']) ?
            	CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + info['internal-fsb-class']) + ' (' + info['internal-fsb-name'] + ')' :
            	CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'onDocument');
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
            
            if (value.event) {
            		if (code == '') code = MERGING_BOILERPLATE;
            		
            		let target = null;
            		if (value['animation-at-element']) {
            			const custom = info[name.replace('onfsb', 'internal-fsb-targeting-')] || null;
            			target = (custom) ? `HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '${custom}')` : 'EventHelper.getCurrentElement(event)';
            		} else {
            			target = 'undefined';
            		}
            	
            		let ACTIVE_ANIMATION = '';
            		if (value['add-animation-tracks']) {
            				ACTIVE_ANIMATION += `\n    AnimationHelper.add(${JSON.stringify(value['add-animation-tracks'])}, ${target});`;
            		}
            		if (value['remove-animation-tracks']) {
            				ACTIVE_ANIMATION += `\n    AnimationHelper.remove(${JSON.stringify(value['remove-animation-tracks'])}, ${target});`;
            		}
            		
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) == -1) {
                    code = code.replace(MERGE_END_BEGIN,
`${FUNCTION_BEGIN_BEGIN}
  protected ${FUNCTION_NAME}(event: ${FUNCTION_EVENT_TYPE}) {${FUNCTION_BEGIN_END}${info['internal-fsb-react-code-' + name] || FUNCTION_BODY}${FUNCTION_END_BEGIN}${ACTIVE_ANIMATION}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}
${MERGE_END_BEGIN}`);
                } else {
                    code = `${code.split(FUNCTION_END_BEGIN)[0]}${FUNCTION_END_BEGIN}${ACTIVE_ANIMATION}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}${code.split(FUNCTION_END_END)[1]}`;
                }
                
                if (executions) {
                		executions.push(`controller.register('${info['internal-fsb-guid']}', '${CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, '').toLowerCase()}', '${FUNCTION_NAME}', ${!!value['capture']}, ${(FORWARD_PROPS_AND_EVENTS_TO_CHILDREN_CLASS_LIST.indexOf(info['internal-fsb-class']) != -1) ? 'true' : 'false'});`);
                }
            } else {
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) != -1) {
                    code = code.split(FUNCTION_BEGIN_BEGIN)[0] + code.split(FUNCTION_END_END + '\n')[1];
                }
            }
            
            functionNameMapping[`${FUNCTION_NAME}:Begin`] = 'internal-fsb-react-code-' + name;
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
};

export {FrontEndReactHelper, DEFAULTS};