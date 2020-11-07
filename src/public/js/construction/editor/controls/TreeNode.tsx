import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../helpers/MathHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import {DropDownControl} from './DropDownControl.js';

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
  deselectable: boolean,
  selectable: boolean,
  dropable: boolean,
  dragging: boolean,
  disabled: boolean,
  selected: boolean,
  insert: InsertDirection,
  customClassName: string,
  nodes: [ITreeNode],
  tag: any
}

interface IProps {
  deep: number;
  nodes: [ITreeNode];
  onUpdate(node: ITreeNode);
  enableDragging: boolean;
  onStartDragging(node: ITreeNode);
  onDragging(point: Point);
  onEndDragging();
  onUpdateOptionVisibleChanged(value: boolean, tag: any);
  draggableAfterSelected: boolean;
  customDraggerClassName: string;
  editingControl: any;
  extendingControl: any;
}

interface IState {
}

class TreeNode extends React.Component<IProps, IState> {
	  private mouseUpDelegate: any = null;
	  private mouseMoveDelegate: any = null;
	  
    constructor(props) {
    	super(props);
    	
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
		private draggingElement: HTMLElement = null;
    
    protected onChange(node) {
  		if (!node.selectable) return;
  		if (node.selected && node.deselectable === false) return;
  		
      node.selected = !node.selected;
      
      this.forceUpdate();
      
      if (this.props.onUpdate != null) {
        this.props.onUpdate(node);
      }
    }
    
    private installEventHandlers() {
			document.body.addEventListener('mouseup', this.mouseUpDelegate, false);
			document.body.addEventListener('mousemove', this.mouseMoveDelegate, false);
			window.top.document.body.addEventListener('mouseup', this.mouseUpDelegate, false);
			window.top.document.body.addEventListener('mousemove', this.mouseMoveDelegate, false);
		}
		private uninstallEventHandlers() {
			document.body.removeEventListener('mouseup', this.mouseUpDelegate, false);
			document.body.removeEventListener('mousemove', this.mouseMoveDelegate, false);
			window.top.document.body.removeEventListener('mouseup', this.mouseUpDelegate, false);
			window.top.document.body.removeEventListener('mousemove', this.mouseMoveDelegate, false);
		}
		private createDraggingElement(title: string, width: number) {
			if (this.draggingElement == null) {
				this.draggingElement = document.createElement('div');
				this.draggingElement.className = 'layer-manager-container dragger' + ((this.props.customDraggerClassName) ? ' ' + this.props.customDraggerClassName : '');
				this.draggingElement.innerHTML = '<div class="treenode-container selected"><div class="treenode-body"><div class="treenode-title"></div></div></div>';
			}
			
			this.draggingElement.style.width = width + 'px';
			this.draggingElement.firstElementChild.firstElementChild.firstElementChild.innerHTML = title;
			
			document.body.appendChild(this.draggingElement);
		}
		private destoryDraggingElement() {
			if (this.draggingElement && this.draggingElement.parentNode) {
				this.draggingElement.parentNode.removeChild(this.draggingElement);
				this.draggingElement = null;
			}
		}
    
    private mouseDown(event) {
			if (!this.props.enableDragging) return;
			if (EventHelper.checkIfDenyForHandle(event)) return;
			
			let originalElement = EventHelper.getCurrentElement(event);
			
			let node = this.getNode(HTMLHelper.getAttribute(originalElement, 'node'));
			if (this.props.draggableAfterSelected && (!node.selectable || !node.selected)) return;
			
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
				
				document.getElementById('area').style.pointerEvents = 'none';
				
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
			
		  if (this.isMouseMoveReachedThreshold) {
		    this.moveDraggingContent(mousePositionInPoint);
		  }
		}
		private mouseUp(event) {
			this.uninstallEventHandlers();
			this.destoryDraggingElement();
			
			document.getElementById('area').style.pointerEvents = 'all';
			
			if (this.props.onEndDragging != null) {
				this.props.onEndDragging();
			}
			
			if (this.isMouseMoveReachedThreshold) {
			  EventHelper.setDenyForHandle('click', true);
			  EventHelper.setDenyForHandle('click', false, 100);
			}
			this.isMouseMoveReachedThreshold = false;
			
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
    
    private onVisibleChanged(value: boolean, tag: any) {
        if (this.props.onUpdateOptionVisibleChanged) {
            this.props.onUpdateOptionVisibleChanged(value, tag);
        }
    }
    private recursiveCheckForContaining(node: ITreeNode): boolean {
    	if (node.selected) return true;
    	else {
    		for (let child of node.nodes) {
    			if (this.recursiveCheckForContaining(child)) {
    				return true;
    			}
    		}
    		return false;
    	}
    }
    
    render() {
      return (
        <div ref="container">
          {this.props.nodes.map((node, index) => {
            return (
              <div key={'node-' + index} className={"treenode-outer-container" + (node.customClassName ? ' ' + node.customClassName : '') + (this.recursiveCheckForContaining(node) ? ' contained' : '')} id={node.id}>
                <div className={"treenode-container row" + (node.selected ? " selected" : "") + (node.disabled ? " disabled" : "") + (!node.selectable ? " freezed" : "") + (node.dragging ? " dragging" : "") + ((node.insert == InsertDirection.TOP) ? " insert-top" : "") + ((node.insert == InsertDirection.INSIDE) ? " insert-inside" : "") + ((node.insert == InsertDirection.BOTTOM) ? " insert-bottom" : "")}>
                	{(() => {
                    if (this.props.extendingControl) {
                    	const ExtendingControl = this.props.extendingControl;
                      return (
                        <ExtendingControl tag={node}>
                        </ExtendingControl>
                      )
                    }
                  })()}
                  <div className={"treenode-body col offset-" + this.props.deep} onMouseDown={this.mouseDown.bind(this)} node={node.id}>
                    {(() => {
                      if (this.props.children && this.props.editingControl) {
                      	const EditingControl = this.props.editingControl;
                        return (
                          <EditingControl representing="ICON:fa fa-edit" onVisibleChanged={this.onVisibleChanged.bind(this)} tag={node}>
                            {this.props.children}
                          </EditingControl>
                        )
                      }
                    })()}
                    <div className="form-check">
                      <label className="form-check-label noselect">
                        <input type="checkbox" className="form-check-input" disabled={node.disabled} checked={node.selected} onChange={this.onChange.bind(this, node)} />
                        <div className={"treenode-title"} dangerouslySetInnerHTML={{__html: node.name}}></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div style={{display: (node.insert == InsertDirection.BOTTOM || node.dragging) ? 'none' : 'inherit'}}>
                	<FullStackBlend.Controls.TreeNode deep={this.props.deep + 1} nodes={node.nodes} onUpdate={this.props.onUpdate} enableDragging={this.props.enableDragging} onStartDragging={this.props.onStartDragging} onDragging={this.props.onDragging} onEndDragging={this.props.onEndDragging} editingControl={this.props.editingControl} extendingControl={this.props.extendingControl}>
                	  {this.props.children}
                	</FullStackBlend.Controls.TreeNode>
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