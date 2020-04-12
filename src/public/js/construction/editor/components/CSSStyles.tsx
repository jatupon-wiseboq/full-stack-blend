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

class CSSStyles extends Base<Props, State> {
    constructor(props) {
        super(props);
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Tree />
      )
    }
}

DeclarationHelper.declare('Components.CSSStyles', CSSStyles);

export {Props, State, CSSStyles};