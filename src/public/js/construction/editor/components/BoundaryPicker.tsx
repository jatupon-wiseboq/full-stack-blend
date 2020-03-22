import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import './SizePicker.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class BoundaryPicker extends Base<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    constructor() {
        super();
    }
    
    render() {
        return (
            <div className="boundary-picker">
                <div className="boundary-panel boundary-position">
                    <FullStackBlend.Components.SizePicker additionalClassName="w" />
                    <span> &times; </span>
                    <FullStackBlend.Components.SizePicker additionalClassName="h" />
                </div>
                <div className="boundary-panel boundary-border">
                </div>
                <div className="boundary-panel boundary-size">
                    <FullStackBlend.Components.SizePicker additionalClassName="w" />
                    <span> &times; </span>
                    <FullStackBlend.Components.SizePicker additionalClassName="h" />
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.BoundaryPicker', BoundaryPicker);

export {Props, State, BoundaryPicker};