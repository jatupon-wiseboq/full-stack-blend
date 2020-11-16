import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {Props, State, ExtendedDefaultState, ExtendedDefaultProps, HTMLManager} from './HTMLManager.js'

declare let React: any;
declare let ReactDOM: any;

let _ExtendedDefaultProps = Object.assign({}, ExtendedDefaultProps);
Object.assign(_ExtendedDefaultProps, {
    path: true,
    watchingExtensionNames: ['pages', 'editingPageID'],
    sortFieldName: 'path'
});

class PageManager extends HTMLManager {
    protected static defaultProps: Props = _ExtendedDefaultProps;
    
    protected getCategoryName() {
        return 'Page';
    }
    
    protected getDisplay(item: any) {
        return `<div class="name">${item.name}</div><div class="path">${item.path}</div>`;
    }
}

DeclarationHelper.declare('Components.PageManager', PageManager);

export {PageManager};