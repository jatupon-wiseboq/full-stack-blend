import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {CodeGenerationHelper, DEFAULTS} from '../../helpers/CodeGenerationHelper.js';
import {CAMEL_OF_EVENTS_DICTIONARY} from '../../Constants.js';

var CodeGeneratorHelper = {
  generateCodeForReactRenderMethod: function(element: HTMLElement) {
    let lines: [string] = [];
    CodeGeneratorHelper.recursiveGenerateCodeForReactRenderMethod(element, '      ', lines);
    
    return '\n' + lines.join('\n');
  },
  generateCodeForMergingSection: function(element: HTMLElement) {
  	let lines: [string] = [];
  	CodeGeneratorHelper.recursiveGenerateCodeForMergingSection(element, lines);
    
    return lines.join('\n');
  },
  recursiveGenerateCodeForReactRenderMethod: function(element: HTMLElement, indent: string, lines: [string], isFirstElement: boolean=true, cumulatedDotNotation: string="", dotNotationChar: string='i') {
    if (element == Accessories.cursor.getDOMNode()) return;
    if (element == Accessories.resizer.getDOMNode()) return;
    if (element == Accessories.guide.getDOMNode()) return;
    
    if (element) {
      if (!element.tagName) {
        lines.push(indent + element.textContent);
      } else {
        let tag = element.tagName.toLowerCase();
        let _attributes = HTMLHelper.getAttributes(element, true);
        let classes = '';
        let styles = null;
        let bindingStyles = {};
        let attributes = [];
        let isForChildren = false;
        let isReactElement = false;
        let reactMode = null;
        let reactNamespace = null;
        let reactClass = null;
        let reactID = null;
        let reactData = null;
        let reactClassComposingInfoClassName = null;
        let reactClassComposingInfoGUID = null;
        
        for (let attribute of _attributes) {
          if (attribute.name.indexOf('internal-fsb-react-style-') == 0 && attribute.value) {
            let bindingName = attribute.name.replace('internal-fsb-react-style-', '');
            let bindingType = attribute.value.split('[')[0];
            let bindingValue = attribute.value.match(/^[A-Z]+\[(.+)\]$/)[1];
            
            switch (bindingType) {
              case 'SETTING':
                bindingStyles[bindingName] = 'Project.Settings.' + bindingValue;
                break;
              case 'PROPERTY':
                bindingStyles[bindingName] = 'this.props.' + bindingValue;
                break;
              case 'STATE':
                bindingStyles[bindingName] = 'this.state.' + bindingValue;
                break;
              case 'CODE':
                bindingStyles[bindingName] = '(()=>{' + bindingValue + '})()';
                break;
            }
          }
        }
        
        for (let attribute of _attributes) {
          switch (attribute.name) {
            case 'class':
              classes = attribute.value.trim().replace(/[\ ]+/g, ' ');
              break;
            case 'style':
              let hashMap = HTMLHelper.getHashMapFromInlineStyle(attribute.value);
              for (let key in hashMap) {
                if (hashMap.hasOwnProperty(key)) {
                  if (styles == null) styles = [];
                  let camelKey = key.replace(/\-([a-z])/g, (matched) => { return matched[1].toUpperCase(); });
                  if (camelKey.indexOf('FsbCell') == 0) continue;
                  if (camelKey.indexOf('FsbForChildren') == 0 && hashMap[key] == 'true') {
                    isForChildren = true;
                    continue;
                  }
                  if (bindingStyles[key]) {
                    styles.push(camelKey + ': ' + bindingStyles[key] + ' || "' + hashMap[key] + '"');
                    delete bindingStyles[key];
                  } else {
                    styles.push(camelKey + ': "' + hashMap[key] + '"');
                  }
                }
              }
              break;
            case 'internal-fsb-react-mode':
              if (!!attribute.value) reactMode = attribute.value;
              break;
            case 'internal-fsb-react-namespace':
              if (!!attribute.value) reactNamespace = attribute.value;
              break;
            case 'internal-fsb-react-class':
              if (!!attribute.value) reactClass = attribute.value;
              break;
            case 'internal-fsb-react-id':
              if (!!attribute.value) reactID = attribute.value;
              break;
            case 'internal-fsb-react-data':
              if (!!attribute.value) reactData = attribute.value;
              break;
            case 'internal-fsb-class':
              if (!!attribute.value) reactClassComposingInfoClassName = attribute.value;
              break;
            case 'internal-fsb-guid':
              if (!!attribute.value) reactClassComposingInfoGUID = attribute.value;
              break;
            default:
              if (CAMEL_OF_EVENTS_DICTIONARY[attribute.name]) {
                let FUNCTION_NAME = CAMEL_OF_EVENTS_DICTIONARY[attribute.name].replace(/^on/, 'on' + HTMLHelper.getAttribute(element, 'internal-fsb-class')) + '_' + HTMLHelper.getAttribute(element, 'internal-fsb-guid');
                
                attributes.push(CAMEL_OF_EVENTS_DICTIONARY[attribute.name] + '={this.' + FUNCTION_NAME + '.bind(this)}');
              }
              break;
          }
        }
        
        for (let key in bindingStyles) {
          if (bindingStyles.hasOwnProperty(key)) {
            if (styles == null) styles = [];
            let camelKey = key.replace(/\-([a-z])/g, (matched) => { return matched[1].toUpperCase(); });
            styles.push(camelKey + ': ' + bindingStyles[key]);
          }
        }
        
        if (isForChildren && classes.indexOf('internal-fsb-element') != -1) {
          styles = null;
        } else if (isForChildren) {
          reactID = HTMLHelper.getAttribute(element.parentNode, 'internal-fsb-react-id');
        }
        
        if (!reactNamespace) {
          reactNamespace = 'Project.Controls';
        }
        
        if (!reactClass && reactClassComposingInfoClassName && reactClassComposingInfoGUID) {
          reactClass = reactClassComposingInfoClassName + '_' + reactClassComposingInfoGUID;
        }
        
        if (reactID) {
          attributes.splice(0, 0, 'ref="' + reactID + '"');
        }
        
        if (isFirstElement) {
          reactData = null;
        }
        
        let _indent = indent;
        if (reactData !== null) {
          lines.push(indent + '{this.getDataFromNotation("' + cumulatedDotNotation + reactData + '").forEach((data, ' + dotNotationChar + ') => {');
          lines.push(_indent + '  return (');
          
          indent += '    ';
          
          cumulatedDotNotation += reactData + '[" + ' + dotNotationChar + ' + "].';
        }
        
        if (reactMode && !isFirstElement) {
          let composed = indent;
          
          composed += '<' + reactNamespace + '.' + reactClass + ' ' + (reactData ? 'key={"item_" + ' + dotNotationChar + '} ' : '') + (reactID && !reactData ? 'ref="' + reactID + '" ' : '') + (reactID && reactData ? 'ref={"' + reactID + '[" + ' + dotNotationChar + ' + "]" ' : '') + (reactData ? 'data={data} ' : '') + '/>';
          
          lines.push(composed);
        }
        
        if (reactData) {
          attributes.splice(0, 0, 'key={"item_" + ' + dotNotationChar + '}');
        }
        
        if (reactData !== null || (reactMode && !isFirstElement)) {
          let charcode = dotNotationChar.charCodeAt() + 1;
          dotNotationChar = String.fromCharCode(charcode);
        }
        
        if (!reactMode || isFirstElement) {
          let composed = indent;
          let children = [...element.childNodes];
          
          children = children.filter(element => [Accessories.cursor.getDOMNode(), Accessories.resizer.getDOMNode(), Accessories.guide.getDOMNode()].indexOf(element) == -1);
          
          composed += '<' + tag;
          if (classes != '') composed += ' className="' + classes + '"';
          if (styles != null) attributes.splice(0, 0, 'style={{' + styles.join(', ') + '}}');
          if (attributes.length != 0) composed += ' ' + attributes.join(' ');
          composed += (children.length == 0) ? ' />' : '>';
          
          lines.push(composed);
          
          for (let child of children) {
            CodeGeneratorHelper.recursiveGenerateCodeForReactRenderMethod(child, indent + '  ', lines, false, cumulatedDotNotation, dotNotationChar);
          }
          
          if (children.length != 0) {
	          composed = indent;
	          composed += '</' + tag + '>';
	          lines.push(composed);
	        }
        }
        
        if (reactData !== null) {
        	lines.push(_indent + '  )');
        	lines.push(_indent + '})()}');
        }
      }
    }
  },
  recursiveGenerateCodeForMergingSection: function(element: HTMLElement, lines: [string], isFirstElement: boolean=true) {
  	if (element == Accessories.cursor.getDOMNode()) return;
    if (element == Accessories.resizer.getDOMNode()) return;
    if (element == Accessories.guide.getDOMNode()) return;
    
    if (element && element.tagName) {
    	if (!isFirstElement && HTMLHelper.getAttribute(element, 'internal-fsb-react-mode')) return;
    	
    	if (!isFirstElement) {
    		let reusablePresetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name') || null;
		    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
		    let attributes = null;
		    
		    if (reusablePresetName) {
		      attributes = HTMLHelper.getAttributes(element, false, {
		        style: StylesheetHelper.getStylesheetDefinition(presetId)
		      });
		    } else {
		      attributes = HTMLHelper.getAttributes(element, false);
		    }
    		
	    	let code, mapping;
	    	[code, mapping] = CodeGenerationHelper.generateMergingCode(attributes, true);
	    	
	    	if (code) lines.push(code);
    	}
    	
    	let children = [...element.childNodes];
      for (let child of children) {
        CodeGeneratorHelper.recursiveGenerateCodeForMergingSection(child, lines, false);
      }
    }
  }
};

export {CodeGeneratorHelper};