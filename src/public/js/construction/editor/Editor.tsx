import {FullStackBlend} from '../../helpers/DeclarationHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import './components/GridPicker.js';
import './components/OffsetPicker.js';
import './components/DisplayPicker.js';
import './components/PreservePicker.js';
import './components/CSSPresets.js';
import './components/CSSStyles.js';
import './components/CSSPresetName.js';
import './components/DimensionPicker.js';
import './components/AppearancePicker.js';
import './components/BoundaryPicker.js';
import './components/Transformer.js';
import './components/SizePicker.js';
import './components/DropDownPicker.js';
import './components/RadioButtonPicker.js';
import './components/LayerManager.js';
import './components/NumberPicker.js';
import './components/TextPicker.js';
import './components/CodeEditor.js';
import './components/ReactEventBinder.js';

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
  
  window.swap = (selector: string, extraPanelSelector: string=null, replacingIconSelector: string=null, iconClass: string=null, skipExtraPanel: boolean=false) => {
    let button = $('.btn' + selector);
    
    button.each((index, value) => {
      $(value).parent().find('> .btn').removeClass('active');
      $(value).addClass('active');
    });
    
    let panel = $('.panel' + selector);
    
    panel.each((index, value) => {
      $(value).parent().find('> .panel').removeClass('active');
      $(value).addClass('active');
    });
    
    if (replacingIconSelector != null) {
      let replacingIconElement = $(replacingIconSelector)[0];
      replacingIconElement.className = replacingIconElement.className.replace(/fa\-[a-z\-]+/g, iconClass);
    }
    
    if (!skipExtraPanel) {
      if (recentExtraPanelSelector != null) {
        let recentExtraPanel = $(recentExtraPanelSelector);
        recentExtraPanel.removeClass('active');
      }
      
      if (extraPanelSelector != null) {
        let extraPanel = $(extraPanelSelector);
        extraPanel.addClass('active');
      }
      
      recentExtraPanelSelector = extraPanelSelector;
    }
    
    synchronize('click');
  };
  
  window.FullStackBlend = FullStackBlend;
  
  window.controls = [];
  
  var synchronize = (name: string, content: any) => {
    switch (name) {
      case 'select':
        break;
      case 'updateEditorProperties':
	      $('[internal-fsb-for]').hide();
	      if (content && content['attributes']) {
	      	for (let key of ['internal-fsb-class', 'internal-fsb-react-mode']) {
	      		let value = content['attributes'][key];
	      		if (value) {
		          $('[internal-fsb-for="' + key + '"]').show();
		          $('[internal-fsb-for*="' + key + ':' + value + '"]').show();
		        }
	      	}
	      }
        
        window.controls.forEach((control) => {
          control.update(content);
        });
        
        $(document.body).removeClass('internal-fsb-selecting-off internal-fsb-selecting-on')
        	.addClass(content && content['extensions'] && content['extensions']['isSelectingElement'] ?
        	'internal-fsb-selecting-on' : 'internal-fsb-selecting-off');
        break;
      case 'click':
        window.document.body.click();
        break;
    }
  };
  
  window.addEventListener("keydown", (event: any) => {
    if (EventHelper.getOriginalElement(event).tagName != "INPUT") {
      perform('keydown', event.keyCode);
    
      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("keyup", (event: any) => {
    if (EventHelper.getOriginalElement(event).tagName != "INPUT") {
      perform('keyup', event.keyCode);
      
      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("scroll", (event: any) => {
    window.scrollTo(0, 0);
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