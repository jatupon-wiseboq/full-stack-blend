import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, CELL_STYLE_ATTRIBUTE_REGEX_LOCAL} from '../../Constants.js';

let stylesheetDefinitions = {};
let stylesheetDefinitionRevision = 0;
let cachedPrioritizedKeys = null;
let cachedPrioritizedKeysRevision = -1;

var StylesheetHelper = {
  generateStylesheetData: () => {
  	for (let key in stylesheetDefinitions) {
  		if (stylesheetDefinitions.hasOwnProperty(key)) {
  			if (stylesheetDefinitions[key]) {
  				stylesheetDefinitions[key] = stylesheetDefinitions[key].split('; ').sort().join('; ');
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
    
    StylesheetHelper.renderStylesheetElement();
  },
	setStyle: function(element: HTMLElement, style: string) {
    let reusablePresetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name') || null;
    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
    
    if (reusablePresetName) {
      StylesheetHelper.setStylesheetDefinition(presetId, reusablePresetName, style);
    } else {
      HTMLHelper.setAttribute(element, 'style', style);
    }
  },
  getStyle: function(element: HTMLElement) {
  	let reusablePresetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name') || null;
    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
    let style = (reusablePresetName) ? StylesheetHelper.getStylesheetDefinition(presetId) : HTMLHelper.getAttribute(element, 'style');
    
    return style;
  },
  setStyleAttribute: function(element: HTMLElement, styleName: string, styleValue: string) {
    let style = StylesheetHelper.getStyle(element);
    style = HTMLHelper.setInlineStyle(style, styleName, styleValue);
    
    StylesheetHelper.setStyle(element, style);
  },
  getStyleAttribute: function(element: HTMLElement, styleName: string) {
    let style = StylesheetHelper.getStyle(element);
    
    return HTMLHelper.getInlineStyle(style, styleName);
  },
  getStylesheetDefinition: function(presetId: string) {
    return stylesheetDefinitions[presetId] || null;
  },
  removeStylesheetDefinition: function(presetId: string) {
    delete stylesheetDefinitions[presetId];
    
    stylesheetDefinitionRevision++;
    
    StylesheetHelper.renderStylesheetElement();
  },
  setStylesheetDefinition: function(presetId: string, presetName: string, content: string) {
    stylesheetDefinitions[presetId] = content;
    
    stylesheetDefinitionRevision++;
    
    StylesheetHelper.renderStylesheetElement();
  },
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      
      console.log(Object.keys(stylesheetDefinitions));
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions).sort((a, b) => {
        let pa = parseInt(HTMLHelper.getInlineStyle(stylesheetDefinitions[a], '-fsb-priority') || '0');
        let pb = parseInt(HTMLHelper.getInlineStyle(stylesheetDefinitions[b], '-fsb-priority') || '0');
        let na = HTMLHelper.getInlineStyle(stylesheetDefinitions[a], '-fsb-reusable-name');
        let nb = HTMLHelper.getInlineStyle(stylesheetDefinitions[b], '-fsb-reusable-name');
        
        console.log(pa, pb, na, nb);
        
        return ((pa != pb) ? pa < pb : na > nb) ? 1 : -1;
      });
      console.log(cachedPrioritizedKeys);
      
      cachedPrioritizedKeys = cachedPrioritizedKeys.map((presetId) => {
      	let presetName = HTMLHelper.getInlineStyle(stylesheetDefinitions[presetId], '-fsb-reusable-name');
      	let _presetId = HTMLHelper.getInlineStyle(stylesheetDefinitions[presetId], '-fsb-preset-id');
      	let inheritedPresets = HTMLHelper.getInlineStyle(stylesheetDefinitions[presetId], '-fsb-inherited-presets');
      	return {
      		id: presetId,
	      	name: presetName,
	      	inheritances: inheritedPresets && inheritedPresets.split(', ').filter(presetId => presetId != _presetId) || []
	      }
      });
    }
    
    return cachedPrioritizedKeys;
  },
  getStylesheetDefinitionRevision: function() {
    return stylesheetDefinitionRevision;
  },
  renderStylesheetElement: function() {
    let element = document.getElementById('internal-fsb-stylesheet');
    if (!element) {
      element = document.createElement('style');
      HTMLHelper.setAttribute(element, 'type', 'text/css');
      HTMLHelper.setAttribute(element, 'id', 'internal-fsb-stylesheet');
      element.className = 'internal-fsb-accessory';
      document.body.appendChild(element);
    }
    
    element.innerText = StylesheetHelper.renderStylesheet();
  },
  renderStylesheet: function(production: boolean=false) {
    let lines = [];
    let prioritizedKeys = StylesheetHelper.getStylesheetDefinitionKeys();
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
	      prefixes.push(prefix + '.internal-fsb-element.-fsb-self-' + info.id + suffix);
	      prefixes.push(prefix + '.internal-fsb-element.-fsb-preset-' + info.id + suffix);
	    }
      
      // Inheritance
      //
      let inversedReferences = inversedReferenceHash[info.id] || [];
      inversedReferences.sort((a, b) => {
      	let pa = prioritizedKeys.indexOf(a);
      	let pb = prioritizedKeys.indexOf(b);
      	
      	if (pa == -1) pa = Number.MAX_SAFE_INTEGER;
      	if (pb == -1) pa = Number.MAX_SAFE_INTEGER;
      	
      	return (pa > pb) ? 1 : -1;
      });
      
      for (let inheritingKey of inversedReferences) {
      	for (let prefix of wysiwygCSSSelectorPrefixes) {
		      prefixes.push(prefix + '.internal-fsb-element.-fsb-preset-' + inheritingKey + suffix);
		    }
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

export {StylesheetHelper};