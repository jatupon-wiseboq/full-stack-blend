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
    
    private draggingArea: HTMLElement = document.createElement('div');
    private originalRect: any = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };
    
    componentDidMount() {
        this.installDraggingArea();
    }
    
    private installDraggingArea() {
        ReactDOM.render(pug `
            .internal-fsb-dragging-area
        `, this.draggingArea);
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
        let selectingElement = EditorHelper.getSelectingElement();
        let position = HTMLHelper.findPosition(selectingElement);
        let size = HTMLHelper.findPosition(selectingElement);
        
        this.originalRect.left = position[0];
        this.originalRect.top = position[1];
        this.originalRect.width = size[0];
        this.originalRect.height = size[1];
        
        this.installEventHandlers();
        
        return EventHelper.cancel(event);
    }
    
    private mouseMove(event) {
        console.log('mouseMove');
    }
    
    private mouseUp(event) {
        console.log('mouseUp');
        
        this.uninstallEventHandlers();
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