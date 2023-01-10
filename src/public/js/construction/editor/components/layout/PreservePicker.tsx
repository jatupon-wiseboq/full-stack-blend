import { FullStackBlend, DeclarationHelper } from '../../../helpers/DeclarationHelper';
import { Props, State, ExtendedDefaultState, ExtendedDefaultProps, DisplayPicker } from './DisplayPicker.js'

declare let React : any;
declare let ReactDOM : any;

let _ExtendedDefaultProps = Object.assign({}, ExtendedDefaultProps);
Object.assign(_ExtendedDefaultProps, {
  watchingClassNames: ['d-preserve-space', null, 'd-sm-preserve-space', null, 'd-md-preserve-space', null, 'd-lg-preserve-space', null, 'd-xl-preserve-space', null]
});

class PreservePicker extends DisplayPicker {
  protected static defaultProps : Props = _ExtendedDefaultProps;
}

DeclarationHelper.declare('Components.PreservePicker', PreservePicker);

export { Props, State, PreservePicker };