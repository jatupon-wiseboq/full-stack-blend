import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../helpers/MathHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {EditorHelper} from '../helpers/EditorHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
    onUpdate(selectedCells: [HTMLTableCellElement]);
}

interface State {
}

class CellDragger extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    private cellElement: HTMLTableCellElement = null;
    private allCellElements: [HTMLTableCellElement] = [];
    
    private originalMousePos: Point = {
        x: 0,
        y: 0
    };
    
    constructor() {
        super();
    }
    
    componentDidMount() {
    }
    
    public setCellElement(element: HTMLTableCellElement) {
        if (this.cellElement == element) return;
    
        if (this.cellElement != null) {
          this.cellElement.removeEventListener('mousedown', this.mouseDown, false);
        }
        
        this.clearSelection();
        
        if (element !== null) {
          element.addEventListener('mousedown', this.mouseDown, false);
          
          let table = HTMLHelper.findTheParentInClassName('internal-fsb-table-layout', element);
          this.allCellElements = HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', table, 'internal-fsb-element');
        } else {
          this.allCellElements = [];
        }
        
        this.cellElement = element;
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
        this.clearSelection();
        
        let mousePosition = EventHelper.getMousePosition(event);
        
        this.originalMousePos.x = mousePosition[0];
        this.originalMousePos.y = mousePosition[1];
        
        this.installEventHandlers();
        
        EventHelper.setDenyForHandle('click', true);
        return EventHelper.cancel(event);
    }
    private mouseMove(event) {
        let mousePosition = EventHelper.getMousePosition(event);

        this.updateSelection({x: mousePosition[0], y: mousePosition[1]});
    }
    private mouseUp(event) {
        this.uninstallEventHandlers();
        
        EventHelper.setDenyForHandle('click', false, 100);
    }
    
    private updateSelection(mousePosition: Point) {
        this.clearSelection();
        
        let mouseRegion = MathHelper.createRegion(this.originalMousePos, mousePosition);
        
        for (let cell of this.allCellElements) {
            let position = HTMLHelper.getPosition(cell);
            let size = HTMLHelper.getSize(cell);
            
            let cellRegion = {
                x: position[0],
                y: position[1],
                width: size[0],
                height: size[1]
            };
            
            if (MathHelper.isOverlap(mouseRegion, cellRegion)) {
                HTMLHelper.addClass(cell, 'internal-fsb-selected');
            }
        }
    }
    
    private clearSelection() {
        for (let cell of this.allCellElements) {
            HTMLHelper.removeClass(cell, 'internal-fsb-selected');
        }
    }
    
    render() {
        return (<div />);
    }
}

DeclarationHelper.declare('Controls.CellDragger', CellDragger);

export {Props, State, CellDragger};