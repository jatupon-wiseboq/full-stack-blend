import {HTMLHelper} from './HTMLHelper.js';

var EventHelper = {
  cancel: (event: HTMLEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    return false;
  },
  
  getCurrentElement: (event: HTMLEvent) => {
    return event.currentTarget;
  },
  getOriginalElement: (event: HTMLEvent) => {
    return event.srcElement || event.originalTarget;
  },
  getCurrentWindow: (event: HTMLEvent) => {
    return HTMLHelper.getCurrentWindow(EventHelper.getCurrentElement(event));
  },
  getMousePosition: (event: HTMLEvent) => {
    return [event.clientX, event.clientY];
  },
  
  checkIfDenyForEarlyHandle: (event: HTMLEvent) => {
    let originalElement = EventHelper.getOriginalElement(event);
    
    if (EventHelper.getCurrentElement(event) == originalElement) return false;
    else return originalElement.getAttribute('internal-fsb-event-no-propagate') == '1';
  },
  setDenyForEarlyHandle: (element: HTMLElement) => {
    element.setAttribute('internal-fsb-event-no-propagate', '1');
  },
};

export {EventHelper};