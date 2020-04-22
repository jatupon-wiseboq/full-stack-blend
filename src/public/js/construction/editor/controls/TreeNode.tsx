import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface ITreeNode {
	id: string,
  name: string,
  selectable: boolean,
  disabled: boolean,
  selected: boolean,
  nodes: [ITreeNode]
}

interface IProps {
  deep: number;
  nodes: [ITreeNode];
  onUpdate(node: ITreeNode);
  enableDragging: boolean;
}

interface IState {
}

class TreeNode extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }
    
    protected onClick(node) {
    		if (!node.selectable) return;
    		
        node.selected = !node.selected;
        
        if (this.props.onUpdate != null) {
            this.props.onUpdate(node);
        }
        
        this.forceUpdate();
    }
    
    render() {
      return (
        <div ref="container">
          {this.props.nodes.map((node, index) => {
            return (
              <div key={'node-' + index}>
                <div className={"treenode-container row" + (node.selected ? " selected" : "") + (node.disabled ? " disabled" : "") + (!node.selectable ? " freezed" : "")}>
                  <div className={"treenode-body col offset-" + this.props.deep}>
                    <div className="form-check">
                      <label className="form-check-label noselect">
                        <input type="checkbox" className="form-check-input" disabled={node.disabled} checked={node.selected} onClick={this.onClick.bind(this, node)} />
                        <div className={"treenode-title"}>{node.name}</div>
                      </label>
                    </div>
                  </div>
                </div>
                <FullStackBlend.Controls.TreeNode deep={this.props.deep + 1} nodes={node.nodes} onUpdate={this.props.onUpdate} enableDragging={this.props.enableDragging}></FullStackBlend.Controls.TreeNode>
              </div>
            )
          })}
        </div>
      )
    }
}

DeclarationHelper.declare('Controls.TreeNode', TreeNode);

export {IProps, IState, ITreeNode, TreeNode};