import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, TreeNode} from './TreeNode.js';

declare let React: any;
declare let ReactDOM: any;

interface IProps {
  nodes: [ITreeNode];
  onUpdate(node: ITreeNode);
}

interface IState {
}

class Tree extends React.Component<IProps, IState> {
    protected static defaultProps: IProps = {
        nodes: []
    }
    
    constructor(props) {
        super(props);
    }
    
    protected onUpdate(node: ITreeNode) {
        if (this.props.onUpdate != null) {
            this.props.onUpdate(node);
        }
    }
    
    render() {
      return (
        <div className="tree-container">
          <div className="container-fluid">
            <TreeNode deep={0} nodes={this.props.nodes} onUpdate={this.onUpdate.bind(this)} />
          </div>
        </div>
      )
    }
}

DeclarationHelper.declare('Controls.Tree', Tree);

export {IProps, IState, Tree};