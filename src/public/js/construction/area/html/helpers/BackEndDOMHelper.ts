import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {BackEndScriptHelper, DEFAULTS} from '../../../helpers/BackEndScriptHelper.js';
import {FORM_CONTROL_CLASS_LIST} from '../../../Constants.js';

var BackEndDOMHelper = {
	generateCodeForMergingSection: function(element: HTMLElement) {
  	let executions: [string] = [];
  	let lines: [string] = [];
  	BackEndDOMHelper.recursiveGenerateCodeForMergingSection(element, executions, lines);
    
    return [executions.join('\n'), lines.join('\n')];
  },
  recursiveGenerateCodeForMergingSection: function(element: HTMLElement, executions: [string], lines: [string]) {
  	if (HTMLHelper.hasClass(element, 'internal-fsb-accessory')) return;
    
    if (element && element.tagName) {
    	if (FORM_CONTROL_CLASS_LIST.indexOf(HTMLHelper.getAttribute(element, 'internal-fsb-class'))) {
		    let info = HTMLHelper.getAttributes(element, false);
    		
	    	let code, mapping;
	    	[code, mapping] = BackEndScriptHelper.generateMergingCode(info);
	    	
	    	if (code) lines.push(code);
    	}
    	
    	let children = [...element.childNodes];
      for (let child of children) {
        BackEndDOMHelper.recursiveGenerateCodeForMergingSection(child, executions, lines);
      }
    }
  }
}

export {BackEndDOMHelper};