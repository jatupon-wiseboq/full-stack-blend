import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import './SizePicker.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class DimensionPicker extends Base<Props, State> {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="dimension-picker">
                <div className="dimension-panel dimension-position internal-fsb-selecting-on">
                    <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["top"]} watchingAttributeNames={['internal-fsb-react-style-top']} />
                    <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["right"]} watchingAttributeNames={['internal-fsb-react-style-right']} />
                    <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["bottom"]} watchingAttributeNames={['internal-fsb-react-style-bottom']} />
                    <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["left"]} watchingAttributeNames={['internal-fsb-react-style-left']} />
                </div>
                <div className="hover-container">
                		<div className="hover-body">
		                    <div className="dimension-panel dimension-margin internal-fsb-selecting-on">
		                        <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["margin-top"]} watchingAttributeNames={['internal-fsb-react-style-margin-top']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["margin-right"]} watchingAttributeNames={['internal-fsb-react-style-margin-right']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["margin-bottom"]} watchingAttributeNames={['internal-fsb-react-style-margin-bottom']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["margin-left"]} watchingAttributeNames={['internal-fsb-react-style-margin-left']} />
		                    </div>
		                    <div className="dimension-panel dimension-border internal-fsb-selecting-on">
		                        <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["border-top-width"]} watchingAttributeNames={['internal-fsb-react-style-border-top-width']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["border-right-width"]} watchingAttributeNames={['internal-fsb-react-style-border-right-width']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["border-bottom-width"]} watchingAttributeNames={['internal-fsb-react-style-border-bottom-width']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["border-left-width"]} watchingAttributeNames={['internal-fsb-react-style-border-left-width']} />
		                    </div>
		                    <div className="dimension-panel dimension-padding">
		                        <FullStackBlend.Components.SizePicker additionalClassName="t" watchingStyleNames={["padding-top"]} watchingAttributeNames={['internal-fsb-react-style-padding-top']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="r" watchingStyleNames={["padding-right"]} watchingAttributeNames={['internal-fsb-react-style-padding-right']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="b" watchingStyleNames={["padding-bottom"]} watchingAttributeNames={['internal-fsb-react-style-padding-bottom']} />
		                        <FullStackBlend.Components.SizePicker additionalClassName="l" watchingStyleNames={["padding-left"]} watchingAttributeNames={['internal-fsb-react-style-padding-left']} />
		                    </div>
		                    <div className="dimension-panel dimension-size">
		                        <FullStackBlend.Components.SizePicker additionalClassName="w" watchingStyleNames={["width"]} watchingAttributeNames={['internal-fsb-react-style-width']} />
		                        <span> &times; </span>
		                        <FullStackBlend.Components.SizePicker additionalClassName="h" watchingStyleNames={["height"]} watchingAttributeNames={['internal-fsb-react-style-height']} />
		                    </div>
		                </div>
                </div>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DimensionPicker', DimensionPicker);

export {Props, State, DimensionPicker};