import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../helpers/MathHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Dragger extends React.Component<IProps, IState> {
  static defaultProps: Props = {
  }
  
  private domElement: HTMLElement = null;
  
  constructor(props) {
    super(props);
  }
  
  constructor() {
		super();
	}

	componentDidMount() {
  }
  
  public getDOMNode() {
    return this.domElement;
  }
  public setDOMNode(element: HTMLElement) {
    this.domElement = element;
  }

  public bind(element: HTMLElement) {
    element.addEventListener('mousedown', this.mouseDown, false);
  }
  public unbind(element: HTMLElement) {
    element.removeEventListener('mousedown', this.mouseDown, false);
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
		
    node.selected = !node.selected;
    
    this.forceUpdate();
    
    if (this.props.onUpdate != null) {
      this.props.onUpdate(node);
    }
  }
  
  private installEventHandlers() {
		document.body.addEventListener('mouseup', this.mouseUp, false);
		document.body.addEventListener('mousemove', this.mouseMove, false);
		window.top.document.body.addEventListener('mouseup', this.mouseUp, false);
		window.top.document.body.addEventListener('mousemove', this.mouseMove, false);
	}
	private uninstallEventHandlers() {
		document.body.removeEventListener('mouseup', this.mouseUp, false);
		document.body.removeEventListener('mousemove', this.mouseMove, false);
		window.top.document.body.removeEventListener('mouseup', this.mouseUp, false);
		window.top.document.body.removeEventListener('mousemove', this.mouseMove, false);
	}
	private destoryDraggingElement() {
		if (this.draggingElement && this.draggingElement.parentNode) {
			this.draggingElement.parentNode.removeChild(this.draggingElement);
			this.draggingElement = null;
		}
	}
  
  private mouseDown(event) {
		let originalElement = EventHelper.getCurrentElement(event);
		this.originalElement = originalElement;
		
		this.draggingElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', originalElement, true);
		
		let mousePosition = EventHelper.getMousePosition(event);
		let elementPosition = HTMLHelper.getPosition(this.draggingElement);
		let containerPosition = HTMLHelper.getPosition(this.draggingElement.parentNode);
		
		this.originalMousePos.x = mousePosition[0];
		this.originalMousePos.y = mousePosition[1];
		
		this.originalElementPos.x = elementPosition[0] - containerPosition[0];
		this.originalElementPos.y = elementPosition[1] - containerPosition[1];
		
		console.log(this.originalMousePos, this.originalElementPos);
		
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
		}
		
		if (this.isMouseMoveReachedThreshold) {
		  this.moveDraggingContent(mousePositionInPoint);
		}
	}
	private mouseUp(event) {
		this.uninstallEventHandlers();
		
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
		
		console.log(diffX, diffY);
	}
	
	render() {
    return (
        pug `
          .internal-fsb-accessory
        `
    )
  }
}

DeclarationHelper.declare('Controls.Dragger', Dragger);

export {Props, State, Dragger};