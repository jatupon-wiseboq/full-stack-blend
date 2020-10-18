import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

const SECOND_SPAN_SIZE = 40;

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
    
    private onContainerMouseDown(event: any, node: ITreeNode) {
    	let container = EventHelper.getCurrentElement(event);
    	let containerPosition = HTMLHelper.getPosition(container);
    	let mousePosition = EventHelper.getMousePosition(event);
    	
    	let keyframePosition = this.state.scrollingBegin + (Math.floor((mousePosition[0] - containerPosition[0]) / SECOND_SPAN_SIZE * 100) / 100);
    	if (keyframePosition * SECOND_SPAN_SIZE - 10 < 250) return;
    	
    	// [TODO]
    	let keyframe = document.createElement('div');
    	keyframe.className = 'keyframe';
    	keyframe.style.left = (keyframePosition * SECOND_SPAN_SIZE - 10) + 'px';
    	
    	container.appendChild(keyframe);
    }
    
    render() {
      return (
      	<div className={"timeline-manager-container"}>
        	<FullStackBlend.Controls.Tree enableDragging={false} nodes={this.state.extensionValues[this.props.watchingExtensionNames[0]]} onUpdate={this.onUpdate.bind(this)} onContainerMouseDown={this.onContainerMouseDown.bind(this)} />
      		<span className="btn btn-light add">+</span>
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