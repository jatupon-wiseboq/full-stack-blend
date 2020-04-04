import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {Props, State, DisplayPicker} from './DisplayPicker.js'

declare let React: any;
declare let ReactDOM: any;

class PreservePicker extends DisplayPicker {
    static defaultProps: Props = {
        watchingClassNames: ['d-preserve-space', null, 'd-sm-preserve-space', null, 'd-md-preserve-space', null, 'd-lg-preserve-space', null],
        watchingStyleNames: [],
    }
}

DeclarationHelper.declare('Components.PreservePicker', PreservePicker);

export {Props, State, PreservePicker};