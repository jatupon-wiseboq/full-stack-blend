import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    components: [any]
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    components: []
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingExtensionNames: ['components', 'editingComponentID']
});

class ComponentMenu extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        if (this.state.extensionValues[this.props.watchingExtensionNames[0]]) {
    				this.state.extensionValues[this.props.watchingExtensionNames[0]].sort((a, b) => {
    					return (a['name'] < b['name']) ? -1 : 1;
    				});
    				
    				this.forceUpdate();
    		}
    }
    
    render() {
        return pug `
          div
            each component, index in (this.state.extensionValues[this.props.watchingExtensionNames[0]] || [])
              if component.state != 'delete'
                div(key='item-' + index)
                  a.dropdown-item(onClick=perform.bind(window, 'insert', {
                    klass: 'Component',
                    id: component.id
                  }))
                    i.fa.fa-puzzle-piece
                    = component.name
        `
    }
}

DeclarationHelper.declare('Components.ComponentMenu', ComponentMenu);

export {ComponentMenu};