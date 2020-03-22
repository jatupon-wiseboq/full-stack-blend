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
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="appearance-picker">
                <div className="appearance-panel appearance-border">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["border-top"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["border-right"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["border-bottom"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["border-left"]} />
                </div>
                <div className="appearance-panel appearance-padding">
                    <FullStackBlend.Components.SizePicker additionalClassName="" watchingStyleNames={["background"]} />
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.AppearancePicker', AppearancePicker);

export {Props, State, AppearancePicker};