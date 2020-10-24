import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {RandomHelper} from '../../helpers/RandomHelper.js';
import {AnimationHelper} from './AnimationHelper.js';
import {InternalProjectSettings} from './WorkspaceHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';

let cachedElementTreeNodes = null;

var TimelineHelper = {
	invalidate: function() {
		cachedElementTreeNodes = null;
	},
  getElementTreeNodes: function(nodes: array=[], container: any=document.body) {
  	if (cachedElementTreeNodes) return cachedElementTreeNodes;
  	
  	let infos = AnimationHelper.getStylesheetDefinitionKeys();
  	
  	if (!InternalProjectSettings.editingAnimationID) {
  		AnimationHelper.setAnimationGroup(RandomHelper.generateGUID());
  		infos = AnimationHelper.getStylesheetDefinitionKeys();
  	}
  	
  	for (let info of infos) {
			nodes.push({
				id: info.id,
				customClassName: '',
				name: info.name || 'Untitled',
				deselectable: false,
				selectable: true,
				dropable: false,
				disabled: false,
				selected: false,
				nodes: TimelineHelper.recursiveGetElementTreeNodes(undefined, undefined, info.id),
				tag: {
					key: info.id,
					root: true,
					keyframes: null
				}
			});
  	}
		
		cachedElementTreeNodes = nodes;
  	return cachedElementTreeNodes;
  },
  recursiveGetElementTreeNodes: function(nodes: array=[], container: any=document.body, key: string=null) {
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
  			if (AnimationHelper.hasStylesheetDefinition(id, key) || (element == EditorHelper.getSelectingElement() && key == InternalProjectSettings.editingAnimationID)) {
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
						selected: (key == InternalProjectSettings.editingAnimationID && Accessories.resizer.getDOMNode().parentNode == element) ? true : false,
	  				nodes: TimelineHelper.recursiveGetElementTreeNodes([], element, key),
	  				tag: {
	  					key: key,
	  					root: false,
	  					keyframes: (key == InternalProjectSettings.editingAnimationID) ? AnimationHelper.getKeyframes(guid) : []
	  				}
	  			});
	  		} else {
	  			TimelineHelper.recursiveGetElementTreeNodes(nodes, element, key);
	  		}
  		} else {
  			TimelineHelper.recursiveGetElementTreeNodes(nodes, element, key);
  		}
  	}
  	return nodes;
  }
};

export {TimelineHelper};