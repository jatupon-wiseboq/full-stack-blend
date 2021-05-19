import {StylesheetHelper} from './StylesheetHelper';
import {AnimationHelper} from './AnimationHelper';
import {EditorHelper} from './EditorHelper';
import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CAMEL_OF_EVENTS_DICTIONARY} from '../../Constants';

let cachedElementAuthoringStatuses = null;
let cachedElementAuthoringRevision = 0;

var StatusHelper = {
	invalidate: function(element: HTMLElement) {
		cachedElementAuthoringStatuses = null;
		cachedElementAuthoringRevision++;
		
		if (element != null) EditorHelper.updateEditorProperties();
	},
  getElementAuthoringStatuses: () => {
  	if (cachedElementAuthoringStatuses != null) return cachedElementAuthoringStatuses;
  	
  	const statuses = {};
  	
  	const elements = Array.from(HTMLHelper.getElementsByAttribute('internal-fsb-guid'));
  	for (const element of elements) {
  		const guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
			statuses[guid] = StatusHelper.getElementAuthoringStatus(element);
  	}
		
		cachedElementAuthoringRevision++;
		
		cachedElementAuthoringStatuses = statuses;
  	return cachedElementAuthoringStatuses;
  },
  getElementAuthoringStatus: (element: HTMLElement) => {
  	const statuses = [''];
  	
  	const style = StylesheetHelper.getStyle(element);
  	if (style && (style + ';').replace(/-fsb-[^;]+;+/g, '').trim()) statuses.push('has-design');
  	
  	if (AnimationHelper.hasKeyframes(HTMLHelper.getAttribute(element, 'internal-fsb-guid'))) statuses.push('has-animation');
  	
  	const info = HTMLHelper.getAttributes(element, false);
  	let found = false;
  	for (const name of Object.keys(CAMEL_OF_EVENTS_DICTIONARY)) {
	    if (info[name]) {
	    	const value = JSON.parse(info[name]);
	    	if (value.event) {
	    		found = true;
	    		break;
	    	}
	    }
	  }
	  
	  if (!found) {
		  for (const name in info) {
		  	if (name.indexOf('internal-fsb-react-') == 0 || name.indexOf('internal-fsb-data-') == 0) {
		  		found = true;
	    		break;
		  	}
		  	
		  	if (info.hasOwnProperty(name)) {
				  for (const key of ['SETTING', 'PROPERTY', 'STATE', 'CODE']) {
			    	if (info[name] && info[name].indexOf(key) == 0) {
			    		found = true;
	    				break;
			    	}
			    }
			  }
			  if (found) break;
		  }
		}
		
		if (found) statuses.push('has-coding');
		
		const reactMode = HTMLHelper.getAttribute(element, 'internal-fsb-react-mode');
		const presetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name');
		
		if (reactMode) statuses.push('is-react-component');
		if (presetName) statuses.push('is-containing-preset');
  	
  	if (HTMLHelper.hasClass(element, 'internal-fsb-selecting')) statuses.push('-fsb-selecting');
  	
  	return statuses.join(' ').trim();
  },
  getElementAuthoringRevision: function() {
    return cachedElementAuthoringRevision;
  }
};

export {StatusHelper};