import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {AnimationHelper} from './AnimationHelper.js';
import {InternalProjectSettings} from './WorkspaceHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';

let cachedElementTreeNodes = null;

var TimelineHelper = {
	invalidate: function() {
		cachedElementTreeNodes = null;
	},
  getElementTreeNodes: function(nodes: array=[], container: any=document.body) {
  	let keys = AnimationHelper.getStylesheetDefinitionKeys();
  	
  	for (let key of keys) {
			nodes.push({
				id: key.id,
				customClassName: '',
				name: key.name,
				deselectable: false,
				selectable: true,
				dropable: false,
				disabled: false,
				selected: false,
				nodes: TimelineHelper.recursiveGetElementTreeNodes(),
				tag: {}
			});
  	}
		
  	return nodes;
  },
  recursiveGetElementTreeNodes: function(nodes: array=[], container: any=document.body) {
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
  			if (element == EditorHelper.getSelectingElement() || AnimationHelper.getStylesheetDefinition(id) != null) {
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
	  				nodes: TimelineHelper.recursiveGetElementTreeNodes([], element),
	  				tag: {}
	  			});
	  		} else {
	  			TimelineHelper.recursiveGetElementTreeNodes(nodes, element);
	  		}
  		} else {
  			TimelineHelper.recursiveGetElementTreeNodes(nodes, element);
  		}
  	}
  	if (container == document.body) cachedElementTreeNodes = nodes;
  	return nodes;
  }
};

export {TimelineHelper};