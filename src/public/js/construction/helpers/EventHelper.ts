import {HTMLHelper} from './HTMLHelper';

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
    return event.srcElement || event.originalTarget || event.target;
  },
  getCurrentWindow: (event: HTMLEvent) => {
    return HTMLHelper.getCurrentWindow(EventHelper.getCurrentElement(event));
  },
  getMousePosition: (event: HTMLEvent) => {
    return [event.clientX, event.clientY];
  },
  
  checkIfDenyForHandle: (event: HTMLEvent) => {
    let originalElement = EventHelper.getOriginalElement(event);
    if (HTMLHelper.getAttribute(originalElement, 'internal-fsb-event-always-propagate') == event.type) return false;
    
    if (denyForHandle[event.type]) return true;
    
    let values = HTMLHelper.findAllParentValuesInAttributeName('internal-fsb-event-no-propagate', originalElement, EventHelper.getCurrentElement(event), true);
    for (let value of values) {
      if (value.split(',').indexOf(event.type) != -1) {
        return (EventHelper.getCurrentElement(event) != originalElement);
      }
    }
    
    if (EventHelper.getCurrentElement(event) == originalElement) return false;
    else return HTMLHelper.getAttribute(originalElement, 'internal-fsb-event-no-propagate') == '1';
  },
  setDenyForHandle: (name: string, value: boolean, delay: null) => {
    if (delay == null) {
      denyForHandle[name] = value;
    } else {
      window.setTimeout(() => {
        denyForHandle[name] = value;
      }, delay);
    }
  },
  setDenyForEarlyHandle: (element: HTMLElement) => {
    HTMLHelper.setAttribute(element, 'internal-fsb-event-no-propagate', '1');
  },
  setAllowForEarlyHandle: (element: HTMLElement) => {
    HTMLHelper.removeAttribute(element, 'internal-fsb-event-no-propagate');
  },
  
  pasteEventInTextPlain: (event) => {
    let text = '';
    
    if (event.clipboardData || event.originalEvent.clipboardData) {
      text = (event.originalEvent || event).clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
      text = window.clipboardData.getData('Text');
    }
    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text);
    } else {
      document.execCommand('paste', false, text);
    }
    
    return EventHelper.cancel(event);
  }
};

export {EventHelper};