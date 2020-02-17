import {EventHelper} from '../helpers/EventHelper.js';
import {EditorHelper} from '../helpers/EditorHelper.js';
import {HTMLHelper} from '../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
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
    
    constructor () {
        super();
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
        let elementPosition = HTMLHelper.findOriginalPosition(HTMLHelper.findPosition(selectingElement), EventHelper.getCurrentWindow(event));
        let elementSize = HTMLHelper.findSize(selectingElement);
        let mousePosition = HTMLHelper.findOriginalPosition(EventHelper.getMousePosition(event), EventHelper.getCurrentWindow(event));
        
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
        let mousePosition = HTMLHelper.findOriginalPosition(EventHelper.getMousePosition(event), EventHelper.getCurrentWindow(event));
        
        if (this.originalResizerDirection.left || this.originalResizerDirection.right) {
            this.originalMousePos.diffX = mousePosition[0] - this.originalMousePos.left;
        }
        if (this.originalResizerDirection.top || this.originalResizerDirection.bottom) {
            this.originalMousePos.diffY = mousePosition[1] - this.originalMousePos.top;
        }
        
        this.updateDraggingAreaPositionAndSize(this.originalRect, { x: this.originalMousePos.diffX, y: this.originalMousePos.diffY });
    }
    private mouseUp(event) {
        this.draggingArea.style.display = 'none';
        
        this.uninstallEventHandlers();
    }
    
    private updateDraggingAreaPositionAndSize(originalRect: { top: number, left: number, width: number, height: number }, diff: { x: number, y: number }) {
        this.draggingArea.style.top = originalRect.top + 'px';
        this.draggingArea.style.left = originalRect.left + 'px';
        this.draggingArea.style.width = originalRect.width + 'px';
        this.draggingArea.style.height = originalRect.height + 'px';
        
        if (this.originalResizerDirection.top) {
            this.draggingArea.style.top = (originalRect.top + diff.y) + 'px';
            this.draggingArea.style.height = Math.max(originalRect.height - diff.y, 0) + 'px';
        }
        if (this.originalResizerDirection.right) {
            this.draggingArea.style.width = Math.max(originalRect.width + diff.x, 0) + 'px';
        }
        if (this.originalResizerDirection.bottom) {
            this.draggingArea.style.height = Math.max(originalRect.height + diff.y, 0) + 'px';
        }
        if (this.originalResizerDirection.left) {
            this.draggingArea.style.left = (originalRect.left + diff.x) + 'px';
            this.draggingArea.style.width = Math.max(originalRect.width - diff.x, 0) + 'px';
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