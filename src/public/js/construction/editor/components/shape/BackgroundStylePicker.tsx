import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../../controls/ColorPicker.js';
import '../../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    visible: boolean;
}

let colorPicker: any = null;

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    visible: false
});

class BackgroundStylePicker extends Base<Props, State> {
    protected state: State = {};
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    protected onVisibleChanged(visible: boolean) {
        this.setState({visible: visible});
    }
    
    protected colorPickerOnUpdate(hex: string) {
        perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[0],
                value: (hex != null) ? '#' + hex : null
            }],
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