import {CodeHelper} from '../../../helpers/CodeHelper';
import {EventHelper} from '../../../helpers/EventHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import './SwatchPicker';
import './GradientPicker';
import '../../controls/ColorPicker';
import '../../controls/DropDownControl';

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
    visible: false,
    color: String,
    type: String
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

class BackgroundStylePicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        let recentBackgroundType = this.state.styleValues[this.props.watchingStyleNames[1]];
        let recentGUID = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        
        if (!super.update(properties)) return;
    }
    
    protected onVisibleChanged(visible: boolean, tag: any) {
        if (visible) this.refs.swatchPicker.deselect();
        if (!visible) this.refs.gradientPicker.deselect();
        
        EventHelper.setDenyForHandle('keydown', visible);
        EventHelper.setDenyForHandle('keyup', visible);
        
        this.setState({visible: visible});
    }
    
    protected colorPickerOnUpdate(color: string) {
        color = color || 'rgba(0, 0, 0, 1.0)';
        this.refs.swatchPicker.setCurrentSwatchColor(color);
        if (this.state.styleValues[this.props.watchingStyleNames[1]] !== null) {
            this.refs.gradientPicker.setCurrentPickerColor(color);
        }
        this.state.color = color;
        
        this.performUpdate();
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
        if (this.state.styleValues[this.props.watchingStyleNames[1]] !== null) {
            this.refs.gradientPicker.setCurrentPickerColor(color);
        }
        this.state.color = color;
        
        this.performUpdate();
    }
    
    protected colorPickerOnUnset() {
        perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[0],
                value: this.state.color
            }],
            replace: this.props.watchingStyleNames[0] + ':' + this.props.watchingStyleNames[1]
        });
    }
    
    protected gradientOnSelectionChange(color: string) {
        this.refs.swatchPicker.deselect();
        this.refs.colorPicker.setCurrentColor(color);
        if (this.state.styleValues[this.props.watchingStyleNames[1]] !== null) {
            this.refs.gradientPicker.setCurrentPickerColor(color);
        }
        this.state.color = color;
        
        this.performUpdate();
    }
    
    protected gradientOnValueChange() {
        this.performUpdate();
    }
    
    private performUpdate() {
        switch (this.state.styleValues[this.props.watchingStyleNames[1]]) {
            case 'linear':
                perform('update', {
                    styles: [{
                        name: this.props.watchingStyleNames[0],
                        value: this.refs.gradientPicker.generateCSSGradientBackgroundValue(false, true)
                    }],
                    replace: this.props.watchingStyleNames[0] + ':' + this.props.watchingStyleNames[1]
                });
                break;
            case 'radial':
                perform('update', {
                    styles: [{
                        name: this.props.watchingStyleNames[0],
                        value: this.refs.gradientPicker.generateCSSGradientBackgroundValue(true, true)
                    }],
                    replace: this.props.watchingStyleNames[0] + ':' + this.props.watchingStyleNames[1]
                });
                break;
            default:
                perform('update', {
                    styles: [{
                        name: this.props.watchingStyleNames[0],
                        value: this.state.color
                    }],
                    replace: this.props.watchingStyleNames[0] + ':' + this.props.watchingStyleNames[1]
                });
                break;
        }
    }
    
    protected onTypeValueChange(value: any) {
        this.state.styleValues[this.props.watchingStyleNames[1]] = value;
        this.forceUpdate();
        this.performUpdate();
        
        window.setTimeout((() => {
            this.refs.dropdownControl.updateHeight();
        }).bind(this));
    }
    
    render() {
        let backgroundType = this.state.styleValues[this.props.watchingStyleNames[1]];
        return (
            <div className={"style-picker " + this.props.additionalClassName}>
                <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={this.state.styleValues[this.props.watchingStyleNames[0]] ? 'ICON:fa fa-paint-brush' : ''} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                    <div className="section-container">
                        <div className="section-title">Background</div>
                        <div className="section-subtitle">Type</div>
                        <div className="section-body">
                            <FullStackBlend.Components.RadioButtonPicker onValueChange={this.onTypeValueChange.bind(this)} watchingStyleNames={['-fsb-background-type']}></FullStackBlend.Components.RadioButtonPicker>
                        </div>
                        <div className="section-subtitle" style={{display: (!!backgroundType) ? 'block' : 'none'}}>Gradient</div>
                        <div className="section-body" style={{display: (!!backgroundType) ? 'block' : 'none'}}>
                            <FullStackBlend.Components.GradientPicker ref="gradientPicker" onSelectionChange={this.gradientOnSelectionChange.bind(this)} onValueChange={this.gradientOnValueChange.bind(this)} watchingStyleNames={['background', '-fsb-background-type']} watchingAttributeNames={['internal-fsb-guid']}></FullStackBlend.Components.GradientPicker>
                        </div>
                        <div className="section-subtitle">Swatches</div>
                        <div className="section-body">
                            <FullStackBlend.Components.SwatchPicker ref="swatchPicker" onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
                        </div>
                        <div className="section-subtitle">Color</div>
                        <div className="section-body">
                            <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.styleValues[this.props.watchingStyleNames[0]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onUnset={this.colorPickerOnUnset.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                        </div>
                    </div>
                </FullStackBlend.Controls.DropDownControl>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.BackgroundStylePicker', BackgroundStylePicker);

export {Props, State, BackgroundStylePicker};