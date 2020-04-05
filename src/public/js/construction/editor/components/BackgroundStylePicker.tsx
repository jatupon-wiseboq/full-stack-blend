import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/ColorPicker.js';
import '../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    visible: boolean;
}

let colorPicker: any = null;

class BackgroundStylePicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, properties: {}, visible: false}
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    protected onVisibleChanged(visible: boolean) {
        this.setState({visible: visible});
    }
    
    protected colorPickerOnUpdate(hex: string) {
        perform('update', {
            aStyle: {
                name: this.props.watchingStyleNames[0],
                value: (hex != null) ? '#' + hex : null
            },
            replace: this.props.watchingStyleNames[0]
        });
    }
    
    protected colorPickerOnRequestHiding() {
        this.refs.dropdownControl.hide();
    }
    
    render() {
        return (
            <div className={"style-picker " + this.props.additionalClassName}>
                <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={this.state.styleValues[this.props.watchingStyleNames[0]]} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                    <div className="section-container">
                        <div className="section-title">Background</div>
                        <div className="section-subtitle">Color</div>
                        <div className="section-body">
                            <FullStackBlend.Controls.ColorPicker value={this.state.styleValues[this.props.watchingStyleNames[0]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                        </div>
                    </div>
                </FullStackBlend.Controls.DropDownControl>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.BackgroundStylePicker', BackgroundStylePicker);

export {Props, State, BackgroundStylePicker};