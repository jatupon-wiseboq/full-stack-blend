import {HTMLHelper} from './HTMLHelper.js';

let denyForHandle: any = {};
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
  
  checkIfDenyForHandle: (event: HTMLEvent) => {
    let originalElement = EventHelper.getOriginalElement(event);
    
    if (denyForHandle[event.type]) return true;
    console.log('checkIfDenyForHandle', event.type, denyForHandle);
    
    if (EventHelper.getCurrentElement(event) == originalElement) return false;
    else return originalElement.getAttribute('internal-fsb-event-no-propagate') == '1';
  },
  setDenyForHandle: (name: string, value: boolean, delay: null) => {
    console.log('setDenyForHandle', name, value);
    
    if (delay == null) {
      denyForHandle[name] = value;
    } else {
      window.setTimeout(() => {
        denyForHandle[name] = value;
      }, delay);
    }
  },
  setDenyForEarlyHandle: (element: HTMLElement) => {
    element.setAttribute('internal-fsb-event-no-propagate', '1');
  },
};

export {EventHelper};