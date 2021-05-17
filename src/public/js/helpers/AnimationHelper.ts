// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HTMLHelper} from './HTMLHelper';

const extensions = {};
let resetCount = 0;

declare let window: any;

const AnimationHelper = {
	// Document Object Model (DOM) Queries
	// 
  add: (animations: any, container: any=HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0')) => {
    if (container) {
    	if (container.tagName != 'DIV') container = container.parentNode;
    	
    	let currentAnimations = [...(HTMLHelper.getAttribute(container, 'internal-fsb-animation') || '').split(' ')];
    	
    	for (let animation of animations) {
    		if (currentAnimations.indexOf('animation-group-' + animation) == -1) {
    			currentAnimations.push('animation-group-' + animation);
	    		
	    		(() => {
		    		const extensionInfo = extensions[animation];
		    		const begin = (new Date()).getTime();
		    		
		    		let current = [];
		    		let loop = 0;
		    		let delay = 0;
		    		const reset = resetCount;
		    		
		    		const render = () => {
		    			const now = (new Date()).getTime();
		    			const diff = (now - begin) / 1000;
		    			const currentFlattenAnimations = HTMLHelper.getAttribute(container, 'internal-fsb-animation') || '';
		    			
		    			let shouldContinue = false;
		    			
		    			for (let i=0; i<extensionInfo.tracks.length; i++) {
		    				const track = extensionInfo.tracks[i];
		    				
		    				if (current[i] === undefined) current[i] = 0;
		    				
			    			for (let j=current[i]; j<track.keyframes.length; j++) {
			    				const keyframe = track.keyframes[j];
			    				
			    				if (diff > loop * track.total + keyframe.time - delay) {
			    					if (currentFlattenAnimations.indexOf('animation-extension-' + keyframe.id) == -1) {
			    						const currentAnimations = Array.from(currentFlattenAnimations.split(' '));
			    						
			    						currentAnimations.push('animation-extension-' + keyframe.id);
			    						HTMLHelper.setAttribute(container, 'internal-fsb-animation', currentAnimations.join(' '));
			    					}
			    					
			    					current[i] = j;
			    				} else {
			    					break;
			    				}
			    			}
			    			
			    			if (current[i] < track.keyframes.length - 1) {
			    				shouldContinue = true;
			    			} else {
			    				loop++;
			    				
			    				if (loop < track.repeat || track.repeat == -1) {
			    					current[i] = 0;
			    					delay = track.delay;
			    					shouldContinue = true;
			    					
			    					const currentAnimations = (HTMLHelper.getAttribute(container, 'internal-fsb-animation') || '').split(' ');
			    					for (let k=0; k<track.keyframes.length; k++) {
			    						const index = currentAnimations.indexOf('animation-extension-' + track.keyframes[k].id);
				    					if (index != -1) currentAnimations.splice(index, 1);
			    					}
			    					HTMLHelper.setAttribute(container, 'internal-fsb-animation', currentAnimations.join(' '));
			    				}
			    			}
			    		}
		    			
		    			if (reset != resetCount) shouldContinue = false;
		    			if (currentFlattenAnimations.indexOf('animation-group-' + animation) == -1) shouldContinue = false;
		    			
		    			if (shouldContinue) window.requestAnimationFrame(render);
		    		};
		    		
		    		extensionInfo && window.requestAnimationFrame(render);
		    	})();
    		}
    	}
    	
    	currentAnimations = currentAnimations.filter(currentAnimation => currentAnimation != '');
    	HTMLHelper.setAttribute(container, 'internal-fsb-animation', currentAnimations.join(' '));
    }
  },
  remove: (animations: any, container: any=HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0')) => {
    if (container) {
    	if (container.tagName != 'DIV') container = container.parentNode;
    	
    	let currentAnimations = [...(HTMLHelper.getAttribute(container, 'internal-fsb-animation') || '').split(' ')];
    	
    	for (let animation of animations) {
    		let index = currentAnimations.indexOf('animation-group-' + animation);
    		if (index != -1) {
    			currentAnimations.splice(index, 1);
    		}
    		
    		const extensionInfo = extensions[animation];
    		if (!extensionInfo) continue;
    		
    		for (let i=0; i<extensionInfo.tracks.length; i++) {
		    	const track = extensionInfo.tracks[i];	
					
					for (let j=0; j<track.keyframes.length; j++) {
						const index = currentAnimations.indexOf('animation-extension-' + track.keyframes[j].id);
						if (index != -1) currentAnimations.splice(index, 1);
					}
				}
    	}
    	
    	currentAnimations = currentAnimations.filter(currentAnimation => currentAnimation != '');
    	HTMLHelper.setAttribute(container, 'internal-fsb-animation', currentAnimations.join(' '));
    }
  },
  register: (animationId: string, extensionInfo: any) => {
  	extensions[animationId] = extensionInfo;
  },
  reset: () => {
  	resetCount++;
  }
}

if (window.__animationHelperDelayedRegisterings !== undefined) {
	for (const args of window.__animationHelperDelayedRegisterings) {
		AnimationHelper.register.apply(null, args);
	}
	
	window.__animationHelperDelayedRegisterings = undefined;
}
if (window.__animationHelperDelayedAddings !== undefined) {
	for (const args of window.__animationHelperDelayedAddings) {
		AnimationHelper.add.apply(null, args);
	}
	
	window.__animationHelperDelayedAddings = undefined;
}

export {AnimationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.