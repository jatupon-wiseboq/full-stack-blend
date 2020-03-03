import {FullStackBlend} from '../../helpers/DeclarationHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import './components/GridPicker.js';
import './components/OffsetPicker.js';
import './components/DisplayPicker.js';
import './components/PreservePicker.js';

let recentExtraPanelSelector: string = null;

(function() {
  window.perform = (name: string, content: any) => {
    let element = document.getElementById('construction') as HTMLFrameElement;
    let contentWindow = element.contentWindow;
    contentWindow.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  };
  
  window.toggle = (name: string, iconSelector: string) => {
    let icon = $(iconSelector);
    if (icon.hasClass('fa-toggle-on')) {
      icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
    } else {
      icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
    }
    perform('toggle', name);
    
    synchronize('click');
  };
  
  window.swap = (panelSelector: string, extraPanelSelector: string=null, replacingIconSelector: string=null, iconClass: string=null) => {
    let panel = $(panelSelector);
    
    panel.parent().find('> .panel').removeClass('active');
    panel.addClass('active');
    
    if (replacingIconSelector != null) {
      let replacingIconElement = $(replacingIconSelector)[0];
      replacingIconElement.className = replacingIconElement.className.replace(/fa\-[a-z\-]+/g, iconClass);
    }
    
    if (recentExtraPanelSelector != null) {
      let recentExtraPanel = $(recentExtraPanelSelector);
      recentExtraPanel.removeClass('active');
    }
    
    if (extraPanelSelector != null) {
      let extraPanel = $(extraPanelSelector);
      extraPanel.addClass('active');
    }
    
    recentExtraPanelSelector = extraPanelSelector;
    
    synchronize('click');
  };
  
  window.FullStackBlend = FullStackBlend;
  
  window.controls = [];
  
  var synchronize = (name: string, content: any) => {
    switch (name) {
      case 'select':
        break;
      case 'updateEditorProperties':
        window.controls.forEach((control) => {
          control.update(content);
        });
        break;
      case 'click':
        window.document.body.click();
        break;
    }
  };
  
  window.addEventListener("keydown", (event: any) => {
    perform('keydown', event.keyCode);
    
    return EventHelper.cancel(event);
  });
  window.addEventListener("keyup", (event: any) => {
    perform('keyup', event.keyCode);
    
    return EventHelper.cancel(event);
  });
  
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    synchronize(data.name, data.content);
  });
  
  window.setup = (() => {
    $('.workspace-panel-container.scrollable').on('scroll', (event) => {
      window.document.body.click();
    });
  });
})();