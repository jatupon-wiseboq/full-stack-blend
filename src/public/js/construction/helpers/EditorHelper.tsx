import {HTMLHelper} from './HTMLHelper.js';
import {EventHelper} from './EventHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import '../components/Cursor.js';
import '../components/Dragger.js';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  cursor: HTMLElement = null,
  dragger: HTMLElement = null
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
    }
  },
  
  select: (element: HTMLElement, dragger: HTMLElement) => {
    if (HTMLHelper.hasClass(element, 'internal-fsb-element')) {
      element.appendChild(Accessories.dragger);
      
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
      if (EditorHelper.getSelectingElement() != EventHelper.getCurrentElement(event)) {
        ManipulationHelper.perform('select', guid);
      }
      EditorHelper.synchronize("click", null);
      return EventHelper.cancel(event);
    }, false);
  },
  installCapabilityOfBeingMoveInCursor: (container: HTMLElement) => {
    let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', container)];
    if (HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor')) {
      allowCursorElements.push(container);
    }
    allowCursorElements.forEach((element: HTMLElement) => {
      if (element.getAttribute('internal-fsb-binded-click') != '1') {
        element.addEventListener('click', (event) => {
          if (Accessories.cursor) element.appendChild(Accessories.cursor);
          EditorHelper.synchronize("click", null);
        }, true);
        element.setAttribute('internal-fsb-binded-click', '1');
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