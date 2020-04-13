import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface ITreeNode {
  name: string,
  disabled: boolean,
  selected: boolean,
  nodes: [ITreeNode]
}

interface IProps {
  deep: number;
  nodes: [ITreeNode];
  onUpdate(node: ITreeNode);
}

interface IState {
}

class TreeNode extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }
    
    protected onClick(node) {
        node.selected = !node.selected;
        
        if (this.props.onUpdate != null) {
            this.props.onUpdate(node);
        }
        
        this.forceUpdate();
    }
    
    render() {
      return (
        <div>
          {this.props.nodes.map((node) => {
            return (
              <div key={node.name}>
                <div className="row">
                  <div className={"col p-0 offset-" + this.props.deep}>
                    <div className="form-check">
                      <label className="form-check-label noselect">
                        <input type="checkbox" className="form-check-input" disabled={node.disabled} checked={node.selected} onClick={this.onClick.bind(this, node)} />
                        <div style={{paddingTop: '3px', color: (node.disabled) ? '#999999' : ''}}>{node.name}</div>
                      </label>
                    </div>
                  </div>
                </div>
                <FullStackBlend.Controls.TreeNode deep={this.props.deep + 1} nodes={node.nodes}></FullStackBlend.Controls.TreeNode>
              </div>
            )
          })}
        </div>
      )
    }
}

DeclarationHelper.declare('Controls.TreeNode', TreeNode);

export {IProps, IState, ITreeNode, TreeNode};