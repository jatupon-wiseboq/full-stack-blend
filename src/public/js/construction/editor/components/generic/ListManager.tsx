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
    nodes: [ITreeNode]
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  	watchingAttributeNames: ['internal-fsb-name'],
  	watchingExtensionNames: ['elementTreeNodes']
});

class ListManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        this.state.nodes = [{
            id: 'delete',
            name: 'Delete',
            selectable: false,
            dropable: true,
            disabled: false,
            selected: false,
            customClassName: 'delete',
            nodes: []
        },{
            id: 'temp1',
            name: 'Item',
            selectable: true,
            dropable: false,
            disabled: false,
            selected: false,
            nodes: []
        },{
            id: 'temp2',
            name: 'Item',
            selectable: true,
            dropable: false,
            disabled: false,
            selected: false,
            nodes: []
        },{
            id: 'temp3',
            name: 'Item',
            selectable: true,
            dropable: false,
            disabled: false,
            selected: false,
            nodes: []
        }];
        
        this.forceUpdate();
    }
    
    private onUpdate(node: ITreeNode) {
        // perform('select', node.selected ? node.id : null);
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		let value = null;
    	  
    		switch (direction) {
    				case InsertDirection.TOP:
    					value = 'insertBefore';
    					break;
    				case InsertDirection.INSIDE:
    					value = 'delete';
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
      	<div className="list-manager-container">
      		<FullStackBlend.Controls.Tree enableDragging={true} draggableAfterSelected={false} nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged}>
      		 | ABC
      		</FullStackBlend.Controls.Tree>
      		<button className="btn btn-light btn-sm add">+</button>
      	</div>
      );
    }
}

DeclarationHelper.declare('Components.ListManager', ListManager);

export {Props, State, ListManager};