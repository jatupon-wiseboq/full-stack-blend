import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {EventHelper} from '../../../helpers/EventHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;
declare let Console: any;
declare let window: any;

interface Props extends IProps {
    window: any
}

interface State extends IState {
    value: any,
    containerId: string
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    window: window
});

class DebuggingConsole extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    private repl: any = null;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
        
        this.state.containerId = 'console-' + Math.random();
    }
    
    componentDidMount() {
        const repl = new Console(document.getElementById(this.state.containerId), {mode: "javascript", theme: "eclipse"});
        
        repl.simpleFormatter = ((msg, ...args) => {
          let output = [msg && msg.toString() || ''];
          for (let arg of args) {
            output.push(arg && arg.toString() || '');
          }
          return output.join(', ');
        });
        this.repl = repl;
        
        if (this.props.window == window) {
        	window.repl = repl;
        	
          this.props.window.error = ((msg, url, line, col, error) => {
            this.props.window.setTimeout(() => {
              $('#codingButton')[0].click();
              $('#footerConsole')[0].click();
            }, 0);
            repl.print(`${msg} (line: ${line}, col: ${col}) ${url}`, 'type-error');
          });
          this.props.window.onerror = this.props.window.error;
          
          this.props.window.console.log = ((...args) => {
          	repl.print(this.props.window.repl.simpleFormatter(...args), 'message');
          });
          this.props.window.console.error = ((...args) => {
            this.props.window.setTimeout(() => {
              $('#codingButton')[0].click();
              $('#footerConsole')[0].click();
            }, 0);
  	        repl.print(this.props.window.repl.simpleFormatter(...args), 'type-error');
          });
          
          let output = document.createElement('div');
          output.className = 'jsconsole eclipse';
          output.append(HTMLHelper.getElementByClassName('jsconsole-input'));
          document.body.append(output);
        	
          repl.on('entry', (event) => {
            this.props.window.setTimeout(() => {
              $('#codingButton')[0].click();
              $('#footerConsole')[0].click();
            }, 0);
          });
          this.props.window.setTimeout(() => {
            repl.output.focus();
          }, 10);
          this.props.window.setTimeout(() => {
            repl.input.focus();
            repl.resetInput();
          }, 20);
        } else {
        	repl.evaluate = (code: any) => {
		        var out = {};
		        out.completionValue = 'executed';
		        return out;
		      };
        
          top.addEventListener("message", ((event: any) => {
            let data = null;
            try {
              data = JSON.parse(event.data);
            } catch { /*void*/ }
            
            switch (data.type) {
              case 'error':
                repl.print(`${data.msg} (line: ${data.line}, col: ${data.col}) ${data.url}`, 'type-error');
                break;
              case 'console.log':
                repl.print(repl.simpleFormatter(...data.args), 'message');
                break;
              case 'console.error':
                repl.print(repl.simpleFormatter(...data.args), 'type-error');
                break;
            }
            
            repl.on('entry', (event) => {
              this.props.window.postMessage(JSON.stringify({
          	    type: 'execute',
          	    statement: event.input
          	  }), '*');
            });
          }).bind(this));
        }
    }
    
    public reset() {
    		this.repl.resetOutput();
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    render() {
        return (
            <div className="console-container">
                <div className="console" id={this.state.containerId}>
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DebuggingConsole', DebuggingConsole);

export {Props, State, DebuggingConsole};