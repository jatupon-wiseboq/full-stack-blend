import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';
import './KeyframeManager.js'
import {SECOND_SPAN_SIZE} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
	scrollingBegin: number;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
	scrollingBegin: 0
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingExtensionNames: ['timelineTreeNodes']
});

class TimelineManager extends Base<Props, State> {
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
  			this.recursiveUnselectAllOfNodes(this.state.extensionValues[this.props.watchingExtensionNames[0]]);
  			node.selected = true;
  			this.forceUpdate();
  			
  			perform('select[cursor]', node.id);
  		}
    }
    
    private recursiveUnselectAllOfNodes(nodes: [ITreeNode]) {
  		for (let node of nodes) {
				node.selected = false;
				this.recursiveUnselectAllOfNodes(node.nodes);
			}
    }
    
    private addOnClick() {
    	perform('update', {
    		extensions: [{
    			name: 'editingAnimationID',
    			value: 'internal-fsb-new-group'
    		}]
    	});
    }
    
    render() {
      return (
      	<div className={"timeline-manager-container"}>
        	<FullStackBlend.Controls.Tree enableDragging={false} nodes={this.state.extensionValues[this.props.watchingExtensionNames[0]]} onUpdate={this.onUpdate.bind(this)} extendingControl={FullStackBlend.Components.KeyframeManager} />
      		<span className="btn btn-light add" onClick={this.addOnClick.bind(this)}>+</span>
      		<div className={"slider-outer-container"}>
      			<div className={"slider-inner-container"}>
      				<div className={"slider"}></div>
      			</div>
      		</div>
      		<div className={"timeline-outer-container"}>
      			<div className={"timeline-inner-container"}>
      				<div className={"timeline"}>
	      				{Array.from(Array(500).keys()).map((value, index) => {
	      					if (index % 2 == 0) {
		      					return (
		      						<div className={"bar"} key={"bar-" + index} style={{left: (index * SECOND_SPAN_SIZE) + 'px'}}></div>
		      					)
		      				}
					      })}
					      {Array.from(Array(500).keys()).map((value, index) => {
	      					return (
	      						<div className={"time"} key={"time-" + index} style={{left: (index * SECOND_SPAN_SIZE) + 'px'}}>
                    	<div className={"text"}>{index + 's'}</div>
                    </div>
	      					)
	      				})}
      				</div>
      			</div>
      		</div>
        </div>
      )
    }
}

DeclarationHelper.declare('Components.TimelineManager', TimelineManager);

export {Props, State, TimelineManager};