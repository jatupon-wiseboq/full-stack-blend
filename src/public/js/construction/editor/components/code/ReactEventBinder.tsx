import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/DropDownControl';
import '../generic/RadioButtonPicker';
import * as CONSTANTS from '../../../Constants';

let options = {
		"onfsbsubmitting": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbsubmitted": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbfailed": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbsuccess": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbclick": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbdblclick": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbmousedown": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbmousemove": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbmouseout": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbmouseover": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbmouseup": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbmousewheel": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbwheel": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onfsbkeydown": CONSTANTS.KEYBOARD_EVENT_HANDLING_OPTIONS,
    "onfsbkeypress": CONSTANTS.KEYBOARD_EVENT_HANDLING_OPTIONS,
    "onfsbkeyup": CONSTANTS.KEYBOARD_EVENT_HANDLING_OPTIONS,
    "onfsbtouchstart": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onfsbtouchmove": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onfsbtouchend": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onfsbtouchcancel": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onfsbdrag": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbdragend": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbdragenter": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbdragleave": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbdragover": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbdragstart": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbdrop": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbscroll": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onfsbblur": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbchange": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbcontextmenu": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbfocus": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbinput": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbinvalid": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbreset": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbsearch": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbselect": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbsubmit": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onfsbafterprint": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbbeforeprint": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbbeforeunload": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsberror": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbhashchange": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbload": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbmessage": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsboffline": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbonline": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbpagehide": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbpageshow": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbpopstate": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbready": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbresize": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbstorage": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbunload": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onfsbcopy": CONSTANTS.CLIPBOARD_EVENT_HANDLING_OPTIONS,
    "onfsbcut": CONSTANTS.CLIPBOARD_EVENT_HANDLING_OPTIONS,
    "onfsbpaste": CONSTANTS.CLIPBOARD_EVENT_HANDLING_OPTIONS,
    "onfsbabort": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbcanplay": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbcanplaythrough": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbcuechange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbdurationchange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbemptied": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbended": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsberror": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbloadeddata": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbloadedmetadata": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbloadstart": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbpause": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbplay": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbplaying": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbprogress": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbratechange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbseeked": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbseeking": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbstalled": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbsuspend": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbtimeupdate": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbvolumechange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onfsbwaiting": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS
}

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
		mode: string;
}

interface State extends IState {
		enabled: boolean;
		visible: boolean;
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
		mode: 'coding'
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
		enabled: false,
		visible: false
});

class ReactEventBinder extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
    		super(props);
    }
    
    public update(properties: any) {
        this.refs.picker.update(properties);
      
        if (!super.update(properties)) return;
        
        let option: any = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        option = option && JSON.parse(option) || {};
        
        this.setState({
        	enabled: (option.event === true)
        });
        
        if (this.refs.dropdown && this.state.visible) this.refs.dropdown.updateHeight();
    }
    
    private getState() {
        let value = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        if (value) value = JSON.parse(value);
        else value = {};
        
        return (value.event == true);
    }
    
    private dropDownOnVisibleChanged(visible: boolean, tag: any) {
    		this.state.visible = visible;
    }
    
    render() {
        return (
            <div className="btn-group btn-group-sm">
                <a className={"btn text-center p-0 mr-1 mb-1" + ((this.getState()) ? " btn-primary" : " btn-light")} style={{fontSize: '12px', color: (this.getState()) ? "#ffffff" : ""}}>
                	{(() => {
                		if (this.props.mode == 'coding') {
                			return (
		                		<FullStackBlend.Controls.DropDownControl ref="dropdown" representing={'<div class="px-2 py-1">' + this.props.watchingAttributeNames[0].replace(/onfsb(document)?/, '') + "</div>"} offsetX={-8} offsetY={7} onVisibleChanged={this.dropDownOnVisibleChanged.bind(this)}>
	                        <div className="section-container" style={{width: '225px'}}>
			                        <div className="section-title">Customize Binding</div>
			                        <div className="section-subtitle">Binding</div>
			                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"event": true}', ["fa-power-off", "enable"]]]}/></div>
			                        <div className="section-subtitle">Custom Code</div>
			                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"disabled-custom-code": true}', ["fa-power-off", "disable"]]]}/></div>
			                        <div className="section-subtitle">Execute at First</div>
			                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"capture": true}', ["fa-power-off", "enable"]]]}/></div>
			                        <div className="section-subtitle">No Propagation</div>
			                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"no-propagation": true}', ["fa-power-off", "enable"]]]}/></div>
			                        <div className="section-note">Disabling event binding will take effect on both animation and coding.</div>
			                    </div>
		                    </FullStackBlend.Controls.DropDownControl>
                			)
                		} else {
                			return (
		                		<FullStackBlend.Controls.DropDownControl ref="dropdown" representing={'<div class="px-2 py-1">' + this.props.watchingAttributeNames[0].replace(/onfsb(document)?/, '') + "</div>"} offsetX={-8} offsetY={7} onVisibleChanged={this.dropDownOnVisibleChanged.bind(this)}>
	                        <div className="section-container" style={{width: '225px'}}>
			                        <div className="section-title">Customize Binding</div>
			                        <div className="section-subtitle">Binding</div>
			                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"event": true}', ["fa-power-off", "enable"]]]}/></div>
			                        <div className="animation-picker-container" style={{display: this.state.enabled ? 'block' : 'none'}}>
				                        <div className="section-subtitle">Add Tracks</div>
				                        <div className="section-body"><FullStackBlend.Components.AnimationPicker watchingAttributeNames={[this.props.watchingAttributeNames[0]]} keyName={'add-animation-tracks'} /></div>
				                        <div className="section-subtitle">Auto Remove Tracks When Finish</div>
				                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"animation-reset": true}', ["fa-power-off", "enable"]]]}/></div>
				                        <div className="section-subtitle">Remove Tracks</div>
				                        <div className="section-body"><FullStackBlend.Components.AnimationPicker watchingAttributeNames={[this.props.watchingAttributeNames[0]]} keyName={'remove-animation-tracks'} /></div>
				                        <div className="section-subtitle">Perform at Element</div>
				                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"animation-at-element": true}', ["fa-power-off", "enable"]]]}/></div>
					                      <div className="section-subtitle">Execute at First</div>
				                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"capture": true}', ["fa-power-off", "enable"]]]}/></div>
				                        <div className="section-subtitle">No Propagation</div>
				                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"no-propagation": true}', ["fa-power-off", "enable"]]]}/></div>
			                        </div>
			                        <div className="section-note">Disabling event binding will take effect on both animation and coding.</div>
			                    </div>
		                    </FullStackBlend.Controls.DropDownControl>
                			)
                		}
                	})()}
                </a>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.ReactEventBinder', ReactEventBinder);

export {ExtendedDefaultProps, ExtendedDefaultState, ReactEventBinder};