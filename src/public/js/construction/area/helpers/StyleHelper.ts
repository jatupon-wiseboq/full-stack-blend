import {HTMLHelper} from '../../helpers/HTMLHelper.js';

let defaultElement = document.createElement('div');

var StyleHelper = {
  getElementComputedStyleNodes: function(element: HTMLElement) {
  	let nodes = [];
  	let isGuideOn = HTMLHelper.hasClass(document.documentElement, 'internal-fsb-guide-on');
  	
  	if (isGuideOn) {
	  	HTMLHelper.removeClass(document.documentElement, 'internal-fsb-guide-on');
	    HTMLHelper.addClass(document.documentElement, 'internal-fsb-guide-off');
  	}
  	
  	document.body.appendChild(defaultElement);
  	
  	let computedStyle = StyleHelper.getComputedStyle(element);
  	let defaultStyle = StyleHelper.getComputedStyle(defaultElement);
  	
  	for (let name in computedStyle) {
  		if (computedStyle.hasOwnProperty(name)) {
  			let style = computedStyle[name];
  			
  			if (name.match(/^[0-9]+$/)) continue;
  			if (!style) continue;
  			
		  	nodes.push({
					id: 'id',
					customClassName: (style === defaultStyle[name]) ? 'original' : 'different',
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
  	
  	document.body.removeChild(defaultElement);
  	
  	if (isGuideOn) {
	  	HTMLHelper.removeClass(document.documentElement, 'internal-fsb-guide-off');
	    HTMLHelper.addClass(document.documentElement, 'internal-fsb-guide-on');
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