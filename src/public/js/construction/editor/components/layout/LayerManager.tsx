import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';

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
    
    private onUpdate(node: ITreeNode) {
    		if (node.selected) {
    			perform('select[cursor]', node.id);
    		} else {
    			perform('select', null);
    		}
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		let value = null;
    	
    		switch (direction) {
    				case InsertDirection.TOP:
    					value = 'insertBefore';
    					break;
    				case InsertDirection.INSIDE:
    					value = 'appendChild';
    					break;
    				case InsertDirection.BOTTOM:
    					value = 'insertAfter';
    					break;
    				default:
    					return;
    		}
    	
    		perform('move[element]', {
	    			target: element.id,
	    			destination: reference.id,
	    			direction: value
    		});
    }
    
    render() {
      return (
      	<div className="layer-manager-container">
      		<FullStackBlend.Controls.Tree enableDragging={true} nodes={this.state.extensionValues[this.props.watchingExtensionNames[0]]} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged} />
      	</div>
      );
    }
}

DeclarationHelper.declare('Components.LayerManager', LayerManager);

export {Props, State, LayerManager};