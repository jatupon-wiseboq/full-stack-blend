import {FullStackBlend} from '../helpers/DeclarationHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import './components/layout/GridPicker.js';
import './components/layout/OffsetPicker.js';
import './components/layout/DisplayPicker.js';
import './components/layout/PreservePicker.js';
import './components/layout/LayerManager.js';

import './components/css/CSSPresets.js';
import './components/css/CSSStyles.js';
import './components/css/CSSPresetName.js';
import './components/css/CSSCustomClasses.js';

import './components/shape/DimensionPicker.js';
import './components/shape/AppearancePicker.js';
import './components/shape/BoundaryPicker.js';
import './components/shape/Transformer.js';
import './components/shape/SizePicker.js';
import './components/shape/SwatchPicker.js';
import './components/shape/GradientPicker.js';

import './components/generic/DropDownPicker.js';
import './components/generic/RadioButtonPicker.js';
import './components/generic/NumberPicker.js';
import './components/generic/TextPicker.js';

import './components/code/ReactCodeEditor.js';
import './components/code/ReactEventBinder.js';
import './components/code/SitePreview.js';
import './components/code/ExternalLibrariesChooser.js';
import './components/code/AttributeManager.js';
import './components/code/OptionManager.js';
import './components/code/WizardInputManager.js';

import './components/content/PageManager.js';

//import GitHub from 'github-api';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  preview: null
};

let recentExtraPanelSelector: string = null;

(function() {
  window.perform = (name: string, content: any) => {
    if (['undo', 'redo'].indexOf(name) != -1) {
      window.document.body.click();
    }
    
    let element = document.getElementById('html') as HTMLFrameElement;
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
    
    if (event) return EventHelper.cancel(event);
  };
  
  window.FullStackBlend = FullStackBlend;
  
  window.controls = [];
  
  var synchronize = (name: string, content: any) => {
    switch (name) {
      case 'select':
        break;
      case 'updateEditorProperties':
	      $('[internal-fsb-for]').hide();
	      $('[internal-fsb-not-for]').show();
	      if (content && content['attributes']) {
	      	for (let key of ['internal-fsb-class', 'internal-fsb-react-mode', 'internal-fsb-data-source-type', 'internal-fsb-textbox-mode']) {
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
	      	}
	      	for (let key of ['editorCurrentMode', 'hasParentReactComponent']) {
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
        window.document.body.click();
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
      perform('keydown', event.keyCode);
    
      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("keyup", (event: any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;
    
    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
      perform('keyup', event.keyCode);
      
      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("scroll", (event: any) => {
    window.scrollTo(0, 0);
  });
  
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
  	if (data.target == 'editor') {
    	synchronize(data.name, data.content);
    }
  });
  
  window.setup = (() => {
    $('.workspace-panel-container.scrollable').on('scroll', (event) => {
      window.document.body.click();
    });
  });
  
  window.preview = (() => {
  	Accessories.preview.current.start();
 	});
  window.save = (() => {
    let GITHUB_TOKEN = window.TOKENS.filter(token => token.kind == 'github');
    if (GITHUB_TOKEN.length == 0) {
      alert('You cannot save until you have connected to a GitHub account.');
      return;
    }
    
    GITHUB_TOKEN = GITHUB_TOKEN[0].accessToken;
    
  	var gh = new GitHub({
			token: GITHUB_TOKEN
		});
		
	  gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getBranch(GITHUB_BRANCH, (error, result, request) => {
      if (error) {
        alert('Please setup your GitHub\'s alias, project name, and branch in Settings and on GitHub.com to continue.');
        return;
      }
      
      console.log(result);
      
      gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).listCommits((error, result, request) => {
        if (error) {
          alert('There was an error while retrieving last commits, please try again.');
          return;
        }
        
        console.log(result);
        let baseCommitSHA = result && result[0] && result[0].sha;
        let baseTreeSHA = result && result[0] && result[0].commit.tree.sha;
        
        console.log('baseCommitSHA', baseCommitSHA);
        console.log('baseTreeSHA', baseTreeSHA);
        
        gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getTree(result && result[0] && result[0].commit.tree.sha, (error, result, request) => {
          if (error) {
            alert('There was an error while retrieving an existing tree, please try again.');
            return;
          }
          
          console.log(result);
          
          gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).createBlob("TEST", (error, result, request) => {
            if (error) {
              alert('There was an error while creating blob, please try again.');
              return;
            }
            
            console.log(result);
            let projectSettingsSHA = result.sha;
            
            console.log('projectSettingsSHA', projectSettingsSHA);
            
            gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).createTree([{
              path: "ProjectSettings.stackblend",
              mode: "100644",
              type: "blob",
              sha: projectSettingsSHA
            }], baseTreeSHA, (error, result, request) => {
              if (error) {
                alert('There was an error while creating a new tree, please try again.');
                return;
              }
              
              console.log(result);
              let updatedTreeSHA = result.sha;
            
              console.log('updatedTreeSHA', updatedTreeSHA);
              
              gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).commit(baseCommitSHA, updatedTreeSHA, "Updated ProjectSettings.stackblend", (error, result, request) => {
                if (error) {
                  alert('There was an error while committing a new change, please try again.');
                  return;
                }
                
                console.log(result);
                let recentCommitSHA = result.sha;
                
                console.log('recentCommitSHA', recentCommitSHA);
                
                gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).updateHead(GITHUB_BRANCH, recentCommitSHA, true, (error, result, request) => {
                  if (error) {
                    alert('There was an error while updating head for the current branch, please try again.');
                    return;
                  }
                  
                  console.log(result);
                });
              });
            });
          });
        });
      });
    });
  });
  window.deploy = (() => {
  	
 	});
 	
 	let setup = (() => {
 		let previewContainer = document.createElement('div');
    Accessories.preview = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.SitePreview ref={Accessories.preview} />, previewContainer);
    document.body.appendChild(previewContainer);
 	});
 	setup();
})();