import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import './DisplayPicker.js'

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class PreservePicker extends FullStackBlend.Controls.DisplayPicker<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: ['d-preserve-space', null, 'd-sm-preserve-space', null, 'd-md-preserve-space', null, 'd-lg-preserve-space', null],
        watchingStyleNames: [],
    }
    
    constructor() {
        super();
    }
}

DeclarationHelper.declare('Controls.PreservePicker', PreservePicker);

export {Props, State, PreservePicker};