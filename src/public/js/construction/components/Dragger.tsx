import {EventHelper} from '../helpers/EventHelper.js';
import {EditorHelper} from '../helpers/EditorHelper.js';
import {HTMLHelper} from '../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
    onUpdate(diffX: number, diffY: number, diffW: number, diffH: number);
    onPreview(diffX: number, diffY: number, diffW: number, diffH: number);
}

interface State {
}

class Dragger extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    private draggingArea: HTMLElement = null;
    private originalRect: any = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };
    private originalMousePos: any = {
        left: 0,
        top: 0,
        diffX: 0,
        diffY: 0
    };
    private originalResizerDirection: any = {
        top: false,
        right: false,
        bottom: false,
        left: false
    };
    
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.installDraggingArea();
    }
    
    private installDraggingArea() {
        this.draggingArea = document.createElement('div');
        this.draggingArea.className = 'internal-fsb-dragging-area';
        window.top.document.body.appendChild(this.draggingArea);
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
    
    private mouseDown(event) {
        let currentResizerElement = EventHelper.getCurrentElement(event);
        let selectingElement = EditorHelper.getSelectingElement();
        let elementPosition = HTMLHelper.getOriginalPosition(HTMLHelper.getPosition(selectingElement), EventHelper.getCurrentWindow(event));
        let elementSize = HTMLHelper.getSize(selectingElement);
        let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), EventHelper.getCurrentWindow(event));
        
        this.originalRect.left = elementPosition[0];
        this.originalRect.top = elementPosition[1];
        this.originalRect.width = elementSize[0];
        this.originalRect.height = elementSize[1];
        
        this.originalMousePos.left = mousePosition[0];
        this.originalMousePos.top = mousePosition[1];
        this.originalMousePos.diffX = 0;
        this.originalMousePos.diffY = 0;
        
        this.originalResizerDirection.top = currentResizerElement.className.indexOf('t') != -1;
        this.originalResizerDirection.right = currentResizerElement.className.indexOf('r') != -1;
        this.originalResizerDirection.bottom = currentResizerElement.className.indexOf('b') != -1;
        this.originalResizerDirection.left = currentResizerElement.className.indexOf('l') != -1;
        
        this.installEventHandlers();
        
        this.draggingArea.style.display = 'block';
        this.updateDraggingAreaPositionAndSize(this.originalRect, { x: this.originalMousePos.diffX, y: this.originalMousePos.diffY });
        
        return EventHelper.cancel(event);
    }
    private mouseMove(event) {
        let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), EventHelper.getCurrentWindow(event));
        
        if (this.originalResizerDirection.left || this.originalResizerDirection.right) {
            this.originalMousePos.diffX = mousePosition[0] - this.originalMousePos.left;
        }
        if (this.originalResizerDirection.top || this.originalResizerDirection.bottom) {
            this.originalMousePos.diffY = mousePosition[1] - this.originalMousePos.top;
        }
        
        this.updateDraggingAreaPositionAndSize(this.originalRect, this.originalMousePos);
    }
    private mouseUp(event) {
        this.draggingArea.style.display = 'none';
        
        let diff = this.calculateDiff(this.originalRect, this.originalMousePos);
        
        if (this.props.onUpdate) {
            this.props.onUpdate(diff.diffX, diff.diffY, diff.diffW, diff.diffH);
        }
        
        this.uninstallEventHandlers();
    }
    
    private updateDraggingAreaPositionAndSize(originalRect: { top: number, left: number, width: number, height: number }, originalMousePos: { left: number, top: number, diffX: number, diffY: number }) {
        let diff = this.calculateDiff(originalRect, originalMousePos);
        
        if (this.props.onPreview) {
            this.props.onPreview(diff.diffX, diff.diffY, diff.diffW, diff.diffH);
        }
        
        this.draggingArea.style.top = (originalRect.top + diff.diffY) + 'px';
        this.draggingArea.style.left = (originalRect.left + diff.diffX) + 'px';
        this.draggingArea.style.width = (originalRect.width + diff.diffW) + 'px';
        this.draggingArea.style.height = (originalRect.height + diff.diffH) + 'px';
    }
    private calculateDiff(originalRect: { top: number, left: number, width: number, height: number }, originalMousePos: { left: number, top: number, diffX: number, diffY: number }) {
        let diffX = 0;
        let diffY = 0;
        let diffW = 0;
        let diffH = 0;
        
        if (this.originalResizerDirection.top) {
            diffY = Math.min(originalRect.height, originalMousePos.diffY);
            diffH = -diffY;
        }
        if (this.originalResizerDirection.right) {
            diffW = Math.max(-originalRect.width, originalMousePos.diffX);
        }
        if (this.originalResizerDirection.bottom) {
            diffH = Math.max(-originalRect.height, originalMousePos.diffY);
        }
        if (this.originalResizerDirection.left) {
            diffX = Math.min(originalRect.width, originalMousePos.diffX);;
            diffW = -diffX;
        }
        
        return {
            diffX: diffX,
            diffY: diffY,
            diffW: diffW,
            diffH: diffH
        }
    }
    
    render() {
        return (
            pug `
                .internal-fsb-dragger(id='internal-fsb-dragger')
                    span.t.l(onMouseDown=this.mouseDown)
                    span.t(onMouseDown=this.mouseDown)
                    span.t.r(onMouseDown=this.mouseDown)
                    span.r(onMouseDown=this.mouseDown)
                    span.b.r(onMouseDown=this.mouseDown)
                    span.b(onMouseDown=this.mouseDown)
                    span.b.l(onMouseDown=this.mouseDown)
                    span.l(onMouseDown=this.mouseDown)
            `
        );
    }
}

DeclarationHelper.declare('Components.Dragger', Dragger);