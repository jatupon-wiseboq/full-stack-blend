import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';

var CapabilityHelper = {
	installCapabilityOfBeingSelected: (_container: HTMLElement) => {
	  HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
	    container.addEventListener('click', (event) => {
        if (EventHelper.checkIfDenyForHandle(event)) return;
        
        let selecting = EditorHelper.getSelectingElement();
        let willSelected = EventHelper.getCurrentElement(event);
        let parents = HTMLHelper.findAllParentsInClassName('internal-fsb-element', willSelected);
        parents.splice(0, 0, willSelected);
        let index = parents.indexOf(selecting);
        
        if (index != -1) {
          willSelected = parents[Math.max(0, index - 1)];
        } else {
          willSelected = parents[parents.length - 1];
        }
        
        if (selecting != willSelected) {
          ManipulationHelper.perform('select', HTMLHelper.getAttribute(willSelected, 'internal-fsb-guid'));
        }
        
        EditorHelper.synchronize("click", null);
        return EventHelper.cancel(event);
      }, false);
      EventHelper.setDenyForEarlyHandle(container);
	  });
  },
  installCapabilityOfBeingMoveInCursor: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
      let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', container)];
      if (HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor')) {
        allowCursorElements.push(container);
      }
      allowCursorElements.forEach((allowCursorElement: HTMLElement) => {
        if (!allowCursorElement.internalFsbBindedClick) {
          allowCursorElement.internalFsbBindedClick = true;
          
          if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-strict-layout')) {
            allowCursorElement.addEventListener('click', (event) => {
              if (EventHelper.checkIfDenyForHandle(event)) return;
              
              let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement);
              if (referenceElement != null) {
                let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
                let theAllowCursorElement = allowCursorElement;
                let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
                
                if (indexOfAllowCursorElement != -1) {
                  let children = [...theAllowCursorElement.children];
                  let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
                  let maximum = count;
                  let walkPath = CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'), indexOfAllowCursorElement, maximum);
                  ManipulationHelper.perform('move[cursor]', walkPath);
                }
                
                referenceElement.click();
              }
              
              EditorHelper.synchronize("click", null);
              return EventHelper.cancel(event);
            }, false);
          } else if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-absolute-layout')) {
            allowCursorElement.addEventListener('click', (event) => {
              if (EventHelper.checkIfDenyForHandle(event)) return;
              
              let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement);
              if (referenceElement != null) {
                referenceElement.click();
                
                if (referenceElement == EditorHelper.getSelectingElement()) {
                  let layoutPosition = HTMLHelper.getPosition(allowCursorElement);
                  let mousePosition = EventHelper.getMousePosition(event);
                  
                  ManipulationHelper.perform('move[cursor]', CursorHelper.createWalkPathForCursor(
                    HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
                    0,
                    mousePosition[0] - layoutPosition[0],
                    mousePosition[1] - layoutPosition[1]
                  ));
                }
              }
              
              EditorHelper.synchronize("click", null);
              return EventHelper.cancel(event);
            }, false);
          }
            
          EventHelper.setDenyForEarlyHandle(allowCursorElement);
        }
      });
    });
  },
  installCapabilityOfBeingPasted: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
  	  container.addEventListener('paste', EventHelper.pasteEventInTextPlain, false);
  	});
  },
  installCapabilitiesForInternalElements: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
      let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-element', container)];
      elements.forEach((element) => {
        CapabilityHelper.installCapabilityOfBeingSelected(element);
      });
      CapabilityHelper.installCapabilityOfBeingMoveInCursor(container);
      if (HTMLHelper.getAttribute(container, 'contentEditable') == 'true') {
      	CapabilityHelper.installCapabilityOfBeingPasted(container);
      }
    });
  },
  installCapabilityOfForwardingStyle: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
    	let style = HTMLHelper.getAttribute(container, 'style');
    	style = HTMLHelper.setInlineStyle(style, '-fsb-for-children', 'true');
    	HTMLHelper.setAttribute(container, 'style', style);
    });
  }
};

export {CapabilityHelper};