import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import '../controls/DropDownControl.js';
import '../components/RadioButtonPicker.js';
import * as CONSTANTS from '../../Constants.js';

let options = {
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
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

class ReactEventBinder extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
    		super(props);
    }
    
    public update(properties: any) {
        this.refs.picker.update(properties);
      
        if (!super.update(properties)) return;
    }
    
    private getState() {
        let value = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        if (value) value = JSON.parse(value);
        else value = {};
        
        return (value.event == true);
    }
    
    render() {
        return (
            <div className="btn-group btn-group-sm">
                <a className={"btn text-center p-0 mr-1 mb-1" + ((this.getState()) ? " btn-primary" : " btn-light")} style={{fontSize: '12px', color: (this.getState()) ? "#ffffff" : ""}}>
                    <FullStackBlend.Controls.DropDownControl representing={'<div class="px-2 py-1">' + this.props.watchingAttributeNames[0].replace('onfsb', '') + "</div>"} offsetX={-8} offsetY={7}>
                        <div className="section-container" style={{width: '175px'}}>
		                        <div className="section-title">Event Binding</div>
		                        <div className="section-subtitle">Binding</div>
		                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"event": true}', ["fa-power-off", "enable"]]]}/></div>
		                        <div className="section-subtitle">No Propagation</div>
		                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"no-propagation": true}', ["fa-power-off", "enable"]]]}/></div>
		                    </div>
                    </FullStackBlend.Controls.DropDownControl>
                </a>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.ReactEventBinder', ReactEventBinder);

export {ExtendedDefaultProps, ExtendedDefaultState, ReactEventBinder};