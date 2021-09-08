import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CodeHelper} from '../../helpers/CodeHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {Accessories, EditorHelper} from './EditorHelper';
import {TimelineHelper} from './TimelineHelper';
import {StylesheetHelper} from './StylesheetHelper';
import {StatusHelper} from './StatusHelper';
import * as ClientAnimationHelper from '../../../helpers/AnimationHelper';
import {CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, CELL_STYLE_ATTRIBUTE_REGEX_LOCAL, EASING_COEFFICIENT, ANIMATABLE_CSS_PROPERTIES} from '../../Constants';

let stylesheetDefinitions = {};
let stylesheetDefinitionRevision = 0;
let cachedPrioritizedKeys = null;
let cachedPrioritizedKeysRevision = -1;

declare let window: any;
window.AnimationHelper = ClientAnimationHelper.AnimationHelper;

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
		  		if (stylesheetDefinitions[animationId].hasOwnProperty(presetId) && ['groupName', 'groupNote', 'groupState', 'groupTestState', 'groupMode', 'synchronizeMode'].indexOf(presetId) == -1) {
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
    
    AnimationHelper.renderStylesheetAndExtensionElement();
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
    AnimationHelper.renderStylesheetAndExtensionElement();
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
    AnimationHelper.renderStylesheetAndExtensionElement();
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
  				if (['groupName', 'groupNote', 'groupState', 'groupTestState', 'groupMode', 'synchronizeMode'].indexOf(presetId) != -1) continue;
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
  	
  	AnimationHelper.renderStylesheetAndExtensionElement();
  },
  setAnimationGroupTestState: function(groupTestState: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupTestState = groupTestState;
  	
  	AnimationHelper.renderStylesheetAndExtensionElement();
  },
  setAnimationGroupMode: function(groupMode: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupMode = groupMode;
    
    AnimationHelper.renderStylesheetAndExtensionElement();
  },
  setAnimationSynchronizeMode: function(synchronizeMode: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].synchronizeMode = synchronizeMode;
    
    AnimationHelper.renderStylesheetAndExtensionElement();
  },
  setAnimationRepeatMode: function(presetId: string, repeatMode: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId].repeatMode = repeatMode;
    
    AnimationHelper.renderStylesheetAndExtensionElement();
  },
  setAnimationRepeatTime: function(presetId: string, repeatTime: string) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId].repeatTime = repeatTime;
    
    AnimationHelper.renderStylesheetAndExtensionElement();
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
  getAnimationGroupName: function() {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName || 'Untitled';
  },
  getAnimationGroupNote: function() {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupNote || '';
  },
  getAnimationGroupState: function() {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupState || null;
  },
  getAnimationGroupTestState: function() {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupTestState || null;
  },
  getAnimationGroupMode: function() {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupMode || null;
  },
  getAnimationSynchronizeMode: function() {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].synchronizeMode || null;
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
  getKeyframes: function(presetId: string, animationID: string=InternalProjectSettings.editingAnimationID) {
  	presetId = AnimationHelper.extendPresetIdWithSelectorIfNeed(presetId);
  	
		if (!animationID) return [];
		
		stylesheetDefinitions[animationID] = stylesheetDefinitions[animationID] || {};
    stylesheetDefinitions[animationID][presetId] = stylesheetDefinitions[animationID][presetId] || {};
		
  	return Object.keys(stylesheetDefinitions[animationID][presetId]).filter(keyframeID => ['repeatMode', 'repeatTime'].indexOf(keyframeID) == -1).map((keyframeID: string) => {
  		let hashMap = HTMLHelper.getHashMapFromInlineStyle(stylesheetDefinitions[animationID][presetId][keyframeID]);
  		
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
  isDisplaying: function(animationID: string=InternalProjectSettings.editingAnimationID) {
  	if (!animationID) return false;
		
		stylesheetDefinitions[animationID] = stylesheetDefinitions[animationID] || {};
		
  	switch (stylesheetDefinitions[animationID].groupTestState) {
  		case 'off':
  			return false;
  		case 'on':
  			return true;
  		default:
  			return (stylesheetDefinitions[animationID].groupState != 'off');
  	}
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
  renderStylesheetAndExtensionElement: function() {
    let style = document.getElementById('internal-fsb-animation');
    
    if (!style) {
      style = document.createElement('style');
      HTMLHelper.setAttribute(style, 'type', 'text/css');
      HTMLHelper.setAttribute(style, 'id', 'internal-fsb-animation');
      style.className = 'internal-fsb-accessory';
    	document.body.appendChild(style);
    }
    
    let script = document.getElementById('internal-fsb-animation-extension');
    script && script.remove();
    script = null;
    
    if (!script) {
      script = document.createElement('script');
      HTMLHelper.setAttribute(script, 'type', 'text/javascript');
      HTMLHelper.setAttribute(script, 'id', 'internal-fsb-animation-extension');
      script.className = 'internal-fsb-accessory';
    }
    
    let defaultClasses;
    
    [style.innerText, script.innerText, defaultClasses] = AnimationHelper.renderStylesheetAndExtension();
    
    let stylesheets = document.getElementsByTagName('link');
    for (const stylesheet of stylesheets) {
    	stylesheet.onload = AnimationHelper.renderStylesheetAndExtensionElement.bind(AnimationHelper);
    }
    
    document.body.appendChild(script);
  },
  renderStylesheetAndExtension: function(production: boolean=false, startOver: boolean=true): [string, string] {
  	let animationGroups = [];
  	let activeAnimationGroup = [];
  	let inactiveAnimationGroup = [];
  	let extensionScript = ['window.AnimationHelper !== undefined && (function() {'];
  	
  	for (let animationId in stylesheetDefinitions) {
  		if (stylesheetDefinitions.hasOwnProperty(animationId)) {
  			let lowPriorityAnimationAssignments = [];
  			let highPriorityAnimationAssignments = [];
  			let animationElements = [];
  			
  			const extensionInfo = {
  				tracks: []
  			};
  			
  			for (let presetId in stylesheetDefinitions[animationId]) {
		  		if (stylesheetDefinitions[animationId].hasOwnProperty(presetId) && ['groupName', 'groupNote', 'groupState', 'groupTestState', 'groupMode', 'synchronizeMode'].indexOf(presetId) == -1) {
						const track = {
							keyframes: [],
							selectors: [],
							properties: [],
							delay: 0,
							repeat: 0,
							total: 0
						};
				
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
		  					raw: HTMLHelper.getInlineStyleFromHashMap(clonedHashMap, true)
		  				};
		  			});
		  			
		  			if (keyframes.length == 0) continue;
		  			if (keyframes.length == 1) {
		  				const content = `${keyframes[0].raw}${keyframes[0].raw && ';' || ''}`.replace(/;/g, ' !important;');
		  				
		  				let repeatMode = stylesheetDefinitions[animationId][presetId].repeatMode || null;
		  				
		  				if (repeatMode != 'disabled') {
				  			if (animationId != 'selector') {
				  				if (StylesheetHelper.getStylesheetDefinition(presetId) && stylesheetDefinitions[animationId].synchronizeMode != 'off') {
				  					lowPriorityAnimationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] .-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"] .-fsb-preset-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-preset-${presetId} { ${content} }`);
				  				} else {
				  					lowPriorityAnimationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] [internal-fsb-guid="${presetId}"], [internal-fsb-animation*="animation-group-${animationId}"][internal-fsb-guid="${presetId}"] { ${content} }`);
				  				}
				  			} else {
				  				const splited = presetId.split(':');
				  				
				  				if (StylesheetHelper.getStylesheetDefinition(splited[0]) && stylesheetDefinitions[animationId].synchronizeMode != 'off') {
				  					lowPriorityAnimationAssignments.push(`.-fsb-self-${splited[0]}:${splited[1]}, .-fsb-preset-${splited[0]}:${splited[1]} { ${content} }`);
				  				} else {
				  					lowPriorityAnimationAssignments.push(`[internal-fsb-guid="${splited[0]}"]:${splited[1]} { ${content} }`);
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
				  		
				  		if (repeatMode != 'disabled') {
					  		const combinedInanimatableHashmap = {};
					  		const combinedNoneAssignmentHashmap = {};
					  		const combinedTransitionHashmap = {};
					  		
				  			for (let i=0; i<keyframes.length; i++) {
				  				let currentKeyframe = keyframes[i];
				  				let nextKeyframe = (i + 1 < keyframes.length) ? keyframes[i + 1] : null;
				  				let previousKeyframe = (i - 1 < keyframes.length) ? keyframes[i - 1] : null;
				  				
				  				let time = parseFloat(currentKeyframe.hashMap['-fsb-animation-keyframe-time']);
				  				let current = (total == 0) ? 0 : (time - delay) / total;
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
					  			
					  			const hashMap = currentKeyframe.hashMap;
					  			const animatableHashMap = {};
					  			const inanimatableHashMap = {};
					  			
					  			for (const key in hashMap) {
					  				if (key.indexOf('-fsb-animation-') == 0) continue;
					  				if (hashMap.hasOwnProperty(key) && ANIMATABLE_CSS_PROPERTIES_DICTIONARY[key] !== true) {
					  					inanimatableHashMap[key] = hashMap[key] + ' !important';
					  					combinedInanimatableHashmap[key] = hashMap[key] + ' !important';
					  				} else {
					  					animatableHashMap[key] = hashMap[key];
					  				}
					  				
					  				if (i == 0) {
					  				  combinedNoneAssignmentHashmap[key] = false;
					  				} else {
					  				  if (combinedNoneAssignmentHashmap[key] !== false) {
					  				    combinedNoneAssignmentHashmap[key] = true;
					  				  }
					  				}
					  			}
					  			
					  			const animatableInlineStyle = HTMLHelper.getInlineStyleFromHashMap(animatableHashMap, true);
					  			const inanimatableInlineStyle = HTMLHelper.getInlineStyleFromHashMap(inanimatableHashMap, true);
					  			const internalStyleKeys = Array.from(new Set([...HTMLHelper.getInternalStyleKeyFromHashMap(animatableHashMap), ...HTMLHelper.getInternalStyleKeyFromHashMap(inanimatableHashMap)]));
				  				
				  				if (previousKeyframe && previousKeyframe != currentKeyframe && internalStyleKeys.length != 0) {
				  					let easing1 = (['out', null].indexOf(EASING_COEFFICIENT[previousKeyframe.hashMap['-fsb-animation-easing-mode']] || null) != -1) ?
					  					(EASING_COEFFICIENT[previousKeyframe.hashMap['-fsb-animation-easing-fn']] || 0) : 0;
					  				let easing2 = 0;
					  				let easing3 = (['in', null].indexOf(EASING_COEFFICIENT[currentKeyframe.hashMap['-fsb-animation-easing-mode']] || null) != -1) ?
					  					(EASING_COEFFICIENT[currentKeyframe.hashMap['-fsb-animation-easing-fn']] || 0) : 0;
					  				let easing4 = 0;
					  				
				  					for (const key of internalStyleKeys) {
				  						combinedTransitionHashmap[key] = {
				  							delay: delay,
				  							duration: total - delay,
				  							timing: `cubic-bezier(${easing1}, ${easing2}, ${(1.0 - easing3).toFixed(4)}, ${(1.0 - easing4).toFixed(4)})`
				  						};
				  					}
				  				}
				  				
				  				if (animatableInlineStyle) {
					  				animationKeyframes.push(`${current * 100}% { ${animatableInlineStyle}${animatableInlineStyle && ';' || ''} ${timing.join('; ')}${timing.length != 0 && ';' || ''} }`);
					  				
						  			if (repeatMode == 'time' && i == keyframes.length - 1) {
						  				endOfAnimationKeyframes.push(`0% { ${animatableInlineStyle} ${timing.join('; ')}${timing.length != 0 && ';' || ''} }`);
						  				endOfAnimationKeyframes.push(`100% { ${animatableInlineStyle} ${timing.join('; ')}${timing.length != 0 && ';' || ''} }`);
						  			}
						  		}
					  			
					  			if (animationId != 'selector' && inanimatableInlineStyle) {
					  				if (StylesheetHelper.getStylesheetDefinition(presetId) && stylesheetDefinitions[animationId].synchronizeMode != 'off') {
					  					highPriorityAnimationAssignments.push(`[internal-fsb-animation*="animation-extension-${currentKeyframe.id}"] .-fsb-self-${presetId}, [internal-fsb-animation*="animation-extension-${currentKeyframe.id}"] .-fsb-preset-${presetId}, [internal-fsb-animation*="animation-extension-${currentKeyframe.id}"].-fsb-self-${presetId}, [internal-fsb-animation*="animation-extension-${currentKeyframe.id}"].-fsb-preset-${presetId} { ${inanimatableInlineStyle} }`);
					  				} else {
					  					highPriorityAnimationAssignments.push(`[internal-fsb-animation*="animation-extension-${currentKeyframe.id}"] [internal-fsb-guid="${presetId}"], [internal-fsb-animation*="animation-extension-${currentKeyframe.id}"][internal-fsb-guid="${presetId}"] { ${inanimatableInlineStyle} }`);
					  				}
					  			
						  			track.keyframes.push({
						  				id: currentKeyframe.id,
						  				time: time
						  			});
					  			}
				  			}
				  			
				  			for (const key in combinedNoneAssignmentHashmap) {
				  			  if (combinedNoneAssignmentHashmap.hasOwnProperty(key) && combinedNoneAssignmentHashmap[key] === true) {
				  			    track.properties.push(key);
				  			  }
				  			}
				  			
				  			track.delay = delay;
				  			track.repeat = (repeatMode == 'time') ? repeatTime : -1;
				  			track.total = total;
					  		
					  		const combinedInanimatableInlineStyle = HTMLHelper.getInlineStyleFromHashMap(combinedInanimatableHashmap, true);
				  			
				  			if (animationId == 'selector' && combinedInanimatableInlineStyle) {
				  				const splited = presetId.split(':');
				  				
				  				if (StylesheetHelper.getStylesheetDefinition(splited[0]) && stylesheetDefinitions[animationId].synchronizeMode != 'off') {
				  					highPriorityAnimationAssignments.push(`.-fsb-self-${splited[0]}:${splited[1]}, .-fsb-preset-${splited[0]}:${splited[1]} { ${combinedInanimatableInlineStyle} }`);
				  				} else {
				  					highPriorityAnimationAssignments.push(`[internal-fsb-guid="${splited[0]}"]:${splited[1]} { ${combinedInanimatableInlineStyle} }`);
				  				}
				  			}
				  			
				  			for (let prefix of ['@-webkit-keyframes', '@-moz-keyframes', '@-ms-keyframes', '@-o-keyframes', '@keyframes']) {
				  				animationElements.push(`${prefix} fsb-animation-${animationId}-${presetId.replace(':', '-')} { ${animationKeyframes.join(' ')} }`);
				  				
				  				if (repeatMode == 'time') {
				  					animationElements.push(`${prefix} fsb-animation-${animationId}-${presetId.replace(':', '-')}-end { ${endOfAnimationKeyframes.join(' ')} }`);
				  				}
				  			}
				  			
			  				let animations = [];
			  				
			  				for (let prefix of ['-webkit-', '-moz-', '-ms-', '-o-', '']) {
			  					if (repeatMode == 'time') {
			  						animations.push(`${prefix}animation-name: fsb-animation-${animationId}-${presetId.replace(':', '-')}, fsb-animation-${animationId}-${presetId.replace(':', '-')}-end; ${prefix}animation-delay: ${delay}s, ${delay + total * repeatTime}s; ${prefix}animation-duration: ${total}s, 1s; ${prefix}animation-iteration-count: ${(repeatMode != 'time') ? 'infinite' : repeatTime}, infinite;`);
			  					} else {
				  					animations.push(`${prefix}animation-name: fsb-animation-${animationId}-${presetId.replace(':', '-')}; ${prefix}animation-delay: ${delay}s; ${prefix}animation-duration: ${total}s; ${prefix}animation-iteration-count: ${(repeatMode != 'time') ? 'infinite' : repeatTime};`);
				  				}
				  			}
				  			
				  			let transitions = [];
				  				
			  				for (const key in combinedTransitionHashmap) {
			  					if (combinedTransitionHashmap.hasOwnProperty(key)) {
			  						const transition = combinedTransitionHashmap[key];
			  						transitions.push(`${key} ${transition.duration}s ${transition.timing} ${transition.delay}s`);
			  					}
			  				}
			  				
				  			if (transitions.length != 0) animations.push(`transition: ${transitions.join(', ')};`);
				  			
				  			if (animationId != 'selector') {
				  				if (StylesheetHelper.getStylesheetDefinition(presetId) && stylesheetDefinitions[animationId].synchronizeMode != 'off') {
				  				  track.selectors.push(`.-fsb-self-${presetId}`);
				  				  track.selectors.push(`.-fsb-preset-${presetId}`);
				  				  
				  					lowPriorityAnimationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] .-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"] .-fsb-preset-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-self-${presetId}, [internal-fsb-animation*="animation-group-${animationId}"].-fsb-preset-${presetId} { ${animations.join(' ')} }`);
				  				} else {
				  				  track.selectors.push(`[internal-fsb-guid="${presetId}"]`);
				  				  
				  					lowPriorityAnimationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] [internal-fsb-guid="${presetId}"], [internal-fsb-animation*="animation-group-${animationId}"][internal-fsb-guid="${presetId}"] { ${animations.join(' ')} }`);
				  				}
				  			} else {
				  				const splited = presetId.split(':');
				  				
				  				if (StylesheetHelper.getStylesheetDefinition(splited[0]) && stylesheetDefinitions[animationId].synchronizeMode != 'off') {
				  					lowPriorityAnimationAssignments.push(`.-fsb-self-${splited[0]}:${splited[1]}, .-fsb-preset-${splited[0]}:${splited[1]} { ${animations.join(' ')} }`);
				  				} else {
				  					lowPriorityAnimationAssignments.push(`[internal-fsb-guid="${splited[0]}"]:${splited[1]} { ${animations.join(' ')} }`);
				  				}
				  			}
				  		}
					  }
					  
					  if (track.keyframes.length != 0 || track.properties.length != 0) extensionInfo.tracks.push(track);
		  		}
		  	}
		  	
		  	animationGroups.push(animationElements.join(' '));
		  	animationGroups.push(lowPriorityAnimationAssignments.join(' '));
		  	animationGroups.push(highPriorityAnimationAssignments.join(' '));
		  	
  			if (extensionInfo.tracks.length != 0) extensionScript.push(`AnimationHelper.register('${animationId}', ${JSON.stringify(extensionInfo)});`);
		  	
		  	if (animationId != 'selector') {
		  		if (production) {
		  			if (stylesheetDefinitions[animationId].groupState != 'off') activeAnimationGroup.push(`${animationId}`);
		  			else inactiveAnimationGroup.push(`${animationId}`);
		  		} else {
		  			if (stylesheetDefinitions[animationId].groupTestState === 'on') activeAnimationGroup.push(`${animationId}`);
		  			else if (stylesheetDefinitions[animationId].groupTestState === 'off') inactiveAnimationGroup.push(`${animationId}`);
		  			else {
		  				if (stylesheetDefinitions[animationId].groupState != 'off') activeAnimationGroup.push(`${animationId}`);
		  				else inactiveAnimationGroup.push(`${animationId}`);
		  			}
		  		}
		  	}
  		}
  	}
  	
  	let begin = HTMLHelper.getElementByClassName('internal-fsb-begin');
  	
    if (startOver) {
      extensionScript.push(`AnimationHelper.reset();`);
      extensionScript.push(`AnimationHelper.remove(${JSON.stringify(inactiveAnimationGroup)});`);
      extensionScript.push(`AnimationHelper.remove(${JSON.stringify(activeAnimationGroup)});`);
      extensionScript.push(`AnimationHelper.add(${JSON.stringify(activeAnimationGroup)});`);
    } else {
      extensionScript.push(`AnimationHelper.add(${JSON.stringify(activeAnimationGroup)});`);
    }
	 	
	 	extensionScript.push('})();');
  	
  	let source = animationGroups.join(' ');
  	let script = extensionScript.join(' ');
  	
    return [source, script, activeAnimationGroup];
  }
};

export {AnimationHelper};