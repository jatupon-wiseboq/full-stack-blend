// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HTMLHelper} from './HTMLHelper.js';

const AnimationHelper = {
	// Document Object Model (DOM) Queries
	// 
  add: (animations: any) => {
    let container = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0');
    if (container) {
    	let currentAnimations = [...(HTMLHelper.getAttribute(container, 'internal-fsb-animation') || '').split(' ')];
    	
    	for (let animation of animations) {
    		if (currentAnimations.indexOf('animation-group-' + animation) == -1) {
    			currentAnimations.append('animation-group-' + animation);
    		}
    	}
    	
    	currentAnimations = currentAnimations.filter(currentAnimation => currentAnimation != '');
    	HTMLHelper.setAttribute(container, 'internal-fsb-animation', currentAnimations.join(' '));
    }
  },
  remove: (animations: any) => {
    let container = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0');
    if (container) {
    	let currentAnimations = [...(HTMLHelper.getAttribute(container, 'internal-fsb-animation') || '').split(' ')];
    	
    	for (let animation of animations) {
    		let index = currentAnimations.indexOf('animation-group-' + animation);
    		if (index != -1) {
    			currentAnimations.splice(index, 1);
    		}
    	}
    	
    	currentAnimations = currentAnimations.filter(currentAnimation => currentAnimation != '');
    	HTMLHelper.setAttribute(container, 'internal-fsb-animation', currentAnimations.join(' '));
    }
  }
}

export {AnimationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.