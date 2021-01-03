import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;
declare let Console: any;
declare let window: any;

interface Props extends IProps {
}

interface State extends IState {
    value: any
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

class DebuggingConsole extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    private repl: Console = null;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    componentDidMount() {
        this.repl = new Console(document.getElementById('console'), {mode: "javascript", theme: "eclipse"});
        
        this.repl.simpleFormatter = ((msg, ...args) => {
          let output = [msg && msg.toString() || ''];
          for (let arg of args) {
            output.push(arg && arg.toString() || '');
          }
          return output.join(', ');
        });
        
        window.error = ((msg, url, line, col, error) => {
          window.setTimeout(() => {
            $('#codingButton')[0].click();
            $('#footerConsole')[0].click();
          }, 0);
          window.repl.print(`${msg} (line: ${line}, col: ${col}) ${url}`, 'type-error');
        });
        window.onerror = window.error;
        
        window.console.log = ((...args) => {
        	window.repl.print(window.repl.simpleFormatter(...args), 'message');
        });
        window.console.error = ((...args) => {
          window.setTimeout(() => {
            $('#codingButton')[0].click();
            $('#footerConsole')[0].click();
          }, 0);
	        window.repl.print(window.repl.simpleFormatter(...args), 'type-error');
        });
        
        let output = document.createElement('div');
        output.className = 'jsconsole eclipse';
        output.append(HTMLHelper.getElementByClassName('jsconsole-input'));
        document.body.append(output);
        
        window.repl = this.repl;
        window.repl.on('entry', (event) => {
          window.setTimeout(() => {
            $('#codingButton')[0].click();
            $('#footerConsole')[0].click();
          }, 0);
        });
        window.setTimeout(() => {
          window.repl.output.focus();
        }, 10);
        window.setTimeout(() => {
          window.repl.input.focus();
          window.repl.resetInput();
        }, 20);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    render() {
        return (
            <div id="console-container">
                <div id="console">
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DebuggingConsole', DebuggingConsole);

export {Props, State, DebuggingConsole};