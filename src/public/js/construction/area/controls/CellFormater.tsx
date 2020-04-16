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

const Edge = Object.freeze({
    TOP:   Symbol("top"),
    RIGHT:  Symbol("right"),
    BOTTOM: Symbol("bottom"),
    LEFT: Symbol("left")
});

class CellFormater extends React.Component<Props, State> {
	static defaultProps: Props = {
	}

	private tableElement: HTMLTableElement = null;
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

	public setTableElement(element: HTMLTableElement) {
		if (this.tableElement == element) return;

		if (this.tableElement != null) {
			for (let cell of this.allCellElements) {
				cell.removeEventListener('mousedown', this.mouseDown, false);
			}
		}

		this.clearSelection();

		if (element !== null) {
			this.allCellElements = HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', element, 'internal-fsb-element');

			for (let cell of this.allCellElements) {
				cell.addEventListener('mousedown', this.mouseDown, false);
			}
		} else {
			this.allCellElements = [];
		}

		this.tableElement = element;
	}
	public getInfo() {
		let li = Number.MAX_SAFE_INTEGER;
		let ri = Number.MIN_SAFE_INTEGER;
		let ti = Number.MAX_SAFE_INTEGER;
		let bi = Number.MIN_SAFE_INTEGER;
		
		let results = {};
		let x, y;
		
		if (this.tableElement != null) {
			let offset = 0;
			
			// Finding an offset for the first TR element.
			// 
			for (let child of this.tableElement.childNodes) {
				if (child.tagName !== 'TR') offset++;
				else break;
			}
			
			// Find the edges of the selected element.
			// 
			for (let cell of this.allCellElements) {
				if (HTMLHelper.hasClass(cell, 'internal-fsb-selected')) {
					x = [...cell.parentNode.childNodes].indexOf(cell);
					y = [...cell.parentNode.parentNode.childNodes].indexOf(cell.parentNode) - offset;
					
					li = Math.min(li, x);
					ri = Math.max(ri, x);
					ti = Math.min(ti, y);
					bi = Math.max(bi, y);
				}
			}
			
			// List all cell borders that can be formatted.
			// 
			for (let cell of this.allCellElements) {
				if (HTMLHelper.hasClass(cell, 'internal-fsb-selected')) {
					x = [...cell.parentNode.childNodes].indexOf(cell);
					y = [...cell.parentNode.parentNode.childNodes].indexOf(cell.parentNode) - offset;
					let prefix = '-fsb-cell-' + x + '-' + y + '-';
					
					let dt = this.getBorderDefinition(x, y, Edge.TOP);
					let dr = this.getBorderDefinition(x, y, Edge.RIGHT);
					let db = this.getBorderDefinition(x, y, Edge.BOTTOM);
					let dl = this.getBorderDefinition(x, y, Edge.LEFT);
					
					if (y == ti) { // top
						results[prefix + 'top'] = dt;
					}
					if (x == ri) { // right
						results[prefix + 'right'] = dr;
					}
					if (y == bi) { // bottom
						results[prefix + 'bottom'] = db;
					}
					if (x == li) { // left
						results[prefix + 'left'] = dl;
					}
					if (x != ri) { // vertical on the right
						results[prefix + 'vertical:' + prefix + 'right'] = dr;
					}
					if (x != li) { // vertical on the left
						results[prefix + 'vertical:' + prefix + 'left'] = dl;
					}
					if (y != bi) { // horizontal on the bottom
						results[prefix + 'horizontal:' + prefix + 'bottom'] = db;
					}
					if (y != ti) { // horizontal on the top
						results[prefix + 'horizontal:' + prefix + 'top'] = dt;
					}
				}
			}
		}
		
		console.log(results);
		
		return results;
	}
	private getBorderDefinition(x: number, y: number, edge: Edge) {
		return EditorHelper.getStyleAttribute(this.tableElement, '-fsb-cell-' + x + '-' + y + '-' + edge.description);
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
	}
	private mouseMove(event) {
		let mousePosition = EventHelper.getMousePosition(event);

		this.updateSelection({x: mousePosition[0], y: mousePosition[1]});
	}
	private mouseUp(event) {
		this.uninstallEventHandlers();
		
		EditorHelper.updateEditorProperties();
		
		EventHelper.setDenyForHandle('click', false, 100);
		return EventHelper.cancel(event);
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

DeclarationHelper.declare('Controls.CellFormater', CellFormater);

export {Props, State, CellFormater};