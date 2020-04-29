import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;
declare let ace: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

class CodeEditor extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        
        this.state = {
            value:
`// Auto generated code will begin and end with // Auto[*]---> and // <---Auto[*], respectively.
//
// Auto[Import]--->
import {CodeHelper} from '../helpers/CodeHelper';
import {DeclarationHelper} from '../helpers/DeclarationHelper';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Base} from './Base.js';
// <---Auto[Import]

// Import additional modules here:
//
import * from '...'

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
DeclarationHelper.declare('Demo.KlassA', KlassA);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState, KlassA};
`,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            fontSize: 12,
            showGutter: true,
            showPrintMargin: true,
            highlightActiveLine: true,
            enableSnippets: false,
            showLineNumbers: true
        };
        
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.11/');
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    onLoad() {
        console.log("loaded");
        
        window.define = ace.define;
        window.require = ace.require;
        
        let editor = ace.edit("reactEditor");
        editor.setTheme("ace/theme/github");
        editor.session.setMode("ace/mode/typescript");
        
        let beginRegEx = /Auto\[[a-zA-Z]+\]--->/;
        let endRegEx = /<---Auto\[[a-zA-Z]+\]/;
        
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
                if (rowCol.row <= 1) {
                  isPreventedFromEditing = true;
                }
                
                if (isPreventedFromEditing) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }).bind(this));
        
        editor.renderer.on('afterRender', function() {
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
                
                if (j <= 1) readonly = true;
                
                if (aceLines[j]) {
                    aceLines[j].style.opacity = (readonly) ? 0.15 : 1.0;
                }
            }
        });
    }
    onChange(value) {
        this.setState({
            value: value
        });
    }
  
    onSelectionChange(newValue, event) {
    }
  
    onCursorChange(newValue, event) {
    }
  
    onValidate(annotations) {
    }
    
    render() {
      return (
        <ReactAce.default style={{position: 'absolute', width: '100%', height: '100%'}}
          name="reactEditor"
          onLoad={this.onLoad.bind(this)}
          onChange={this.onChange.bind(this)}
          onSelectionChange={this.onSelectionChange.bind(this)}
          onCursorChange={this.onCursorChange.bind(this)}
          onValidate={this.onValidate.bind(this)}
          value={this.state.value}
          fontSize={this.state.fontSize}
          showPrintMargin={this.state.showPrintMargin}
          showGutter={this.state.showGutter}
          highlightActiveLine={this.state.highlightActiveLine}
          setOptions={{
            useWorker: true,
            enableBasicAutocompletion: this.state.enableBasicAutocompletion,
            enableLiveAutocompletion: this.state.enableLiveAutocompletion,
            enableSnippets: this.state.enableSnippets,
            showLineNumbers: this.state.showLineNumbers,
            tabSize: 2
         }}
        />
      )
    }
}

DeclarationHelper.declare('Components.CodeEditor', CodeEditor);

export {Props, State, CodeEditor};