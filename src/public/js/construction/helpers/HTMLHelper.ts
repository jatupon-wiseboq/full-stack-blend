import {CodeHelper} from './CodeHelper.js';
import {VENDOR_PREFIXES} from '../VendorPrefixes.js';
import {FORWARED_ATTRIBUTES_FOR_CHILDREN} from '../Constants.js'

let vendor_prefixes_hash = {};
for (let prefix of VENDOR_PREFIXES) {
  vendor_prefixes_hash[prefix] = true;
}

var HTMLHelper = {
  sanitizingPug: (code: string) => {
    return code.replace(/classname=/gi, 'class=');
  },
  
  getElementById: (id: string, container: HTMLElement=document) => {
    return container.getElementById(id);
  },
  getElementByClassName: (className: string, container: HTMLElement=document) => { // return the last one
    let elements = HTMLHelper.getElementsByClassName(className, container);
    if (elements.length != 0) { return elements[elements.length - 1]; }
    else { return null; }
  },
  getElementsByClassName: (className: string, container: HTMLElement=document, notToBeUnder: string=null) => {
    let elements = container.getElementsByClassName(className);
    
    if (notToBeUnder === null) {
      return elements;
    } else {
      return [...elements].filter((element) => {
        let current = element.parentNode;
        while (current != null && current != container) {
          if (HTMLHelper.hasClass(current, notToBeUnder)) return false;
          current = current.parentNode;
        }
        return true;
      });
    }
  },
  getElementByAttributeNameAndValue: (attributeName: string, value: string, container: HTMLElement=document) => {
    return container.querySelectorAll('[' + attributeName + '="' + value + '"]')[0];
  },
  getElementsByAttributeNameAndValue: (attributeName: string, value: string, container: HTMLElement=document) => {
    return container.querySelectorAll('[' + attributeName + '="' + value + '"]');
  },
  getElementsByAttribute: (attributeName: string, container: HTMLElement=document, includingSelf: boolean=false) => {
    let results = [...container.querySelectorAll('[' + attributeName + ']')];
    if (includingSelf && HTMLHelper.hasAttribute(container, attributeName)) {
      results.splice(0, 0, container);
    }
    return results;
  },
  getElementsByTagName: (tagName: string, container: HTMLElement=window) => {
    if (container === null) return [];
    
    return container.getElementsByTagName(tagName);
  },
  getNextSibling: (element: HTMLElement, skipIds: string[]=[]) => {
  	if (!element) return null;
  	while (element.nextSibling) {
  		element = element.nextSibling;
  		if (skipIds.indexOf(HTMLHelper.getAttribute(element, 'id')) != -1) continue;
  		if (!element.tagName) continue;
  		return element;
  	}
  	return null;
  },
  getPreviousSibling: (element: HTMLElement, skipIds: string[]=[]) => {
  	if (!element) return null;
  	while (element.previousSibling) {
  		element = element.previousSibling;
  		if (skipIds.indexOf(HTMLHelper.getAttribute(element, 'id')) != -1) continue;
  		if (!element.tagName) continue;
  		return element;
  	}
  	return null;
  },
  getAttributes: (element: HTMLElement, array: boolean=false, mergeAttributes: any={}, reverseForwarding: boolean=true) => {
    if (array) {
      let elementAttributes = [];
      
      if (reverseForwarding && HTMLHelper.isForChildren(element)) {
        for (let attributeName of FORWARED_ATTRIBUTES_FOR_CHILDREN) {
          if (HTMLHelper.hasAttribute(element.firstElementChild, attributeName)) {
            elementAttributes.push({
              name: attributeName,
              value: HTMLHelper.getAttribute(element.firstElementChild, attributeName)
            });
          }
        }
      }
      
      if (element.hasAttributes()) {
        let attrs = element.attributes;
        for (let attr of attrs) {
          if (mergeAttributes[attr.name] !== undefined) {
            elementAttributes.push({
              name: attr.name,
              value: mergeAttributes[attr.name]
            });
            delete mergeAttributes[attr.name];
          } else {
            elementAttributes.push({
              name: attr.name,
              value: HTMLHelper.getAttribute(element, attr.name)
            });
          }
        }
      }
      
      let keys = Object.keys(mergeAttributes);
      for (let key of keys) {
        elementAttributes.push({
          name: key,
          value: mergeAttributes[key]
        });
      }
      
      elementAttributes.sort((a: any, b: any) => {
      	return (a.name > b.name) ? 1 : -1;
      });
      
      const _elementAttributes = [];
      const _insertedKeys = {};
      
      for (let _element of elementAttributes) {
      	if (_insertedKeys[_element.name] === true) continue;
      	_insertedKeys[_element.name] = true;
      	
      	_elementAttributes.push(_element);
      }
      
      return _elementAttributes;
    } else {
      if (reverseForwarding && HTMLHelper.isForChildren(element)) {
        for (let attributeName of FORWARED_ATTRIBUTES_FOR_CHILDREN) {
          if (HTMLHelper.hasAttribute(element.firstElementChild, attributeName)) {
            mergeAttributes[attributeName] = HTMLHelper.getAttribute(element.firstElementChild, attributeName);
          }
        }
      }
      
      if (element.hasAttributes()) {
        let attrs = element.attributes;
        for (let attr of attrs) {
          if (mergeAttributes[attr.name] === undefined) {
            mergeAttributes[attr.name] = HTMLHelper.getAttribute(element, attr.name);
          }
        }
      }
      
      CodeHelper.sortHashtable(mergeAttributes);
      
      return mergeAttributes;
    }
  },
  isForChildren: (element: HTMLElement, styleAttributeValue: string=null) => {
    return (element && element.getAttribute && element.getAttribute('style') == '-fsb-empty' && HTMLHelper.hasAttribute(element, 'internal-fsb-guid'));
  },
  getAttribute: (element: HTMLElement, name: string) => {
  	if (!element || !element.getAttribute) return null;
  	if (name == 'style' && HTMLHelper.isForChildren(element)) {
  		return element.firstElementChild.getAttribute(name);
  	} else if (name == 'class' && HTMLHelper.isForChildren(element)) {
  		return [element.getAttribute(name) || '', element.firstElementChild.getAttribute(name) || ''].join(' ');
  	} else if (FORWARED_ATTRIBUTES_FOR_CHILDREN.indexOf(name) != -1 && HTMLHelper.isForChildren(element)) {
  		return element.firstElementChild.getAttribute(name);
  	} else {
  		return element.getAttribute(name);
  	}
  },
  setAttribute: (element: HTMLElement, name: string, value: any) => {    
  	if (!element || !element.getAttribute || !element.setAttribute) return;
  	if (name == 'style' && HTMLHelper.getInlineStyle(value, '-fsb-for-children') == 'true') {
  		element.setAttribute(name, '-fsb-empty');
  		return element.firstElementChild.setAttribute(name, value);
  	} else if (name == 'class' && HTMLHelper.isForChildren(element)) {
  		element.setAttribute(name, CodeHelper.getInternalClasses(value));
  		return element.firstElementChild.setAttribute(name, CodeHelper.getCustomClasses(value));
  	} else if (FORWARED_ATTRIBUTES_FOR_CHILDREN.indexOf(name) != -1 && HTMLHelper.isForChildren(element)) {
  		return element.firstElementChild.setAttribute(name, value);
  	} else {
  		return element.setAttribute(name, value);
  	}
  },
  removeAttribute: (element: HTMLElement, name: string) => {
  	if (!element || !element.getAttribute || !element.removeAttribute) return;
  	if (name == 'style' && element.getAttribute(name) == '-fsb-empty') {
  		element.removeAttribute(name);
  		element.firstElementChild.removeAttribute(name);
  	} else if (FORWARED_ATTRIBUTES_FOR_CHILDREN.indexOf(name) != -1 && HTMLHelper.isForChildren(element)) {
  		return element.firstElementChild.removeAttribute(name);
  	} else {
  		return element.removeAttribute(name);
  	}
  },
  hasAttribute: (element: HTMLElement, name: string) => {
  	if (!element || !element.getAttribute || !element.hasAttribute) return null;
  	if (name == 'style' && element.getAttribute(name) == '-fsb-empty') {
  		return element.firstElementChild.hasAttribute(name);
  	} else if (FORWARED_ATTRIBUTES_FOR_CHILDREN.indexOf(name) != -1 && HTMLHelper.isForChildren(element)) {
  		return element.firstElementChild.hasAttribute(name);
  	} else {
  		return element.hasAttribute(name);
  	}
  },	
	
  findTheParentInClassName: (className: string, element: HTMLElement, isIncludingSelf: boolean=false) => { // the closet one
    let current = (!isIncludingSelf) ? element.parentNode : element;
    while (current != null) {
      if (HTMLHelper.hasClass(current, className)) {
        return current;
      }
      current = current.parentNode;
    }
    
    return null;
  },
  findAllParentsInClassName: (className: string, element: HTMLElement) => {
    let results = [];
    let current = element.parentNode;
    
    while (current != null && current != document) {
      if (HTMLHelper.hasClass(current, className)) {
        results.push(current);
      }
      current = current.parentNode;
    }
    
    return results;
  },
  findAllParentValuesInAttributeName: (attributeName: string, fromElement: HTMLElement, toElement: HTMLElement=null, includeSelf: boolean=false) => {
    let results = [];
    let current = (includeSelf) ? fromElement : fromElement.parentNode;
    
    if (current == null) {
      return results;
    }
    
    do {
      let value = current.getAttribute(attributeName);
      if (value !== '' && value !== null) {
        results.push(value);
      }
      current = current.parentNode;
    }
    while (current != toElement && current != null && current != document)
    
    return results;
  },
  
  hasClass: (element: any, name: string) => {
    let classAttributeValue: string = element;
    if (typeof element === 'object') {
      classAttributeValue = (element.className || '');
    }
    let splited = classAttributeValue.split && classAttributeValue.split(' ') || [];
    return splited.indexOf(name) != -1;
  },
  removeClass: (element: HTMLElement, name: string) => {
    let classAttributeValue: string = element;
    if (typeof element === 'object') {
      classAttributeValue = (element.className || '');
    }
    if (!classAttributeValue.split) return;
    let splited = classAttributeValue.split(' ') || [];
    let index = splited.indexOf(name);
    if (index != -1) {
      splited.splice(index, 1);
    }
    element.className = HTMLHelper.cleanArray(splited).sort().join(' ');
  },
  addClass: (element: HTMLElement, name: string) => {
    let classAttributeValue: string = element;
    if (typeof element === 'object') {
      classAttributeValue = (element.className || '');
    }
    if (!classAttributeValue.split) return;
    let splited = classAttributeValue.split(' ') || [];
    if (splited.indexOf(name) == -1) {
      splited.push(name);
    }
    element.className = HTMLHelper.cleanArray(splited).sort().join(' ');
  },
  cleanArray: (splited: string[]) => {
    let results = [];
    splited.forEach((token) => {
      if (token) {
        results.push(token);
      }
    });
    return results;
  },
  
  setInlineStyle: (inlineStyle: string, styleName: string, styleValue: string) => {
    let splited = (inlineStyle || '').replace(/;$/, '').split('; ');
    let found = false;
    
    for (var i=0; i<splited.length; i++) {
      if (splited[i].indexOf(styleName + ': ') == 0) {
        found = true;
        if (styleValue) {
        	splited[i] = styleName + ': ' + styleValue;
        } else {
        	splited.splice(i, 1);
        }
        break;
      }
    }
    
    if (!found && styleValue) {
      splited.push(styleName + ': ' + styleValue);
    }
    
    return splited.sort().join('; ');
  },
  getInlineStyle: (inlineStyle: string, styleName: string) => {
  	if (!inlineStyle) return null;
    if (('; ' + inlineStyle).indexOf('; ' + styleName + ': ') == -1) return null;
    
    let splited = inlineStyle.replace(/;$/, '').split('; ');
    
    for (var i=0; i<splited.length; i++) {
      if (splited[i].trim().indexOf(styleName + ': ') == 0) {
        let tokens = splited[i].split(': ');
        return tokens[tokens.length - 1];
      }
    }
    
    return null;
  },
  getHashMapFromInlineStyle: (inlineStyle: string) => {
  	if (!inlineStyle) return {};
    let splited = inlineStyle.replace(/;$/, '').split('; ');
    let hashMap = {};
    
    for (var i=0; i<splited.length; i++) {
      let tokens = splited[i].split(': ');
      hashMap[tokens[0]] = tokens[1];
    }
    
    return hashMap;
  },
  getInlineStyleFromHashMap: (hash: any) => {
    let results = [];
    for (var key in hash) {
      if (hash.hasOwnProperty(key) && hash[key] != null) {
        results.push(key + ': ' + hash[key]);
      }
    }
    return results.sort().join('; ');
  },
  
  getPosition: (object: HTMLElement, ofDocument: boolean=true, ofOrigin: boolean=false) => {
    var curleft = 0;
    var curtop = 0;
    var computedStyle = null;
    
    if (object.offsetParent) {
      do {
        computedStyle = window.getComputedStyle(object, null);
        curleft += object.offsetLeft;
        curleft += parseInt(computedStyle.getPropertyValue('border-left-width'));
        curtop += object.offsetTop;
        curtop += parseInt(computedStyle.getPropertyValue('border-top-width'));
        curtop -= object.scrollTop;
      } while (ofDocument && (object = object.offsetParent));
    }
    
    if (ofOrigin) {
      curtop += document.body.scrollTop;
    }
    
    return [curleft, curtop];
  },
  getSize: (object: HTMLElement) => {
    return [object.offsetWidth, object.offsetHeight];
  },
  getContainingIframe: (currentWindow: Window) => {
    let iframeElements = HTMLHelper.getElementsByTagName('iframe', currentWindow.parent.document);
    
    for (var i=0; i<iframeElements.length; i++) {
      if (HTMLHelper.getIframeContentWindow(iframeElements[i]) === currentWindow) {
        return iframeElements[i]
      }
    }
    
    return null;
  },
  getOriginalPosition: (_position: [number, number], currentWindow: Window) => {
    let result = [_position[0], _position[1]];
    if (currentWindow.parent == null) return result;
    
    while (currentWindow !== null && currentWindow != currentWindow.parent) {
      let iframe = HTMLHelper.getContainingIframe(currentWindow);
      if (iframe === null) break;
      
      let position = HTMLHelper.getPosition(iframe);
      
      result[0] += position[0];
      result[1] += position[1];
      
      currentWindow = currentWindow.parent;
    }
    
    return result;
  },
  
  getCurrentWindow: (element: HTMLElement) => {
    let document = element.ownerDocument;
    return document.defaultView || document.parentWindow;
  },
  getIframeContentWindow: (element: HTMLIframeElement) => {
    return element.contentWindow;
  },
  hasVendorPrefix: (prefix: string, name: string) => {
    return vendor_prefixes_hash[prefix + name] === true;
  },
  sortAttributes: (container: HTMLElement=document) => {
  	HTMLHelper.recursiveSortAttributes([document.body]);
  },
	recursiveSortAttributes: (elements: any) => {
    for (let j = 0; j < elements.length; j++) {
    	if (!elements[j].setAttribute || !elements[j].removeAttribute) continue;
    	
    	const attributes = [];
    	if (elements[j].hasAttributes()) {
        let attrs = elements[j].attributes;
        for (let attr of attrs) {
          attributes.push({
            name: attr.name,
            value: attr.value
          });
        }
      }
			
      for (let i = 0; i < attributes.length; i++) {
        elements[j].removeAttribute(attributes[i].name);
      }

      for (let i = 0; i < attributes.length; i++) {
      	HTMLHelper.sortAttributeValues(attributes[i]);
      	
        elements[j].setAttribute(attributes[i].name, attributes[i].value);
      }
      
      elements[j].children && HTMLHelper.recursiveSortAttributes(elements[j].children);
    }
	},
	sortAttributeValues: (attribute: any) => {
		switch (attribute.name) {
  		case 'style':
  			if (attribute.value) {
  				attribute.value = attribute.value.split('; ').sort().join('; ');
  			}
  			break;
  		case 'class':
  			if (attribute.value) {
  				attribute.value = attribute.value.split(' ').sort().join(' ');
  			}
  			break;
  		case 'internal-fsb-data-controls':
  			if (attribute.value) {
  				attribute.value = attribute.value.trim().split(' ').sort().join(' ');
  			}
  			break;
  	}
	}
};

export {HTMLHelper};