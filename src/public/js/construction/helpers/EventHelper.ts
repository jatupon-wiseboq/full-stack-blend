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
  getCurrentWindow: (event: HTMLEvent) => {
    return HTMLHelper.getCurrentWindow(EventHelper.getCurrentElement(event));
  },
  getMousePosition: (event: HTMLEvent) => {
    return [event.clientX, event.clientY];
  }
};

export {EventHelper};