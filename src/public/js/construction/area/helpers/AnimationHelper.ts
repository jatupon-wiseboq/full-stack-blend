import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {InternalProjectSettings} from './WorkspaceHelper.js';
import {EditorHelper} from './EditorHelper.js';
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
  getStylesheetDefinition: function(presetId: string) {
  	if (!stylesheetDefinitions[InternalProjectSettings.editingAnimationID]) return null;
  	else return stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] || null;
  },
  removeStylesheetDefinition: function(presetId: string) {
    delete stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId];
    
    stylesheetDefinitionRevision++;
    
    AnimationHelper.renderStylesheetElement();
  },
  setStylesheetDefinition: function(presetId: string, groupName: string, content: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
    stylesheetDefinitions[InternalProjectSettings.editingAnimationID][presetId] = content;
    
    if (groupName) {
    	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName = groupName;
    }
    
    stylesheetDefinitionRevision++;
    
    AnimationHelper.renderStylesheetElement();
  },
  setAnimationGroupName: function(groupName: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName = groupName;
  },
  setAnimationGroupNote: function(groupNote: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupNote = groupNote;
  },
  setAnimationGroupState: function(groupState: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupState = groupState;
  },
  getAnimationGroupName: function(groupName: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupName || 'Untitled';
  },
  getAnimationGroupNote: function(groupNote: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupNote || '';
  },
  getAnimationGroupState: function(groupState: string) {
  	stylesheetDefinitions[InternalProjectSettings.editingAnimationID] = stylesheetDefinitions[InternalProjectSettings.editingAnimationID] || {};
  	return stylesheetDefinitions[InternalProjectSettings.editingAnimationID].groupState || null;
  },
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions);
      
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
  	return '';
  	
    let lines = [];
    let prioritizedKeys = AnimationHelper.getStylesheetDefinitionKeys();
    let inversedReferenceHash = {};
    let wysiwygCSSSelectorPrefixes = (production) ? [''] : ['.internal-fsb-strict-layout > .internal-fsb-element',
    	'.internal-fsb-absolute-layout > .internal-fsb-element',
    	'.internal-fsb-strict-layout > .internal-fsb-inheriting-element',
    	'.internal-fsb-absolute-layout > .internal-fsb-inheriting-element'];
    
  	for (let info of prioritizedKeys) {
  		let references = info.inheritances.filter(token => token != '');
  		
  		for (let reference of references) {
  			if (!inversedReferenceHash[reference]) {
  					inversedReferenceHash[reference] = [];
  			}
  			
  			if (inversedReferenceHash[reference].indexOf(info.id) == -1) {
  					inversedReferenceHash[reference].push(info.id);
  			}
  		}
  	}
    
    for (let i=prioritizedKeys.length-1; i>=0; i--) {
      let info = prioritizedKeys[i];
      let prefixes = [];
      let isForChildren = (stylesheetDefinitions[info.id].indexOf('-fsb-for-children: true') != -1);
      let suffix = (isForChildren) ? ' > :first-child' : '';
      
      for (let prefix of wysiwygCSSSelectorPrefixes) {
	      prefixes.push(prefix + '.-fsb-self-' + info.id + suffix);
	      prefixes.push(prefix + '.-fsb-preset-' + info.id + suffix);
	    }
      
      lines.push(prefixes.join(', ') + ' { ' + stylesheetDefinitions[info.id] + ' }');
      
      // Table Cell Property (With Reusable Stylesheet)
      // 
      let tableCellDefinitions = stylesheetDefinitions[info.id].match(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL);
      if (tableCellDefinitions !== null) {
  	   	for (let tableCellDefinition of tableCellDefinitions) {
     			let matchedInfo = tableCellDefinition.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
     			
     			for (let prefix of prefixes) {
     				lines.push(prefix + ' tbody > tr:nth-child(' + (parseInt(matchedInfo[2]) + 1) + ') > td:nth-child(' + (parseInt(matchedInfo[1]) + 1) +
     								 ') { border-' + matchedInfo[3] + ': ' + matchedInfo[4] + ' }');
     			}
  	   	}
  	  }
    }
    let source = lines.join(' ');
    
    return source;
  }
};

export {AnimationHelper};