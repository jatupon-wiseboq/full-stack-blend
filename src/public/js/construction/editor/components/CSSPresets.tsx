import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class CSSPresets extends Base<Props, State> {
    static defaultProps: Props = {
      watchingClassNames: [],
      watchingStyleNames: []
    }
    
    constructor() {
        super();
    }
    
    render() {
      return (
        <div>CSSPresets</div>
      )
    }
}

DeclarationHelper.declare('Components.CSSPresets', CSSPresets);

export {Props, State, CSSPresets};