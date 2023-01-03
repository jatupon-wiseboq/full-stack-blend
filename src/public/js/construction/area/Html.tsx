import {HTMLHelper} from '../helpers/HTMLHelper';
import {EventHelper} from '../helpers/EventHelper';
import {WorkspaceHelper} from './helpers/WorkspaceHelper';
import {CursorHelper} from './helpers/CursorHelper';
import {CapabilityHelper} from './helpers/CapabilityHelper';
import {EditorHelper} from './helpers/EditorHelper';
import {AnimationHelper} from './helpers/AnimationHelper';

(() => {
  let isLoaded: boolean = false;
  
  const checkTextElementIfBlank = () => {
    const elements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'TextElement');
    
    for (const element of elements) {
      // When switching off and deselecting, causes the innerText to be empty,
      // and we should prevent it.
      if (HTMLHelper.findTheParentInClassName(element, 'internal-fsb-layer-off', true)) continue;
      
      if (element && element.textContent.trim() == '') {
        const accessories = Array.from(HTMLHelper.getElementsByClassName('internal-fsb-accessory', element));
        
        element.innerHTML = 'Text';
        
        for (const accessory of accessories) element.appendChild(accessory);
      }
    }
  };
  
  window.addEventListener("load", (event) => {
    // Setup a cursor and a resizer.
    //
    EditorHelper.setup();
    
    // Install capabilities.
    //
    CapabilityHelper.installCapabilitiesForInternalElements(document);
    
    isLoaded = true;
  });
  
  window.addEventListener('contextmenu', (event: any) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;
    
    try {
      if (!top._contextMenuNotice) {
        alert("The system's context menu isn't supported. Please use ctrl+c, ctrl+x, and ctrl+v for copy-and-paste text and element instead.");
        top._contextMenuNotice = true;
      }
    } catch(error) {
      if (!window._contextMenuNotice) {
        alert("The system's context menu isn't supported. Please use ctrl+c, ctrl+x, and ctrl+v for copy-and-paste text and element instead.");
        window._contextMenuNotice = true;
      }
    }
    
    return EventHelper.cancel(event);
  }, true);
  
  // Bind events.
  //
  const messageFn = (event) => {
    let data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
    EditorHelper.perform(data.name, data.content);
  };
  window.addEventListener("message", messageFn, true);
  window.messageFnArray = window.messageFnArray || [];
  window.messageFnArray.push(messageFn);
  window.postMessage = (data: any) => {
    if (typeof data === 'string') data = JSON.parse(data);
    for (const messageFn of window.messageFnArray) {
      messageFn({
        data: data
      });
    }
  };
  
  window.addEventListener("keydown", (event) => {
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement' &&
      [27].indexOf(event.keyCode) == -1) {
      if (HTMLHelper.hasClass(document.activeElement.parentNode, 'internal-fsb-absolute-layout')) {
        if ((document.activeElement.innerText == '\n' || document.activeElement.innerText == '') && event.keyCode == 8) {
          EditorHelper.perform('keydown', event.keyCode);
          
          checkTextElementIfBlank();
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
          if (HTMLHelper.hasClass(document.body, 'internal-fsb-focusing-text-element')) {
            document.activeElement.blur();
            return EventHelper.cancel(event);
          } else {
            document.activeElement.blur();
          }
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
    if (document.activeElement && HTMLHelper.getAttribute(document.activeElement, 'internal-fsb-class') === 'TextElement' &&
      HTMLHelper.hasClass(document.activeElement, 'internal-fsb-selecting')) {
      HTMLHelper.addClass(document.body, 'internal-fsb-focusing-text-element');
    } else {
      document.activeElement && document.activeElement.blur();
    }
  }, true);
  window.addEventListener("blur", (event) => {
    checkTextElementIfBlank();
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
  window.generateConnectorCode = (() => {
    return WorkspaceHelper.generateConnectorCode();
  });
  window.generateWorkerCode = (() => {
    return WorkspaceHelper.generateWorkerCode();
  });
  window.generateSchedulerCode = (() => {
    return WorkspaceHelper.generateSchedulerCode();
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