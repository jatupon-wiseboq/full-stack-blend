import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {CodeGeneratorSharingHelper, DEFAULTS} from '../../helpers/CodeGeneratorSharingHelper.js';
import {CAMEL_OF_EVENTS_DICTIONARY, REQUIRE_FULL_CLOSING_TAGS, CONTAIN_TEXT_CONTENT_TAGS} from '../../Constants.js';

// This code generator relies on elements in construction area.
// 
var CodeGeneratorHelper = {
	generateHTMLCodeForPage: function(root: HTMLElement=HTMLHelper.getElementByAttributeNameAndValue("internal-fsb-guid", "0")) {
    // Document Level
    // 
    let generatedRenderMethodRootResult = CodeGeneratorHelper.generateCodeForReactRenderMethod(root);
    let generatedMergingSectionRootResult = CodeGeneratorHelper.generateCodeForMergingSection(root);
    
    let functionDeclarations = generatedMergingSectionRootResult[1];
    let functionBindings = generatedMergingSectionRootResult[0];
    let rootHTML = generatedRenderMethodRootResult[1];
    let rootScript = generatedRenderMethodRootResult[0];
    
		// Generate Scripts
		// SEO: Optimize Score of Google PageSpeed Insights.
		// 
		let executions: [string] = [];
    let lines: [string] = [];
    
    CodeGeneratorHelper.recursiveGenerateCodeForPage(root, '      ', executions, lines);
    
    let allReactComponentsScript = lines.join('\n');
    let allReactPrerequisiteScript = executions.join('\n');
    
  	let combinedHTMLTags = `${rootHTML}`;
		let combinedMinimalFeatureScripts = 
`private class Controller {
  const dictionary: {string: {string: string}} = {};
  
  ${functionDeclarations}
  
  public register(guid, eventName, functionName) {
    if (!this.dictionary[guid]) this.dictionary[guid] = {};
    this.dictionary[guid][eventName] = functionName;
  }
  public listen(guid: string) {
    if (this.dictionary[guid]) {
      for (let key in this.dictionary[guid]) {
        if (this.dictionary[guid].hasOwnProperty(key)) {
          const eventName = key;
          const functionName = this.dictionary[guid][key];
          const element = this.getElementUsingGUID(guid);
          
          element.addEventListener(eventName, this[functionName].bind(this), false);
        }
      }
    }
  }
  public getElementUsingGUID(guid: string): HTMLElement {
    return document.querySelectorAll('[internal-fsb-guid="' + guid + '"]')[0];
  }
}
let controller = new Controller();
${functionBindings}
${rootScript}`;
		let combinedExpandingFeatureScripts = `${allReactPrerequisiteScript}${allReactComponentsScript}`;
    
    return [combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts];
	},
	recursiveGenerateCodeForPage: function(element: HTMLElement, indent: string, executions: [string], lines: [string], isFirstElement: boolean=true) {
		if (element == Accessories.cursor.getDOMNode()) return;
    if (element == Accessories.resizer.getDOMNode()) return;
    if (element == Accessories.guide.getDOMNode()) return;
    
    if (element && element.tagName) {
    	if (!isFirstElement && HTMLHelper.getAttribute(element, 'internal-fsb-react-mode')) {
    		let _info = HTMLHelper.getAttributes(element, false);
    		
        _info.autoGeneratedCodeForRenderMethod = CodeGeneratorHelper.generateCodeForReactRenderMethod(element);
        _info.autoGeneratedCodeForMergingSection = CodeGeneratorHelper.generateCodeForMergingSection(element);
    		
    		let _code, _mapping;
    		[_code, _mapping] = CodeGeneratorSharingHelper.generateReactCode(_info);
    		
    		lines.push(_code);
    	}
    	
    	let children = [...element.childNodes];
    	
    	children = children.filter(element => [Accessories.cursor.getDOMNode(), Accessories.resizer.getDOMNode(), Accessories.guide.getDOMNode()].indexOf(element) == -1);
    	
	    for (let child of children) {
	      CodeGeneratorHelper.recursiveGenerateCodeForPage(child, indent, executions, lines, false);
	    }
    }
	},
  generateCodeForReactRenderMethod: function(element: HTMLElement) {
    let executions: [string] = [];
    let lines: [string] = [];
    
    if (EditorHelper.hasParentReactComponent(element)) {
    	CodeGeneratorHelper.recursiveGenerateCodeForReactRenderMethod(element, '      ', executions, lines);
    } else {
    	CodeGeneratorHelper.recursiveGenerateCodeForFallbackRendering(element, '      ', executions, lines);
    }
    
    return ['\n' + executions.join('\n'), '\n' + lines.join('\n')];
  },
  recursiveGenerateCodeForReactRenderMethod: function(element: HTMLElement, indent: string, executions: [string], lines: [string], isFirstElement: boolean=true, cumulatedDotNotation: string="", dotNotationChar: string='i') {
    if (element == Accessories.cursor.getDOMNode()) return;
    if (element == Accessories.resizer.getDOMNode()) return;
    if (element == Accessories.guide.getDOMNode()) return;
    
    if (element) {
      if (!element.tagName) {
        lines.push(indent + element.textContent);
      } else {
        let tag = element.tagName.toLowerCase();
        let _attributes = HTMLHelper.getAttributes(element, true, {}, false);
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
                  if (!camelKey) continue;
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
              if (attribute.name.indexOf('internal-fsb-') == 0) continue;
              if (CAMEL_OF_EVENTS_DICTIONARY[attribute.name]) {
              	let value = null;
              	if (attribute.value) value = JSON.parse(attribute.value);
            		else value = {};
            		
            		if (value.event) {
	                let FUNCTION_NAME = CAMEL_OF_EVENTS_DICTIONARY[attribute.name].replace(/^on/, 'on' + HTMLHelper.getAttribute(element, 'internal-fsb-class')) + '_' + HTMLHelper.getAttribute(element, 'internal-fsb-guid');
	                
	                attributes.push(CAMEL_OF_EVENTS_DICTIONARY[attribute.name] + '={this.' + FUNCTION_NAME + '.bind(this)}');
	              }
              } else {
                attributes.push(attribute.name + '=' + ((attribute.value[0] == '{') ? attribute.value : '"' + attribute.value.split('"').join('&quot;') + '"'));
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
          classes = CodeHelper.getInternalClasses(classes);
        } else if (isForChildren) {
          reactID = HTMLHelper.getAttribute(element.parentNode, 'internal-fsb-react-id');
        }
        
        if (!reactNamespace) {
          reactNamespace = 'Project.Controls';
        }
        
        if (!reactClass && reactClassComposingInfoClassName && reactClassComposingInfoGUID) {
          reactClass = reactClassComposingInfoClassName + '_' + reactClassComposingInfoGUID;
        }
	      
        if (isFirstElement) {
          reactData = null;
        }
        
        // For react rendering method:
        // 
        if (reactID && (!isForChildren || classes.indexOf('internal-fsb-element') == -1)) {
          attributes.splice(0, 0, 'ref="' + reactID + '"');
        }
        
        // Dot Notation Feature
        // 
        let _indent = indent;
        if (reactData !== null) {
          lines.push(indent + '{this.getDataFromNotation("' + cumulatedDotNotation + reactData + '").forEach((data, ' + dotNotationChar + ') => {');
          lines.push(_indent + '  return (');
          
          indent += '    ';
          
          cumulatedDotNotation += reactData + '[" + ' + dotNotationChar + ' + "].';
        }
        
        // Include Another React Class Feature
        // 
        if (reactMode && !isFirstElement) {
          let composed = indent;
          
          composed += '<' + reactNamespace + '.' + reactClass + ' ' + (reactData ? 'key={"item_" + ' + dotNotationChar + '} ' : '') + (reactID && !reactData ? 'ref="' + reactID + '" ' : '') + (reactID && reactData ? 'ref={"' + reactID + '[" + ' + dotNotationChar + ' + "]" ' : '') + (reactData ? 'data={data} ' : '') + '/>';
          
          lines.push(composed);
        }
        
        // Dot Notation Feature (Continue 1/2)
        // 
        if (reactData) {
          attributes.splice(0, 0, 'key={"item_" + ' + dotNotationChar + '}');
        }
        
        if (reactData !== null || (reactMode && !isFirstElement)) {
          let charcode = dotNotationChar.charCodeAt() + 1;
          dotNotationChar = String.fromCharCode(charcode);
        }
        
        // Recursive Children Feature
        //
        if (!reactMode || isFirstElement) {
          let composed = indent;
          let children = [...element.childNodes];
          
          children = children.filter(element => [Accessories.cursor.getDOMNode(), Accessories.resizer.getDOMNode(), Accessories.guide.getDOMNode()].indexOf(element) == -1);
          
          composed += '<' + tag;
          if (classes != '') composed += ' className="' + classes + '"';
          if (styles != null) attributes.splice(0, 0, 'style={{' + styles.join(', ') + '}}');
          if (attributes.length != 0) composed += ' ' + attributes.join(' ');
          composed += (children.length == 0 && REQUIRE_FULL_CLOSING_TAGS.indexOf(tag) == -1) ? ' />' : '>';
          
          lines.push(composed);
          
          for (let child of children) {
            CodeGeneratorHelper.recursiveGenerateCodeForReactRenderMethod(child, indent + '  ', executions, lines, false, cumulatedDotNotation, dotNotationChar);
          }
          
          if (children.length != 0 || REQUIRE_FULL_CLOSING_TAGS.indexOf(tag) != -1) {
	          if (CONTAIN_TEXT_CONTENT_TAGS.indexOf(tag) == -1) {
	            composed = indent;
	          } else {
	            composed = '';
	          }
	          composed += '</' + tag + '>';
	          lines.push(composed);
	        }
        }
        
        // Dot Notation Feature (Continue 2/2)
        // 
        if (reactData !== null) {
        	lines.push(_indent + '  )');
        	lines.push(_indent + '})()}');
        }
      }
	  }
	},
	recursiveGenerateCodeForFallbackRendering: function(element: HTMLElement, indent: string, executions: [string], lines: [string], isFirstElement: boolean=true) {
    if (element == Accessories.cursor.getDOMNode()) return;
    if (element == Accessories.resizer.getDOMNode()) return;
    if (element == Accessories.guide.getDOMNode()) return;
    
    if (element) {
      if (!element.tagName) {
        lines.push(indent + element.textContent);
      } else {
        let tag = element.tagName.toLowerCase();
        let _attributes = HTMLHelper.getAttributes(element, true, {}, false);
        let classes = '';
        let styles = null;
        let bindingStyles = {};
        let events = [];
        let attributes = [];
        let isForChildren = false;
        let isReactElement = false;
        let reactMode = null;
        let reactNamespace = null;
        let reactClass = null;
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
              classes = attribute.value.replace(/(internal-fsb-allow-cursor)/g, '').trim();
              break;
            case 'style':
              let hashMap = HTMLHelper.getHashMapFromInlineStyle(attribute.value);
              for (let key in hashMap) {
                if (hashMap.hasOwnProperty(key)) {
                  if (styles == null) styles = [];
                  if (key.indexOf('-fsb-cell') == 0) continue;
                  if (key.indexOf('-fsb-for-children') == 0 && hashMap[key] == 'true') {
                    isForChildren = true;
                    continue;
                  }
                  styles.push(key + ': ' + hashMap[key]);
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
            case 'internal-fsb-class':
              if (!!attribute.value) reactClassComposingInfoClassName = attribute.value;
              break;
            case 'internal-fsb-guid':
              if (!!attribute.value) reactClassComposingInfoGUID = attribute.value;
              break;
            default:
              if (attribute.name.indexOf('internal-fsb-') == 0) continue;
              if (CAMEL_OF_EVENTS_DICTIONARY[attribute.name]) {
              	let value = null;
              	if (attribute.value) value = JSON.parse(attribute.value);
            		else value = {};
            		
            		if (value.event) {
	                let FUNCTION_NAME = CAMEL_OF_EVENTS_DICTIONARY[attribute.name].replace(/^on/, 'on' + HTMLHelper.getAttribute(element, 'internal-fsb-class')) + '_' + HTMLHelper.getAttribute(element, 'internal-fsb-guid');
	                
	                events.push([CAMEL_OF_EVENTS_DICTIONARY[attribute.name].replace(/^on/, '').toLowerCase(), FUNCTION_NAME]);
	              }
              } else {
                attributes.push(attribute.name + '=' + ((attribute.value[0] == '{') ? attribute.value : '"' + attribute.value.split('"').join('&quot;') + '"'));
              }
              break;
          }
        }
        
        if (isForChildren && classes.indexOf('internal-fsb-element') != -1) {
          styles = null;
          classes = CodeHelper.getInternalClasses(classes);
        }
        
        if (!reactNamespace) {
          reactNamespace = 'Project.Controls';
        }
        
        if (!reactClass && reactClassComposingInfoClassName && reactClassComposingInfoGUID) {
          reactClass = reactClassComposingInfoClassName + '_' + reactClassComposingInfoGUID;
        }
        
	      // For HTML5 fallback rendering:
	      // TODO: still skip dot notation in fallback mode.
        // 
        
      	// Include Another React Class Feature
        // 
      	if (reactMode && !isFirstElement) {
      		lines.push('<span internal-fsb-init-class="' + reactNamespace + '.' + reactClass + '"></span>');
      	}
      	
      	// Recursive Children Feature
        //
      	if (!reactMode || isFirstElement) {
      		let composed = indent;
          let children = [...element.childNodes];
          
          children = children.filter(element => [Accessories.cursor.getDOMNode(), Accessories.resizer.getDOMNode(), Accessories.guide.getDOMNode()].indexOf(element) == -1);
          
          composed += '<' + tag;
          if (reactClassComposingInfoGUID != null) composed += ' internal-fsb-guid="' + reactClassComposingInfoGUID + '"';
          if (classes != '') composed += ' class="' + classes + '"';
          if (styles != null) composed += ' style="' + styles.join('; ') + ';"';
          if (attributes.length != 0) composed += ' ' + attributes.join(' ');
          composed += (children.length == 0 && REQUIRE_FULL_CLOSING_TAGS.indexOf(tag) == -1) ? ' />' : '>';
          
          lines.push(composed);
          
          for (let eventInfo of events) {
          	executions.push(`controller.listen('${reactClassComposingInfoGUID}');`);
          }
          
          for (let child of children) {
            CodeGeneratorHelper.recursiveGenerateCodeForFallbackRendering(child, indent + '  ', executions, lines, false);
          }
          
          if (children.length != 0 || REQUIRE_FULL_CLOSING_TAGS.indexOf(tag) != -1) {
	          if (CONTAIN_TEXT_CONTENT_TAGS.indexOf(tag) == -1) {
	            composed = indent;
	          } else {
	            composed = '';
	          }
	          composed += '</' + tag + '>';
	          lines.push(composed);
	        }
      	}
      }
    }
  },
  generateCodeForMergingSection: function(element: HTMLElement) {
  	let executions: [string] = [];
  	let lines: [string] = [];
  	CodeGeneratorHelper.recursiveGenerateCodeForMergingSection(element, executions, lines, true, EditorHelper.hasParentReactComponent(element));
    
    return [executions.join('\n'), lines.join('\n')];
  },
  recursiveGenerateCodeForMergingSection: function(element: HTMLElement, executions: [string], lines: [string], isFirstElement: boolean=true, hasParentReactComponent: boolean=true) {
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
	    	[code, mapping] = CodeGeneratorSharingHelper.generateMergingCode(attributes, hasParentReactComponent ? null : executions, true);
	    	
	    	if (code) lines.push(code);
    	}
    	
    	let children = [...element.childNodes];
      for (let child of children) {
        CodeGeneratorHelper.recursiveGenerateCodeForMergingSection(child, executions, lines, false, hasParentReactComponent);
      }
    }
  }
};

export {CodeGeneratorHelper};