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
                    <FullStackBlend.Components.SizePicker additionalClassName="t" target="top" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" target="right" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" target="bottom" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" target="left" />
                </div>
                <div className="dimension-panel dimension-margin">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" target="margin-top" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" target="margin-right" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" target="margin-bottom" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" target="margin-left" />
                </div>
                <div className="dimension-panel dimension-border">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" target="border-top-width" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" target="border-right-width" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" target="border-bottom-width" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" target="border-left-width" />
                </div>
                <div className="dimension-panel dimension-padding">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" target="padding-top" />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" target="padding-right" />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" target="padding-bottom" />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" target="padding-left" />
                </div>
                <div className="dimension-panel dimension-size">
                    <FullStackBlend.Components.SizePicker additionalClassName="w" target="width" />
                    <span> &times; </span>
                    <FullStackBlend.Components.SizePicker additionalClassName="h" target="height" />
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DimensionPicker', DimensionPicker);

export {Props, State, DimensionPicker};