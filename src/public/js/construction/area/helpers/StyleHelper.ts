import {HTMLHelper} from '../../helpers/HTMLHelper.js';

var StyleHelper = {
  getElementComputedStyleNodes: function(element: HTMLElement) {
  	let nodes = [];
  	let computedStyle = StyleHelper.getComputedStyle(element);
  	
  	for (let name in computedStyle) {
  		if (computedStyle.hasOwnProperty(name)) {
  			let style = computedStyle[name];
  			
  			if (name.match(/^[0-9]+$/)) continue;
  			if (!style) continue;
  			
		  	nodes.push({
					id: 'id',
					customClassName: '',
					name: `${name}: ${style}`,
					selectable: false,
					dropable: false,
					disabled: false,
					selected: false,
					nodes: [],
					tag: null
				});
			}
  	}
		
  	return nodes;
  },
  getComputedStyle(element: HTMLElement) {
    var computedStyle;
    if (typeof element.currentStyle != 'undefined') {
    	computedStyle = element.currentStyle;
    }
    else {
    	computedStyle = document.defaultView.getComputedStyle(element, null);
    }
    return computedStyle;
	}
};

export {StyleHelper};