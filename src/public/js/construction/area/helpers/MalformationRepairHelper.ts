import {HTMLHelper} from '../../helpers/HTMLHelper.js';

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
    	
    	
      
      elements[j].children && MalformationRepairHelper.recursiveRepair(elements[j].children);
    }
	}
};

export {MalformationRepairHelper};