import {FullStackBlend} from '../helpers/DeclarationHelper';
import {EventHelper} from '../helpers/EventHelper';
import {HTMLHelper} from '../helpers/HTMLHelper';
import {RequestHelper} from '../helpers/RequestHelper';

import './components/layout/GridPicker';
import './components/layout/OffsetPicker';
import './components/layout/DisplayPicker';
import './components/layout/PreservePicker';
import './components/layout/LayerManager';

import './components/css/CSSPresets';
import './components/css/CSSStyles';
import './components/css/CSSPresetName';
import './components/css/CSSCustomClasses';
import './components/css/ComputedStyleManager';

import './components/shape/DimensionPicker';
import './components/shape/AppearancePicker';
import './components/shape/BoundaryPicker';
import './components/shape/Transformer';
import './components/shape/SizePicker';
import './components/shape/SwatchPicker';
import './components/shape/GradientPicker';

import './components/generic/DropDownPicker';
import './components/generic/RadioButtonPicker';
import './components/generic/NumberPicker';
import './components/generic/TextPicker';

import './components/code/FrontEndScriptEditor';
import './components/code/ReactEventBinder';
import './components/code/ExternalLibrariesChooser';
import './components/code/AttributeManager';
import './components/code/OptionManager';
import './components/code/WizardInputManager';
import './components/code/BackEndScriptEditor';
import './components/code/DebuggingConsole';
import './components/code/ExternalLibrariesManager';

import './components/content/SitePreview';
import './components/content/PageManager';
import './components/content/ProjectManager';
import './components/content/ComponentMenu';
import './components/content/ComponentManager';
import './components/content/PopupManager';
import './components/content/EndpointManager';
import './components/content/SchemaManager';

import './components/animation/AnimationPicker';
import './components/animation/TimelineManager';
import './components/animation/KeyframeManager';
import './components/animation/Keyframe';

//import GitHub from 'github-api';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  preview: null
};

let recentExtraPanelSelector: string = null;
let cachedUpdateEditorProperties = {};

