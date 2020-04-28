import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import {EditorHelper} from '../helpers/EditorHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
    onUpdate(original: {x: number, y: number, w: number, h: number}, diff: {dx: number, dy: number, dw: number, dh: number});
    onPreview(original: {x: number, y: number, w: number, h: number}, diff: {dx: number, dy: number, dw: number, dh: number});
}

interface State {
}

class Resizer extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    private draggingArea: HTMLElement = null;
    private originalRect: any = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    private originalMousePos: any = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    };
    private originalResizerDirection: any = {
        top: false,
        right: false,
        bottom: false,
        left: false
    };
    private domElement: HTMLElement = null;
    
    constructor() {
        super();
    }
    
    componentDidMount() {
        this.installDraggingArea();
    }
    
    public getDOMNode() {
        return this.domElement;
    }
    public setDOMNode(element: HTMLElement) {
        this.domElement = element;
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
        
        this.originalRect.x = elementPosition[0];
        this.originalRect.y = elementPosition[1];
        this.originalRect.w = elementSize[0];
        this.originalRect.h = elementSize[1];
        
        this.originalMousePos.x = mousePosition[0];
        this.originalMousePos.y = mousePosition[1];
        this.originalMousePos.dx = 0;
        this.originalMousePos.dy = 0;
        
        this.originalResizerDirection.top = HTMLHelper.hasClass(currentResizerElement, 't');
        this.originalResizerDirection.right = HTMLHelper.hasClass(currentResizerElement, 'r');
        this.originalResizerDirection.bottom = HTMLHelper.hasClass(currentResizerElement, 'b');
        this.originalResizerDirection.left = HTMLHelper.hasClass(currentResizerElement, 'l');
        
        this.installEventHandlers();
        
        this.draggingArea.style.display = 'block';
        this.updateDraggingAreaPositionAndSize(this.originalRect, {x: 0, y: 0, dx: 0, dy: 0});
        
        EventHelper.setDenyForHandle('click', true);
        return EventHelper.cancel(event);
    }
    private mouseMove(event) {
        let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), EventHelper.getCurrentWindow(event));
        
        if (this.originalResizerDirection.left || this.originalResizerDirection.right) {
            this.originalMousePos.dx = mousePosition[0] - this.originalMousePos.x;
        }
        if (this.originalResizerDirection.top || this.originalResizerDirection.bottom) {
            this.originalMousePos.dy = mousePosition[1] - this.originalMousePos.y;
        }
        
        this.updateDraggingAreaPositionAndSize(this.originalRect, this.originalMousePos);
    }
    private mouseUp(event) {
        this.draggingArea.style.display = 'none';
        
        let diff = this.calculateDiff(this.originalRect, this.originalMousePos);
        
        if (this.props.onUpdate) {
            this.props.onUpdate(this.originalRect, diff);
        }
        
        this.uninstallEventHandlers();
        
        EventHelper.setDenyForHandle('click', false, 100);
    }
    
    private updateDraggingAreaPositionAndSize(originalRect: { x: number, y: number, w: number, h: number }, originalMousePos: { x: number, y: number, dx: number, dy: number }) {
        let diff = this.calculateDiff(originalRect, originalMousePos);
        
        if (this.props.onPreview) {
            this.props.onPreview(originalRect, diff);
        }
        
        this.draggingArea.style.left = (originalRect.x + diff.dx) + 'px';
        this.draggingArea.style.top = (originalRect.y + diff.dy) + 'px';
        this.draggingArea.style.width = (originalRect.w + diff.dw) + 'px';
        this.draggingArea.style.height = (originalRect.h + diff.dh) + 'px';
    }
    private calculateDiff(originalRect: { x: number, y: number, w: number, h: number }, originalMousePos: { x: number, y: number, dx: number, dy: number }) {
        let dx = 0;
        let dy = 0;
        let dw = 0;
        let dh = 0;
        
        if (this.originalResizerDirection.right) {
            dw = Math.max(-originalRect.w, originalMousePos.dx);
        }
        if (this.originalResizerDirection.top) {
            dy = Math.min(originalRect.h, originalMousePos.dy);
            dh = -dy;
        }
        if (this.originalResizerDirection.bottom) {
            dh = Math.max(-originalRect.h, originalMousePos.dy);
        }
        if (this.originalResizerDirection.left) {
            dx = Math.min(originalRect.w, originalMousePos.dx);;
            dw = -dx;
        }
        
        return {
            dx: dx,
            dy: dy,
            dw: dw,
            dh: dh
        }
    }
    
    render() {
        return (
            pug `
                .internal-fsb-resizer(id='internal-fsb-resizer')
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

DeclarationHelper.declare('Controls.Resizer', Resizer);

export {Props, State, Resizer};