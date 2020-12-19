import {EventHelper} from '../../../helpers/EventHelper';
import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/ColorPicker';
import '../../controls/DropDownControl';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    inline: boolean,
    manual: boolean
}

interface State extends IState {
    value: any,
    visible: boolean
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    value: null,
    visible: false
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    inline: false,
    manual: false
});

class ColorPicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        this.state.value = original || null;
        
        this.forceUpdate();
    }
    
    protected colorPickerOnUpdate(rgba: any) {
        rgba = rgba || 'rgba(0, 0, 0, 1.0)';
        
        this.state.value = rgba;
        this.refs.swatchPicker.setCurrentSwatchColor(rgba);
      	
      	if (!this.props.manual) {
	        perform('update', {
	            styles: [{
	                name: this.props.watchingStyleNames[0].split('[')[0],
	                value: rgba
	            }],
	            replace: this.props.watchingStyleNames[0]
	        });
	      }
    }
    
    protected onVisibleChanged(visible: boolean, tag: any) {
        if (visible) this.refs.swatchPicker.deselect();
        
        this.setState({
            visible: visible
        });
    }
    
    protected colorPickerOnRequestHiding() {
        this.refs.dropdownControl.hide();
    }
    
    public getValue() {
        return this.state.value;
    }
    
    public hide() {
    }
    
    protected onColorPicked(color: string) {
        this.setState({
            value: color
        });
        this.refs.colorPicker.setCurrentColor(color);
        
        if (!this.props.manual) {
	        perform('update', {
	            styles: [{
	                name: this.props.watchingStyleNames[0].split('[')[0],
	                value: color
	            }],
	            replace: this.props.watchingStyleNames[0]
	        });
	      }
    }
    
    render() {
        if (this.props.inline) {
            return (
                <div className="input-group inline" internal-fsb-event-no-propagate="click">
                    <div className="btn btn-secondary btn-sm" internal-fsb-event-no-propagate="click" style={{flex: 'auto'}}>
                        <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={this.state.value} autohide={false} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                            <div className="section-container">
                                <div className="section-subtitle">Swatches</div>
                                <div className="section-body">
                                    <FullStackBlend.Components.SwatchPicker ref="swatchPicker" watchingStyleNames={['-fsb-background-type']} onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
                                </div>
                                <div className="section-subtitle">Color</div>
                                <div className="section-body">
                                    <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.value} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                                </div>
                            </div>
                        </FullStackBlend.Controls.DropDownControl>
                    </div>
                    <div className="input-group-append">
                        <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
                            <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="btn-group btn-group-sm mr-1 mb-1" role="group">
                    <button className={"btn btn-light color-picker p-0 " + this.props.additionalClassName}>
                        <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={"<div style=\"width: 36px; height: 28px; padding: 4px 8px;\"><div style=\"width: 20px; height: 20px; background-color: " + this.state.value + "; \" /></div>"} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                             <div className="section-container">
                                <div className="section-subtitle">Swatches</div>
                                <div className="section-body">
                                    <FullStackBlend.Components.SwatchPicker ref="swatchPicker" watchingStyleNames={['-fsb-background-type']} onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
                                </div>
                                <div className="section-subtitle">Color</div>
                                <div className="section-body">
                                    <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.styleValues[this.props.watchingStyleNames[0]]}  visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                                </div>
                            </div>
                        </FullStackBlend.Controls.DropDownControl>
                    </button>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.ColorPicker', ColorPicker);

export {Props, State, ColorPicker}; 