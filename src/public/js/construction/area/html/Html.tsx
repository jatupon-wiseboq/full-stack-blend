import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {EditorHelper} from './helpers/EditorHelper.js';
import {WorkspaceHelper} from './helpers/WorkspaceHelper.js';
import {CursorHelper} from './helpers/CursorHelper.js';
import {CapabilityHelper} from './helpers/CapabilityHelper.js';
import {CodeGeneratorHelper} from './helpers/CodeGeneratorHelper.js';
import {StylesheetHelper} from './helpers/StylesheetHelper.js';

(() => {
  let isLoaded: boolean = false;
  window.addEventListener("load", (event) => {
    // Setup a cursor and a resizer.
    //
    EditorHelper.setup();
    
    // Install capabilities.
    //
    CapabilityHelper.installCapabilitiesForInternalElements(document);
    
    isLoaded = true;
  });
  
  // Bind events.
  //
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    EditorHelper.perform(data.name, data.content);
  }, true);
  window.addEventListener("keydown", (event) => {
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement') {
      if (HTMLHelper.hasClass(document.activeElement.parentNode, 'internal-fsb-absolute-layout')) {
        if ((document.activeElement.innerText == '\n' || document.activeElement.innerText == '') && event.keyCode == 8) {
          EditorHelper.perform('keydown', event.keyCode);
          
          HTMLHelper.removeClass(document.body, 'internal-fsb-focusing-text-element');
    
          return EventHelper.cancel(event);
        } else {
          return true;
        }
      } else {
        return true;
      }
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
  window.addEventListener("click", (event) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
    
    if (EventHelper.getOriginalElement(event) == document.body) CursorHelper.moveCursorToTheEndOfDocument();
    EditorHelper.synchronize("click", null);
  }, true);
  window.addEventListener("focus", (event) => {
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement') {
      HTMLHelper.addClass(document.body, 'internal-fsb-focusing-text-element');
    }
  }, true);
  window.addEventListener("blur", (event) => {
    HTMLHelper.removeClass(document.body, 'internal-fsb-focusing-text-element');
  }, true);
  let previousWindowSize = {width: null, height: null};
  window.addEventListener('resize', (event) => {
    if (!isLoaded) return;
    
    if (previousWindowSize.width != window.innerWidth || previousWindowSize.height != window.innerHeight) {
      previousWindowSize.width = window.innerWidth;
      previousWindowSize.height = window.innerHeight;
      EditorHelper.updateEditorProperties();
    }
  });
  window.generateHTMLCodeForPage = (() => {
  	return WorkspaceHelper.generateHTMLCodeForPage();
  });
  window.generateHTMLCodeForPages = (() => {
    return WorkspaceHelper.generateHTMLCodeForPages();
  });
  window.generateWorkspaceData = (() => {
  	return WorkspaceHelper.generateWorkspaceData();
  });
 	window.initializeWorkspaceData = ((data) => {
  	return WorkspaceHelper.initializeWorkspaceData(data);
  });
})();