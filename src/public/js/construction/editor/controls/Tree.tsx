import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, TreeNode} from './TreeNode.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
  tree: ITreeNode
}

interface State extends IState {
}

class Tree extends React.Component<Props, State> {
    static defaultProps: Props = {
        tree: [{name: "Title 1", nodes: []},
               {name: "Title 2", nodes: [{name: "Title 1", nodes: []}, {name: "Title 2", nodes: []}, {name: "Title 3", nodes: []}],
               {name: "Title 3", [{name: "Title 1", nodes: []}]}]
    }
    
    constructor() {
        super();
    }
    
    render() {
      return (
        pug `
          .tree-container
            .container-fluid
              each values, index in this.props.tree
                = FullStackBlend.Controls.TreeNode({deep: 0, tree: values})
        `
      )
    }
}

DeclarationHelper.declare('Controls.Tree', Tree);

export {Props, State, Tree};