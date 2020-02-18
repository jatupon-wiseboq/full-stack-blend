import {HTMLHelper} from './HTMLHelper.js';
import {EventHelper} from './EventHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import '../components/Cursor.js';
import '../components/Dragger.js';
import '../components/Guide.js';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  cursor: HTMLElement = null,
  dragger: HTMLElement = null,
  guide: HTMLElement = null
}

var EditorHelper = {
  setup: () => {
    Accessories.cursor = document.createElement('div');
    ReactDOM.render(<FullStackBlend.Components.Cursor />, Accessories.cursor);
    Accessories.cursor = Accessories.cursor.firstChild;
    
    function draggerOnPreview(original: {x: number, y: number, w: number, h: number}, diff: {dx: number, dy: number, dw: number, dh: number}) {
      let size = LayoutHelper.calculateColumnSize(original.w + diff.dw);
      if (size !== null) {
        ManipulationHelper.perform('update[columnSize]', size, false);
      }
    }
    function draggerOnUpdate(original: {x: number, y: number, w: number, h: number}, diff: {dx: number, dy: number, dw: number, dh: number}) {
      let size = LayoutHelper.calculateColumnSize(original.w + diff.dw);
      if (size !== null) {
        ManipulationHelper.perform('update[columnSize]', size, true);
      }
    }
    
    Accessories.dragger = document.createElement('div');
    ReactDOM.render(<FullStackBlend.Components.Dragger onPreview={draggerOnPreview} onUpdate={draggerOnUpdate} />, Accessories.dragger);
    Accessories.dragger = Accessories.dragger.firstChild;
    
    Accessories.guide = document.createElement('div');
    ReactDOM.render(<FullStackBlend.Components.Guide />, Accessories.guide);
    Accessories.guide = Accessories.guide.firstChild;
    
    EditorHelper.moveCursorToTheEndOfDocument();
  },
  
  synchronize: (name: string, content: any) => {
    window.top.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  },
  
  moveCursorToTheEndOfDocument: () => {
    let element = HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (element) {
      element.appendChild(Accessories.cursor);
      element.parentNode.appendChild(Accessories.guide);
    }
  },
  
  select: (element: HTMLElement, dragger: HTMLElement) => {
    if (!element) return;
    if (HTMLHelper.hasClass(element, 'internal-fsb-element')) {
      element.appendChild(Accessories.dragger);
      
      let current = element;
      while (current != null) {
        if (HTMLHelper.hasClass(current, 'container') || HTMLHelper.hasClass(current, 'container-fluid')) {
          current.insertBefore(Accessories.guide, current.firstChild);
          break;
        }
        current = current.parentNode;
      }
      
      EditorHelper.synchronize('select', element.getAttribute('internal-fsb-class'));
    }
  },
  getSelectingElement: () => {
    if (Accessories.dragger && Accessories.dragger.parentNode && HTMLHelper.hasClass(Accessories.dragger.parentNode, 'internal-fsb-element')) {
      return Accessories.dragger.parentNode;
    } else {
      return null;
    }
  },
  
  installCapabilityOfBeingSelected: (element: HTMLElement, guid: string) => {
    element.setAttribute('internal-fsb-guid', guid);
    element.addEventListener('click', (event) => {
      if (EventHelper.checkIfDenyForEarlyHandle(event)) return;
      
      if (EditorHelper.getSelectingElement() != EventHelper.getCurrentElement(event)) {
        ManipulationHelper.perform('select', guid);
      }
      
      EditorHelper.synchronize("click", null);
      return EventHelper.cancel(event);
    }, false);
    EventHelper.setDenyForEarlyHandle(element);
  },
  installCapabilityOfBeingMoveInCursor: (container: HTMLElement) => {
    let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', container)];
    if (HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor')) {
      allowCursorElements.push(container);
    }
    allowCursorElements.forEach((element: HTMLElement) => {
      if (element.getAttribute('internal-fsb-binded-click') != '1') {
        element.setAttribute('internal-fsb-binded-click', '1');
        element.addEventListener('click', (event) => {
          if (EventHelper.checkIfDenyForEarlyHandle(event)) return;
          
          if (Accessories.cursor) element.appendChild(Accessories.cursor);
          
          let parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', element);
          if (parent != null) {
            parent.click();
          }
          
          EditorHelper.synchronize("click", null);
          return EventHelper.cancel(event);
        }, false);
        EventHelper.setDenyForEarlyHandle(element);
      }
    });
  },
  installCapabilitiesForInternalElements: (container: HTMLElement) => {
    let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-element', container)];
    elements.forEach((element) => {
      EditorHelper.installCapabilityOfBeingSelected(element);
    });
    EditorHelper.installCapabilityOfBeingMoveInCursor(container);
  }
};

export {Accessories, EditorHelper};