import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface ITreeNode {
  name: string,
  nodes: [ITreeNode]
}

interface Props extends IProps {
  deep: number,
  tree: ITreeNode
}

interface State extends IState {
}

class TreeNode extends React.Component<Props, State> {
    static defaultProps: Props = {
        deep: 0,
        tree: []
    }
    
    constructor() {
        super();
    }
    
    render() {
      return (
        pug `
          each node, index of this.props.tree
            .row(key="node-" + index)
              div(className="col offset-" + this.props.deep)
                input.form-check-input.form-control.form-control-sm(type="checkbox")
                | #{node.name}
            = FullStackBlend.Controls.TreeNode({deep: this.props.deep + 1, tree: node.nodes})
        `
      )
    }
}

DeclarationHelper.declare('Controls.TreeNode', TreeNode);

export {IProps, IState, ITreeNode, TreeNode};