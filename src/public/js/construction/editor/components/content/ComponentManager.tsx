import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {Props, State, ExtendedDefaultState, ExtendedDefaultProps, HTMLManager} from './HTMLManager.js'

declare let React: any;
declare let ReactDOM: any;

let _ExtendedDefaultProps = Object.assign({}, ExtendedDefaultProps);
Object.assign(_ExtendedDefaultProps, {
    watchingExtensionNames: ['components', 'editingComponentID']
});

class ComponentManager extends HTMLManager {
    protected static defaultProps: Props = _ExtendedDefaultProps;
    
    protected getCategoryName() {
        return 'Component';
    }
    
    protected getDisplay(item: any) {
        return `<div class="name">${item.name}</div>`;
    }
}

DeclarationHelper.declare('Components.ComponentManager', ComponentManager);

export {ComponentManager};