import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {Props, State, ExtendedDefaultState, ExtendedDefaultProps, GridPicker} from './GridPicker.js'
import {RESPONSIVE_OFFSET_REGEX} from '../../../Constants';

declare let React: any;
declare let ReactDOM: any;

let _ExtendedDefaultProps = Object.assign({}, ExtendedDefaultProps);
Object.assign(_ExtendedDefaultProps, {
    watchingClassNames: RESPONSIVE_OFFSET_REGEX,
    options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    defaultOption: 0,
    prefix: 'offset'
});

class OffsetPicker extends GridPicker {
    protected static defaultProps: Props = _ExtendedDefaultProps;
}

DeclarationHelper.declare('Components.OffsetPicker', OffsetPicker);

export {Props, State, OffsetPicker};