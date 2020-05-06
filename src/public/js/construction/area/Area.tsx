import {HTMLHelper} from '../helpers/HTMLHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import {EditorHelper} from './helpers/EditorHelper.js';
import {CursorHelper} from './helpers/CursorHelper.js';
import {CapabilityHelper} from './helpers/CapabilityHelper.js';
import {CodeGeneratorHelper} from './helpers/CodeGeneratorHelper.js';

(() => {
  // Setup a cursor and a resizer.
  //
  EditorHelper.setup();
  
  // Bind events.
  //
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    EditorHelper.perform(data.name, data.content);
  }, true);
  window.addEventListener("keydown", (event) => {
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement') {
      return true;
    } else {
      EditorHelper.perform('keydown', event.keyCode);
    
      return EventHelper.cancel(event);
    }
  }, false);
  window.addEventListener("keyup", (event: any) => {
    EditorHelper.perform('keyup', event.keyCode);
    
    return EventHelper.cancel(event);
  });
  window.addEventListener("click", (event) => {
    EditorHelper.synchronize("click", null);
  }, false);
  window.document.body.addEventListener("click", (event) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
    
    CursorHelper.moveCursorToTheEndOfDocument();
    EditorHelper.synchronize("click", null);
  }, true);
  window.document.body.addEventListener("focus", (event) => {
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement') {
      HTMLHelper.addClass(document.body, 'internal-fsb-focusing-text-element');
    }
  }, true);
  window.document.body.addEventListener("blur", (event) => {
    HTMLHelper.removeClass(document.body, 'internal-fsb-focusing-text-element');
  }, true);
  let previousWindowSize = {width: null, height: null};
  window.addEventListener('resize', (event) => {
    if (previousWindowSize.width != window.innerWidth || previousWindowSize.height != window.innerHeight) {
      previousWindowSize.width = window.innerWidth;
      previousWindowSize.height = window.innerHeight;
      EditorHelper.updateEditorProperties();
    }
  });
  window.generateHTMLCodeForPage = (() => {
  	return CodeGeneratorHelper.generateHTMLCodeForPage();
  });
  
  // Install capabilities.
  //
  CapabilityHelper.installCapabilitiesForInternalElements(document);
})();