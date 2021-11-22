import {HTMLHelper} from '../helpers/HTMLHelper';
import {EventHelper} from '../helpers/EventHelper';
import {WorkspaceHelper} from './helpers/WorkspaceHelper';
import {CursorHelper} from './helpers/CursorHelper';
import {CapabilityHelper} from './helpers/CapabilityHelper';
import {EditorHelper} from './helpers/EditorHelper';
import {AnimationHelper} from './helpers/AnimationHelper';

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
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement' &&
      [27].indexOf(event.keyCode) == -1) {
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
      switch (event.keyCode) {
        case 27:
          document.activeElement.blur();
          break;
        case 67:
        case 86:
        case 88:
        	// Allow cut, copy, and paste events.
        	//
        	if (!window.clipboardData) return;
        	break;
      }
      
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
  window.generateFrontEndCodeForCurrentPage = (() => {
  	return WorkspaceHelper.generateFrontEndCodeForCurrentPage();
  });
  window.generateFrontEndCodeForAllPages = (() => {
    return WorkspaceHelper.generateFrontEndCodeForAllPages();
  });
  window.generateBackEndCodeForAllPages = (() => {
    return WorkspaceHelper.generateBackEndCodeForAllPages();
  });
  window.getCommonExpandingFeatureScripts = (() => {
    return WorkspaceHelper.getCommonExpandingFeatureScripts();
  });
  window.generateWorkspaceData = (() => {
  	return WorkspaceHelper.generateWorkspaceData();
  });
  window.clearFullStackCodeForAllPages = ((data) => {
  	return WorkspaceHelper.clearFullStackCodeForAllPages(data);
  });
 	window.initializeWorkspaceData = ((data) => {
  	return WorkspaceHelper.initializeWorkspaceData(data);
  });
})();