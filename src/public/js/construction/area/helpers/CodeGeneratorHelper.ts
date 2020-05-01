import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {CAMEL_OF_EVENTS_DICTIONARY} from '../../Constants.js';

var CodeGeneratorHelper = {
  generateCodeForReactRenderMethod: function(element: HTMLElement) {
    let lines: [string] = [];
    CodeGeneratorHelper.recursiveGenerateCodeForReactRenderMethod(element, '        ', lines);
    
    return '\n' + lines.join('\n');
  },
  recursiveGenerateCodeForReactRenderMethod: function(element: HTMLElement, indent: string, lines: [string], isFirstElement: boolean=true, cumulatedDotNotation: string="", dotNotationChar: string='i') {
    if (element == Accessories.cursor.getDOMNode()) return;
    if (element == Accessories.resizer.getDOMNode()) return;
    if (element == Accessories.guide.getDOMNode()) return;
    
    if (element) {
      if (!element.tagName) {
        lines.push(indent + '| ' + element.textContent);
      } else {
        let tag = element.tagName.toLowerCase();
        let _attributes = HTMLHelper.getAttributes(element, true);
        let classes = '';
        let styles = null;
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
          switch (attribute.name) {
            case 'class':
              classes = attribute.value.trim().split(' ').join('.').replace(/[\.]+/g, '.');
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
                  styles.push(camelKey + ': "' + hashMap[key] + '"');
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
                
                attributes.push(CAMEL_OF_EVENTS_DICTIONARY[attribute.name] + '=this.' + FUNCTION_NAME + '.bind(this)');
              }
              break;
          }
        }
        
        if (isForChildren && classes.indexOf('internal-fsb-element') != -1) {
          styles = null;
        } else if (isForChildren) {
          reactID = HTMLHelper.getAttribute(element.parentNode, 'internal-fsb-react-id');
        }
        
        if (!reactNamespace) {
          reactNamespace = 'Controls';
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
        
        if (reactData !== null) {
          lines.push(indent + 'each data, ' + dotNotationChar + ' in this.getDataFromNotation("' + cumulatedDotNotation + reactData + '")');
          
          indent += '  ';
          
          cumulatedDotNotation += reactData + '[" + ' + dotNotationChar + ' + "].';
        }
        
        if (reactMode && !isFirstElement) {
          let composed = indent;
          
          composed += '= ${(<' + reactNamespace + '.' + reactClass + ' ' + (reactData ? 'key={"item_" + ' + dotNotationChar + '} ' : '') + (reactID ? 'ref="' + reactID + '" ' : '') + (reactData ? 'data={data} ' : '') + '/>)}';
          
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
          
          if (tag != 'div' || (classes == '' && styles == null && attributes.length == 0)) composed += tag;
          if (classes != '') composed += ('.' + classes).replace('.internal-fsb-allow-cursor', '');
          if (styles != null || attributes.length != 0) composed += '(';
          if (styles != null) attributes.splice(0, 0, 'style={' + styles.join(', ') + '}');
          if (attributes.length != 0) composed += attributes.join(' ');
          if (styles != null || attributes.length != 0) composed += ')';
          
          lines.push(composed);
          
          indent += '  ';
          
          let children = [...element.childNodes];
          for (let child of children) {
            CodeGeneratorHelper.recursiveGenerateCodeForReactRenderMethod(child, indent, lines, false, cumulatedDotNotation, dotNotationChar);
          }
        }
      }
    }
  }
};

export {CodeGeneratorHelper};