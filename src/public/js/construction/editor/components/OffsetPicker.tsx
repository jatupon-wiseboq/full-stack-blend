import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import './GridPicker.js'
import {RESPONSIVE_OFFSET_REGEX} from '../../Constants.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class OffsetPicker extends FullStackBlend.Components.GridPicker<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: RESPONSIVE_OFFSET_REGEX,
        watchingStyleNames: [],
        options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        defaultOption: 0,
        prefix: 'offset'
    }
    
    constructor(props) {
        super(props);
    }
}

DeclarationHelper.declare('Components.OffsetPicker', OffsetPicker);

export {Props, State, OffsetPicker};