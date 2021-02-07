import {HTMLHelper} from '../../helpers/HTMLHelper';

let defaultElement = document.createElement('div');
let cachedElementComputedStyleNodesElement = null;
let cachedElementComputedStyleNodesResults = null;

var StyleHelper = {
	invalidate: function() {
		cachedElementComputedStyleNodesElement = null;
		cachedElementComputedStyleNodesResults = null;
	},
  getElementComputedStyleNodes: function(element: HTMLElement) {
  	if (cachedElementComputedStyleNodesElement == element && cachedElementComputedStyleNodesResults)
  		return cachedElementComputedStyleNodesResults;
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
  			if (style === defaultStyle[name] && name !== 'fontFamily') continue;
  			
		  	nodes.push({
					id: 'id',
					customClassName: 'different', // (style === defaultStyle[name]) ? 'original' : 'different',
					name: `${name}: ${style}`,
					selectable: false,
					dropable: false,
					disabled: false,
					selected: false,
					nodes: [],
					tag: {
						name: name,
						style: style
					}
				});
			}
  	}
  	
  	document.body.removeChild(defaultElement);
  	
  	if (isGuideOn) {
	  	HTMLHelper.removeClass(document.documentElement, 'internal-fsb-guide-off');
	    HTMLHelper.addClass(document.documentElement, 'internal-fsb-guide-on');
  	}
		
		cachedElementComputedStyleNodesResults = nodes;
  	return cachedElementComputedStyleNodesResults;
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