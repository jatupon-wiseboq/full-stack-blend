import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';

let cachedElementTreeNodes = null;

var LayoutHelper = {
	invalidate: function() {
		cachedElementTreeNodes = null;
	},
  calculateColumnSize: function(width: number) {
    let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      let measure = document.createElement('div');
      let i: number;
      
      selectingElement.parentNode.insertBefore(measure, selectingElement.parentNode.firstElementChild);
      
      for (i=1; i<=12; i++) {
        measure.className = 'col-' + i;
        if (HTMLHelper.getSize(measure)[0] >= width) break;
      }

      selectingElement.parentNode.removeChild(measure);
      
      return Math.min(12, i);
    } else {
      return null;
    }
  },
  getElementTreeNodes: function(nodes: array=[], container: any=document.body) {
  	if (container == document.body && cachedElementTreeNodes) return cachedElementTreeNodes;
  	if (!container.childNodes) return nodes;
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
  			nodes.push({
  				id: (isTableLayoutCell) ? id + ':' + [...element.parentNode.parentNode.childNodes].indexOf(element.parentNode) +
  					',' + [...element.parentNode.childNodes].indexOf(element) : id,
  				customClassName: (reactMode) ? 'is-react-component' : '',
  				name: (isTableLayoutCell) ? 'cell' : name,
  				selectable: !isTableLayoutCell,
  				dropable: (isTableLayoutCell ||
  					['FlowLayout', 'AbsoluteLayout', 'Rectangle', 'Button', 'Label'].indexOf(klass) != -1) &&
  					!HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting'),
					disabled: false,
					selected: (Accessories.resizer.getDOMNode().parentNode == element) ? true : false,
  				nodes: this.getElementTreeNodes([], element),
  				tag: {
  				  class: klass,
  				  guid: guid,
  				  options: LayoutHelper.getElementOptions(element)
  				}
  			});
  		} else {
  			this.getElementTreeNodes(nodes, element);
  		}
  	}
  	if (container == document.body) cachedElementTreeNodes = nodes;
  	return nodes;
  },
  getElementOptions: function(element: HTMLElement) {
    if (HTMLHelper.getAttribute(element, 'internal-fsb-class') == 'Select') {
      let children = HTMLHelper.getElementsByTagName('option', element.firstElementChild);
      return [...children].map((child) => {
        if (child.tagName)
  	    return {
  	      name: child.innerText,
  	      value: child.getAttribute('value'),
  	      selected: child.getAttribute('selected') == 'true'
  	    }
  	  });
  	} else {
  	  return null;
  	}
  },
  isNestedComponent: function(container: HTMLElement, componentID: string) {
  	if (!componentID) return false;
  	
  	let elements = HTMLHelper.findAllParentsInClassName('internal-fsb-element', container);
  	
    for (let element of elements) {
    	if (HTMLHelper.getAttribute(element, 'internal-fsb-react-mode') == 'Site' &&
    		HTMLHelper.getAttribute(element, 'internal-fsb-guid') == componentID) {
    		return true;
    	}
    }
    
    return false;
  },
  isContainedInInheritedComponent: function(_element: HTMLElement) {
  	if (!_element) return false;
  	
  	let elements = [...HTMLHelper.findAllParentsInClassName('internal-fsb-element', _element)];
  	
    for (let element of elements) {
    	if (HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting')) {
    		return true;
    	}
    }
    
    return false;
  }
};

export {LayoutHelper};