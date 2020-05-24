import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import './SwatchPicker.js';
import './GradientPicker.js';
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
    
    protected onVisibleChanged(visible: boolean, tag: any) {
        if (visible) this.refs.swatchPicker.deselect();
        
        EventHelper.setDenyForHandle('keydown', visible);
        EventHelper.setDenyForHandle('keyup', visible);
        
        this.setState({visible: visible});
    }
    
    protected colorPickerOnUpdate(rgba: string) {
        rgba = rgba || 'rgba(0, 0, 0, 1.0)';
        this.refs.swatchPicker.setCurrentSwatchColor(rgba);
        this.refs.gradientPicker.setCurrentPickerColor(rgba);
      
        perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[0],
                value: rgba
            }],
            replace: this.props.watchingStyleNames[0]
        });
    }
    
    protected colorPickerOnRequestHiding() {
        this.refs.dropdownControl.hide();
    }
    
    protected buttonOnClick(mode: string) {
        this.setState({
            mode: mode
        });
    }
    
    protected onColorPicked(color: string) {
        this.setState({
            value: color
        });
        this.refs.colorPicker.setCurrentColor(color);
        this.refs.gradientPicker.setCurrentPickerColor(color);
        
        perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[0],
                value: color
            }],
            replace: this.props.watchingStyleNames[0]
        });
    }
    
    protected gradientOnChangeSelection(color: string) {
        this.refs.swatchPicker.deselect();
        this.refs.colorPicker.setCurrentColor(color);
        this.refs.gradientPicker.setCurrentPickerColor(color);
    }
    
    render() {
        return (
            <div className={"style-picker " + this.props.additionalClassName}>
                <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={this.state.styleValues[this.props.watchingStyleNames[0]] ? 'ICON:fa fa-paint-brush' : ''} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                    <div className="section-container">
                        <div className="section-title">Background</div>
                        <div className="section-subtitle">Type</div>
                        <div className="section-body">
                            <FullStackBlend.Components.RadioButtonPicker watchingStyleNames={['-fsb-background-type']}></FullStackBlend.Components.RadioButtonPicker>
                        </div>
                        <div className="section-subtitle">Gradient</div>
                        <div className="section-body">
                            <FullStackBlend.Components.GradientPicker ref="gradientPicker" onChangeSelection={this.gradientOnChangeSelection.bind(this)} watchingStyleNames={['-fsb-background-type']}></FullStackBlend.Components.GradientPicker>
                        </div>
                        <div className="section-subtitle">Swatches</div>
                        <div className="section-body">
                            <FullStackBlend.Components.SwatchPicker ref="swatchPicker" watchingStyleNames={['-fsb-background-type']} onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
                        </div>
                        <div className="section-subtitle">Color</div>
                        <div className="section-body">
                            <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.styleValues[this.props.watchingStyleNames[0]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                        </div>
                    </div>
                </FullStackBlend.Controls.DropDownControl>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.BackgroundStylePicker', BackgroundStylePicker);

export {Props, State, BackgroundStylePicker};