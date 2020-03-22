import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class Transformer extends Base<Props, State> {
    static defaultProps: Props = {
      watchingClassNames: [],
      watchingStyleNames: []
    }
    
    constructor() {
        super();
    }
    
    render() {
      return (
        <div>ABC</div>
      )
    }
}

DeclarationHelper.declare('Components.Transformer', Transformer);

export {Props, State, Transformer};