import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../helpers/MathHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

const InsertDirection = Object.freeze({
    TOP: Symbol("top"),
    BOTTOM: Symbol("bottom"),
    INSIDE: Symbol("inside"),
    NONE: Symbol("none")
});

interface ITreeNode {
	id: string,
  name: string,
  selectable: boolean,
  dropable: boolean,
  dragging: boolean,
  disabled: boolean,
  selected: boolean,
  insert: InsertDirection,
  nodes: [ITreeNode]
}

interface IProps {
  deep: number;
  nodes: [ITreeNode];
  onUpdate(node: ITreeNode);
  enableDragging: boolean;
  onStartDragging(node: ITreeNode);
  onDragging(point: Point);
  onEndDragging();
}

interface IState {
}

class TreeNode extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
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
		private draggingElement: HTMLElement = null;
    
    protected onClick(node) {
  		if (!node.selectable) return;
  		
      node.selected = !node.selected;
      
      if (this.props.onUpdate != null) {
          this.props.onUpdate(node);
      }
      
      this.forceUpdate();
    }
    
    private installEventHandlers() {
			window.document.body.addEventListener('mouseup', this.mouseUp, false);
			window.document.body.addEventListener('mousemove', this.mouseMove, false);
			window.top.document.body.addEventListener('mouseup', this.mouseUp, false);
			window.top.document.body.addEventListener('mousemove', this.mouseMove, false);
		}
		private uninstallEventHandlers() {
			window.document.body.removeEventListener('mouseup', this.mouseUp, false);
			window.document.body.removeEventListener('mousemove', this.mouseMove, false);
			window.top.document.body.removeEventListener('mouseup', this.mouseUp, false);
			window.top.document.body.removeEventListener('mousemove', this.mouseMove, false);
		}
		private createDraggingElement(title: string, width: number) {
			if (this.draggingElement == null) {
				this.draggingElement = document.createElement('div');
				this.draggingElement.className = 'layer-manager-container dragger';
				this.draggingElement.innerHTML = '<div class="treenode-container selected"><div class="treenode-body"><div class="treenode-title"></div></div></div>';
			}
			
			this.draggingElement.style.width = width + 'px';
			this.draggingElement.firstChild.firstChild.firstChild.innerText = title;
			
			document.body.appendChild(this.draggingElement);
		}
		private destoryDraggingElement() {
			if (this.draggingElement && this.draggingElement.parentNode) {
				this.draggingElement.parentNode.removeChild(this.draggingElement);
				this.draggingElement = null;
			}
		}
    
    private mouseDown(event) {
			let originalElement = EventHelper.getCurrentElement(event);
			
			let node = this.getNode(HTMLHelper.getAttribute(originalElement, 'node'));
			if (!node.selectable || !node.selected) return;
			
			this.originalElement = originalElement;
			
			let mousePosition = EventHelper.getMousePosition(event);
			let elementPosition = HTMLHelper.getPosition(this.originalElement);
			
			this.originalMousePos.x = mousePosition[0];
			this.originalMousePos.y = mousePosition[1];
			
			this.originalElementPos.x = elementPosition[0];
			this.originalElementPos.y = elementPosition[1];
			
			this.installEventHandlers();
		}
		private mouseMove(event) {
			let mousePosition = EventHelper.getMousePosition(event);
			let mousePositionInPoint = {x: mousePosition[0], y: mousePosition[1]};
			
			if (!this.isMouseMoveReachedThreshold &&
					Math.abs(mousePositionInPoint.x - this.originalMousePos.x) < 5 &&
					Math.abs(mousePositionInPoint.y - this.originalMousePos.y) < 5) {
				return;
			}
			
			if (!this.isMouseMoveReachedThreshold) {
				this.isMouseMoveReachedThreshold = true;
				
				document.getElementById('construction').style.pointerEvents = 'none';
				
				let node = this.getNode(HTMLHelper.getAttribute(this.originalElement, 'node'));
				let elementSize = HTMLHelper.getSize(this.originalElement);
				this.createDraggingElement(node.name, elementSize[0]);
				
				if (this.props.onStartDragging != null) {
					this.props.onStartDragging(node);
				}
			}
				
			if (this.props.onDragging != null) {
				this.props.onDragging(mousePositionInPoint);
			}
			
			this.moveDraggingContent(mousePositionInPoint);
		}
		private mouseUp(event) {
			this.uninstallEventHandlers();
			this.destoryDraggingElement();
			
			this.isMouseMoveReachedThreshold = false;
			
			document.getElementById('construction').style.pointerEvents = 'all';
			
			if (this.props.onEndDragging != null) {
				this.props.onEndDragging();
			}
			
			EventHelper.setDenyForHandle('click', false, 100);
			return EventHelper.cancel(event);
		}
		
		private moveDraggingContent(mousePosition: Point) {
			let diffX = mousePosition.x - this.originalMousePos.x;
			let diffY = mousePosition.y - this.originalMousePos.y;
			
			this.draggingElement.style.left = (this.originalElementPos.x + diffX) + 'px';
			this.draggingElement.style.top = (this.originalElementPos.y + diffY) + 'px';
		}
		private getNode(id: string, nodes: [ITreeNode]=this.props.nodes) {
			for (let node of nodes) {
				if (node.id == id) {
					return node;
				}
				let result = this.getNode(id, node.nodes);
				if (result != null) {
					return result;
				}
			}
			return null;
		}
    
    render() {
      return (
        <div ref="container">
          {this.props.nodes.map((node, index) => {
            return (
              <div key={'node-' + index}>
                <div className={"treenode-container row" + (node.selected ? " selected" : "") + (node.disabled ? " disabled" : "") + (!node.selectable ? " freezed" : "") + (node.dragging ? " dragging" : "") + ((node.insert == InsertDirection.TOP) ? " insert-top" : "") + ((node.insert == InsertDirection.INSIDE) ? " insert-inside" : "") + ((node.insert == InsertDirection.BOTTOM) ? " insert-bottom" : "")}>
                  <div className={"treenode-body col offset-" + this.props.deep} onMouseDown={this.mouseDown.bind(this)} node={node.id}>
                    <div className="form-check">
                      <label className="form-check-label noselect">
                        <input type="checkbox" className="form-check-input" disabled={node.disabled} checked={node.selected} onClick={this.onClick.bind(this, node)} />
                        <div className={"treenode-title"}>{node.name}</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div style={{display: (node.insert == InsertDirection.BOTTOM || node.dragging) ? 'none' : 'inherit'}}>
                	<FullStackBlend.Controls.TreeNode deep={this.props.deep + 1} nodes={node.nodes} onUpdate={this.props.onUpdate} enableDragging={this.props.enableDragging} onStartDragging={this.props.onStartDragging} onDragging={this.props.onDragging} onEndDragging={this.props.onEndDragging}></FullStackBlend.Controls.TreeNode>
                </div>
              </div>
            )
          })}
        </div>
      )
    }
}

DeclarationHelper.declare('Controls.TreeNode', TreeNode);

export {IProps, IState, ITreeNode, TreeNode, InsertDirection};