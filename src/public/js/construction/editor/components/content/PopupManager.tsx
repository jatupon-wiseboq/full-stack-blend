import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {Props, State, ExtendedDefaultState, ExtendedDefaultProps, HTMLManager} from './HTMLManager.js'

declare let React: any;
declare let ReactDOM: any;

let _ExtendedDefaultProps = Object.assign({}, ExtendedDefaultProps);
Object.assign(_ExtendedDefaultProps, {
    watchingExtensionNames: ['popups', 'editingPopupID'],
    sortFieldName: 'name'
});

class PopupManager extends HTMLManager {
    protected static defaultProps: Props = _ExtendedDefaultProps;
    
    protected getCategoryName() {
        return 'Popup';
    }
    
    protected getDisplay(item: any) {
        return `<div class="name">${item.name}</div>`;
    }
}

DeclarationHelper.declare('Components.PopupManager', PopupManager);

export {PopupManager};