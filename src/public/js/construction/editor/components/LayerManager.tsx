import {CodeHelper} from '../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
	watchingAttributeNames: ['internal-fsb-name'],
	watchingExtensionNames: ['elementTreeNodes']
});

class LayerManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    protected onUpdate(node: ITreeNode) {
        perform('select', node.selected ? node.id : null);
    }
    
    render() {
      return (
      	<div className="layer-manager-container">
      		<FullStackBlend.Controls.Tree enableDragging={true} nodes={this.state.extensionValues[this.props.watchingExtensionNames[0]]} onUpdate={this.onUpdate.bind(this)} />
      	</div>
      );
    }
}

DeclarationHelper.declare('Components.LayerManager', LayerManager);

export {Props, State, LayerManager};