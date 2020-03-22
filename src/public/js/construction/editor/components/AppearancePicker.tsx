import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import './SizePicker.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class AppearancePicker extends Base<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    constructor() {
        super();
    }
    
    render() {
        return (
            <div className="appearance-picker">
                <div className="appearance-panel appearance-border">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" />
                </div>
                <div className="appearance-panel appearance-padding">
                    <FullStackBlend.Components.SizePicker additionalClassName="" />
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.AppearancePicker', AppearancePicker);

export {Props, State, AppearancePicker};