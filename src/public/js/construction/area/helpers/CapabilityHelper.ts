import {HTMLHelper} from '../../helpers/HTMLHelper';
import {EventHelper} from '../../helpers/EventHelper';
import {CursorHelper} from './CursorHelper';
import {isCtrlKeyActive, isCommandKeyActive, ManipulationHelper} from './ManipulationHelper';
import {Accessories, EditorHelper} from './EditorHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {SINGLE_DOM_CONTAINER_ELEMENTS} from '../../Constants';

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
        
        if (isCtrlKeyActive || isCommandKeyActive) {
          if (index != -1) {
            willSelected = parents[Math.max(0, index - 1)];
          } else {
            willSelected = parents[parents.length - 1];
          }
        } else {
          willSelected = parents[0];
        }
        
        EditorHelper.synchronize("click", null);
        
        if (selecting != willSelected) {
          ManipulationHelper.perform('select[cursor]', HTMLHelper.getAttribute(willSelected, 'internal-fsb-guid'));
	        EventHelper.setDenyForHandle("click", true);
	        EventHelper.setDenyForHandle("click", false, 100);
        }
        
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
        let listenEventFromElement = (!HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-begin-layout') &&
          HTMLHelper.hasClass(allowCursorElement.parentNode, 'container-fluid')) ?
          allowCursorElement.parentNode : allowCursorElement;
        
        if (!allowCursorElement.internalFsbBindedClick) {
          allowCursorElement.internalFsbBindedClick = true;
          
          if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-strict-layout') ||
          	!HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-absolute-layout')) {
          	if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-begin-layout')) {
	          	listenEventFromElement.addEventListener('click', (event) => {
	          		if (EventHelper.checkIfDenyForHandle(event)) return;
	          		
	          		let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement, true);
	          		let cursorPosition = EventHelper.getMousePosition(event);
	          		let found = -1;
	          		
	          		let elements = [...allowCursorElement.children];
	          		elements = elements.filter(element => element != Accessories.cursor.getDOMNode());
	          		for (const [index, element] of elements.entries()) {
	          			let elementPosition = HTMLHelper.getPosition(element);
	          			let elementSize = HTMLHelper.getSize(element);
	          			
	          			if (elementPosition[1] < cursorPosition[1] && elementPosition[1] + elementSize[1] > cursorPosition[1]) {
	          				if (elementPosition[0] > cursorPosition[0]) {
	          					break;
	          				}
	          			} else if (elementPosition[1] > cursorPosition[1]) {
	          				break;
	          			}
	          			
	          			found = index;
	          		}
	          		
	          		if (found != -1) {
	          			let walkPath = CursorHelper.createWalkPathForCursor('0', 0, found + 1);
	          			ManipulationHelper.perform('move[cursor]', walkPath);
	          		} else {
	          			CursorHelper.moveCursorToTheEndOfDocument(false);
	          		}
	              
	              EditorHelper.synchronize("click", null);
	              return EventHelper.cancel(event);
	            }, false);
	          } else {
	            listenEventFromElement.addEventListener('click', (event) => {
	              if (EventHelper.checkIfDenyForHandle(event)) return;
	              
	              let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement, true);
	              let isReferenceElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(allowCursorElement, 'internal-fsb-class')) != -1);
	              
	              if (isReferenceElementASingleDomElement) {
	              	referenceElement = allowCursorElement;
	              }
	              
	              if (referenceElement != null) {
	                let allowCursorElements = (isReferenceElementASingleDomElement) ? [allowCursorElement] :
	                	[...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
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
	          }
          } else if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-absolute-layout')) {
            listenEventFromElement.addEventListener('click', (event) => {
              if (EventHelper.checkIfDenyForHandle(event)) return;
              
              if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-begin-layout')) {
              	let layoutPosition = HTMLHelper.getPosition(allowCursorElement);
                let mousePosition = EventHelper.getMousePosition(event);
                
                mousePosition[0] += document.body.scrollLeft;
                
                ManipulationHelper.perform('move[cursor]', CursorHelper.createWalkPathForCursor(
                  '0',
                  0,
                  mousePosition[0] - layoutPosition[0],
                  mousePosition[1] - layoutPosition[1]
                ));
              } else {
	              let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement, true);
	              if (referenceElement != null) {
	                referenceElement.click();
	                
	                if (referenceElement == EditorHelper.getSelectingElement()) {
	                  let layoutPosition = HTMLHelper.getPosition(allowCursorElement);
	                  let mousePosition = EventHelper.getMousePosition(event);
	                  
	                  mousePosition[0] += document.body.scrollLeft;
	                  
	                  ManipulationHelper.perform('move[cursor]', CursorHelper.createWalkPathForCursor(
	                    HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
	                    0,
	                    mousePosition[0] - layoutPosition[0],
	                    mousePosition[1] - layoutPosition[1]
	                  ));
	                }
	              }
	            }
              
              EditorHelper.synchronize("click", null);
              return EventHelper.cancel(event);
            }, false);
          }
          
          EventHelper.setDenyForEarlyHandle(listenEventFromElement);
          // Migrate: setDenyForEarlyHandle shouldn't be active in allowCursorElement if handle in the container.
          //
          if (allowCursorElement != listenEventFromElement) EventHelper.setAllowForEarlyHandle(allowCursorElement);
        }
      });
    });
  },
  installCapabilityOfBeingPasted: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
  	  container.addEventListener('paste', EventHelper.pasteEventInTextPlain, false);
  	});
  },
  installCapabilityOfBeingDragged: (_container: HTMLElement) => {
    let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-dragging-handle', _container)];
    if (HTMLHelper.hasClass(_container, 'internal-fsb-dragging-handle')) {
      elements.push(_container);
    }
    
    elements.forEach((element) => {
  	  if (!element.internalFsbBindedDragging) {
        element.internalFsbBindedDragging = true;
        
        Accessories.dragger.bind(element);
      }
  	});
  },
  installCapabilityOfBeingClickWithoutRedirection: (_container: HTMLElement) => {
    let elements = [...HTMLHelper.getElementsByTagName('a', _container)];
    if (_container.tagName == 'A') {
      elements.push(_container);
    }
    
    elements.forEach((element) => {
  	  element.addEventListener('click', (event) => {
  	 		event.preventDefault();
  	 	}, true);
  	});
  },
  installCapabilitiesForInternalElements: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
      let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-element', container)];
      elements.forEach((element) => {
        CapabilityHelper.installCapabilityOfBeingSelected(element);
        CapabilityHelper.installCapabilityOfBeingMeasure(element);
      });
      if (HTMLHelper.hasClass(container, 'internal-fsb-element') && !HTMLHelper.hasClass(container, 'internal-fsb-begin')) {
        CapabilityHelper.installCapabilityOfBeingSelected(container);
      }
      
      CapabilityHelper.installCapabilityOfBeingMeasure(container);
      CapabilityHelper.installCapabilityOfBeingMoveInCursor(container);
      
      if (HTMLHelper.getAttribute(container, 'contentEditable') == 'true') {
      	CapabilityHelper.installCapabilityOfBeingPasted(container);
      }
    });
    CapabilityHelper.installCapabilityOfBeingDragged(_container);
    CapabilityHelper.installCapabilityOfBeingClickWithoutRedirection(_container);
  },
  installCapabilityOfForwardingStyle: (_container: HTMLElement) => {
    HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
    	let style = HTMLHelper.getAttribute(container, 'style');
    	style = HTMLHelper.setInlineStyle(style, '-fsb-for-children', 'true');
    	HTMLHelper.setAttribute(container, 'style', style);
    });
  },
  installCapabilityOfBeingMeasure: (_container: HTMLElement) => {
  	if (['site', 'components', 'popups'].indexOf(InternalProjectSettings.currentMode) == -1) return;
  	
  	HTMLHelper.getElementsByAttribute('internal-fsb-guid', _container, true).forEach((container) => {
  		container.addEventListener('mouseout', (event: Event) => {
	    	Accessories.redLine.measure(null);
	    	
	    	return EventHelper.cancel(event);
      }, false);
	    container.addEventListener('mouseover', (event: Event) => {
        Accessories.redLine.measure(event);
        
        return EventHelper.cancel(event);
      }, false);
	  });
  }
};

export {CapabilityHelper};