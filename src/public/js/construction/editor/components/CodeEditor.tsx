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
            value: 'let x = 0;',
            placeholder: "Placeholder Text",
            theme: "ace/theme/github",
            mode: "ace/mode/typescript",
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
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
        editor.setTheme(this.state.theme);
        editor.session.setMode(this.state.mode);
    }
    onChange(newValue) {
        console.log("change", newValue);
        this.setState({
            value: newValue
        });
    }
  
    onSelectionChange(newValue, event) {
        console.log("select-change", newValue);
        console.log("select-change-event", event);
    }
  
    onCursorChange(newValue, event) {
        console.log("cursor-change", newValue);
        console.log("cursor-change-event", event);
    }
  
    onValidate(annotations) {
        console.log("onValidate", annotations);
    }
    
    render() {
      return (
        <ReactAce.default style={{position: 'absolute', width: '100%', height: '100%'}}
          placeholder={this.state.placeholder}
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
            useWorker: false,
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