import {CodeHelper} from '../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;
declare let ace: any;

interface Props extends IProps {
}

interface State extends IState {
   value: string
}

const CAMEL_OF_EVENTS_DICTIONARY = {
  'onfsbclick': 'onClick', 
  'onfsbdblclick': 'onDblClick', 
  'onfsbmousedown': 'onMouseDown', 
  'onfsbmousemove': 'onMouseMove', 
  'onfsbmouseout': 'onMouseOut', 
  'onfsbmouseover': 'onMouseOver', 
  'onfsbmouseup': 'onMouseUp', 
  'onfsbmousewheel': 'onMouseWheel', 
  'onfsbwheel': 'onWheel', 
  'onfsbkeydown': 'onKeyDown', 
  'onfsbkeypress': 'onKeyPress', 
  'onfsbkeyup': 'onKeyUp', 
  'onfsbtouchstart': 'onTouchStart', 
  'onfsbtouchmove': 'onTouchMove', 
  'onfsbtouchend': 'onTouchEnd', 
  'onfsbtouchcancel': 'onTouchCancel', 
  'onfsbdrag': 'onDrag', 
  'onfsbdragend': 'onDragend', 
  'onfsbdragenter': 'onDragEnter', 
  'onfsbdragleave': 'onDragLeave', 
  'onfsbdragover': 'onDragOver', 
  'onfsbdragstart': 'onDragStart', 
  'onfsbdrop': 'onDrop', 
  'onfsbscroll': 'onScroll', 
  'onfsbblur': 'onBlur', 
  'onfsbchange': 'onChange', 
  'onfsbcontextmenu': 'onContextMenu', 
  'onfsbfocus': 'onFocus', 
  'onfsbinput': 'onInput', 
  'onfsbinvalid': 'onInvalid', 
  'onfsbreset': 'onReset', 
  'onfsbsearch': 'onSearch', 
  'onfsbselect': 'onSelect', 
  'onfsbsubmit': 'onSubmit', 
  'onfsbafterprint': 'onAfterPrint', 
  'onfsbbeforeprint': 'onBeforePrint', 
  'onfsbbeforeunload': 'onBeforeUnload', 
  'onfsberror': 'onError', 
  'onfsbhashchange': 'onHashChange', 
  'onfsbload': 'onLoad', 
  'onfsbmessage': 'onMessage', 
  'onfsboffline': 'onOffline', 
  'onfsbonline': 'onOnline', 
  'onfsbpagehide': 'onPageHide', 
  'onfsbpageshow': 'onPageShow', 
  'onfsbpopstate': 'onPopState', 
  'onfsbresize': 'onResize', 
  'onfsbstorage': 'onStorage', 
  'onfsbunload': 'onUnload', 
  'onfsbcopy': 'onCopy', 
  'onfsbcut': 'onCut', 
  'onfsbpaste': 'onPaste', 
  'onfsbabort': 'onAbort', 
  'onfsbcanplay': 'onCanplay', 
  'onfsbcanplaythrough': 'onCanplayThrough', 
  'onfsbcuechange': 'onCueChange', 
  'onfsbdurationchange': 'onDurationChange', 
  'onfsbemptied': 'onEmptied', 
  'onfsbended': 'onEnded', 
  'onfsberror': 'onError', 
  'onfsbloadeddata': 'onLoadedData', 
  'onfsbloadedmetadata': 'onLoadedMetadata', 
  'onfsbloadstart': 'onLoadStart', 
  'onfsbpause': 'onPause', 
  'onfsbplay': 'onPlay', 
  'onfsbplaying': 'onPlaying', 
  'onfsbprogress': 'onProgress', 
  'onfsbratechange': 'onRateChange', 
  'onfsbseeked': 'onSeeked', 
  'onfsbseeking': 'onSeeking', 
  'onfsbstalled': 'onStalled', 
  'onfsbsuspend': 'onSuspend', 
  'onfsbtimeupdate': 'onTimeUpdate', 
  'onfsbvolumechange': 'onVolumeChange', 
  'onfsbwaiting': 'onWaiting'
};
const CAMEL_OF_EVENTS_COUNT = Object.keys(CAMEL_OF_EVENTS_DICTIONARY).length;

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
let watchingAttributeNames = [...Object.keys(CAMEL_OF_EVENTS_DICTIONARY)];
watchingAttributeNames.push('internal-fsb-name');
watchingAttributeNames.push('internal-fsb-class');
watchingAttributeNames.push('internal-fsb-guid');
watchingAttributeNames.push('internal-fsb-react-namespace');
watchingAttributeNames.push('internal-fsb-react-class');
watchingAttributeNames.push('internal-fsb-react-id');
watchingAttributeNames.push('internal-fsb-react-mode');
watchingAttributeNames.push('internal-fsb-react-data');

