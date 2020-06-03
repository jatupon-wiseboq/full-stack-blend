import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';
import '../../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
  onUpdate(node: ITreeNode);
  onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection);
  onInsertOptionVisibleChanged(value: boolean);
  onUpdateOptionVisibleChanged(value: boolean, tag: any);
  nodes: [ITreeNode];
  customDraggerClassName: string;
}

interface State extends IState {
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  	watchingAttributeNames: ['internal-fsb-name'],
  	watchingExtensionNames: ['elementTreeNodes'],
  	nodes: []
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
    }
    
    private onUpdate(node: ITreeNode) {
        if (this.props.onUpdate) {
          this.props.onUpdate(node);
        }
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		if (this.props.onDragged) {
            this.props.onDragged(element, reference, direction);
        }
    }
    
    private onInsertOptionVisibleChanged(value: boolean) {
        if (this.props.onInsertOptionVisibleChanged) {
            this.props.onInsertOptionVisibleChanged(value);
        }
    }
    
    private onUpdateOptionVisibleChanged(value: boolean, node: ITreeNode) {
        if (this.props.onUpdateOptionVisibleChanged) {
            this.props.onUpdateOptionVisibleChanged(value, node);
        }
    }
    
    render() {
      return (
      	<div className={"list-manager-container" + (this.props.customClassName ? ' ' + this.props.customClassName : '')}>
      		<FullStackBlend.Controls.Tree customDraggerClassName={this.props.customDraggerClassName} enableDragging={true} draggableAfterSelected={false} nodes={this.props.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
      		  {this.props.children}
      		</FullStackBlend.Controls.Tree>
      		<FullStackBlend.Controls.DropDownControl representing="+" customClassName="btn btn-light add" onVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)}>{this.props.children}</FullStackBlend.Controls.DropDownControl>
      	</div>
      );
    }
}

DeclarationHelper.declare('Components.ListManager', ListManager);

export {Props, State, ExtendedDefaultState, ExtendedDefaultProps, ListManager};