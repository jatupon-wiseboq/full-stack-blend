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
    
    private repl: Console = null;
    
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
        
        if (this.props.window == window) {
          this.props.window.error = ((msg, url, line, col, error) => {
            this.props.window.setTimeout(() => {
              $('#codingButton')[0].click();
              $('#footerConsole')[0].click();
            }, 0);
            this.props.window.repl.print(`${msg} (line: ${line}, col: ${col}) ${url}`, 'type-error');
          });
          this.props.window.onerror = this.props.window.error;
          
          this.props.window.console.log = ((...args) => {
          	this.props.window.repl.print(this.props.window.repl.simpleFormatter(...args), 'message');
          });
          this.props.window.console.error = ((...args) => {
            this.props.window.setTimeout(() => {
              $('#codingButton')[0].click();
              $('#footerConsole')[0].click();
            }, 0);
  	        this.props.window.repl.print(this.props.window.repl.simpleFormatter(...args), 'type-error');
          });
          
          let output = document.createElement('div');
          output.className = 'jsconsole eclipse';
          output.append(HTMLHelper.getElementByClassName('jsconsole-input'));
          document.body.append(output);
        
          this.props.window.repl = repl;
          this.props.window.repl.on('entry', (event) => {
            this.props.window.setTimeout(() => {
              $('#codingButton')[0].click();
              $('#footerConsole')[0].click();
            }, 0);
          });
          this.props.window.setTimeout(() => {
            this.props.window.repl.output.focus();
          }, 10);
          this.props.window.setTimeout(() => {
            this.props.window.repl.input.focus();
            this.props.window.repl.resetInput();
          }, 20);
        } else {
          top.addEventListener("message", ((event: any) => {
            let data = null;
            try {
              data = JSON.parse(event.data);
            } catch { /*void*/ }
            
            switch (data.type) {
              case 'error':
                this.props.window.repl.print(`${data.msg} (line: ${data.line}, col: ${data.col}) ${data.url}`, 'type-error');
                break;
              case 'console.log':
                this.props.window.repl.print(this.props.window.repl.simpleFormatter(...data.args), 'message');
                break;
              case 'console.error':
                this.props.window.repl.print(this.props.window.repl.simpleFormatter(...data.args), 'type-error');
                break;
            }
            
            repl.on('entry', (event) => {
              this.props.window.postMessage(JSON.stringify({
          	    type: 'execute',
          	    statement: event.detail
          	  }), '*');
              return EventHelper.cancel(event);
            });
          }).bind(this));
        }
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    render() {
        return (
            <div class="console-container">
                <div class="console" id={this.state.containerId}>
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DebuggingConsole', DebuggingConsole);

export {Props, State, DebuggingConsole};