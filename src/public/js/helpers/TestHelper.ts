// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HTMLHelper} from './HTMLHelper';

const TestHelper = {
  identify: (delay: number=1000) => {
  	window.setTimeout(() => {
  		if (!HTMLHelper.getElementById('selenium-ide-indicator')) return;
  		
  		const elements = HTMLHelper.getElementsByAttribute('internal-fsb-guid');
  		
  		for (const element of elements) {
  			TestHelper.recursiveAssignId(element);
  		}
  	}, delay);
  },
  recursiveAssignId: (element: any, guid: string='_', suffix: string='') => {
  	if (!element.tagName) return;
  	
  	let currentId = HTMLHelper.getAttribute(element, 'id') || '';
  	
  	if (currentId.indexOf('internal-fsb-') == 0) currentId = '';
  	
  	const _guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
  	guid = _guid || guid;
  	
  	if (_guid) {
	  	const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', _guid, element.parentNode));
	  	const index = elements.indexOf(element);
	  	
	  	if (index == 0) suffix = '-first';
	  	else if (index == elements.length-1) suffix = '-last';
	  	else if (index != -1) suffix = `-${index}`;
	  }
  	
  	if (!currentId) HTMLHelper.setAttribute(element, 'id', `internal-fsb-${guid}${suffix}`);
  	
  	const children = element.children;
  	
  	for (let i=0; i<children.length; i++) {
  		TestHelper.recursiveAssignId(children[i], `${guid}-${suffix || i}`);
  	}
  }
}

export {TestHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.