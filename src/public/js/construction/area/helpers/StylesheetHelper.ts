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
			
			if (inversedReferenceHash[reference].indexOf(info.name) == -1) {
					inversedReferenceHash[reference].push(info.name);
			}
		}
	}
  
  for (let i=prioritizedKeys.length-1; i>=0; i--) {
    let info = prioritizedKeys[i];
    let prefixes = [];
    let isForChildren = (stylesheetDefinitions[info.name].indexOf('-fsb-for-children: true') != -1);
    let suffix = (isForChildren) ? ' > :first-child' : '';
    
    prefixes.push('.internal-fsb-allow-cursor > .internal-fsb-element.-fsb-self-' + info.name + suffix);
    prefixes.push('.internal-fsb-allow-cursor > .internal-fsb-element.-fsb-preset-' + info.name + suffix);
    
    // Inheritance
    //
    let inversedReferences = inversedReferenceHash[info.name] || [];
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
    
    lines.push(prefixes.join(', ') + ' { ' + stylesheetDefinitions[info.name] + ' }');
    
    // Table Cell Property (With Reusable Stylesheet)
    // 
    let tableCellDefinitions = stylesheetDefinitions[info.name].match(/-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/g);
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
    
    if (reusablePresetName) {
      StylesheetHelper.setStylesheetDefinition(reusablePresetName, style, HTMLHelper.getAttribute(element, 'internal-fsb-guid'));
    } else {
      HTMLHelper.setAttribute(element, 'style', style);
    }
  },
  getStyle: function(element: HTMLElement) {
    let reusablePresetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name') || null;
    let style = (reusablePresetName) ? StylesheetHelper.getStylesheetDefinition(reusablePresetName) : HTMLHelper.getAttribute(element, 'style');
    
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
  getStylesheetDefinition: function(name: string) {
    return stylesheetDefinitions[name] || null;
  },
  removeStylesheetDefinition: function(name: string, guid: string) {
    delete stylesheetDefinitions[name];
    
    for (let key in stylesheetDefinitions) {
    	if (stylesheetDefinitions.hasOwnProperty(key)) {
    		let presets = HTMLHelper.getInlineStyle(stylesheetDefinitions[key], '-fsb-inherited-presets');
    		let splited = presets && presets.split(', ') || [];
    		splited = splited.map(presetName => (presetName == name) ? guid : presetName);
    		
    		stylesheetDefinitions[key] = HTMLHelper.setInlineStyle(stylesheetDefinitions[key], '-fsb-inherited-presets', splited.join(', '));
    	}
    }
    
    stylesheetDefinitionRevision++;
  },
  setStylesheetDefinition: function(name: string, content: string, guid: string) {
    if (stylesheetDefinitions[name] === undefined) {
      for (let key in stylesheetDefinitions) {
	    	if (stylesheetDefinitions.hasOwnProperty(key)) {
	    		let presets = HTMLHelper.getInlineStyle(stylesheetDefinitions[key], '-fsb-inherited-presets');
	    		let splited = presets && presets.split(', ') || [];
	    		splited = splited.map(presetName => (presetName == guid) ? name : presetName);
	    		
	    		stylesheetDefinitions[key] = HTMLHelper.setInlineStyle(stylesheetDefinitions[key], '-fsb-inherited-presets', splited.join(', '));
	    	}
	    }
    }
    
    stylesheetDefinitions[name] = content;
    stylesheetDefinitionRevision++;
    
    renderStylesheet();
  },
  swapStylesheetName: function(previousName: string, nextName: string) {
    stylesheetDefinitions[nextName] = stylesheetDefinitions[previousName];
    delete stylesheetDefinitions[previousName];
    
    stylesheetDefinitionRevision++;
    
    for (let key in stylesheetDefinitions) {
    	if (stylesheetDefinitions.hasOwnProperty(key)) {
    		let presets = HTMLHelper.getInlineStyle(stylesheetDefinitions[key], '-fsb-inherited-presets');
    		let splited = presets && presets.split(', ') || [];
    		splited = splited.map(presetName => (presetName == previousName) ? nextName : presetName);
    		
    		stylesheetDefinitions[key] = HTMLHelper.setInlineStyle(stylesheetDefinitions[key], '-fsb-inherited-presets', splited.join(', '));
    	}
    }
    
    renderStylesheet();
  },
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions).sort((a, b) => {
        let pa = HTMLHelper.getInlineStyle(stylesheetDefinitions[a], 'internal-fsb-priority') || 0;
        let pb = HTMLHelper.getInlineStyle(stylesheetDefinitions[b], 'internal-fsb-priority') || 0;
        
        return (pa != pb) ? pa < pb : a > b;
      });
      cachedPrioritizedKeys = cachedPrioritizedKeys.map((name) => {
      	let inheritedPresets = HTMLHelper.getInlineStyle(stylesheetDefinitions[name], '-fsb-inherited-presets');
      	return {
	      	name: name,
	      	inheritances: inheritedPresets && inheritedPresets.split(', ').filter(presetName => presetName != name) || []
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