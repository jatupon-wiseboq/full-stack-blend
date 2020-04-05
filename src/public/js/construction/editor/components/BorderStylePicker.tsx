import {EventHelper} from '../../helpers/EventHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/ColorPicker.js';
import '../controls/DropDownList.js';
import '../controls/DropDownControl.js';
import {BORDER_STYLES_IN_DESCRIPTION, BORDER_STYLES_IN_VALUE} from '../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    borderStyleIndex: number;
    visible: boolean;
}

let colorPicker: any = null;

class BorderStylePicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, properties: {}, borderStyleIndex: 0, visible: false}
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let borderStyleIndex = BORDER_STYLES_IN_VALUE.indexOf(this.state.styleValues[this.props.watchingStyleNames[0]]);
        
        this.setState({
            borderStyleIndex: (borderStyleIndex == -1) ? 0 : borderStyleIndex
        });
    }
    
    private getRepresentedValue() {
        let status = this.state.styleValues[this.props.watchingStyleNames[0]];
        if (status) {
            return status;
        } else {
            return null;
        }
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            borderStyleIndex: index
        });
        perform('update', {
            aStyle: [{
                name: this.props.watchingStyleNames[0],
                value: BORDER_STYLES_IN_VALUE[index]
            }]
        });
    }
    
    protected onVisibleChanged(visible: boolean) {
        this.setState({visible: visible});
    }
    
    protected colorPickerOnUpdate(hex: string) {
        perform('update', {
            aStyle: [{
                name: this.props.watchingStyleNames[1],
                value: (hex != null) ? '#' + hex : null
            }],
            replace: this.props.watchingStyleNames[1]
        });
    }
    
    protected colorPickerOnRequestHiding() {
        this.refs.dropdownControl.hide();
        this.refs.borderStyleDropdownList.hide();
    }
    
    render() {
        return (
            <div className={"style-picker " + this.props.additionalClassName}>
                <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={BORDER_STYLES_IN_VALUE[this.state.borderStyleIndex]} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                    <div className="section-container">
                        <div className="section-title">Border</div>
                        <div className="section-subtitle">Border Style</div>
                        <div className="section-body">
                            <FullStackBlend.Controls.DropDownList ref="borderStyleDropdownList" customClassName="btn-secondary" options={BORDER_STYLES_IN_DESCRIPTION} autohide={false} onUpdate={this.dropdownOnUpdate.bind(this)}>
                                <div dangerouslySetInnerHTML={{__html: BORDER_STYLES_IN_DESCRIPTION[this.state.borderStyleIndex]}} style={{display: 'inline-block', width: '100px', verticalAlign: 'top'}} />
                            </FullStackBlend.Controls.DropDownList>
                        </div>
                        <div className="section-subtitle">Border Color</div>
                        <div className="section-body">
                            <FullStackBlend.Controls.ColorPicker value={this.state.styleValues[this.props.watchingStyleNames[1]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                        </div>
                    </div>
                </FullStackBlend.Controls.DropDownControl>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.BorderStylePicker', BorderStylePicker);

export {Props, State, BorderStylePicker};