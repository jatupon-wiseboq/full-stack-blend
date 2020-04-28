import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

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
    }
    
    componentDidMount() {
        const code = ReactDOM.findDOMNode(this.refs.code);
        const worker = new Worker('/js/construction/Worker.bundle.js');
        worker.onmessage = (event) => { code.innerHTML = event.data; }
        worker.postMessage(code.textContent);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    render() {
      return (
        <div ref="code">let x = 0;</div>
      )
    }
}

DeclarationHelper.declare('Components.CodeEditor', CodeEditor);

export {Props, State, CodeEditor};