Object.assign(ExtendedDefaultProps, {
  watchingAttributeNames: watchingAttributeNames
});

class ReactCodeEditor extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        
        this.state = CodeHelper.clone(Object.assign({}, DefaultState, {
            value: ''
        }));
        
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.6/');
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        if (this.state.attributeValues['internal-fsb-react-mode']) {
            let code = this.state.value;
            let klass = this.state.attributeValues['internal-fsb-react-class'] ||
                this.state.attributeValues['internal-fsb-class'] + '_' + this.state.attributeValues['internal-fsb-guid'];
            let namespace = this.state.attributeValues['internal-fsb-react-namespace'] || 'Controls';
            let fullnamespace = namespace + '.' + klass;
            let dotNotation = this.state.attributeValues['internal-fsb-react-data'] || null;
            let mode = this.state.attributeValues['internal-fsb-react-mode'];
            
            if (code == '') {
                code = `// Auto[Import]--->
import {CodeHelper} from '../helpers/CodeHelper';
import {EventHelper} from '../helpers/EventHelper';
import {DeclarationHelper} from '../helpers/DeclarationHelper';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Base} from './Base.js';
// <---Auto[Import]

// Import additional modules here:
//
import * from '...';

// Auto[Declare]--->
declare let React: any;
declare let ReactDOM: any;
// <---Auto[Declare]

// Declare private static variables here:
//
let x: number = 0;

// Auto[Interface]--->
interface IProps extends IBaseProps {
}
interface IState extends IBaseState { 
}
// <---Auto[Interface]

// Declare or extend interfaces here:
//
let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  
});

// Auto[ClassBegin]--->
class KlassA extends Base<IProps, IState> {
  state: IState = null;
  protected static defaultProps: IProps = DefaultProps;
  
  constructor(props) {
    super(props);
    this.state = CodeHelper.clone(DefaultState);
    
    super.load(${JSON.stringify(dotNotation)});
    this.initialize();
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected initialize(): void {
  }

  // Auto[ClassEnd]--->
  protected render(): any {
    return (
      pug \`
        div
      \`
    )
  }
}
DeclarationHelper.declare('${mode}', '${fullnamespace}', ${klass});
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};
`
            }
            
            for (let i=0; i<CAMEL_OF_EVENTS_COUNT; i++) {
                let name = this.props.watchingAttributeNames[i];
                
                let value = this.state.attributeValues[name];
                if (value) value = JSON.parse(value);
                else value = {};
                
                let FUNCTION_NAME = CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + this.state.attributeValues['internal-fsb-class']) + '_' + this.state.attributeValues['internal-fsb-guid'];
                let FUNCTION_COMPREHEND_NAME = CAMEL_OF_EVENTS_DICTIONARY[name].replace(/^on/, 'on' + this.state.attributeValues['internal-fsb-class']) + ' (' + this.state.attributeValues['internal-fsb-name'] + ')';
                let FUNCTION_BEGIN_BEGIN = `\n  // Auto[${FUNCTION_NAME}:Begin]--->`;
                let FUNCTION_BEGIN_END = `\n    // <---Auto[${FUNCTION_NAME}:Begin]`;
                let FUNCTION_END_BEGIN = `\n    // Auto[${FUNCTION_NAME}:End]--->`;
                let FUNCTION_END_END = `\n  // <---Auto[${FUNCTION_NAME}:End]`;
                let CLASS_END_BEGIN = `\n  // Auto[ClassEnd]--->`;
                let NO_PROPAGATION = `\n    return EventHelper.stopPropagation(event);`;
                
                if (value.event) {
                    if (code.indexOf(FUNCTION_BEGIN_BEGIN) == -1) {
                        code = code.replace(CLASS_END_BEGIN,
`${FUNCTION_BEGIN_BEGIN}
  protected ${FUNCTION_NAME}(event: HTMLEvent) {${FUNCTION_BEGIN_END}

    // Handle the event of ${FUNCTION_COMPREHEND_NAME} here:
    // 
${FUNCTION_END_BEGIN}${value['no-propagation'] ? NO_PROPAGATION : ''}
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
            }
            
            let DECLARATION_BEGIN = `DeclarationHelper.declare(`;
            let DECLARATION_END = `);\n// <---Auto[ClassEnd]`;
            
            code = `${code.split(DECLARATION_BEGIN)[0]}${DECLARATION_BEGIN}'${mode}', '${fullnamespace}', ${klass}${DECLARATION_END}${code.split(DECLARATION_END)[1]}`;
            
            let CLASS_BEGIN = `// Auto[ClassBegin]--->\nclass `;
            let CLASS_END = ` extends Base<IProps, IState> {`;
              
            code = `${code.split(CLASS_BEGIN)[0]}${CLASS_BEGIN}${klass}${CLASS_END}${code.split(CLASS_END)[1]}`;
            
            let LOAD_BEGIN = `CodeHelper.clone(DefaultState);
    
    super.load(`;
            let LOAD_END = `);
    this.initialize();
  }`;
  
            code = `${code.split(LOAD_BEGIN)[0]}${LOAD_BEGIN}${JSON.stringify(dotNotation)}${LOAD_END}${code.split(LOAD_END)[1]}`;
            
            this.state.value = code;
        } else {
            this.state.value = '';
        }
        
        let editor = ace.edit("reactEditor");
        
        editor.setValue(this.state.value);
        editor.clearSelection();
    }
    
    private onLoad() {
        console.log("loaded");
        
        window.define = ace.define;
        window.require = ace.require;
        
        let editor = ace.edit("reactEditor");
        editor.session.setMode("ace/mode/typescript");
        
        let beginRegEx = /Auto\[[0-9a-zA-Z\:_]+\]--->/;
        let endRegEx = /<---Auto\[[0-9a-zA-Z\:_]+\]/;
        
        editor.commands.on("exec", (function(e) {
            let lines = this.state.value.split('\n');
        
            if (e.command && (e.command.name == 'backspace' || e.command.name == 'insertstring')) {
                let rowCol = editor.selection.getCursor();
                let isPreventedFromEditing = false;
                
                for (let i = rowCol.row; i >= 0; i--) {
                  if (lines[i].match(endRegEx) != null) break;
                  if (lines[i].match(beginRegEx) != null) {
                    isPreventedFromEditing = true;
                    break;
                  }
                }
                for (let i = rowCol.row; i < editor.session.getLength(); i++) {
                  if (lines[i].match(beginRegEx) != null) break;
                  if (lines[i].match(endRegEx) != null) {
                    isPreventedFromEditing = true;
                    break;
                  }
                }
                
                if (rowCol.column == 0 && rowCol.row-1 >= 0 && e.command.name == 'backspace') {
                  if (lines[rowCol.row-1].match(endRegEx) != null) {
                     isPreventedFromEditing = true;
                  }
                }
                
                if (isPreventedFromEditing) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }).bind(this));
        
        editor.renderer.on('afterRender', (function() {
            let aceLines = [...document.getElementById('reactEditor').getElementsByClassName('ace_line')];
            
            for (let j=0; j<aceLines.length; j++) {
                let readonly = false;
              
                for (let i = j; i >= 0; i--) {
                    if (aceLines[i].innerText.match(endRegEx) != null) break;
                    if (aceLines[i].innerText.match(beginRegEx) != null) {
                        readonly = true;
                        break;
                    }
                }
                for (let i = j; i < aceLines.length; i++) {
                    if (aceLines[i].innerText.match(beginRegEx) != null) break;
                    if (aceLines[i].innerText.match(endRegEx) != null) {
                        readonly = true;
                        break;
                    }
                }
                
                if (aceLines[j]) {
                    aceLines[j].style.opacity = (readonly) ? 0.25 : 1.0;
                }
            }
        }).bind(this));
        
        editor.session.setUseWrapMode(true);
    }
    private onChange(value) {
        this.setState({
            value: value
        });
    }
    
    render() {
      return (
        <ReactAce.default style={{position: 'absolute', width: '100%', height: '100%'}}
          name="reactEditor"
          onLoad={this.onLoad.bind(this)}
          onChange={this.onChange.bind(this)}
          value={this.state.value}
          fontSize={12}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            useWorker: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
         }}
        />
      )
    }
}

DeclarationHelper.declare('Components.ReactCodeEditor', ReactCodeEditor);

export {Props, State, ReactCodeEditor};