(function() {
  window.perform = (name: string, content: any) => {
    if (['undo', 'redo'].indexOf(name) != -1) {
      document.body.click();
    }
    
    let element = document.getElementById('area') as HTMLFrameElement;
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
  
  window.swap = (selector: string, toolsetSelector: string=null, extraPanelSelector: string=null, replacingIconSelector: string=null, iconClass: string=null, skipExtraPanel: boolean=false) => {
    let button = $(EventHelper.getCurrentElement(event));
    if (button.prop('tagName') != 'A') button = button.parent();
    if (button.hasClass('active')) return;
    
    let accessory = button.parent().find('> a.active').attr('id');
    
    button.parent().find('> a.active').removeClass('active');
    button.addClass('active');
    
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
    
    if (toolsetSelector) {
      $('.toolset').hide();
      $(toolsetSelector).show();
    }
    
    if (button.attr('skip-perform') !== 'true') {
      perform('swap', {
        id: button.attr('id'),
        accessory: accessory
      });
    }
    button.removeAttr('skip-perform');
    
    synchronize('click');
    
    // Fix console's element sizing bug.
    // 
    window.setTimeout(() => {
      window.repl.output.focus();
    }, 10);
    window.setTimeout(() => {
      window.repl.input.focus();
      window.repl.resetInput();
    }, 20);
    
    if (event) return EventHelper.cancel(event);
  };
  
  window.FullStackBlend = FullStackBlend;
  
  window.controls = [];
  
  var synchronize = (name: string, content: any) => {
    switch (name) {
      case 'select':
        break;
      case 'updateEditorProperties':
      	let recent = cachedUpdateEditorProperties;
      	for (let key in content) {
	  			if (content.hasOwnProperty(key)) {
	  				if (content[key] === '~') {
	  					content[key] = recent[key];
	  				} else if (key === 'extensions') {
	  					let extensions = content[key] || {};
	  					let recentExtensions = recent[key] || {};
	  					for (let extensionKey in extensions) {
				  			if (extensions.hasOwnProperty(extensionKey)) {
				  				if (extensions[extensionKey] === '~') {
				  					extensions[extensionKey] = recentExtensions[extensionKey];
				  				}
				  			}
				  		}
	  				}
	  			}
	  		}
  			cachedUpdateEditorProperties = Object.assign({}, content);
      
	      $('[internal-fsb-for]').hide();
	      $('[internal-fsb-not-for]').show();
	      if (content && content['attributes']) {
	      	for (let key of ['internal-fsb-class', 'internal-fsb-react-mode', 'internal-fsb-data-source-type', 'internal-fsb-textbox-mode', 'internal-fsb-inheriting', 'required', 'data-field-type', 'internal-fsb-data-wizard-type', 'internal-fsb-data-value-source', 'data-lock-mode', 'data-lock-matching-mode', 'data-rendering-condition-mode', 'data-rendering-condition-matching-mode', 'internal-fsb-animation-timing-mode', 'internal-fsb-data-validation-format', 'internal-fsb-react-display-logic', 'internal-fsb-react-division', 'data-forward-option', 'data-forward-mode', 'data-missing-enable', 'data-missing-default', 'data-mismatch-enable', 'data-mismatch-default', 'data-mismatch-action']) {
	      		let value = content['attributes'][key];
	      		if (value) {
		          $('[internal-fsb-for="' + key + '"]').each((index, element) => {
		          	element = $(element);
		          	if (element.attr('internal-fsb-for-display-value')) element.css('display', element.attr('internal-fsb-for-display-value'));
		          	else element.show();
		          });
		          $('[internal-fsb-for*="' + key + ':' + value + '"]').each((index, element) => {
		          	element = $(element);
		          	if (element.attr('internal-fsb-for-display-value')) element.css('display', element.attr('internal-fsb-for-display-value'));
		          	else element.show();
		          });
		          $('[internal-fsb-not-for="' + key + '"]').hide();
		          $('[internal-fsb-not-for*="' + key + ':' + value + '"]').hide();
		        }
		        
		        let style = content['attributes']['style'];
		        if (style) {
		        	let hashMap = HTMLHelper.getHashMapFromInlineStyle(style);
		        	for (let key of ['-fsb-animation-timing-mode']) {
		        		let value = hashMap[key];
		        		$('[internal-fsb-for="' + key + '"]').each((index, element) => {
			          	element = $(element);
			          	if (element.attr('internal-fsb-for-display-value')) element.css('display', element.attr('internal-fsb-for-display-value'));
			          	else element.show();
			          });
			          $('[internal-fsb-for*="' + key + ':' + value + '"]').each((index, element) => {
			          	element = $(element);
			          	if (element.attr('internal-fsb-for-display-value')) element.css('display', element.attr('internal-fsb-for-display-value'));
			          	else element.show();
			          });
			          $('[internal-fsb-not-for="' + key + '"]').hide();
			          $('[internal-fsb-not-for*="' + key + ':' + value + '"]').hide();
		        	}
		        }
	      	}
	      }
	      if (content && content['extensions']) {
	      	document.body.setAttribute('selector', (content['extensions']['editingAnimationID'] == 'selector') ? 'true' : 'false');
	      	if (content['extensions']['editorCurrentMode']) document.body.setAttribute('mode', content['extensions']['editorCurrentMode']);
	      	
	      	for (let key of ['editorCurrentMode', 'hasParentReactComponent', 'editing', 'editingAnimationID', 'editingKeyframeID', 'areFormatAndStyleOptionsAvailable', 'animationGroupMode', 'animationRepeatMode', 'isTableLayoutRow', 'isFirstElementOfComponent', 'isInheritingComponent', 'isNotContainingInFlexbox']) {
	      		let value = content['extensions'][key];
	      		if (value) {
		          $('[internal-fsb-for="' + key + '"]').each((index, element) => {
		          	element = $(element);
		          	if (element.attr('internal-fsb-for-display-value')) element.css('display', element.attr('internal-fsb-for-display-value'));
		          	else element.show();
		          });
		          $('[internal-fsb-for*="' + key + ':' + value + '"]').each((index, element) => {
		          	element = $(element);
		          	if (element.attr('internal-fsb-for-display-value')) element.css('display', element.attr('internal-fsb-for-display-value'));
		          	else element.show();
		          });
		          $('[internal-fsb-not-for="' + key + '"]').hide();
		          $('[internal-fsb-not-for*="' + key + ':' + value + '"]').hide();
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
        document.body.click();
        break;
      case 'swap':
        let element = document.getElementById(content);
        if (element) {
          element.setAttribute('skip-perform', 'true');
          element.click();
        }
        break;
    }
  };
  
  window.addEventListener("keydown", (event: any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
    
    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
    	if (element.className && element.className.indexOf('ace_') == 0) return;
    	
      perform('keydown', event.keyCode);
    
      switch (event.keyCode) {
      	case 67:
        case 86:
        case 88:
      		return;
      }
    
      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("keyup", (event: any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
    
    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
    	if (element.className && element.className.indexOf('ace_') == 0) return;
    	
      perform('keyup', event.keyCode);
      
      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("cut", (event: any) => {
	  if (EventHelper.checkIfDenyForHandle(event)) return;
	  
    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
    	if (element.className && element.className.indexOf('ace_') == 0) return;
      
      const iframe = document.getElementById('area') as HTMLFrameElement;
    	const contentWindow = iframe.contentWindow;
    	
    	contentWindow && contentWindow.performClipboardAction && contentWindow.performClipboardAction("cut", event);
	  }
  });
  window.addEventListener("copy", (event: any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
	  
    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
    	if (element.className && element.className.indexOf('ace_') == 0) return;
      
      const iframe = document.getElementById('area') as HTMLFrameElement;
    	const contentWindow = iframe.contentWindow;
    	
    	contentWindow && contentWindow.performClipboardAction && contentWindow.performClipboardAction("copy", event);
	  }
  });
  window.addEventListener("paste", (event: any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
	  
    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
    	if (element.className && element.className.indexOf('ace_') == 0) return;
      
      const iframe = document.getElementById('area') as HTMLFrameElement;
    	const contentWindow = iframe.contentWindow;
    	
    	contentWindow && contentWindow.performClipboardAction && contentWindow.performClipboardAction("paste", event);
	  }
  });
  window.addEventListener("scroll", (event: any) => {
    window.scrollTo(0, 0);
  });
  
  window.addEventListener("message", (event) => {
  	try {
	    let data = JSON.parse(event.data);
	  	if (data.target == 'editor') {
	    	synchronize(data.name, data.content);
	    }
	  } catch (error) {
	  	/* void */
	  }
  });
  
  window.addEventListener("beforeunload", (event: any) => {
  	if (!window.overrideBeforeUnload) {
	  	event.preventDefault();
	  	event.returnValue = 'Your changes may be lost. Are you sure you want to exit the editor?';
	  	
	  	return 'Your changes may be lost. Are you sure you want to exit the editor?';
	  }
  });
  
  window.setup = (() => {
    $('.workspace-panel-container.scrollable').on('scroll', (event) => {
      document.body.click();
    });
    Accessories.projectManager.current.load();
  });
  window.update = (() => {
  	HTMLHelper.addClass(HTMLHelper.getElementByClassName('update-button'), 'in-progress');
  
    Accessories.endpointManager.current.save(() => {
    	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('update-button'), 'in-progress');
    }, true);
  });
  window.save = (() => {
    Accessories.projectManager.current.save();
  });
  window.merge = (() => {
    Accessories.projectManager.current.merge();
  });
  window.deploy = (() => {
    Accessories.projectManager.current.deploy();
  });
  
  let latestRevision = 0;
  let currentRevision = null;
  let timerIncrementalUpdate = null;
  
  window.preview = ((incremental: boolean=false) => {
  	if (incremental) {
  		window.clearTimeout(timerIncrementalUpdate);
  		timerIncrementalUpdate = window.setTimeout(() => {
  			 Accessories.endpointManager.current.save(() => {}, true);
  		}, 2500);
  	} else {
	    latestRevision += 1;
	    currentRevision = latestRevision;
	    
	    Accessories.preview.current.open();
	    
	    $('#siteButton')[0].click();
	    
	    window.setTimeout(() => {
		    Accessories.endpointManager.current.save((success) => {
		    	if (!Accessories.preview.current.isOpening()) return;
		      if (success) {
		      	window.setTimeout(() => {
			        Accessories.preview.current.start();
			        
			        let endpoint = window.ENDPOINT;
			       	if (endpoint.indexOf('https://localhost') == 0) {
			       		endpoint = 'https://localhost.stackblend.org';
			       	}
			        
			        RequestHelper.get(`${endpoint}/endpoint/recent/error?r=${Math.floor(Math.random() * 999999)}`).then((results) => {
			          if (currentRevision == latestRevision) {
			            if (!results.success) {
			              console.error(`${results.error}`);
			              Accessories.preview.current.close();
			            }
			          }
			        }).catch(() => {
			        });
		      	}, 3000);
		      } else {
		        console.error('There was an error trying to update content at endpoint.');
		        Accessories.preview.current.close();
		      }
		    });
	    }, 1000);
	  }
 	});
 	
 	let setup = (() => {
 		let previewContainer = document.createElement('div');
    Accessories.preview = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.SitePreview ref={Accessories.preview} />, previewContainer);
    document.body.appendChild(previewContainer);
    
    let projectManagerContainer = document.createElement('div');
    Accessories.projectManager = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.ProjectManager ref={Accessories.projectManager} />, projectManagerContainer);
    document.body.appendChild(projectManagerContainer);
    
    let endpointManagerContainer = document.createElement('div');
    Accessories.endpointManager = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.EndpointManager ref={Accessories.endpointManager} />, endpointManagerContainer);
    document.body.appendChild(endpointManagerContainer);
 	});
 	setup();
})();