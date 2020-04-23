import {VENDOR_PREFIXES} from '../VendorPrefixes.js';

let vendor_prefixes_hash = {};
for (let prefix of VENDOR_PREFIXES) {
  vendor_prefixes_hash[prefix] = true;
}

let _BASE_GET_ATTRIBUTE = HTMLElement.prototype.getAttribute;
HTMLElement.prototype.getAttribute = function(name) {
	if (_BASE_GET_ATTRIBUTE.apply(this, ['internal-fsb-style-children']) == 'true' && name == 'style') {
		return _BASE_GET_ATTRIBUTE.apply(this.firstChild, [name]);
	} else {
		return _BASE_GET_ATTRIBUTE.apply(this, [name]);
	}
};
let _BASE_SET_ATTRIBUTE = HTMLElement.prototype.setAttribute;
HTMLElement.prototype.setAttribute = function(name, value) {
  if (_BASE_GET_ATTRIBUTE.apply(this, ['internal-fsb-style-children']) == 'true' && name == 'style') {
  	_BASE_SET_ATTRIBUTE.apply(this, [name, '']);
		return _BASE_SET_ATTRIBUTE.apply(this.firstChild, [name, value]);
	} else {
		return _BASE_SET_ATTRIBUTE.apply(this, [name, value]);
	}
};
let _BASE_REMOVE_ATTRIBUTE = HTMLElement.prototype.removeAttribute;
HTMLElement.prototype.removeAttribute = function(name) {
	if (_BASE_GET_ATTRIBUTE.apply(this, ['internal-fsb-style-children']) == 'true' && name == 'style') {
		_BASE_REMOVE_ATTRIBUTE.apply(this, [name]);
		return _BASE_REMOVE_ATTRIBUTE.apply(this.firstChild, [name]);
	} else {
		return _BASE_REMOVE_ATTRIBUTE.apply(this, [name]);
	}
}
let _BASE_HAS_ATTRIBUTE = HTMLElement.prototype.hasAttribute;
HTMLElement.prototype.hasAttribute = function(name) {
	if (_BASE_GET_ATTRIBUTE.apply(this, ['internal-fsb-style-children']) == 'true' && name == 'style') {
		return _BASE_HAS_ATTRIBUTE.apply(this.firstChild, [name]);
	} else {
		return _BASE_HAS_ATTRIBUTE.apply(this, [name]);
	}
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
  getElementsByAttribute: (attributeName: string, container: HTMLElement=document) => {
    return container.querySelectorAll('[' + attributeName + ']');
  },
  getElementsByTagName: (tagName: string, _window: Window=window) => {
    if (_window === null) return [];
    
    return _window.document.getElementsByTagName(tagName);
  },
  getAttributes: (element: HTMLElement, array: boolean=false, mergeAttributes: any={}) => {
    if (array) {
      let elementAttributes = [];
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
              value: element.getAttribute(attr.name)
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
      
      return elementAttributes;
    } else {
      if (element.hasAttributes()) {
        let attrs = element.attributes;
        for (let attr of attrs) {
          if (mergeAttributes[attr.name] === undefined) {
            mergeAttributes[attr.name] = element.getAttribute(attr.name);
          }
        }
      }
      
      return mergeAttributes;
    }
  },
  findTheParentInClassName: (className: string, element: HTMLElement) => { // the closet one
    let current = element.parentNode;
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
    
    while (current != null) {
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
    let splited = classAttributeValue.split(' ');
    return splited.indexOf(name) != -1;
  },
  removeClass: (element: HTMLElement, name: string) => {
    let classAttributeValue: string = element;
    if (typeof element === 'object') {
      classAttributeValue = (element.className || '');
    }
    let splited = classAttributeValue.split(' ');
    let index = splited.indexOf(name);
    if (index != -1) {
      splited.splice(index, 1);
    }
    element.className = HTMLHelper.cleanArray(splited).join(' ');
  },
  addClass: (element: HTMLElement, name: string) => {
    let classAttributeValue: string = element;
    if (typeof element === 'object') {
      classAttributeValue = (element.className || '');
    }
    let splited = classAttributeValue.split(' ');
    if (splited.indexOf(name) == -1) {
      splited.push(name);
    }
    element.className = HTMLHelper.cleanArray(splited).join(' ');
  },
  cleanArray: (splited: [string]) => {
    let results = [];
    splited.forEach((token) => {
      if (token) {
        results.push(token);
      }
    });
    return results;
  },
  
  updateInlineStyle: (styleAttributeValue: string, styleName: string, styleValue: string) => {
    let splited = (styleAttributeValue || '').split('; ');
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
    
    return splited.join('; ');
  },
  getInlineStyle: (styleAttributeValue: string, styleName: string) => {
    if (('; ' + styleAttributeValue).indexOf('; ' + styleName + ': ') == -1) return null;
    
    let splited = styleAttributeValue.split('; ');
    
    for (var i=0; i<splited.length; i++) {
      if (splited[i].trim().indexOf(styleName + ': ') == 0) {
        let tokens = splited[i].split(': ');
        return tokens[tokens.length - 1];
      }
    }
    
    return null;
  },
  getHashMapFromInlineStyle: (styleAttributeValue: string) => {
    let splited = styleAttributeValue.split('; ');
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
    return results.join('; ');
  },
  
  getPosition: (object: HTMLElement, ofDocument: boolean=true) => {
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
    
    return [curleft, curtop];
  },
  getSize: (object: HTMLElement) => {
    return [object.offsetWidth, object.offsetHeight];
  },
  getContainingIframe: (currentWindow: Window) => {
    let iframeElements = HTMLHelper.getElementsByTagName('iframe', currentWindow.parent);
    
    for (var i=0; i<iframeElements.length; i++) {
      if (HTMLHelper.getIframeContentWindow(iframeElements[i]) === currentWindow) {
        return iframeElements[i]
      }
    }
    
    return null;
  },
  getOriginalPosition: (_position: [number, number], currentWindow: Window) => {
    let result = [_position[0], _position[1]];
    
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
  }
};

export {HTMLHelper};