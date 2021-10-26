import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CodeHelper} from '../../helpers/CodeHelper';
import {FORWARD_STYLE_TO_CHILDREN_CLASS_LIST} from '../../Constants';

var MalformationRepairHelper = {
	repair: (container: HTMLElement=document) => {
  	MalformationRepairHelper.recursiveRepair([document.body]);
  },
	recursiveRepair: (elements: any) => {
    for (let j = 0; j < elements.length; j++) {
    	if (HTMLHelper.isForChildren(elements[j]) && (!elements[j].firstElementChild || !elements[j].firstElementChild.tagName)) {
    		elements[j].parentNode.removeChild(elements[j]);
    		continue;
    	}
    	
    	if (elements[j].getAttribute && FORWARD_STYLE_TO_CHILDREN_CLASS_LIST.indexOf(elements[j].getAttribute('internal-fsb-class')) != -1) {
    		if ((elements[j].getAttribute('style') || '').indexOf('-fsb-empty') == -1) {
    			elements[j].setAttribute('style', '-fsb-empty');
    		}
    		const currentConcatenatedClasses = elements[j].getAttribute('class') || '';
    		const internalConcatenatedClasses = CodeHelper.getInternalClasses(currentConcatenatedClasses);
    		if (currentConcatenatedClasses != internalConcatenatedClasses) {
    			elements[j].setAttribute('class', internalConcatenatedClasses);
    		}
    	
	  	  if (HTMLHelper.hasClass(elements[j], 'internal-fsb-selecting')) {
	  			HTMLHelper.removeClass(elements[j], 'internal-fsb-selecting');
	  		}
	  		
	  		if (HTMLHelper.hasClass(elements[j], 'internal-fsb-walking')) {
	  			HTMLHelper.removeClass(elements[j], 'internal-fsb-walking');
	  		}
    	}
  		
  		if (HTMLHelper.getAttribute(elements[j], 'internal-fsb-class') == 'FlowLayout') {
  			if (elements[j].firstElementChild &&
  				HTMLHelper.hasClass(elements[j].firstElementChild, 'container-fluid') &&
  				HTMLHelper.getAttribute(elements[j].firstElementChild, 'internal-fsb-class') != 'FlowLayout') {
  				
  				let current = elements[j].firstElementChild.firstElementChild &&
  					HTMLHelper.hasClass(elements[j].firstElementChild.firstElementChild, 'row') &&
  					elements[j].firstElementChild.firstElementChild.firstElementChild || null;
  					
  				while (current != null) {
  					const next = current;
  					current = current.nextElementSibling;
  					next && elements[j].appendChild(next);
  				}
  				
  				elements[j].removeChild(elements[j].firstElementChild);
  				
  				HTMLHelper.addClass(elements[j], 'internal-fsb-strict-layout');
  				HTMLHelper.addClass(elements[j], 'internal-fsb-allow-cursor');
  			}
  		}
  		
  		if (HTMLHelper.hasClass(elements[j], 'internal-fsb-begin')) {
  			HTMLHelper.removeClass(elements[j], 'container-fluid');
  		}
  		
  		if (HTMLHelper.hasClass(elements[j], 'internal-fsb-begin-layout')) {
  			HTMLHelper.removeClass(elements[j], 'row');
  		}
  		
  		if (elements[j].tagName != 'HTML' && HTMLHelper.hasClass(elements[j], 'internal-fsb-guide-on')) {
  			HTMLHelper.removeClass(elements[j], 'internal-fsb-guide-on');
  		}
  		
  		if (elements[j].tagName != 'HTML' && HTMLHelper.hasClass(elements[j], 'internal-fsb-guide-off')) {
  			HTMLHelper.removeClass(elements[j], 'internal-fsb-guide-off');
  		}
      
      elements[j].children && MalformationRepairHelper.recursiveRepair(elements[j].children);
    }
	}
};

export {MalformationRepairHelper};