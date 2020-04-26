import {HTMLHelper} from '../../helpers/HTMLHelper.js';

let stylesheetDefinitions = {};
let stylesheetDefinitionRevision = 0;
let cachedPrioritizedKeys = null;
let cachedPrioritizedKeysRevision = -1;

function renderStylesheet() {
  let lines = [];
  let prioritizedKeys = StylesheetHelper.getStylesheetDefinitionKeys();
  let inversedReferenceHash = {};
  
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
    
    prefixes.push('.internal-fsb-allow-cursor > .internal-fsb-element.-fsb-self-' + info.id + suffix);
    prefixes.push('.internal-fsb-allow-cursor > .internal-fsb-element.-fsb-preset-' + info.id + suffix);
    
    // Inheritance
    //
    let inversedReferences = inversedReferenceHash[info.id] || [];
    inversedReferences.sort((a, b) => {
    	let pa = prioritizedKeys.indexOf(a);
    	let pb = prioritizedKeys.indexOf(b);
    	
    	if (pa == -1) pa = Number.MAX_SAFE_INTEGER;
    	if (pb == -1) pa = Number.MAX_SAFE_INTEGER;
    	
    	return pa > pb;
    });
    
    for (let inheritingKey of inversedReferences) {
    	prefixes.push('.internal-fsb-allow-cursor > .internal-fsb-element.-fsb-preset-' + inheritingKey + suffix);
    }
    
    lines.push(prefixes.join(', ') + ' { ' + stylesheetDefinitions[info.id] + ' }');
    
    // Table Cell Property (With Reusable Stylesheet)
    // 
    let tableCellDefinitions = stylesheetDefinitions[info.id].match(/-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/g);
    if (tableCellDefinitions !== null) {
	   	for (let tableCellDefinition of tableCellDefinitions) {
   			let matchedInfo = tableCellDefinition.match(/-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/);
   			
   			for (let prefix of prefixes) {
   				lines.push(prefix + ' > tr:nth-child(' + (parseInt(matchedInfo[2]) + 1) + ') > td:nth-child(' + (parseInt(matchedInfo[1]) + 1) +
   								 ') { border-' + matchedInfo[3] + ': ' + matchedInfo[4] + ' }');
   			}
	   	}
	  }
  }
  let source = lines.join('\n');
  
  let element = document.getElementById('internal-fsb-stylesheet');
  if (!element) {
    element = document.createElement('style');
    HTMLHelper.setAttribute(element, 'type', 'text/css');
    HTMLHelper.setAttribute(element, 'id', 'internal-fsb-stylesheet');
    document.head.appendChild(element);
  }
  
  element.innerText = source;
}

var StylesheetHelper = {
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
    
    renderStylesheet();
  },
  setStylesheetDefinition: function(presetId: string, presetName: string, content: string) {
    stylesheetDefinitions[presetId] = content;
    
    stylesheetDefinitionRevision++;
    
    renderStylesheet();
  },
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions).sort((a, b) => {
        let pa = HTMLHelper.getInlineStyle(stylesheetDefinitions[a], '-fsb-priority') || 0;
        let pb = HTMLHelper.getInlineStyle(stylesheetDefinitions[b], '-fsb-priority') || 0;
        let na = HTMLHelper.getInlineStyle(stylesheetDefinitions[a], '-fsb-preset-name') || 0;
        let nb = HTMLHelper.getInlineStyle(stylesheetDefinitions[b], '-fsb-preset-name') || 0;
        
        return (pa != pb) ? pa < pb : na > nb;
      });
      cachedPrioritizedKeys = cachedPrioritizedKeys.map((presetId) => {
      	let presetName = HTMLHelper.getInlineStyle(stylesheetDefinitions[presetId], '-fsb-preset-name');
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
  }
};

export {StylesheetHelper};