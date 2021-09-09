import {HTMLHelper} from '../../helpers/HTMLHelper';
import {RandomHelper} from '../../helpers/RandomHelper';
import {AnimationHelper} from './AnimationHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {Accessories, EditorHelper} from './EditorHelper';

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
				customClassName: (info.id == 'selector') ? 'selector' : '',
				name: info.name || 'Untitled',
				deselectable: false,
				selectable: true,
				dropable: false,
				insertable: true,
				dragable: true,
				disabled: Accessories.resizer.getDOMNode().parentNode == null,
				selected: false,
				nodes: (info.id == 'selector') ? TimelineHelper.getSelectorTreeNodes() : TimelineHelper.recursiveGetElementTreeNodes(undefined, undefined, info.id),
				tag: {
					key: info.id,
					root: true,
					keyframes: null,
					display: AnimationHelper.isDisplaying(info.id)
				}
			});
  	}
		
		cachedElementTreeNodes = nodes;
  	return cachedElementTreeNodes;
  },
  recursiveGetElementTreeNodes: function(nodes: array=[], container: any=document.body, key: string=null) {
  	if (HTMLHelper.hasAttribute(container, 'internal-fsb-inheriting')) return nodes;
  	
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
						insertable: true,
						dragable: true,
						disabled: false,
						selected: (key == InternalProjectSettings.editingAnimationID && Accessories.resizer.getDOMNode().parentNode == element) ? true : false,
	  				nodes: TimelineHelper.recursiveGetElementTreeNodes([], element, key),
	  				tag: {
	  					key: key,
	  					root: false,
	  					keyframes: AnimationHelper.getKeyframes(guid, key),
	  					display: AnimationHelper.isDisplaying(key)
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
  },
  getSelectorTreeNodes: function() {
  	if (Accessories.resizer.getDOMNode().parentNode == null || InternalProjectSettings.editingAnimationID != 'selector') return [];
  	else return ['Active', 'Focus', 'Hover', 'Visited'].map((selector) => {
  		const selectorId = `:${selector.toLowerCase()}`;
  		return {
				id: selectorId,
				customClassName: '',
				name: selector,
				deselectable: false,
				selectable: true,
				dropable: false,
				disabled: false,
				selected: (selectorId == AnimationHelper.getAnimationSelector()),
				nodes: [],
				tag: {
					key: 'selector',
					root: false,
					keyframes: AnimationHelper.getKeyframes(selectorId),
					display: true
				}
			}
  	});
  }
};

export {TimelineHelper};