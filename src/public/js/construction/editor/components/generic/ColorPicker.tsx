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
    manual: boolean,
    hexMode: boolean
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
    manual: false,
    hexMode: false
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
        
        if (this.state.visible) this.refs.dropdownControl.updateHeight();
    }
    
    protected colorPickerOnUpdate(rgba: any) {
        rgba = rgba || 'rgba(0, 0, 0, 1.0)';
        
        this.state.value = rgba;
        this.refs.swatchPicker.setCurrentSwatchColor(rgba);
      	
      	if (!this.props.manual) {
	        	if (this.props.watchingStyleNames[0].indexOf('[') != -1) {
	        			rgba = rgba && rgba.replace(/(,[ ]*)/g, ',') || rgba;
	        			
	        			let current = this.state.styleValues[this.props.watchingStyleNames[1]];
	        			current = current && current.replace(/(,[ ]*)/g, ',') || current;
	        			
	        			let composed = TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], rgba, current, '0px');
	        			composed = composed && composed.replace(/(,[ ]*)/g, ', ') || composed;
	        			
	        			perform('update', {
				            styles: [{
				                name: this.props.watchingStyleNames[0].split('[')[0],
				                value: composed
				            }],
				            replace: this.props.watchingStyleNames[0]
				        });
        		} else {
        				perform('update', {
				            styles: [{
				                name: this.props.watchingStyleNames[0].split('[')[0],
				                value: rgba
				            }],
				            replace: this.props.watchingStyleNames[0]
			        	});
        		}
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
	      		if (this.props.watchingStyleNames[0].indexOf('[') != -1) {
	        			let rgba = color;
	        			rgba = rgba && rgba.replace(/(,[ ]*)/g, ',') || rgba;
	        			
	        			let current = this.state.styleValues[this.props.watchingStyleNames[1]];
	        			current = current && current.replace(/(,[ ]*)/g, ',') || current;
	        			
	        			let composed = TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], rgba, current, '0px');
	        			composed = composed && composed.replace(/(,[ ]*)/g, ', ') || composed;
	        			
	        			perform('update', {
				            styles: [{
				                name: this.props.watchingStyleNames[0].split('[')[0],
				                value: composed
				            }],
				            replace: this.props.watchingStyleNames[0]
				        });
        		} else {
        				perform('update', {
				            styles: [{
				                name: this.props.watchingStyleNames[0].split('[')[0],
				                value: color
				            }],
				            replace: this.props.watchingStyleNames[0]
			        	});
        		}
	      }
    }
    
    protected colorPickerOnUnset() {
    		if (!this.props.manual) {
	        perform('update', {
	            styles: [{
	                name: this.props.watchingStyleNames[0].split('[')[0],
	                value: null
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
                                    <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.value} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onUnset={this.colorPickerOnUnset.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
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
                        <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={"<div style=\"width: 36px; height: 28px; padding: 4px 8px;\"><div style=\"width: 20px; height: 20px; background-color: " + this.state.value + "; \" />" + ((this.state.styleValues[this.props.watchingStyleNames[0]] !== 'coding') ? '' : '<i class="m-0 fa fa-code" style="color: #777;" />') + "</div>"} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                             <div className="section-container">
                             		{(() => {
                             			if (this.state.extensionValues['editorCurrentMode'] === 'animation') {
	                             			return (
	                             				<div>
		                             				<div className="section-subtitle">Swatches</div>
		                                		<div className="section-body">
			                             				<div role="group" className="btn-group btn-group-sm radio-button mr-1 mb-1">
			                             					<div className={"btn shadow-none text-center " + ((this.state.styleValues[this.props.watchingStyleNames[0]] !== 'coding') ? 'btn-primary' : 'btn-light')} style={{fontSize: '12px'}} onClick={this.colorPickerOnUnset.bind(this)}>Solid</div>
			                             					<div className={"btn shadow-none text-center " + ((this.state.styleValues[this.props.watchingStyleNames[0]] === 'coding') ? 'btn-primary' : 'btn-light')} style={{fontSize: '12px'}} onClick={this.onColorPicked.bind(this, 'coding')}>Coding</div>
			                             				</div>
			                             			</div>
			                             		</div>
							                      );
							                    }
					                      })()}
			                      		<div style={{display: (this.state.styleValues[this.props.watchingStyleNames[0]] !== 'coding') ? 'block' : 'none'}}>
	                                <div className="section-subtitle">Swatches</div>
	                                <div className="section-body">
	                                    <FullStackBlend.Components.SwatchPicker ref="swatchPicker" watchingStyleNames={['-fsb-background-type']} onColorPicked={this.onColorPicked.bind(this)}></FullStackBlend.Components.SwatchPicker>
	                                </div>
	                                <div className="section-subtitle">Color</div>
	                                <div className="section-body">
	                                    <FullStackBlend.Controls.ColorPicker ref="colorPicker" value={this.state.styleValues[this.props.watchingStyleNames[0]]} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onUnset={this.colorPickerOnUnset.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
	                                </div>
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