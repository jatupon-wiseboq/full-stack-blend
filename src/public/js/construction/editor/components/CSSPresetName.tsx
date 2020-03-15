import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Textbox.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class CSSPresetName extends Base<Props, State> {
    static defaultProps: Props = {
      watchingClassNames: [],
      watchingStyleNames: []
    }
    
    constructor() {
        super();
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Textbox />
      )
    }
}

DeclarationHelper.declare('Components.CSSPresetName', CSSPresetName);

export {Props, State, CSSPresetName};