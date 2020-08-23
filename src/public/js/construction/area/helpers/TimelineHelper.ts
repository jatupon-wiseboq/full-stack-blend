import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';

let cachedElementTreeNodes = null;

var TimelineHelper = {
	invalidate: function() {
		cachedElementTreeNodes = null;
	},
  getElementTreeNodes: function(nodes: array=[]) {
  	if (cachedElementTreeNodes) return cachedElementTreeNodes;
		
  	return nodes;
  }
};

export {TimelineHelper};