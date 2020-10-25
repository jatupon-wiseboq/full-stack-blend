import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {InternalProjectSettings} from './WorkspaceHelper.js';
import {EditorHelper} from './EditorHelper.js';
import {TimelineHelper} from './TimelineHelper.js';
import {CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, CELL_STYLE_ATTRIBUTE_REGEX_LOCAL} from '../../Constants.js';

let stylesheetDefinitions = {};
let stylesheetDefinitionRevision = 0;
let cachedPrioritizedKeys = null;
let cachedPrioritizedKeysRevision = -1;

var AnimationHelper = {
  generateStylesheetData: () => {
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
    AnimationHelper.setStylesheetDefinition(presetId, null, style);
  },
  getStyle: function(element: HTMLElement) {
    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
    let style = AnimationHelper.getStylesheetDefinition(presetId);
    
    return style;
  },
  hasStylesheetDefinition: function(presetId: string, groupId: string) {
  	if (!stylesheetDefinitions[groupId]) return false;
  	if (!stylesheetDefinitions[groupId][presetId]) return false;
  	
  	return Object.keys(stylesheetDefinitions[groupId][presetId]).length != 0;
  },
  getStylesheetDefinition: function(presetId: string) {
  	if (!InternalProjectSettings.editingAnimationID) return null;
  	if (!InternalProjectSettings.editingKeyframeID) return null;
  	
  	if (!stylesheetDefinitions[InternalProjectSettings.editingAnimationID]) return null;
  	if (!stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId]) return null;
  	
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID] || null;
  },
  removeStylesheetDefinition: function(presetId: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	if (!InternalProjectSettings.editingKeyframeID) return;
  	
    delete stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID];
    
    stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
    
    AnimationHelper.renderStylesheetElement();
  },
  setStylesheetDefinition: function(presetId: string, groupName: string, content: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	if (!InternalProjectSettings.editingKeyframeID) return;
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
    
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][InternalProjectSettings.editingKeyframeID] = content;
    
    stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
    
    AnimationHelper.renderStylesheetElement();
  },
  setAnimationGroup: function(editingAnimationID: string) {
  	InternalProjectSettings.editingAnimationID = editingAnimationID;
    
  	if (InternalProjectSettings.editingAnimationID) {
    	stylesheetDefinitionRevision++;
    
  		stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	}
  	
  	AnimationHelper.setCurrentKeyframe(null);
  	
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
    TimelineHelper.invalidate();
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName = groupName;
  },
  setAnimationGroupNote: function(groupNote: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupNote = groupNote;
  },
  setAnimationGroupState: function(groupState: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupState = groupState;
  },
  setAnimationGroupMode: function(groupMode: string) {
  	if (!InternalProjectSettings.editingAnimationID) return;
  	
  	stylesheetDefinitionRevision++;
    TimelineHelper.invalidate();
  	
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupMode = groupMode;
    
    AnimationHelper.renderStylesheetElement();
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
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions).sort((a, b) => {
        let pa = stylesheetDefinitions[a].groupName || 'Untitled';
        let pb = stylesheetDefinitions[b].groupName || 'Untitled';
        
        return (pa > pb) ? 1 : -1;
      });
      
      cachedPrioritizedKeys = cachedPrioritizedKeys.map((groupId) => {
      	let groupName = stylesheetDefinitions[groupId].groupName || 'Untitled';
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
		if (!InternalProjectSettings.editingAnimationID) return [];
		
		console.log(stylesheetDefinitions);
		
		stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || {};
		
  	return Object.keys(stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId]).map((keyframeID: string) => {
  		let hashMap = HTMLHelper.getHashMapFromInlineStyle(stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId][keyframeID]);
  		
  		return {
  			id: keyframeID,
  			time: hashMap['-fsb-animation-keyframe-time'] || 0
  		};
  	});
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
  renderStylesheet: function(production: boolean=false) {
  	let animationGroups = [];
  	let activeAnimationGroup = [];
  	
  	for (let animationId in stylesheetDefinitions) {
  		if (stylesheetDefinitions.hasOwnProperty(animationId)) {
  			let animationAssignments = [];
  			let animationElements = [];
  			
  			for (let presetId in stylesheetDefinitions[animationId]) {
		  		if (stylesheetDefinitions[animationId].hasOwnProperty(presetId)) {
		  			let animationKeyframes = [];
		  			
		  			let keyframes = Object.keys(stylesheetDefinitions[animationId][presetId]).map((keyframeId) => {
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
		  			
		  			keyframes = keyframes.sort((a, b) => {
		  				const timeA = parseFloat(a.hashMap['-fsb-animation-keyframe-time']);
		  				const timeB = parseFloat(b.hashMap['-fsb-animation-keyframe-time']);
		  				
		  				return (timeA > timeB) ? 1 : -1;
		  			});
		  			
		  			let delay = parseFloat(keyframes[0].hashMap['-fsb-animation-keyframe-time']);
		  			let total = parseFloat(keyframes[keyframes.length - 1].hashMap['-fsb-animation-keyframe-time']) - delay;
		  			
		  			for (let i=0; i<keyframes.length; i++) {
		  				let currentKeyframe = keyframes[i];
		  				let nextKeyframe = (i + 1 < keyframes.length) ? keyframes[i + 1] : null;
		  				
		  				let current = (total == 0) ? 0 : (parseFloat(currentKeyframe.hashMap['-fsb-animation-keyframe-time']) - delay) / total;
		  				
		  				animationKeyframes.push(`${current * 100}% { ${currentKeyframe.raw} }`);
		  			}
		  			
		  			for (let prefix of ['@-webkit-keyframes', '@-moz-keyframes', '@-ms-keyframes', '@-o-keyframes', '@keyframes']) {
		  				animationElements.push(`${prefix} fsb-animation-${presetId} { ${animationKeyframes.join(' ')} }`);
		  			}
		  			
		  			animationAssignments.push(`[internal-fsb-animation*="animation-group-${animationId}"] [internal-fsb-guid="${presetId}"] { animation-name: fsb-animation-${presetId}; animation-delay: ${delay}s; animation-duration: ${total}s; animation-iteration-count: infinite; }`);
		  		}
		  	}
		  	
		  	animationGroups.push(animationElements.join(' '));
		  	animationGroups.push(animationAssignments.join(' '));
		  	
		  	if (stylesheetDefinitions[animationId].groupState != 'off') activeAnimationGroup.push(`animation-group-${animationId}`);
  		}
  	}
  	
  	HTMLHelper.setAttribute(document.body, 'internal-fsb-animation', '');
  	window.setTimeout(() => {
  		HTMLHelper.setAttribute(document.body, 'internal-fsb-animation', activeAnimationGroup.join(' '));
  	}, 0);
  	
  	let source = animationGroups.join(' ');
    return source;
  }
};

export {AnimationHelper};