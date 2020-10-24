import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {RandomHelper} from '../../../helpers/RandomHelper.js';
import {Point, MathHelper} from '../../../helpers/MathHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';
import './KeyframeManager.js'
import {SECOND_SPAN_SIZE, MAXIMUM_OF_SECONDS} from '../../../Constants.js';

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
  watchingExtensionNames: ['timelineTreeNodes', 'editingAnimationID']
});

let groupCount = 0;

class TimelineManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
	  private mouseUpDelegate: any = null;
	  private mouseMoveDelegate: any = null;

    constructor(props) {
      super(props);
      Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    
	    this.mouseUpDelegate = this.mouseUp.bind(this);
	    this.mouseMoveDelegate = this.mouseMove.bind(this);
    }
  	
	  private originalMousePos: Point = {
			x: 0,
			y: 0
		};
		private originalElementPos: Point = {
			x: 0,
			y: 0
		};
		private originalElement: HTMLElement = null;
		
		private isMouseMoveReachedThreshold: boolean = false;
    
    public update(properties: any) {
      if (!super.update(properties)) return;
      
      this.updateKeyframeStyles();
    }
  
	  private installEventHandlers() {
			document.body.addEventListener('mouseup', this.mouseUpDelegate, false);
			document.body.addEventListener('mousemove', this.mouseMoveDelegate, false);
			document.getElementById('area').contentWindow.document.body.addEventListener('mouseup', this.mouseUpDelegate, false);
			document.getElementById('area').contentWindow.document.body.addEventListener('mousemove', this.mouseMoveDelegate, false);
		}
		private uninstallEventHandlers() {
			document.body.removeEventListener('mouseup', this.mouseUpDelegate, false);
			document.body.removeEventListener('mousemove', this.mouseMoveDelegate, false);
			document.getElementById('area').contentWindow.document.body.removeEventListener('mouseup', this.mouseUpDelegate, false);
			document.getElementById('area').contentWindow.document.body.removeEventListener('mousemove', this.mouseMoveDelegate, false);
		}
    
    private onUpdate(node: ITreeNode) {
  		if (node.selected) {
  			this.recursiveUnselectAllOfNodes(this.state.extensionValues[this.props.watchingExtensionNames[0]]);
  			node.selected = true;
  			this.forceUpdate();
  			
  			console.log(node);
  			
  			perform('update', {
	    		extensions: [{
	    			name: 'editingAnimationID',
	    			value: node.tag.key
	    		}]
	    	});
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
    			value: RandomHelper.generateGUID()
    		}]
    	});
	  	perform('update', {
	  		extensions: [{
	  			name: 'animationGroupName',
	  			value: 'Untitled ' + ++groupCount
	  		}]
	  	});
    }
    
    private mouseDown(event) {
			let originalElement = ReactDOM.findDOMNode(this.refs.slider);
			this.originalElement = originalElement;
			let currentWindow = originalElement.ownerDocument.defaultView || originalElement.ownerDocument.parentWindow;
			
			let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), currentWindow);
			
			this.originalMousePos.x = mousePosition[0];
			this.originalMousePos.y = mousePosition[1];
			
			let container = this.originalElement.parentNode;
			let containerPosition = HTMLHelper.getPosition(container);
			let elementPosition = HTMLHelper.getPosition(originalElement);
			this.originalElementPos.x = elementPosition[0] - containerPosition[0];
			this.originalElementPos.y = 0;
			
			this.installEventHandlers();
			
			return EventHelper.cancel(event);
		}
		private mouseMove(event) {
			let originalElement = EventHelper.getCurrentElement(event);
			let currentWindow = originalElement.ownerDocument.defaultView || originalElement.ownerDocument.parentWindow;
			
			let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), currentWindow);
			let mousePositionInPoint = {x: mousePosition[0], y: mousePosition[1]};
			
			if (!this.isMouseMoveReachedThreshold &&
					Math.abs(mousePositionInPoint.x - this.originalMousePos.x) < 5 &&
					Math.abs(mousePositionInPoint.y - this.originalMousePos.y) < 5) {
				return;
			}
			
			if (!this.isMouseMoveReachedThreshold) {
				this.isMouseMoveReachedThreshold = true;
			}
			
		  if (this.isMouseMoveReachedThreshold) {
		    this.moveDraggingContent(mousePositionInPoint);
		  }
		}
		private mouseUp(event) {
			this.uninstallEventHandlers();
			
			if (this.isMouseMoveReachedThreshold) {
			  let container = this.originalElement.parentNode;
				let containerSize = HTMLHelper.getSize(container);
				let percent = MathHelper.clamp(parseFloat(this.originalElement.style.left) * 100.0 / containerSize[0], 0, 70);
				
				this.originalElement.style.left = percent + '%';
				
				this.setState({
					scrollingBegin: percent / 100.0
				});
			}
			this.isMouseMoveReachedThreshold = false;
			
			return EventHelper.cancel(event);
		}
		
		private moveDraggingContent(mousePosition: Point) {
			let diffX = mousePosition.x - this.originalMousePos.x;
			let diffY = mousePosition.y - this.originalMousePos.y;
			
			let container = this.originalElement.parentNode;
			let containerSize = HTMLHelper.getSize(container);
			let elementSize = HTMLHelper.getSize(this.originalElement);
			
			this.originalElement.style.left = MathHelper.clamp(this.originalElementPos.x + diffX, 0, containerSize[0] - elementSize[0]) + 'px';
			
			let percent = MathHelper.clamp(parseFloat(this.originalElement.style.left) * 100.0 / containerSize[0], 0, 70);
			
			this.updateKeyframeStyles(percent / 100.0);
		}
		private updateKeyframeStyles(percent: number=this.state.scrollingBegin) {
			let offsetLeft = -percent * SECOND_SPAN_SIZE * MAXIMUM_OF_SECONDS;
			let timeline = ReactDOM.findDOMNode(this.refs.timeline);
			
			timeline.style.left = offsetLeft + 'px';
			
			let keyframeManagers = HTMLHelper.getElementsByClassName('keyframe-manager-container');
			for (let i=0; i<keyframeManagers.length; i++) {
				keyframeManagers[i].style.left = (offsetLeft + 251) + 'px';
				
				let keyframes = HTMLHelper.getElementsByClassName('keyframe-container');
				for (let j=0; j<keyframes.length; j++) {
					let left = parseFloat(keyframes[j].style.left);
					
					keyframes[j].style.opacity = (left < -offsetLeft) ? 0.35 : 1.0;
				}
			}
		}
    
    render() {
      return (
      	<div className="timeline-manager-container">
        	<FullStackBlend.Controls.Tree enableDragging={false} nodes={this.state.extensionValues[this.props.watchingExtensionNames[0]]} onUpdate={this.onUpdate.bind(this)} extendingControl={FullStackBlend.Components.KeyframeManager} />
      		<span className="btn btn-light add" onClick={this.addOnClick.bind(this)}>+</span>
      		<div className="slider-outer-container">
      			<div className="slider-inner-container">
      				<div className="slider" ref="slider" onMouseDown={this.mouseDown.bind(this)}></div>
      			</div>
      		</div>
      		<div className="timeline-outer-container">
      			<div className="timeline-inner-container">
      				<div className="timeline" ref="timeline" style={{left: (-this.state.scrollingBegin * SECOND_SPAN_SIZE * MAXIMUM_OF_SECONDS) + 'px'}}>
	      				{Array.from(Array(MAXIMUM_OF_SECONDS).keys()).map((value, index) => {
	      					if (index % 2 == 0) {
		      					return (
		      						<div className="bar" key={"bar-" + index} style={{left: (index * SECOND_SPAN_SIZE) + 'px'}}></div>
		      					)
		      				}
					      })}
					      {Array.from(Array(MAXIMUM_OF_SECONDS).keys()).map((value, index) => {
	      					return (
	      						<div className="time" key={"time-" + index} style={{left: (index * SECOND_SPAN_SIZE) + 'px'}}>
                    	<div className="text">{index + 's'}</div>
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