import {HTMLHelper} from '../helpers/HTMLHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import {EditorHelper} from './helpers/EditorHelper.js';
import {ManipulationHelper} from './helpers/ManipulationHelper.js';

(() => {
  // Setup a cursor and a dragger.
  //
  EditorHelper.setup();
  
  // Bind events.
  //
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    ManipulationHelper.perform(data.name, data.content);
  }, true);
  window.addEventListener("keydown", (event) => {
    ManipulationHelper.perform('keydown', event.keyCode);
    
    return EventHelper.cancel(event);
  }, false);
  window.addEventListener("click", (event) => {
    EditorHelper.synchronize("click", null);
  }, false);
  window.document.body.addEventListener("click", (event) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
    
    EditorHelper.moveCursorToTheEndOfDocument();
    EditorHelper.synchronize("click", null);
    
  }, true);
  let previousWindowSize = {width: null, height: null};
  window.addEventListener('resize', (event) => {
    if (previousWindowSize.width != window.innerWidth || previousWindowSize.height != window.innerHeight) {
      previousWindowSize.width = window.innerWidth;
      previousWindowSize.height = window.innerHeight;
      EditorHelper.updateEditorProperties();
    }
  });
  
  // Install capabilities.
  //
  EditorHelper.installCapabilitiesForInternalElements(document);
})();