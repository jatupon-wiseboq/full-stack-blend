import {CAMEL_OF_EVENTS_DICTIONARY} from '../Constants.js';

const USER_CODE_REGEX_GLOBAL = /\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]([\s\S]+?)(\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|$)/g;
const USER_CODE_REGEX_GROUP = /\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]([\s\S]+?)(\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|$)/;

const DEFAULTS = {
  Import: `

// Import additional modules here:
//
import * from '...';

`,
  Declare: `

// Declare private static variables here:
//
let x: number = 0;

`,
  Interface: `

// Declare or extend interfaces here:
//
let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  
});

`,
  ClassBegin: `
  
  // Declare class variables and functions here:
  //
  protected initialize(): void {
  }

  `,
  ClassEnd: `

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};
`
}

const FULL_BOILERPLATE = `// Auto[Import]--->
import {CodeHelper} from '../helpers/CodeHelper';
import {EventHelper} from '../helpers/EventHelper';
import {DeclarationHelper} from '../helpers/DeclarationHelper';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Base} from './Base.js';
// <---Auto[Import]// Auto[Declare]--->
declare let React: any;
declare let ReactDOM: any;
declare let pug: any;
// <---Auto[Declare]// Auto[Interface]--->
interface IProps extends IBaseProps {
  
}
interface IState extends IBaseState { 
}
// <---Auto[Interface]// Auto[ClassBegin]--->
class KlassA extends Base<IProps, IState> {
  state: IState = null;
  protected static defaultProps: IProps = DefaultProps;
  
  constructor(props) {
    super(props);
    this.state = CodeHelper.clone(DefaultState);
    
    this.initialize();
  }
  // <---Auto[ClassBegin]// Auto[ClassEnd]--->
  protected render(): any {
    return (
      pug.render(\`
      \`)
    )
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
const NO_PROPAGATION = `\n    return EventHelper.stopPropagation(event);`;

const DECLARATION_BEGIN = `DeclarationHelper.declare(`;
const DECLARATION_END = `);\n// <---Auto[ClassEnd]`;

const CLASS_BEGIN = `// Auto[ClassBegin]--->\nclass `;
const CLASS_END = ` extends Base<IProps, IState> {`;

const LOAD_BEGIN = `super(props);
    this.state = CodeHelper.clone(DefaultState);
    `;
const LOAD_END = `
    this.initialize();
  }
  // <---Auto[ClassBegin]`;

const RENDER_BEGIN = `protected render(): any {
    return (
      pug.render(\``;
const RENDER_END = `\`)
    )
  }
}
DeclarationHelper.declare(`;

var CodeGenerationHelper = {
    generateReactCode: (info: any) => {
        let klass = info['internal-fsb-react-class'] || info['internal-fsb-class'] + '_' + info['internal-fsb-guid'];
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
            let FUNCTION_BEGIN_BEGIN = `\n  // Auto[${FUNCTION_NAME}:Begin]--->`;
            let FUNCTION_BEGIN_END = `\n    // <---Auto[${FUNCTION_NAME}:Begin]`;
            let FUNCTION_END_BEGIN = `// Auto[${FUNCTION_NAME}:End]--->`;
            let FUNCTION_END_END = `\n  // <---Auto[${FUNCTION_NAME}:End]`;
            let FUNCTION_BODY = `

    // Handle the event of ${FUNCTION_COMPREHEND_NAME} here:
    // 
    
    `;
            
            if (value.event) {
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) == -1) {
                    code = code.replace(CLASS_END_BEGIN,
`${FUNCTION_BEGIN_BEGIN}
  protected ${FUNCTION_NAME}(event: HTMLEvent) {${FUNCTION_BEGIN_END}${info['internal-fsb-react-code-' + name] || FUNCTION_BODY}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
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
        
        code = `${code.split(DECLARATION_BEGIN)[0]}${DECLARATION_BEGIN}'${mode}', '${fullnamespace}', ${klass}${DECLARATION_END}${code.split(DECLARATION_END)[1]}`;
        code = `${code.split(CLASS_BEGIN)[0]}${CLASS_BEGIN}${klass}${CLASS_END}${code.split(CLASS_END)[1]}`;
        
        if (dotNotation) {
            code = `${code.split(LOAD_BEGIN)[0]}${LOAD_BEGIN}
    // Load and assign to this.state.data:
    // 
    this.load(${JSON.stringify(dotNotation)});
    
    // Make changes to this.state.data and save using:
    // 
    // this.save(${JSON.stringify(dotNotation)});
    ${LOAD_END}${code.split(LOAD_END)[1]}`;
        }
        
        code = `${code.split(RENDER_BEGIN)[0]}${RENDER_BEGIN}${info['autoGeneratedCode']}${RENDER_END}${code.split(RENDER_END)[1]}`;
        
        return [code, functionNameMapping];
    },
    generateMergingCode: (info: any) => {
        let code = '';
        let functionNameMapping = {};
        
        for (let name of Object.keys(CAMEL_OF_EVENTS_DICTIONARY)) {
            let value = info[name];
            if (value) value = JSON.parse(value);
            else value = {};
                
            let FUNCTION_NAME = CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + info['internal-fsb-class']) + '_' + info['internal-fsb-guid'];
            let FUNCTION_COMPREHEND_NAME = CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + info['internal-fsb-class']) + ' (' + info['internal-fsb-name'] + ')';
            let FUNCTION_BEGIN_BEGIN = `\n  // Auto[${FUNCTION_NAME}:Begin]--->`;
            let FUNCTION_BEGIN_END = `\n    // <---Auto[${FUNCTION_NAME}:Begin]`;
            let FUNCTION_END_BEGIN = `// Auto[${FUNCTION_NAME}:End]--->`;
            let FUNCTION_END_END = `\n  // <---Auto[${FUNCTION_NAME}:End]`;
            let FUNCTION_BODY = `

    // Handle the event of ${FUNCTION_COMPREHEND_NAME} here:
    // 
    
    `;
            
            if (value.event) {
            		if (code == '') code = MERGING_BOILERPLATE;
            	
                if (code.indexOf(FUNCTION_BEGIN_BEGIN) == -1) {
                    code = code.replace(MERGE_END_BEGIN,
`${FUNCTION_BEGIN_BEGIN}
  protected ${FUNCTION_NAME}(event: HTMLEvent) {${FUNCTION_BEGIN_END}${info['internal-fsb-react-code-' + name] || FUNCTION_BODY}${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
  }${FUNCTION_END_END}
${MERGE_END_BEGIN}`);
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

export {CodeGenerationHelper};