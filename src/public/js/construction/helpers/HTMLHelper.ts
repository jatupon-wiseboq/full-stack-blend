var HTMLHelper = {
  sanitizingPug: (code: string) => {
    return code.replace(/classname=/gi, 'class=');
  },
  
  getElementById: (id: string) => {
    return document.getElementById(id);
  },
  getElementByClassName: (className: string) => { // return the last one
    let elements = HTMLHelper.getElementsByClassName(className);
    if (elements.length != 0) { return elements[elements.length - 1]; }
    else { return null; }
  },
  getElementsByClassName: (className: string) => {
    return document.getElementsByClassName(className);
  },
  getElementByAttributeNameAndValue: (attributeName: string, value: string) => {
    return document.querySelectorAll('[' + attributeName + '="' + value + '"]')[0];
  },
  getElementsByAttribute: (attributeName: string) => {
    return document.querySelectorAll('[' + attributeName + ']');
  },
  
  findPosition(object: HTMLElement) {
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
  findSize(object: HTMLElement) {
    return [object.offsetWidth, object.offsetHeight];
  }
};

export {HTMLHelper};