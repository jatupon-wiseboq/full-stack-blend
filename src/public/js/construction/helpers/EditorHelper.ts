import {HTMLHelper} from './HTMLHelper.js';

var EditorHelper = {
  synchronize: (name: string, content: any) => {
    window.top.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  },
  
  select: (element: HTMLElement, dragger: HTMLElement) => {
    if (element.className.indexOf('internal-fsb-element') != -1) {
      element.appendChild(dragger);
      
      EditorHelper.synchronize('select', element.getAttribute('internal-fsb-class'));
    }
  },
  
  getSelectingElement: () => {
    let dragger = HTMLHelper.getElementByClassName('internal-fsb-dragger');
    if (dragger && dragger.parentNode && dragger.parentNode.className.indexOf('internal-fsb-element') != -1) {
      return dragger.parentNode;
    } else {
      return null;
    }
  }
};

export {EditorHelper};

          
          