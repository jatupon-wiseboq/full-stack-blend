import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import * as CONSTANTS from '../../Constants.js';

let options = {
		"onClick": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onDblClick": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onMouseDown": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onMouseMove": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onMouseOut": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onMouseOver": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onMouseUp": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onMouseWheel": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onWheel": CONSTANTS.MOUSE_EVENT_HANDLING_OPTIONS,
    "onKeyDown": CONSTANTS.KEYBOARD_EVENT_HANDLING_OPTIONS,
    "onKeyPress": CONSTANTS.KEYBOARD_EVENT_HANDLING_OPTIONS,
    "onKeyUp": CONSTANTS.KEYBOARD_EVENT_HANDLING_OPTIONS,
    "onTouchStart": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onTouchMove": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onTouchEnd": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onTouchCancel": CONSTANTS.TOUCH_EVENT_HANDLING_OPTIONS,
    "onDrag": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onDragEnd": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onDragEnter": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onDragLeave": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onDragOver": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onDragStart": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onDrop": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onScroll": CONSTANTS.DRAG_EVENT_HANDLING_OPTIONS,
    "onBlur": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onChange": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onContextMenu": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onFocus": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onInput": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onInvalid": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onReset": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onSearch": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onSelect": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onSubmit": CONSTANTS.FORM_EVENT_HANDLING_OPTIONS,
    "onAfterPrint": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onBeforePrint": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onBeforeUnload": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onError": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onHashChange": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onLoad": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onMessage": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onOffline": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onOnline": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onPageHide": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onPageShow": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onPopState": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onResize": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onStorage": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onUnload": CONSTANTS.DOCUMENT_EVENT_HANDLING_OPTIONS,
    "onCopy": CONSTANTS.CLIPBOARD_EVENT_HANDLING_OPTIONS,
    "onCut": CONSTANTS.CLIPBOARD_EVENT_HANDLING_OPTIONS,
    "onPaste": CONSTANTS.CLIPBOARD_EVENT_HANDLING_OPTIONS,
    "onabort": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "oncanplay": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "oncanplaythrough": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "oncuechange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "ondurationchange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onemptied": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onended": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onerror": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onloadeddata": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onloadedmetadata": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onloadstart": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onpause": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onplay": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onplaying": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onprogress": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onratechange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onseeked": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onseeking": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onstalled": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onsuspend": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "ontimeupdate": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onvolumechange": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS,
    "onwaiting": CONSTANTS.MEDIA_EVENT_HANDLING_OPTIONS	
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
        if (!super.update(properties)) return;
    }
    
    render() {
        return (
          pug `
            .btn-group.btn-group-sm.mr-1.mb-1(role="group")
              if options[this.props.watchingExtensionNames[0]]
                each value, index in options[this.props.watchingExtensionNames[0]]
                  button.btn.text-center(key="item-extension-" + index, className=(false ? 'btn-primary' : (this.props.customClassName || 'btn-light')), style={fontSize: '12px'})
                    = this.props.watchingExtensionNames[0].replace(/^on/, '').toLowerCase()
          `
        )
    }
}

DeclarationHelper.declare('Components.ReactEventBinder', ReactEventBinder);

export {ExtendedDefaultProps, ExtendedDefaultState, ReactEventBinder};