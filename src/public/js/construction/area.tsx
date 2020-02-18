import {HTMLHelper} from './helpers/HTMLHelper.js';
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
  });
  window.addEventListener("keydown", (event) => {
    ManipulationHelper.perform('keydown', event.keyCode);
  });
  window.addEventListener("click", (event) => {
    EditorHelper.synchronize("click", null);
  });
  
  // Install capabilities.
  //
  EditorHelper.installCapabilitiesForInternalElements(document);
})();