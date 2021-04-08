import {CodeHelper} from '../../../helpers/CodeHelper';
import {EventHelper} from '../../../helpers/EventHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/ColorPicker';
import '../../controls/DropDownList';
import '../../controls/DropDownControl';
import {BORDER_STYLES_IN_DESCRIPTION, BORDER_STYLES_IN_VALUE} from '../../../Constants';

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

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    borderStyleIndex: 0,
    visible: false
});

class BorderStylePicker extends Base<Props, State> {
    protected state: State = {};
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
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
            styles: [{
                name: this.props.watchingStyleNames[0],
                value: BORDER_STYLES_IN_VALUE[index]
            }]
        });
    }
    
    protected onVisibleChanged(visible: boolean, tag: any) {
        if (visible) this.refs.swatchPicker.deselect();
        
        this.setState({visible: visible});
    }
    
    protected colorPickerOnUpdate(rgba: string) {
        rgba = rgba || 'rgba(0, 0, 0, 1.0)';
        this.refs.swatchPicker.setCurrentSwatchColor(rgba);
      
        perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[1],
                value: rgba
            }],
            replace: this.props.watchingStyleNames[1]
        });
    }
    
    protected colorPickerOnUnset() {
    		perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[1],
                value: null
            }],
            replace: this.props.watchingStyleNames[1]
        });
    }
    
    protected colorPickerOnRequestHiding() {
        this.refs.dropdownControl.hide();
        this.refs.borderStyleDropdownList.hide();
    }
    
    protected onColorPicked(color: string) {
        this.setState({
            value: color
        });
        this.refs.colorPicker.setCurrentColor(color);
        
        perform('update', {
            styles: [{
                name: this.props.watchingStyleNames[1],
                value: color
            }],
            replace: this.props.watchingStyleNames[1]
        });
    }
    
    render() {
    		if (this.props.inline) {
		        return (
		            <div className={"btn-group btn-group-sm mr-1 mb-1"}>
		            		<a className="btn text-center btn-light">
				                <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={'<div style="width: 90px;"><div style="border-width: 6px; border-style: ' + this.state.styleValues[this.props.watchingStyleNames[0]] + '; border-color: ' + this.state.styleValues[this.props.watchingStyleNames[1]] + '; height: 16px;"/></div>'} onVisibleChanged={this.onVisibleChanged.bind(this)}>
				                    <div className="section-container">
				                        <div className="section-title">Border</div>
				                        <div className="section-subtitle">Border Style</div>
				                        <div className="section-body">
				                            <FullStackBlend.Controls.DropDownList ref="borderStyleDropdownList" customClassName="btn-secondary" options={BORDER_STYLES_IN_DESCRIPTION} autohide={false} onUpdate={this.dropdownOnUpdate.bind(this)}>
				                                <div dangerouslySetInnerHTML={{__html: BORDER_STYLES_IN_DESCRIPTION[this.state.borderStyleIndex]}} style={{display: 'inline-block', width: '100px', verticalAlign: 'top'}} />
				                            </FullStackBlend.Controls.DropDownList>
				                        </div>
                                <div className="section-subtitle">Swatches</div>
                                <div className="section-body">
                                    <FullStackBlend.Components.SwatchPicker ref="swatchPicker" watchingStyleNames={['-fsb-background-type']} onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
                                </div>
				                        <div className="section-subtitle">Border Color</div>
				                        <div className="section-body">
				                            <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.styleValues[this.props.watchingStyleNames[1]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onUnset={this.colorPickerOnUnset.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
				                        </div>
				                    </div>
				                </FullStackBlend.Controls.DropDownControl>
				            </a>
		            </div>
		        )
		    } else {
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
                            <div className="section-subtitle">Swatches</div>
                            <div className="section-body">
                                <FullStackBlend.Components.SwatchPicker ref="swatchPicker" watchingStyleNames={['-fsb-background-type']} onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
                            </div>
		                        <div className="section-subtitle">Border Color</div>
		                        <div className="section-body">
		                            <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.styleValues[this.props.watchingStyleNames[1]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onUnset={this.colorPickerOnUnset.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
		                        </div>
		                    </div>
		                </FullStackBlend.Controls.DropDownControl>
		            </div>
		        )
		    }
    }
}

DeclarationHelper.declare('Components.BorderStylePicker', BorderStylePicker);

export {Props, State, BorderStylePicker};