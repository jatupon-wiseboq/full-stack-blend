import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import './SizePicker.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class DimensionPicker extends Base<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    constructor() {
        super();
    }
    
    render() {
        return (
            <div className="dimension-picker">
                <div className="dimension-panel dimension-position">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" />
                </div>
                <div className="dimension-panel dimension-margin">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" />
                </div>
                <div className="dimension-panel dimension-border">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" />
                </div>
                <div className="dimension-panel dimension-padding">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" />
                </div>
                <div className="dimension-panel dimension-size">
                    <FullStackBlend.Components.SizePicker additionalClassName="w" />
                    <span> &times; </span>
                    <FullStackBlend.Components.SizePicker additionalClassName="h" />
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DimensionPicker', DimensionPicker);

export {Props, State, DimensionPicker};