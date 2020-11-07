import {EventHelper} from '../../helpers/EventHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../helpers/MathHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import {EditorHelper} from '../helpers/EditorHelper.js';
import {StylesheetHelper} from '../helpers/StylesheetHelper.js';

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
	private domElement: HTMLElement = null;

	private originalMousePos: Point = {
		x: 0,
		y: 0
	};

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
	public refresh() {
	  let tableElement = this.tableElement;
	  this.setTableElement(null);
	  this.setTableElement(tableElement);
	}
	public getInfo() {
		let li = Number.MAX_SAFE_INTEGER;
		let ri = Number.MIN_SAFE_INTEGER;
		let ti = Number.MAX_SAFE_INTEGER;
		let bi = Number.MIN_SAFE_INTEGER;
		
		let results = {};
		let x, y;
		
		if (this.tableElement != null) {
			// Find the edges of the selected element.
			// 
			for (let cell of this.allCellElements) {
				if (HTMLHelper.hasClass(cell, 'internal-fsb-selected')) {
					x = [...cell.parentNode.childNodes].indexOf(cell);
					y = [...this.tableElement.firstElementChild.childNodes].indexOf(cell.parentNode);
					
					li = Math.min(li, x);
					ri = Math.max(ri, x);
					ti = Math.min(ti, y);
					bi = Math.max(bi, y);
				}
			}
			
			let isCollapseMode = (HTMLHelper.getAttribute(this.tableElement, 'internal-fsb-table-collapse') == 'true');
			
			// List all cell borders that can be formatted.
			// 
			for (let cell of this.allCellElements) {
				if (HTMLHelper.hasClass(cell, 'internal-fsb-selected')) {
					x = [...cell.parentNode.childNodes].indexOf(cell);
					y = [...this.tableElement.firstElementChild.childNodes].indexOf(cell.parentNode);
					let prefix = '-fsb-cell-' + x + '-' + y + '-';
					let prefixOffsetRight = '-fsb-cell-' + (x + 1) + '-' + y + '-';
					let prefixOffsetBottom = '-fsb-cell-' + x + '-' + (y + 1) + '-';
					let prefixOffsetLeft = '-fsb-cell-' + (x - 1) + '-' + y + '-';
					let prefixOffsetTop = '-fsb-cell-' + x + '-' + (y - 1) + '-';
					
					let dt = this.getBorderDefinition(x, y, Edge.TOP);
					let dr = this.getBorderDefinition(x, y, Edge.RIGHT);
					let db = this.getBorderDefinition(x, y, Edge.BOTTOM);
					let dl = this.getBorderDefinition(x, y, Edge.LEFT);
					
					if (y == ti) { // top
						if (!isCollapseMode) {
							results[prefix + 'top'] = dt;
						} else {
							results[prefix + 'top'] = dt;
							if (y - 1 >= 0) {
								results[prefix + 'top:' + prefixOffsetTop + 'bottom'] = dt;
							}
						}
					}
					if (x == ri) { // right
						if (!isCollapseMode) {
							results[prefix + 'right'] = dr;
						} else {
							if (x + 1 < cell.parentNode.childNodes.length) {
								results[prefix + 'right'] = (!this.getBorderDefinition(x + 1, y, Edge.LEFT)) ? null : dr;
								results[prefix + 'right:' + prefixOffsetRight + 'left'] = dr;
							}
							if (x == cell.parentNode.childNodes.length - 1) {
								results[prefix + 'right'] = dr;
							}
						}
					}
					if (y == bi) { // bottom
						if (!isCollapseMode) {
							results[prefix + 'bottom'] = db;
						} else {
							if (y + 1 < this.tableElement.firstElementChild.childNodes.length) {
								if (this.tableElement.firstElementChild.childNodes[y + 1].tagName == 'TR') {
									results[prefix + 'bottom'] = (!this.getBorderDefinition(x, y + 1, Edge.TOP)) ? null : db;
									results[prefix + 'bottom:' + prefixOffsetBottom + 'top'] = results[prefix + 'bottom'];
								} else {
									results[prefix + 'bottom'] = db;
								}
							} else if (y + 1 == this.tableElement.firstElementChild.childNodes.length) {
								results[prefix + 'bottom'] = db;
							}
						}
					}
					if (x == li) { // left
						if (!isCollapseMode) {
							results[prefix + 'left'] = dl;
						} else {
							results[prefix + 'left'] = dl;
							if (x - 1 >= 0) {
								results[prefix + 'left:' + prefixOffsetLeft + 'right'] = dl;
							}
						}
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
		
		results['-fsb-cell-style'] = this.getBorderStyle();
		
		return results;
	}
	private getBorderStyle() {
		if (this.tableElement == null) return null;
		
		let style = StylesheetHelper.getStyleAttribute(this.tableElement, '-fsb-cell-border-style');
		let color = StylesheetHelper.getStyleAttribute(this.tableElement, '-fsb-cell-border-color');
		let size = StylesheetHelper.getStyleAttribute(this.tableElement, '-fsb-cell-border-size');
		
		return [size, style, color].join(' ');
	}
	private getBorderDefinition(x: number, y: number, edge: Edge) {
		return StylesheetHelper.getStyleAttribute(this.tableElement, '-fsb-cell-' + x + '-' + y + '-' + edge.description);
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
    return (
        pug `
          .internal-fsb-accessory
        `
    )
  }
}

DeclarationHelper.declare('Controls.CellFormater', CellFormater);

export {Props, State, CellFormater};