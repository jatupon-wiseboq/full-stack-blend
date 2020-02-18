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
  getElementsByClassName: (className: string, container: HTMLElement=document) => {
    return container.getElementsByClassName(className, container);
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
  findTheParentInClassName: (className: string, element: HTMLElement) => {
    let current = element;
    while (current != null) {
      current = current.parentNode;
      if (HTMLHelper.hasClass(current, className)) {
        return current;
      }
    }
    
    return null;
  },
  
  hasClass: (element: HTMLElement, name: string) => {
    let splited = (element.className || '').split(' ');
    return splited.indexOf(name) != -1;
  },
  removeClass: (element: HTMLElement, name: string) => {
    let splited = (element.className || '').split(' ');
    let index = splited.indexOf(name);
    if (index != -1) {
      splited.splice(index, 1);
    }
    element.className = HTMLHelper.cleanArray(splited).join(' ');
  },
  addClass: (element: HTMLElement, name: string) => {
    let splited = (element.className || '').split(' ');
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
  
  getPosition: (object: HTMLElement) => {
    var curleft = 0;
    var curtop = 0;
    
    if (object.offsetParent) {
      do {
        curleft += object.offsetLeft;
        curtop += object.offsetTop;
      } while (object = object.offsetParent);
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
  }
};

export {HTMLHelper};