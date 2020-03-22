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
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="dimension-picker">
                <div className="dimension-panel dimension-position">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["top"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["right"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["bottom"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["left"]} />
                </div>
                <div className="dimension-panel dimension-margin">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["margin-top"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["margin-right"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["margin-bottom"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["margin-left"]} />
                </div>
                <div className="dimension-panel dimension-border">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["border-top-width"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["border-right-width"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["border-bottom-width"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["border-left-width"]} />
                </div>
                <div className="dimension-panel dimension-padding">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["padding-top"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["padding-right"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["padding-bottom"]} />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["padding-left"]} />
                </div>
                <div className="dimension-panel dimension-size">
                    <FullStackBlend.Components.SizePicker additionalClassName="w" watchingStyleNames={["width"]} />
                    <span> &times; </span>
                    <FullStackBlend.Components.SizePicker additionalClassName="h" watchingStyleNames={["height"]} />
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DimensionPicker', DimensionPicker);

export {Props, State, DimensionPicker};