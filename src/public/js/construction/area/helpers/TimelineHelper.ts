import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';

let cachedElementTreeNodes = null;

var TimelineHelper = {
	invalidate: function() {
		cachedElementTreeNodes = null;
	},
  getElementTreeNodes: function(nodes: array=[], container: any=document.body) {
  	if (cachedElementTreeNodes) return cachedElementTreeNodes;
		
  	for (let element of container.childNodes) {
  		if (!element.getAttribute) continue;
  		
  		let name = HTMLHelper.getAttribute(element, 'internal-fsb-name');
  		let klass = HTMLHelper.getAttribute(element, 'internal-fsb-class');
  		let guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
  		let reactMode = HTMLHelper.getAttribute(element, 'internal-fsb-react-mode');
  		let isTheBeginElement = HTMLHelper.hasClass(element, 'internal-fsb-begin');
  		let isTableLayoutCell = (element.tagName == 'TD' && HTMLHelper.hasClass(element, 'internal-fsb-allow-cursor'));
  		let id = (isTableLayoutCell) ? HTMLHelper.getAttribute(element.parentNode.parentNode.parentNode, 'internal-fsb-guid') : HTMLHelper.getAttribute(element, 'internal-fsb-guid');
  		
  		if ((id || isTableLayoutCell) && !isTheBeginElement) {
  			nodes.push({
  				id: (isTableLayoutCell) ? id + ':' + [...element.parentNode.parentNode.childNodes].indexOf(element.parentNode) +
  					',' + [...element.parentNode.childNodes].indexOf(element) : id,
  				customClassName: (reactMode) ? 'is-react-component' : '',
  				name: (isTableLayoutCell) ? 'cell' : name,
  				deselectable: false,
  				selectable: !isTableLayoutCell,
  				dropable: (isTableLayoutCell ||
  					['FlowLayout', 'AbsoluteLayout', 'Rectangle', 'Button', 'Label'].indexOf(klass) != -1) &&
  					!HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting'),
					disabled: false,
					selected: (Accessories.resizer.getDOMNode().parentNode == element) ? true : false,
  				nodes: TimelineHelper.getElementTreeNodes([], element),
  				tag: {
  				  class: klass,
  				  guid: guid,
  				  options: {
		  	      name: 'name',
		  	      value: 'value',
		  	      selected: false
		  	    }
  				}
  			});
  		} else {
  			TimelineHelper.getElementTreeNodes(nodes, element);
  		}
  	}
  	if (container == document.body) cachedElementTreeNodes = nodes;
  	return nodes;
  }
};

export {TimelineHelper};