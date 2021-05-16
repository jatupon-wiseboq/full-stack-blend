import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CodeHelper} from '../../helpers/CodeHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {Accessories, EditorHelper} from './EditorHelper';
import {TimelineHelper} from './TimelineHelper';
import {StylesheetHelper} from './StylesheetHelper';
import {StatusHelper} from './StatusHelper';
import {CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, CELL_STYLE_ATTRIBUTE_REGEX_LOCAL, EASING_COEFFICIENT, ANIMATABLE_CSS_PROPERTIES} from '../../Constants';

let stylesheetDefinitions = {};
let stylesheetDefinitionRevision = 0;
let cachedPrioritizedKeys = null;
let cachedPrioritizedKeysRevision = -1;

const ANIMATABLE_CSS_PROPERTIES_DICTIONARY = {};
for (const property of ANIMATABLE_CSS_PROPERTIES) {
	ANIMATABLE_CSS_PROPERTIES_DICTIONARY[property] = true;
}

var AnimationHelper = {
  generateStylesheetData: () => {
  	CodeHelper.deleteEmptyKeys(stylesheetDefinitions);
  	
  	for (let animationId in stylesheetDefinitions) {
  		if (stylesheetDefinitions.hasOwnProperty(animationId)) {
  			for (let presetId in stylesheetDefinitions[animationId]) {
		  		if (stylesheetDefinitions[animationId].hasOwnProperty(presetId) && ['groupName', 'groupNote', 'groupState', 'groupMode'].indexOf(presetId) == -1) {
		  			for (let keyframeId in stylesheetDefinitions[animationId][presetId]) {
  						if (stylesheetDefinitions[animationId][presetId].hasOwnProperty(keyframeId) && ['repeatMode', 'repeatTime'].indexOf(keyframeId) == -1) {
  							if (stylesheetDefinitions[animationId][presetId][keyframeId]) {
  								stylesheetDefinitions[animationId][presetId][keyframeId] = stylesheetDefinitions[animationId][presetId][keyframeId].split('; ').sort().join('; ');
  							}
  						}
  					}
  				}
  			}
  		}
  	}
  	
    return stylesheetDefinitions;
  },
  initializeStylesheetData: (data: any) => {
    stylesheetDefinitions = data || {};
    stylesheetDefinitionRevision = 0;
    cachedPrioritizedKeys = null;
    cachedPrioritizedKeysRevision = -1;
    
    AnimationHelper.renderStylesheetElement();
  },
  setStyle: function(element: HTMLElement, style: string) {
    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
    AnimationHelper.setStylesheetDefinition(presetId, null, style);
  },
  getStyle: function(element: HTMLElement) {
    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
    let style = AnimationHelper.getStylesheetDefinition(presetId);
    
    return style;
  },
  hasStylesheetDefinition: function(presetId: string, groupId: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!stylesheetDefinitions[groupId]) return false;
  	if (!stylesheetDefinitions[groupId][presetId]) return false;
  	
  	return Object.keys(stylesheetDefinitions[groupId][presetId]).length != 0;
  },
  getStylesheetDefinition: function(presetId: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	if (!InternalProjectSettings.editingKeyframeID) return null;
  	
  	if (!stylesheetDefinitions[InternalProjectSettings.editingAnimationID]) return null;
  	if (!stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId]) return null;
  	
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID] || null;
  },
  removeStylesheetDefinition: function(presetId: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return;
  	if (!InternalProjectSettings.editingKeyframeID) return;
  	
    delete stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID];
    
    AnimationHelper.setCurrentKeyframe(null);
    
    stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
    AnimationHelper.renderStylesheetElement();
    StatusHelper.invalidate(HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', presetId.split(':')[0]));
  },
  setStylesheetDefinition: function(presetId: string, groupName: string, content: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return;
  	if (!InternalProjectSettings.editingKeyframeID) return;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
    
    if (content != null) stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID] = content;
    else delete stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID];
    
    stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
    AnimationHelper.renderStylesheetElement();
    StatusHelper.invalidate(HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', presetId.split(':')[0]));
    
  	console.log(JSON.stringify(stylesheetDefinitions));
  },
  setAnimationGroup: function(editingAnimationID: string) {
  	InternalProjectSettings.editingAnimationID = editingAnimationID;
    
  	for (let animationId in stylesheetDefinitions) {
  		if (InternalProjectSettings.editingAnimationID == animationId) continue;
  		if (stylesheetDefinitions.hasOwnProperty(animationId)) {
    		let found = false;
  			for (let presetId in stylesheetDefinitions[animationId]) {
  				if (['groupName', 'groupNote', 'groupState', 'groupMode'].indexOf(presetId) != -1) continue;
  				if (stylesheetDefinitions[animationId].hasOwnProperty(presetId)) {
  					if (Object.keys(stylesheetDefinitions[animationId][presetId]).length != 0) {
  						found = true;
  						break;
  					}
  				}
  			}
  			if (!found) delete stylesheetDefinitions[animationId];
  		}
  	}
  	
  	if (InternalProjectSettings.editingAnimationID) {
    	stylesheetDefinitionRevision++;
    
  		stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	}
  	
  	AnimationHelper.setCurrentKeyframe(null);
  	
    TimelineHelper.invalidate();
  	EditorHelper.updateEditorProperties();
  },
  setAnimationSelector: function(selector: string) {
  	InternalProjectSettings.editingSelector = selector;
  	
  	TimelineHelper.invalidate();
  	EditorHelper.updateEditorProperties();
  },
  setCurrentKeyframe: function(editingKeyframeID: string) {
  	InternalProjectSettings.editingKeyframeID = editingKeyframeID;
  	
    TimelineHelper.invalidate();
  	EditorHelper.updateEditorProperties();
  },
  setAnimationGroupName: function(groupName: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName = groupName;
  	
    TimelineHelper.invalidate();
  	EditorHelper.updateEditorProperties();
  },
  setAnimationGroupNote: function(groupNote: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupNote = groupNote;
  },
  setAnimationGroupState: function(groupState: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupState = groupState;
  	
  	AnimationHelper.renderStylesheetElement();
  },
  setAnimationGroupMode: function(groupMode: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupMode = groupMode;
    
    AnimationHelper.renderStylesheetElement();
  },
  setAnimationRepeatMode: function(presetId: string, repeatMode: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId].repeatMode = repeatMode;
    
    AnimationHelper.renderStylesheetElement();
  },
  setAnimationRepeatTime: function(presetId: string, repeatTime: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId].repeatTime = repeatTime;
    
    AnimationHelper.renderStylesheetElement();
  },
  getAnimationGroup: function() {
  	return InternalProjectSettings.editingAnimationID;
  },
  getAnimationSelector: function() {
  	return InternalProjectSettings.editingSelector || ':hover';
  },
  getCurrentKeyframe: function() {
  	return InternalProjectSettings.editingKeyframeID;
  },
  getAnimationGroupName: function(groupName: string) {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName || 'Untitled';
  },
  getAnimationGroupNote: function(groupNote: string) {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupNote || '';
  },
  getAnimationGroupState: function(groupState: string) {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupState || null;
  },
  getAnimationGroupMode: function(groupMode: string) {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupMode || null;
  },
  getAnimationRepeatMode: function(presetId: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
    
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId].repeatMode || null;
  },
  getAnimationRepeatTime: function(presetId: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
    
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId].repeatTime || null;
  },
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
    	if (!stylesheetDefinitions.hasOwnProperty('selector')) {
    		stylesheetDefinitions['selector'] = {
    		}
    	}
    	
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions).sort((a, b) => {
      	if (a == 'selector') return -1;
      	if (b == 'selector') return 1;
      	
        let pa = stylesheetDefinitions[a].groupName || 'Untitled';
        let pb = stylesheetDefinitions[b].groupName || 'Untitled';
        
        return (pa > pb) ? 1 : -1;
      });
      
      cachedPrioritizedKeys = cachedPrioritizedKeys.map((groupId) => {
      	let groupName = (groupId == 'selector') ? 'Mouse' : (stylesheetDefinitions[groupId].groupName || 'Untitled');
      	return {
      		id: groupId,
	      	name: groupName
	      }
      });
    }
    
    return cachedPrioritizedKeys;
  },
  getStylesheetDefinitionRevision: function() {
    return stylesheetDefinitionRevision;
  },
  getKeyframes: function(presetId: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
		if (!InternalProjectSettings.editingAnimationID) return [];
		
		stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
		
  	return Object.keys(stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId]).filter(keyframeID => ['repeatMode', 'repeatTime'].indexOf(keyframeID) == -1).map((keyframeID: string) => {
  		let hashMap = HTMLHelper.getHashMapFromInlineStyle(stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][keyframeID]);
  		
  		return {
  			id: keyframeID,
  			time: hashMap['-fsb-animation-keyframe-time'] || 0
  		};
  	});
  },
  hasKeyframes: function(presetId: string) {
  	for (const key in stylesheetDefinitions) {
  		if (stylesheetDefinitions.hasOwnProperty(key)) {
  			let definitions, keyframes;
  			
  			if (stylesheetDefinitions[key].hasOwnProperty(presetId)) {
	  			definitions = stylesheetDefinitions[key][presetId] || {};
	  			keyframes = Object.keys(definitions).filter(keyframeID => ['repeatMode', 'repeatTime'].indexOf(keyframeID) == -1);
	  			
	  			if (keyframes.length != 0) return true;
	  		}
	  		
	  		for (const selector of [':active', ':focus', ':hover', ':visited']) {
	  			if (stylesheetDefinitions[key].hasOwnProperty(presetId + selector)) {
		  			definitions = stylesheetDefinitions[key][presetId + selector] || {};
		  			keyframes = Object.keys(definitions).filter(keyframeID => ['repeatMode', 'repeatTime'].indexOf(keyframeID) == -1);
		  			
		  			if (keyframes.length != 0) return true;
		  		}
	  		}
  		}
  	}
  	return false;
  },
  extendPresetIdWithSelectorIfNeed: function(presetIdOrSelector: string) {
  	if (Accessories.resizer.getDOMNode().parentNode == null) return presetIdOrSelector;
  	
  	if (presetIdOrSelector && [':active', ':focus', ':hover', ':visited'].indexOf(presetIdOrSelector) != -1) {
  		const guid = HTMLHelper.getAttribute(Accessories.resizer.getDOMNode().parentNode, 'internal-fsb-guid');
  		return guid + presetIdOrSelector;
  	}
  	else if (presetIdOrSelector && presetIdOrSelector.indexOf(':') == -1 && AnimationHelper.getAnimationGroup() == 'selector') {
  		return presetIdOrSelector + AnimationHelper.getAnimationSelector();
  	}
  	else return presetIdOrSelector;
  },
  renderStylesheetElement: function() {
    let element = document.getElementById('internal-fsb-animation');
    if (!element) {
      element = document.createElement('style');
      HTMLHelper.setAttribute(element, 'type', 'text/css');
      HTMLHelper.setAttribute(element, 'id', 'internal-fsb-animation');
      element.className = 'internal-fsb-accessory';
      document.body.appendChild(element);
    }
    
    element.innerText = AnimationHelper.renderStylesheet();
  },
  renderStylesheet: function(production: boolean=false, startOver: boolean=true) {
  	let animationGroups = [];
  	let activeAnimationGroup = [];
  	
  	for (let animationId in stylesheetDefinitions) {
  		if (stylesheetDefinitions.hasOwnProperty(animationId)) {
  			let animationAssignments = [];
  			let animationElements = [];
  			
  			for (let presetId in stylesheetDefinitions[animationId]) {
		  		if (stylesheetDefinitions[animationId].hasOwnProperty(presetId) && ['groupName', 'groupNote', 'groupState', 'groupMode'].indexOf(presetId) == -1) {
		  			let animationKeyframes = [];
		  			let endOfAnimationKeyframes = [];
		  			
		  			let keyframes = Object.keys(stylesheetDefinitions[animationId][presetId])
		  				.filter(keyframeId => ['repeatMode', 'repeatTime'].indexOf(keyframeId) == -1)
		  				.map((keyframeId) => {
		  				let hashMap = HTMLHelper.getHashMapFromInlineStyle(stylesheetDefinitions[animationId][presetId][keyframeId]);
		  				let clonedHashMap = CodeHelper.clone(hashMap);
		  				
		  				delete clonedHashMap['-fsb-animation-keyframe-time'];
		  				
		  				return {
		  					id: keyframeId,
		  					hashMap: hashMap,
		  					raw: HTMLHelper.getInlineStyleFromHashMap(clonedHashMap)
		  				};
		  			});
		  			
		  			if (keyframes.length == 0) continue;
		  			if (keyframes.length == 1) {
		  				const content = `${keyframes[0].raw}${keyframes[0].raw && ';' || ''}`.replace(/;/g, ' !important;');
		  				
		  				let repeatMode = stylesheetDefinitions[animationId][presetId].repeatMode || null;
		  				
		  				if (repeatMode != 'disabled') {
				  			if (animationId != 'selector') {
				  				if (StylesheetHelper.getStylesheetDefinition(presetId)) {
				  					animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] .-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"] .-fsb-preset-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-preset-${presetId} { ${content} }`);
				  				} else {
				  					animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] [internal-fsb-guid="${presetId}"], [internal-fsb-animation*="animation-group-${animationId}"][internal-fsb-guid="${presetId}"] { ${content} }`);
				  				}
				  			} else {
				  				const splited = presetId.split(':');
				  				
				  				if (StylesheetHelper.getStylesheetDefinition(splited[0])) {
				  					animationAssignments.push(`.-fsb-self-${splited[0]}:${splited[1]}, .-fsb-preset-${splited[0]}:${splited[1]} { ${content} }`);
				  				} else {
				  					animationAssignments.push(`[internal-fsb-guid="${splited[0]}"]:${splited[1]} { ${content} }`);
				  				}
				  			}
				  		}
		  			} else {
			  			keyframes = keyframes.sort((a, b) => {
			  				const timeA = parseFloat(a.hashMap['-fsb-animation-keyframe-time']);
			  				const timeB = parseFloat(b.hashMap['-fsb-animation-keyframe-time']);
			  				
			  				return (timeA > timeB) ? 1 : -1;
			  			});
			  			
			  			let delay = parseFloat(keyframes[0].hashMap['-fsb-animation-keyframe-time']);
			  			let total = parseFloat(keyframes[keyframes.length - 1].hashMap['-fsb-animation-keyframe-time']) - delay;
			  			
			  			let repeatMode = stylesheetDefinitions[animationId][presetId].repeatMode || null;
			  			let repeatTime = stylesheetDefinitions[animationId][presetId].repeatTime || 1;
			  			
				  		const inanimatableHashMap = {};
				  		
			  			for (let i=0; i<keyframes.length; i++) {
			  				let currentKeyframe = keyframes[i];
			  				let nextKeyframe = (i + 1 < keyframes.length) ? keyframes[i + 1] : null;
			  				
			  				let current = (total == 0) ? 0 : (parseFloat(currentKeyframe.hashMap['-fsb-animation-keyframe-time']) - delay) / total;
			  				let timing = [];
			  				
			  				if (nextKeyframe != null) {
				  				let easing1 = (['out', null].indexOf(EASING_COEFFICIENT[currentKeyframe.hashMap['-fsb-animation-easing-mode']] || null) != -1) ?
				  					(EASING_COEFFICIENT[currentKeyframe.hashMap['-fsb-animation-easing-fn']] || 0) : 0;
				  				let easing2 = 0;
				  				let easing3 = (['in', null].indexOf(EASING_COEFFICIENT[nextKeyframe.hashMap['-fsb-animation-easing-mode']] || null) != -1) ?
				  					(EASING_COEFFICIENT[nextKeyframe.hashMap['-fsb-animation-easing-fn']] || 0) : 0;
				  				let easing4 = 0;
			  				
				  				for (let prefix of ['-webkit-', '-moz-', '-ms-', '-o-', '']) {
					  				timing.push(`${prefix}animation-timing-function: cubic-bezier(${easing1}, ${easing2}, ${(1.0 - easing3).toFixed(4)}, ${(1.0 - easing4).toFixed(4)})`);
					  			}
				  			}
				  			
				  			const hashMap = HTMLHelper.getHashMapFromInlineStyle(currentKeyframe.raw);
				  			const animatableHashMap = {};
				  			
				  			for (const key in hashMap) {
				  				if (hashMap.hasOwnProperty(key) && ANIMATABLE_CSS_PROPERTIES_DICTIONARY[key] !== true) {
				  					inanimatableHashMap[key] = hashMap[key] + ' !important';
				  				} else {
				  					animatableHashMap[key] = hashMap[key];
				  				}
				  			}
				  			
				  			const animatableInlineStyle = HTMLHelper.getInlineStyleFromHashMap(animatableHashMap);
			  				
			  				animationKeyframes.push(`${current * 100}% { ${animatableInlineStyle}${animatableInlineStyle && ';' || ''} ${timing.join('; ')}${timing.length != 0 && ';' || ''} }`);
			  				
				  			if (repeatMode == 'time' && i == keyframes.length - 1) {
				  				endOfAnimationKeyframes.push(`0% { ${animatableInlineStyle} ${timing.join('; ')}${timing.length != 0 && ';' || ''} }`);
				  				endOfAnimationKeyframes.push(`100% { ${animatableInlineStyle} ${timing.join('; ')}${timing.length != 0 && ';' || ''} }`);
				  			}
			  			}
			  			
				  		const inanimatableInlineStyle = HTMLHelper.getInlineStyleFromHashMap(inanimatableHashMap);
			  			
			  			for (let prefix of ['@-webkit-keyframes', '@-moz-keyframes', '@-ms-keyframes', '@-o-keyframes', '@keyframes']) {
			  				animationElements.push(`${prefix} fsb-animation-${presetId.replace(':', '-')} { ${animationKeyframes.join(' ')} }`);
			  				
			  				if (repeatMode == 'time') {
			  					animationElements.push(`${prefix} fsb-animation-${presetId.replace(':', '-')}-end { ${endOfAnimationKeyframes.join(' ')} }`);
			  				}
			  			}
			  			
			  			if (repeatMode != 'disabled') {
			  				if (inanimatableInlineStyle) {
				  				if (animationId != 'selector') {
					  				if (StylesheetHelper.getStylesheetDefinition(presetId)) {
					  					animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] .-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"] .-fsb-preset-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-preset-${presetId} { ${inanimatableInlineStyle} }`);
					  				} else {
					  					animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] [internal-fsb-guid="${presetId}"], [internal-fsb-animation*="animation-group-${animationId}"][internal-fsb-guid="${presetId}"] { ${inanimatableInlineStyle} }`);
					  				}
					  			} else {
					  				const splited = presetId.split(':');
					  				
					  				if (StylesheetHelper.getStylesheetDefinition(splited[0])) {
					  					animationAssignments.push(`.-fsb-self-${splited[0]}:${splited[1]}, .-fsb-preset-${splited[0]}:${splited[1]} { ${inanimatableInlineStyle} }`);
					  				} else {
					  					animationAssignments.push(`[internal-fsb-guid="${splited[0]}"]:${splited[1]} { ${inanimatableInlineStyle} }`);
					  				}
					  			}
					  		}
					  		
			  				let animations = [];
			  				
			  				for (let prefix of ['-webkit-', '-moz-', '-ms-', '-o-', '']) {
			  					if (repeatMode == 'time') {
			  						animations.push(`${prefix}animation-name: fsb-animation-${presetId.replace(':', '-')}, fsb-animation-${presetId.replace(':', '-')}-end; ${prefix}animation-delay: ${delay}s, ${delay + total * repeatTime}s; ${prefix}animation-duration: ${total}s, 1s; ${prefix}animation-iteration-count: ${(repeatMode != 'time') ? 'infinite' : repeatTime}, infinite;`);
			  					} else {
				  					animations.push(`${prefix}animation-name: fsb-animation-${presetId.replace(':', '-')}; ${prefix}animation-delay: ${delay}s; ${prefix}animation-duration: ${total}s; ${prefix}animation-iteration-count: ${(repeatMode != 'time') ? 'infinite' : repeatTime};`);
				  				}
				  			}
				  			
				  			if (animationId != 'selector') {
				  				if (StylesheetHelper.getStylesheetDefinition(presetId)) {
				  					animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] .-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"] .-fsb-preset-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-preset-${presetId} { ${animations.join(' ')} }`);
				  				} else {
				  					animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] [internal-fsb-guid="${presetId}"], [internal-fsb-animation*="animation-group-${animationId}"][internal-fsb-guid="${presetId}"] { ${animations.join(' ')} }`);
				  				}
				  			} else {
				  				const splited = presetId.split(':');
				  				
				  				if (StylesheetHelper.getStylesheetDefinition(splited[0])) {
				  					animationAssignments.push(`.-fsb-self-${splited[0]}:${splited[1]}, .-fsb-preset-${splited[0]}:${splited[1]} { ${animations.join(' ')} }`);
				  				} else {
				  					animationAssignments.push(`[internal-fsb-guid="${splited[0]}"]:${splited[1]} { ${animations.join(' ')} }`);
				  				}
				  			}
				  		}
				  	}
		  		}
		  	}
		  	
		  	animationGroups.push(animationElements.join(' '));
		  	animationGroups.push(animationAssignments.join(' '));
		  	
		  	if (animationId != 'selector') {
		  		if (stylesheetDefinitions[animationId].groupState != 'off') activeAnimationGroup.push(`animation-group-${animationId}`);
		  	}
  		}
  	}
  	
  	let begin = HTMLHelper.getElementByClassName('internal-fsb-begin');
  	
  	if (startOver) {
	  	HTMLHelper.setAttribute(begin, 'internal-fsb-animation', '');
	  	window.setTimeout(() => {
	  		HTMLHelper.setAttribute(begin, 'internal-fsb-animation', activeAnimationGroup.join(' '));
	  	}, 0);
	 	} else {
	 		HTMLHelper.setAttribute(begin, 'internal-fsb-animation', activeAnimationGroup.join(' '));
	 	}
  	
  	let source = animationGroups.join(' ');
    return source;
  }
};

export {AnimationHelper};