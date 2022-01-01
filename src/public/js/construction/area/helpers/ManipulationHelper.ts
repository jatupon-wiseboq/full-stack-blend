import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CodeHelper} from '../../helpers/CodeHelper';
import {RandomHelper} from '../../helpers/RandomHelper';
import {EventHelper} from '../../helpers/EventHelper';
import {TextHelper} from '../../helpers/TextHelper';
import {FontHelper} from '../../helpers/FontHelper';
import {Accessories, EditorHelper} from './EditorHelper';
import {InternalProjectSettings, WorkspaceHelper} from './WorkspaceHelper';
import {CursorHelper} from './CursorHelper';
import {LayoutHelper} from './LayoutHelper';
import {TimelineHelper} from './TimelineHelper';
import {SchemaHelper} from './SchemaHelper';
import {StyleHelper} from './StyleHelper';
import {StatusHelper} from './StatusHelper';
import {StylesheetHelper} from './StylesheetHelper';
import {AnimationHelper} from './AnimationHelper';
import {CapabilityHelper} from './CapabilityHelper';
import {FrontEndDOMHelper} from './FrontEndDOMHelper';
import {FrontEndManipulationHelper} from './manipulations/FrontEndManipulationHelper';
import {BackEndManipulationHelper} from './manipulations/BackEndManipulationHelper';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, RESPONSIVE_SIZE_REGEX, RESPONSIVE_OFFSET_REGEX, INTERNAL_CLASSES_GLOBAL_REGEX, NON_SINGLE_CONSECUTIVE_SPACE_GLOBAL_REGEX, CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, CELL_STYLE_ATTRIBUTE_REGEX_LOCAL, DEBUG_MANIPULATION_HELPER, SINGLE_DOM_CONTAINER_ELEMENTS} from '../../Constants';

let performed: any = [];
let performedIndex: number = -1;
let previousInfo: any = {};
let isShiftKeyActive: boolean = false;
let isCtrlKeyActive: boolean = false;
let isCommandKeyActive: boolean = false;
let invalidateTimer = null;

function removeAllPresetReferences(presetId: string, link: string) {
	// TODO: should iterate in all documents.
	// 
	let selectingElement = EditorHelper.getSelectingElement();
	
	let elements = HTMLHelper.getElementsByClassName('internal-fsb-element');
	for (let element of elements) {
		let classNames = HTMLHelper.getAttribute(element, 'class');
		let inheritedPresets = StylesheetHelper.getStyleAttribute(element, '-fsb-inherited-presets');
		
		classNames = classNames && classNames.split(' ') || [];
		inheritedPresets = inheritedPresets && inheritedPresets.split(', ') || [];
		
		if (inheritedPresets.indexOf(presetId) != -1) {
			classNames = classNames.filter(klass => klass != '-fsb-preset-' + presetId);
			inheritedPresets = inheritedPresets.filter(_presetId => _presetId != presetId);
			
			ManipulationHelper.perform('select', HTMLHelper.getAttribute(element, 'internal-fsb-guid'), true, false, link);
			ManipulationHelper.perform('update', {
      		attributes: [{
      				name: 'class',
      				value: classNames.join(' ')
      		}],
          styles: [{
              name: '-fsb-inherited-presets',
              value: inheritedPresets.join(', ')
          }]
      }, true, false, link);
		}
	}
	
	if (selectingElement) {
		ManipulationHelper.perform('select', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'), true, false, link);
	} else {
		EditorHelper.deselect();
	}
}

((window, document) => {
	if (window.clipboardData) return;
	window.performClipboardAction = (type: string, event: ClipboardEvent) => {
		if (HTMLHelper.hasClass(document.body, 'internal-fsb-focusing-text-element')) {
      return;
    } else {
			if (type == 'cut') {
				let selectingElement = EditorHelper.getSelectingElement(window, document);
		  	event.clipboardData.setData('application/stackblend', selectingElement.outerHTML);
		  	event.clipboardData.setData('application/stackblend-state', JSON.stringify({
		  		isCutMode: true
		  	}));
		  	
		    if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
		      if (HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()) &&
		          HTMLHelper.hasClass(HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()), 'internal-fsb-element')) {
		        ManipulationHelper.perform('delete[cut]', HTMLHelper.getAttribute(HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()), 'internal-fsb-guid'));
		      } else if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
		        ManipulationHelper.perform('delete[cut]', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
		      }
		    } else if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
		      ManipulationHelper.perform('delete[cut]', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
		    }
		    
		    event.preventDefault();
			} else if (type == 'copy') {
				let selectingElement = EditorHelper.getSelectingElement(window, document);
		  	event.clipboardData.setData('application/stackblend', selectingElement.outerHTML);
		  	event.clipboardData.setData('application/stackblend-state', JSON.stringify({
		  		isCutMode: false
		  	}));
		    
		    event.preventDefault();
			} else if (type == 'paste') {
				const html = event.clipboardData.getData('application/stackblend');
				if (html) {
					const state = JSON.parse(event.clipboardData.getData('application/stackblend-state') || '{}');
			  	if (state.isCutMode) {
			  		ManipulationHelper.perform('insert', {
			    		klass: 'Pasteboard',
			        html: CodeHelper.preparePastingContent(html, true)
			    	});
			  		event.clipboardData.setData('application/stackblend', '');
			  		event.clipboardData.setData('application/stackblend-state', JSON.stringify({
				  		isCutMode: false
				  	}));
			  	} else {
			  		window.postMessage(JSON.stringify({
				    	name: 'insert',
				      content: {
				    		klass: 'Pasteboard',
				        html: CodeHelper.preparePastingContent(html)
				    	}
				    }), '*');
			    }
			  }
		    
		    event.preventDefault();
			}
		}
	};
	
	document.addEventListener('cut', (event: ClipboardEvent) => {
		window.performClipboardAction && window.performClipboardAction('cut', event);
	});
	document.addEventListener('copy', (event: ClipboardEvent) => {
		window.performClipboardAction && window.performClipboardAction('copy', event);
	});
	document.addEventListener('paste', (event: ClipboardEvent) => {
		window.performClipboardAction && window.performClipboardAction('paste', event);
	});
})(window, window.document);

var ManipulationHelper = {
  perform: (name: string, content: any, remember: boolean=true, skipAfterPromise: boolean=false, link: any=false) => {
    let accessory = null;
    let resolve = null;
    let promise = new Promise((_resolve) => { resolve = _resolve; });
    let replace = (content && (typeof content === 'object') && content.replace) || false;
    let tag = (content && (typeof content === 'object') && content.tag) || null;
    let recentSelectingElement = null;
    let preview = true;
    
    if (content && (typeof content === 'object') && content.link !== undefined) {
    	link = content.link;
    }
    if (content && (typeof content === 'object') && content.content !== undefined) {
    	content = content.content;
    }
    
    switch (name) {
      case 'select':
      	recentSelectingElement = EditorHelper.getSelectingElement();
      	
      	link = link || Math.random();
      	
      	if (!recentSelectingElement || HTMLHelper.getAttribute(recentSelectingElement, 'internal-fsb-guid') != content) {
      		[accessory, remember, link] = ManipulationHelper.handleSelectElement(name, content, remember, promise, link);
      		
	      	if (recentSelectingElement && HTMLHelper.getAttribute(recentSelectingElement, 'internal-fsb-guid') != content) {
		      	promise.then(() => {
		      		ManipulationHelper.perform('update', {
			      		extensions: [{
			      			name: 'editingKeyframeID',
			      			value: null
			      		}]
			      	}, true, false, link);
		      	});
		      }
      	} else {
      		remember = false;
      	}
      	
      	preview = false;
        break;
      case 'select[cursor]':
      	recentSelectingElement = EditorHelper.getSelectingElement();
      	
    		name = 'select';
      	link = link || Math.random();
      	
      	if (!recentSelectingElement || HTMLHelper.getAttribute(recentSelectingElement, 'internal-fsb-guid') != content) {
      		[accessory, remember, link] = ManipulationHelper.handleSelectElement(name, content, remember, promise, link);
      	
	      	promise.then(() => {
		      	let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content);
		      	if (element) {
		      		let allowCursorElement = element.parentNode;
		      		if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-strict-layout')) {
			      		let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement, true) || HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0');
			      		let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
			          let theAllowCursorElement = allowCursorElement;
			          let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
			      		
			      		if (indexOfAllowCursorElement != -1) {
			            let children = [...theAllowCursorElement.children];
			            let index = [...theAllowCursorElement.children].indexOf(element);
			            let cursorIndex = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
			            
			            if (cursorIndex == -1 || cursorIndex >= index) {
			            	index += 1;
			            }
			            
			            let walkPath = CursorHelper.createWalkPathForCursor(
			            	HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
			            	indexOfAllowCursorElement,
			            	index);
			            ManipulationHelper.perform('move[cursor]', walkPath, true, false, link);
			          }
		      		}
		      	}
		      }).then(() => {
	      		if (recentSelectingElement && HTMLHelper.getAttribute(recentSelectingElement, 'internal-fsb-guid') != content) {
				      ManipulationHelper.perform('update', {
			      		extensions: [{
			      			name: 'editingKeyframeID',
			      			value: null
			      		}]
			      	}, true, false, link);
			      }
		      });
		    } else {
		    	remember = false;
		    }
      	
      	preview = false;
      	break;
      case 'insert':
        if (InternalProjectSettings.currentMode != 'data') {
      	  [accessory, remember, link] = FrontEndManipulationHelper.handleInsert(name, content, remember, promise, link);
      	} else {
      	  [accessory, remember, link] = BackEndManipulationHelper.handleInsert(name, content, remember, promise, link);
      	}
        break;
      case 'update':
        [accessory, remember, link, preview] = ManipulationHelper.handleUpdate(name, content, remember, promise, link);
        break;
      case 'update[size]':
      	[accessory, remember, link] = ManipulationHelper.handleUpdateElementSize(name, content, remember, promise, link);
        break;
      case 'update[responsive]':
      	[accessory, remember, link] = ManipulationHelper.handleUpdateResponsiveSize(name, content, remember, promise, link);
        break;
      case 'move[cursor]':
      	[accessory, remember, link] = ManipulationHelper.handleMoveCursor(name, content, remember, promise, link);
      	
      	preview = false;
        break;
      case 'move[element]':
      	[accessory, remember, link] = ManipulationHelper.handleMoveElement(name, content, remember, promise, link);
        break;
      case 'delete':
      	[accessory, remember, link] = ManipulationHelper.handleDeleteElement(name, content, remember, promise, link);
        break;
      case 'delete[silence]':
      	[accessory, remember, link] = ManipulationHelper.handleDeleteElement(name, content, remember, promise, link, false, true);
        break;
      case 'delete[cut]':
      	[accessory, remember, link] = ManipulationHelper.handleDeleteElement(name, content, remember, promise, link, true);
        break;
      case 'table':
      	[accessory, remember, link, content] = ManipulationHelper.handleModifyTable(name, content, remember, promise, link);
        break;
      case 'keydown':
      	[accessory, remember, link] = ManipulationHelper.handleKeyDown(name, content, remember, promise, link);
      	
      	preview = false;
        break;
      case 'keyup':
      	[accessory, remember, link] = ManipulationHelper.handleKeyUp(name, content, remember, promise, link);
      	
      	preview = false;
      	break;
      case 'toggle':
      	[accessory, remember, link] = ManipulationHelper.handleToggleDesignMode(name, content, remember, promise, link);
      	
      	preview = false;
        break;
      case 'undo':
      	[accessory, remember] = ManipulationHelper.handleUndo(name, content, remember, promise);
        break;
      case 'redo':
      	[accessory, remember] = ManipulationHelper.handleRedo(name, content, remember, promise);
        break;
      case 'swap':
      	[accessory, content, remember] = ManipulationHelper.handleToggleEditorPanel(name, content, remember, promise);
      	
      	preview = false;
        break;
      case 'removePreset':
      	[accessory, content, remember] = ManipulationHelper.handleRemovePreset(name, content, remember, promise);
      	break;
    }
    
    if (content && typeof content === 'object') {
      content.tag = null;
    }
    
    if (remember) {
      if (replace && performedIndex >= 0) {
        if (performed[performed.length - 1].replace === replace) {
          performedIndex -= 1;
          accessory = performed.splice(-1)[0].accessory;
        }
      }
      
      if (DEBUG_MANIPULATION_HELPER) console.log('remember', name, content, accessory, replace, link);
      
      performedIndex += 1;
      performed = performed.splice(0, performedIndex);
      
      performed.push({
        name: name,
        content: content,
        accessory: accessory,
        replace: replace,
        link: link
      });
    }
    
    if (!skipAfterPromise) {
      resolve();
    }
    
    Accessories.overlay && Accessories.overlay.renderAllRelations();
    EditorHelper.update(tag);
    
    if (preview && window.parent.PROGRESSIVE) {
    	window.parent.preview(true);
    }
  },
  updateComponentData: (node: any) => {
    if (node) {
	    let elements = [...HTMLHelper.findAllParentsInClassName('internal-fsb-element', node), node];
	    
	    for (let element of elements) {
	    	if (HTMLHelper.getAttribute(element, 'internal-fsb-react-mode') == 'Site' && !HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting') &&
	    		(InternalProjectSettings.currentMode != 'popups' || !HTMLHelper.hasClass(element.parentNode, 'internal-fsb-begin-layout'))) {
	    		let reactNamespace = HTMLHelper.getAttribute(element, 'internal-fsb-react-namespace') || 'Project.Controls';
	        let reactClass = HTMLHelper.getAttribute(element, 'internal-fsb-react-class');
	        let reactClassComposingInfoClassName = HTMLHelper.getAttribute(element, 'internal-fsb-class');
	        let reactClassComposingInfoGUID = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
	        
	        if (!reactClass && reactClassComposingInfoClassName && reactClassComposingInfoGUID) {
	          reactClass = reactClassComposingInfoClassName + '_' + reactClassComposingInfoGUID;
	        }
	    		
	    		WorkspaceHelper.addOrReplaceComponentData(
	          reactClassComposingInfoGUID,
	          HTMLHelper.getAttribute(element, 'internal-fsb-name'),
	          reactNamespace,
	          reactClass,
	          element.outerHTML
	        );
	    	}
	    }
	  }
	},
	invalidate: (interval) => {
		window.clearTimeout(invalidateTimer);
		invalidateTimer = window.setTimeout(() => {
    	FrontEndDOMHelper.invalidate();
    	StyleHelper.invalidate();
		}, interval);
	},
  
  handleUpdate: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
		let accessory = null;
		let selectingElement = EditorHelper.getSelectingElement() || document.body;
		let preview = true;
		
    if (selectingElement) {
      let previousReusablePresetName = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-reusable-preset-name') || null;
      let presetId = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      
      if (EditorHelper.getEditorCurrentMode() == 'animation') {
      	if (content.attributes && !content.attributes.some(attribute => attribute.name == 'keyframe')) {
	      	for (let attribute of content.attributes) {
	          switch (attribute.name) {
	          	case 'style':
	          		attribute.name = 'keyframe';
	          		break;
	          }
	        }
	      }
      }
      
      if (previousReusablePresetName) {
        accessory = {
          attributes: HTMLHelper.getAttributes(selectingElement, true, {
            style: StylesheetHelper.getStylesheetDefinition(presetId),
            keyframe: AnimationHelper.getStylesheetDefinition(presetId)
          }),
          extensions: CodeHelper.convertDictionaryIntoPairs(InternalProjectSettings),
          options: LayoutHelper.getElementOptions(selectingElement)
        };
      } else {
        accessory = {
          attributes: HTMLHelper.getAttributes(selectingElement, true, {
            style: HTMLHelper.getAttribute(selectingElement, 'style'),
            keyframe: AnimationHelper.getStylesheetDefinition(presetId)
          }),
          extensions: CodeHelper.convertDictionaryIntoPairs(InternalProjectSettings),
          options: LayoutHelper.getElementOptions(selectingElement)
        };
      }
      
      let dictionary = {};
      for (let attribute of accessory.attributes) {
        dictionary[attribute.name] = true;
      }
      if (content.attributes !== undefined) {
        for (let attribute of content.attributes) {
          if (!!attribute.value && !dictionary[attribute.name]) {
            accessory.attributes.push({
              name: attribute.name,
              value: null
            });
          }
        }
      }
      
      let found = false;
      
      if (content.attributes !== undefined) {
        for (let attribute of content.attributes) {
          switch (attribute.name) {
            case 'internal-fsb-reusable-preset-name':
              let nextReusablePresetName = attribute.value || null;
              
              if (previousReusablePresetName == null) {
                if (nextReusablePresetName != null) {
                  found = true;
                  StylesheetHelper.setStylesheetDefinition(presetId, nextReusablePresetName, HTMLHelper.getAttribute(selectingElement, 'style') || '');
                  if (HTMLHelper.hasAttribute(selectingElement, 'internal-fsb-reusable-preset-name')) {
                  	selectingElement.setAttribute('style', '-fsb-empty');
                  } else {
                  	HTMLHelper.removeAttribute(selectingElement, 'style');
                  }
                }
              } else {
                if (nextReusablePresetName == null) {
                	found = true;
                	let style = StylesheetHelper.getStylesheetDefinition(presetId);
                	StylesheetHelper.removeStylesheetDefinition(presetId);
                	HTMLHelper.setAttribute(selectingElement, 'style', style);
                } else if (previousReusablePresetName != nextReusablePresetName) {
                  found = true;
                  StylesheetHelper.setStyleAttribute(selectingElement, '-fsb-reusable-name', nextReusablePresetName);
                }
              }
              
              if (found) AnimationHelper.renderStylesheetAndExtensionElement();
              
              if (nextReusablePresetName) {
                HTMLHelper.setAttribute(selectingElement, 'internal-fsb-reusable-preset-name', nextReusablePresetName);
              } else {
                HTMLHelper.removeAttribute(selectingElement, 'internal-fsb-reusable-preset-name');
                
                link = Math.random();
						  	promise.then(() => {
						  		removeAllPresetReferences(presetId, link);
						  	});
              }
              previousReusablePresetName = nextReusablePresetName;
		          
		          preview = false;
              break;
            case 'style':
              if (previousReusablePresetName) {
                let style = StylesheetHelper.getStylesheetDefinition(presetId);
                if (style != attribute.value) {
                  found = true;
                  StylesheetHelper.setStylesheetDefinition(presetId, previousReusablePresetName, attribute.value);
                }
              } else {
                if (HTMLHelper.getAttribute(selectingElement, 'style') != attribute.value) {
                  found = true;
                  HTMLHelper.setAttribute(selectingElement, 'style', attribute.value);
                }
              }
              break;
            case 'keyframe':
              let style = AnimationHelper.getStylesheetDefinition(presetId);
              if (style != attribute.value) {
                found = true;
                AnimationHelper.setStylesheetDefinition(presetId, null, attribute.value);
              }
              break;
            case 'internal-fsb-textbox-mode':
              if (HTMLHelper.getAttribute(selectingElement, attribute.name) != attribute.value) {
                found = true;
                if (attribute.value !== null) {
                	HTMLHelper.setAttribute(selectingElement, attribute.name, attribute.value);
                  selectingElement.firstElementChild.outerHTML = selectingElement.firstElementChild.outerHTML.replace(/<input/,"<textarea");
                } else {
                	HTMLHelper.removeAttribute(selectingElement, attribute.name);
                  selectingElement.firstElementChild.outerHTML = selectingElement.firstElementChild.outerHTML.replace(/<textarea/,"<input");
                }
              }
              break;
            case 'internal-fsb-inner-html':
              if (HTMLHelper.getAttribute(selectingElement, attribute.name) != attribute.value) {
                found = true;
                if (attribute.value !== null) {
                	HTMLHelper.setAttribute(selectingElement, attribute.name, attribute.value);
                  selectingElement.firstElementChild.innerHTML = attribute.value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<div style="font-family: Courier; font-size: 10px; color: #dc3545;">&lt;script&gt;Please compose custom scripts in coding user interface.&lt;/script&gt;</div>');
                } else {
                	HTMLHelper.removeAttribute(selectingElement, attribute.name);
                  selectingElement.firstElementChild.innerHTML = '';
                }
              }
              break;
            default:
              if (attribute.name == 'internal-fsb-react-mode') {
              	if (attribute.value != 'Site') {
              		WorkspaceHelper.removeComponentData(HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
              	} else {
              		if (HTMLHelper.hasAttribute(selectingElement, 'internal-fsb-inheriting')) {
	              		alert('You cannot create a component of an inheriting one.');
	              		return [accessory, false, link];
	              	}
              	}
              	
    						StatusHelper.invalidate(selectingElement);
              } else if (attribute.name == 'data-title-name') {
              	attribute.value = attribute.value || 'Untitled';
              	let titleElement = HTMLHelper.getElementsByClassName('internal-fsb-title', selectingElement, false)[0];
              	if (titleElement) {
              		titleElement.innerText = attribute.value;
              	}
              } else if (attribute.name == 'internal-fsb-name') {
    						LayoutHelper.invalidate();
    						TimelineHelper.invalidate();
		            
		            preview = false;
              } else if (HTMLHelper.getAttribute(selectingElement, 'internal-fsb-class') == 'Flash') {
    						switch (attribute.name) {
    						  case 'src':
    						    selectingElement.firstElementChild.firstElementChild.setAttribute('value', attribute.value);
    						    selectingElement.firstElementChild.lastElementChild.setAttribute('src', attribute.value);
    						    break;
    						  case 'class':
    						  case 'width':
    						  case 'height':
    						    break;
    						  default:
    						    selectingElement.firstElementChild.lastElementChild.setAttribute(attribute.name, attribute.value);
    						    break;
    						}
              }
              
              if (HTMLHelper.getAttribute(selectingElement, attribute.name) != attribute.value) {
                found = true;
                if (attribute.value !== null) {
                	HTMLHelper.setAttribute(selectingElement, attribute.name, attribute.value);
                } else {
                	HTMLHelper.removeAttribute(selectingElement, attribute.name);
                }
              }
              break;
          }
        }
      }
      {
      	let inlineStyle = ((EditorHelper.getEditorCurrentMode() == 'animation') ? AnimationHelper.getStyle(selectingElement) : StylesheetHelper.getStyle(selectingElement)) || '';
        let hash = HTMLHelper.getHashMapFromInlineStyle(inlineStyle);
        
        if (content.styles != undefined) {
          for (let aStyle of content.styles) {
            let name = aStyle.name.toString().trim();
            if (hash[name] != aStyle.value) {
              found = true;
              
              hash[name] = aStyle.value;
              if (HTMLHelper.hasVendorPrefix('-webkit-', name)) hash['-webkit-' + name] = aStyle.value;
              if (HTMLHelper.hasVendorPrefix('-moz-', name)) hash['-moz-' + name] = aStyle.value;
              if (HTMLHelper.hasVendorPrefix('-ms-', name)) hash['-ms-' + name] = aStyle.value;
              
              if (aStyle.name == 'font-family') {
                FontHelper.load(aStyle.value);
              }
              
              if (aStyle.name == 'ratio') {
              	let expander = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-ratio-expand', 'true', selectingElement);
              	
              	if (!expander) {
              		expander = document.createElement('img');
              		expander.setAttribute('style', 'display: none');
              		expander.setAttribute('internal-fsb-ratio-expand', 'true');
              		selectingElement.insertBefore(expander, selectingElement.firstElementChild.nextSibling);
              	}
              	
              	const splited = aStyle.value && aStyle.value.split(':') || [];
              	const w = splited[0] && parseInt(splited[0]) || NaN;
              	const h = splited[1] && parseInt(splited[1]) || NaN;
              	if (!isNaN(w) && !isNaN(h)) {
              		selectingElement.firstElementChild.setAttribute('internal-fsb-ratio-fit', true);
                	expander.setAttribute('src', FrontEndDOMHelper.generateImageDataURLWithRatio(w, h));
                } else {
              		selectingElement.firstElementChild.removeAttribute('internal-fsb-ratio-fit');
                	selectingElement.removeChild(expander);
                }
                
                window.RufflePlayer && window.RufflePlayer.polyfill();
              }
              
              if (aStyle.name == 'flex-direction') {
              	if (HTMLHelper.getAttribute(selectingElement, 'internal-fsb-class') == 'FlowLayout') {
              		if (aStyle.value == 'column' || aStyle.value == 'column-reverse') {
              			HTMLHelper.addClass(selectingElement, 'internal-fsb-inverse');
              		} else {
              			HTMLHelper.removeClass(selectingElement, 'internal-fsb-inverse');
              		}
              	}
              }
              
              if (['flex-wrap', 'justify-content', 'align-items', 'align-content'].indexOf(aStyle.name) != -1) {
              	if (HTMLHelper.getAttribute(selectingElement, 'internal-fsb-class') == 'FlowLayout') {
              		if (hash['flex-wrap'] || hash['justify-content'] || hash['align-items'] || hash['align-content']) {
              			HTMLHelper.addClass(selectingElement, 'internal-fsb-stretch');
              		} else {
              			HTMLHelper.removeClass(selectingElement, 'internal-fsb-stretch');
              		}
              	}
              }
            }
          }
          
          inlineStyle = HTMLHelper.getInlineStyleFromHashMap(hash);
          
          if (EditorHelper.getEditorCurrentMode() == 'animation') AnimationHelper.setStyle(selectingElement, inlineStyle);
          else StylesheetHelper.setStyle(selectingElement, inlineStyle);
        }
        
        // Perspective Property
        // 
        if (hash['-fsb-mode']) {
          let strictContainers = HTMLHelper.getElementsByClassName('internal-fsb-strict-layout', selectingElement, 'internal-fsb-element');
          let absoluteContainers = HTMLHelper.getElementsByClassName('internal-fsb-absolute-layout', selectingElement, 'internal-fsb-element');
          let containers = [...strictContainers, ...absoluteContainers];
          let isPerspectiveCamera = (hash['-fsb-mode'] === 'perspective');
          
          for (let container of containers) {
          	let _inlineStyle = HTMLHelper.getAttribute(container, 'style') || '';
          	
          	if (isPerspectiveCamera) {
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform-style', hash['-child-transform-style']);
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform', hash['-child-transform']);
          	} else {
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform-style', '');
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform', '');
          	}
          	
            HTMLHelper.setAttribute(container, 'style', _inlineStyle);
          }
        }
        
        // Table Cell Property (Without Stylesheet)
        //
        if (HTMLHelper.getAttribute(selectingElement, 'internal-fsb-class') == 'TableLayout') {
        	let isCollapse = (hash['border-collapse'] == 'collapse');
        	HTMLHelper.setAttribute(selectingElement, 'internal-fsb-table-collapse', (isCollapse) ? 'true' : 'false');
        	
        	for (let childY of [...selectingElement.firstElementChild.childNodes]) {
        		for (let childX of [...childY.childNodes]) {
        			let _inlineStyle = HTMLHelper.getAttribute(childX, 'style') || '';
        			
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-top', '');
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-right', '');
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-bottom', '');
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-left', '');
        			
        			HTMLHelper.setAttribute(childX, 'style', _inlineStyle);
        		}
        	}
        	
        	if (!HTMLHelper.getAttribute(selectingElement, 'internal-fsb-reusable-preset-name')) {
          	let tableCellDefinitions = inlineStyle.match(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL);
          	if (tableCellDefinitions !== null) {
					   	for (let tableCellDefinition of tableCellDefinitions) {
				   			let matchedInfo = tableCellDefinition.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
				   			
				   			let x = parseInt(matchedInfo[1]);
				   			let y = parseInt(matchedInfo[2]);
				   			let side = matchedInfo[3];
				   			let style = matchedInfo[4];
				   			
				   			let childY = selectingElement.firstElementChild.childNodes[y];
				   			if (childY) {
				   				if (childY.childNodes[x]) {
				   					let childX = childY.childNodes[x];
				   					if (childX) {
				   						let _inlineStyle = HTMLHelper.getAttribute(childX, 'style') || '';
				   						
				   						_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-' + side, style);
				   						
				   						HTMLHelper.setAttribute(childX, 'style', _inlineStyle);
				   					}
				   				}
				   			}
					   	}
					  }
					}
        }
      }
      {
        if (content.extensions !== undefined) {
          for (let extension of content.extensions) {
          	if (['animationGroupName', 'animationGroupNote', 'animationGroupState', 'animationGroupTestState', 'animationGroupMode', 'animationRepeatMode', 'animationRepeatTime', 'editingAnimationID', 'editingKeyframeID', 'editingAnimationSelector', 'animationSynchronizeMode'].indexOf(extension.name) != -1) {
              switch (extension.name) {
              	case 'animationGroupName':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationGroupName()
		                }]
		              };
              		if (AnimationHelper.getAnimationGroupName() != (extension.value || 'Untitled')) found = true;
		            	AnimationHelper.setAnimationGroupName(extension.value || 'Untitled');
		            	
		            	preview = false;
		              break;
		            case 'animationGroupNote':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationGroupNote()
		                }]
		              };
              		if (AnimationHelper.getAnimationGroupNote() != (extension.value || '')) found = true;
		            	AnimationHelper.setAnimationGroupNote(extension.value || '');
		            	
		            	preview = false;
		              break;
		            case 'animationGroupState':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationGroupState()
		                }]
		              };
              		if (AnimationHelper.getAnimationGroupState() != (extension.value || null)) found = true;
		            	AnimationHelper.setAnimationGroupState(extension.value || null);
		              break;
		            case 'animationGroupTestState':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationGroupTestState()
		                }]
		              };
              		if (AnimationHelper.getAnimationGroupTestState() != (extension.value || null)) found = true;
		            	AnimationHelper.setAnimationGroupTestState(extension.value || null);
		            	
		            	preview = false;
		              break;
		            case 'animationGroupMode':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationGroupMode()
		                }]
		              };
              		if (AnimationHelper.getAnimationGroupMode() != (extension.value || null)) found = true;
		            	AnimationHelper.setAnimationGroupMode(extension.value || null);
		              break;
		            case 'animationSynchronizeMode':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationSynchronizeMode()
		                }]
		              };
              		if (AnimationHelper.getAnimationSynchronizeMode() != (extension.value || null)) found = true;
		            	AnimationHelper.setAnimationSynchronizeMode(extension.value || null);
		              break;
		            case 'animationRepeatMode':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationRepeatMode(presetId)
		                }]
		              };
              		if (AnimationHelper.getAnimationRepeatMode(presetId) != (extension.value || null)) found = true;
		            	AnimationHelper.setAnimationRepeatMode(presetId, extension.value || null);
		              break;
		            case 'animationRepeatTime':
		          		accessory = {
		                extensions: [{
		                  name: extension.name,
		                  value: AnimationHelper.getAnimationRepeatTime(presetId)
		                }]
		              };
              		if (AnimationHelper.getAnimationRepeatTime(presetId) != (extension.value || null)) found = true;
		            	AnimationHelper.setAnimationRepeatTime(presetId, extension.value || null);
		              break;
		            case 'editingAnimationID':
			            accessory = {
	                  extensions: [{
	                    name: extension.name,
	                    value: AnimationHelper.getAnimationGroup()
	                  }]
	                };
	                if (AnimationHelper.getAnimationGroup() != (extension.value || null)) found = true;
	              	AnimationHelper.setAnimationGroup(extension.value);
		            	
		            	preview = false;
		            	break;
		            case 'editingAnimationSelector':
			            accessory = {
	                  extensions: [{
	                    name: extension.name,
	                    value: AnimationHelper.getAnimationSelector()
	                  }]
	                };
	                if (AnimationHelper.getAnimationSelector() != (extension.value || null)) found = true;
	              	AnimationHelper.setAnimationSelector(extension.value);
		            	
		            	preview = false;
		            	break;
		            case 'editingKeyframeID':
			            accessory = {
	                  extensions: [{
	                    name: extension.name,
	                    value: AnimationHelper.getCurrentKeyframe()
	                  }]
	                };
	                if (AnimationHelper.getCurrentKeyframe() != (extension.value || null)) found = true;
	              	AnimationHelper.setCurrentKeyframe(extension.value);
		            	
		            	preview = false;
		            	break;
              }
          	} else if (InternalProjectSettings[extension.name] != extension.value) {
              found = true;
              
              if (['editingPageID', 'editingComponentID', 'editingPopupID'].indexOf(extension.name) != -1) {
                accessory = {
                  extensions: [{
                    name: extension.name,
                    value: InternalProjectSettings[extension.name]
                  }]
                };
                
                WorkspaceHelper.saveWorkspaceData(false);
                InternalProjectSettings[extension.name] = extension.value;
                WorkspaceHelper.loadWorkspaceData(true);
		            
		            preview = false;
              } else if (['pages', 'components', 'popups'].indexOf(extension.name) != -1) {
                accessory = {
                  extensions: [{
                    name: extension.name,
                    value: CodeHelper.clone(InternalProjectSettings[extension.name])
                  }]
                };
                
                InternalProjectSettings[extension.name] = extension.value;
              } else if (extension.name == 'externalLibraries') {
                InternalProjectSettings[extension.name] = extension.value;
                EditorHelper.updateExternalLibraries();
              } else {
                InternalProjectSettings[extension.name] = extension.value;
              }
            }
          }
        }
      }
      {
        if (content.options !== undefined && content.options !== null) {
          selectingElement.firstElementChild.innerText = '';
          found = true;
          for (let option of content.options) {
            let optionElement = document.createElement('option');
            
            optionElement.setAttribute('value', option.value);
            if (option.selected) optionElement.setAttribute('selected', 'true');
            optionElement.innerText = option.name;
            
            selectingElement.firstElementChild.appendChild(optionElement);
          }
          LayoutHelper.invalidate();
        }
      }
      
	    if (found) FrontEndDOMHelper.invalidate();
	    if (found) StyleHelper.invalidate();
    	if (found) TimelineHelper.invalidate();
    	if (found) SchemaHelper.invalidate();
    	if (found) Accessories.guide.invalidate();
    	if (found) StatusHelper.invalidate(selectingElement);
      
      if (remember && !found) {
        remember = false;
      }
    } else {
      remember = false;
    }
    
    ManipulationHelper.updateComponentData(selectingElement);
    
    return [accessory, remember, link, preview];
  },
  handleUpdateElementSize: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	if (EditorHelper.getEditorCurrentMode() == 'animation') return;
  	
  	let accessory = null;
  	let selectingElement = EditorHelper.getSelectingElement();
  	
    if (selectingElement) {
      let origin = HTMLHelper.getPosition(selectingElement.parentNode);
      let position = HTMLHelper.getPosition(selectingElement);
      let size = HTMLHelper.getSize(selectingElement);
      let computedStyle = window.getComputedStyle(selectingElement, null);
      
      position[0] -= parseInt(computedStyle.borderLeftWidth || '0px');
      position[1] -= parseInt(computedStyle.borderTopWidth || '0px');
      
      const parentNode = HTMLHelper.findTheParentInClassName('internal-fsb-element', selectingElement);
      if (parentNode) {
        let parentComputedStyle = window.getComputedStyle(parentNode, null);
        position[0] += parseInt(parentComputedStyle.paddingLeft || '0px');
        position[1] += parseInt(parentComputedStyle.paddingTop || '0px');
      }
      
      accessory = {
        dx: -content.dx,
        dy: -content.dy,
        dw: -content.dw,
        dh: -content.dh
      }
      
      StylesheetHelper.setStyleAttribute(selectingElement, 'left', (position[0] - origin[0] + content.dx) + 'px');
      StylesheetHelper.setStyleAttribute(selectingElement, 'top', (position[1] - origin[1] + content.dy) + 'px');
      StylesheetHelper.setStyleAttribute(selectingElement, 'width', (size[0] + content.dw) + 'px');
      StylesheetHelper.setStyleAttribute(selectingElement, 'min-height', (size[1] + content.dh) + 'px');
    } else {
      remember = false;
    }
  	
  	ManipulationHelper.updateComponentData(selectingElement);
  	ManipulationHelper.invalidate(500);
    
  	return [accessory, remember, link];
  },
  handleUpdateResponsiveSize: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      if (previousInfo.previousClassName == null) {
        previousInfo.previousClassName = HTMLHelper.getAttribute(selectingElement, 'class');
      }
      
      let elementClassName = previousInfo.previousClassName;
      
      let currentActiveLayoutForSize = Accessories.layoutInfo.currentActiveLayout();
      let currentActiveLayoutForOffset = currentActiveLayoutForSize;
      let offsetMatch = null;
      
      for (currentActiveLayoutForSize; currentActiveLayoutForSize >= 0; currentActiveLayoutForSize--) {
        if (elementClassName.match(RESPONSIVE_SIZE_REGEX[currentActiveLayoutForSize])) break;
      }
      
      for (currentActiveLayoutForOffset; currentActiveLayoutForOffset >= 0; currentActiveLayoutForOffset--) {
        let _offsetMatch = elementClassName.match(RESPONSIVE_OFFSET_REGEX[currentActiveLayoutForOffset]);
        if (_offsetMatch) {
          offsetMatch = _offsetMatch;
          break;
        }
      }
      
      if (currentActiveLayoutForSize == -1) currentActiveLayoutForSize = 0;
      if (currentActiveLayoutForOffset == -1) currentActiveLayoutForOffset = 0;
      let currentOffset = (offsetMatch == null) ? 0 : parseInt(offsetMatch[1]);
      
      let currentSizePrefix = [' col-', ' col-sm-', ' col-md-', ' col-lg-', ' col-xl-'][currentActiveLayoutForSize];
      let currentOffsetPrefix = [' offset-', ' offset-sm-', ' offset-md-', ' offset-lg-', ' offset-xl-'][currentActiveLayoutForOffset];
      
      elementClassName = elementClassName.replace(RESPONSIVE_SIZE_REGEX[currentActiveLayoutForSize], '');
      elementClassName += currentSizePrefix + content.size;
      elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
      
      elementClassName = elementClassName.replace(RESPONSIVE_OFFSET_REGEX[currentActiveLayoutForOffset], '');
      elementClassName += currentOffsetPrefix + (currentOffset + content.dOffset);
      elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
      
      if (!remember) {
        HTMLHelper.setAttribute(selectingElement, 'class', elementClassName);
      }
      
      if (remember) {
        promise.then(() => {
          HTMLHelper.setAttribute(selectingElement, 'class', previousInfo.previousClassName);
          previousInfo.previousClassName = null;
          
          let hash = HTMLHelper.getHashMapFromInlineStyle(StylesheetHelper.getStyle(selectingElement) || '');
          
          if (content.dh != 0) {
            hash['min-height'] = (content.h + content.dh) + 'px';
          }
          if (content.dy != 0) {
            let position = HTMLHelper.getPosition(selectingElement, false);
            hash['margin-top'] = (position[1] + content.dy) + 'px';
          }
          
          ManipulationHelper.perform('update', {
            attributes: [{
              name: 'class',
              value: elementClassName
            }, {
              name: 'style',
              value: HTMLHelper.getInlineStyleFromHashMap(hash)
            }]
          });
        });
      }
    }
    remember = false;
  	
  	ManipulationHelper.updateComponentData(selectingElement);
  	ManipulationHelper.invalidate(500);
    
  	return [accessory, remember, link];
  },
  handleKeyDown: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	EditorHelper.synchronize("click", null);
  	  	
 	 	if ([37, 38, 39, 40, 8].indexOf(content) != -1 && !Accessories.cursor.getDOMNode().parentNode) {
  		alert('Please place a cursor anywhere before performing keystroke action.');
  		return [accessory, false, link];
  	}
  	
  	switch (content) {
      case 37:
        CursorHelper.moveCursorToTheLeft();
        remember = false;
        break;
      case 38:
        CursorHelper.moveCursorUp();
        remember = false;
        break;
      case 39:
        CursorHelper.moveCursorToTheRight();
        remember = false;
        break;
      case 40:
        CursorHelper.moveCursorDown();
        remember = false;
        break;
      case 88:
        if (window.clipboardData && (isCtrlKeyActive || isCommandKeyActive)) {
        	let selectingElement = EditorHelper.getSelectingElement();
        	window.clipboardData.setData('application/stackblend', selectingElement.outerHTML);
        	window.clipboardData.setData('application/stackblend-state', JSON.stringify({
			  		isCutMode: true
			  	}));
        	
          if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
            if (HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()) &&
                HTMLHelper.hasClass(HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()), 'internal-fsb-element')) {
              ManipulationHelper.perform('delete[cut]', HTMLHelper.getAttribute(HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()), 'internal-fsb-guid'));
            } else if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
              ManipulationHelper.perform('delete[cut]', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
            }
          } else if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
            ManipulationHelper.perform('delete[cut]', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
          }
        }
        remember = false;
        break;
      case 8:
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
            if (HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()) &&
                HTMLHelper.hasClass(HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()), 'internal-fsb-element')) {
              ManipulationHelper.perform('delete', HTMLHelper.getAttribute(HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode()), 'internal-fsb-guid'));
            } else if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
              ManipulationHelper.perform('delete', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
            }
          } else if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
            ManipulationHelper.perform('delete', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
          }
          remember = false;
        }
        break;
      case 27:
        {
        	let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
          }
      		
          EditorHelper.deselect();
          
    			TimelineHelper.invalidate();
    			StatusHelper.invalidate(selectingElement);
        }
        break;
      case 9:
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
          }
          
          EditorHelper.selectNextElement();
          
    			TimelineHelper.invalidate();
    			StatusHelper.invalidate(selectingElement);
        }
        break;
      case 16:
        isShiftKeyActive = true;
        remember = false;
        break;
      case 17:
        isCtrlKeyActive = true;
        remember = false;
        break;
      case 91:
        isCommandKeyActive = true;
        remember = false;
        break;
      case 67:
        if (window.clipboardData && (isCtrlKeyActive || isCommandKeyActive)) {
        	let selectingElement = EditorHelper.getSelectingElement();
        	window.clipboardData.setData('application/stackblend', selectingElement.outerHTML);
        	window.clipboardData.setData('application/stackblend-state', JSON.stringify({
			  		isCutMode: false
			  	}));
        }
        remember = false;
        break;
      case 86:
        if (window.clipboardData && (isCtrlKeyActive || isCommandKeyActive) && window.clipboardData.getData('application/stackblend')) {
        	const state = JSON.parse(window.clipboardData.getData('application/stackblend-state') || '{}');
        	if (state.isCutMode) {
        		ManipulationHelper.perform('insert', {
	        		klass: 'Pasteboard',
			        html: CodeHelper.preparePastingContent(window.clipboardData.getData('application/stackblend'), true)
	        	});
        		window.clipboardData.setData('application/stackblend', '');
        		window.clipboardData.setData('application/stackblend-state', JSON.stringify({
				  		isCutMode: false
				  	}));
        	} else {
	        	ManipulationHelper.perform('insert', {
	        		klass: 'Pasteboard',
			        html: CodeHelper.preparePastingContent(window.clipboardData.getData('application/stackblend'))
	        	});
	        }
        }
        remember = false;
        break;
      case 90:
        {
          if (DEBUG_MANIPULATION_HELPER) console.log(isShiftKeyActive, isCommandKeyActive, isCtrlKeyActive);
          
          if ((!isShiftKeyActive && isCommandKeyActive && !isCtrlKeyActive) ||
              (!isShiftKeyActive && !isCommandKeyActive && isCtrlKeyActive)) { // Undo
            ManipulationHelper.perform('undo', null);
            remember = false;
          } else if ((isShiftKeyActive && isCommandKeyActive && !isCtrlKeyActive) ||
                     (isShiftKeyActive && !isCommandKeyActive && isCtrlKeyActive)) { // Redo
            ManipulationHelper.perform('redo', null);
            remember = false;
          }
        }
        break;
    }
  	
  	return [accessory, remember, link];
  },
  handleKeyUp: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	switch (content) {
      case 16:
        isShiftKeyActive = false;
        break;
      case 17:
        isCtrlKeyActive = false;
        break;
      case 91:
        isCommandKeyActive = false;
        break;
    }
    remember = false;
  	
  	return [accessory, remember, link];
  },
  handleSelectElement: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      accessory = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
    }
    
    if (content) {
    	const splited = (content as string).split(':');
      let selecting = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', splited[0]);
      
      const indexes = splited[1] && splited[1].split(',') || [];
      if (selecting && indexes.length == 1) {
      	selecting = selecting.firstElementChild.childNodes[parseInt(indexes[0])];
      }
      
      EditorHelper.select(selecting);
    } else {
      EditorHelper.deselect();
    }
    
    TimelineHelper.invalidate();
    StyleHelper.invalidate();
    StatusHelper.invalidate(selectingElement);
    
    if (selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-class') == 'TextElement') {
    	ManipulationHelper.updateComponentData(selectingElement);
    }
  	
  	return [accessory, remember, link];
  },
  handleDeleteElement: (name: string, content: any, remember: boolean, promise: Promise, link: any, cut: boolean=false, silence: boolean=false) => {
  	let accessory = null;
  	let shouldContinue = true;
  	let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content);
  	
  	let deletingKeyframe = EditorHelper.getEditorCurrentMode() == 'animation' && !!InternalProjectSettings.editingKeyframeID;
  	
  	if (!deletingKeyframe) {
  		if (!cut) {
		  	if (element && HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name')) {
		  		if (!silence && !confirm('Remove inheriting from the preset "' + HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name').replace(/_/g, ' ') + '"?')) {
		  			shouldContinue = false;
		  		}
		  	}
		  	if (element) {
		  		if (!silence && !confirm('Are you sure you want to delete "' + HTMLHelper.getAttribute(element, 'internal-fsb-name') + '"?')) {
		  			shouldContinue = false;
		  		}
		  	}
	  	}
	  } else {
	  	if (element) {
	  		if (!silence && !confirm('Are you sure you want to delete a keyframe of "' + HTMLHelper.getAttribute(element, 'internal-fsb-name') + '"?')) {
	  			shouldContinue = false;
	  		}
	  	}
		}
  	
  	accessory = {
  	  element: element,
  	  container: element.parentNode
  	}
  	
    if (shouldContinue && element) {
    	if (!deletingKeyframe) {
    		if (!cut) {
		    	link = Math.random();
			  	promise.then(() => {
			  		let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
						removeAllPresetReferences(presetId, link);
						StylesheetHelper.removeStylesheetDefinition(presetId);
					});
				}
				
				let parentNode = element.parentNode;
	      parentNode.removeChild(element);
	      
	      ManipulationHelper.updateComponentData(parentNode);
	    } else {
	    	let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
	    	
	    	AnimationHelper.removeStylesheetDefinition(presetId);
	    }
    } else {
    	remember = false;
    }
    
    LayoutHelper.invalidate();
    TimelineHelper.invalidate();
    SchemaHelper.invalidate();
    FrontEndDOMHelper.invalidate();
  	
  	return [accessory, remember, link];
  },
  handleModifyTable: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	if (typeof content === 'string') {
  	  content = {
  	    action: content,
  	    elements: null
  	  }
  	}
  	
  	let selectingElement = EditorHelper.getSelectingElement();
  	let cursorContainer = Accessories.cursor.getDOMNode().parentNode;
  	
  	if (!cursorContainer || cursorContainer.tagName != 'TD') {
  		alert('Please place a cursor inside any cell before performing table modification.');
  		return [accessory, false, link];
  	}
  	
    if (selectingElement && cursorContainer.tagName == 'TD') {
      switch (content.action) {
        case 'delete-row':
          if (HTMLHelper.getNextSibling(cursorContainer.parentNode) && HTMLHelper.getNextSibling(cursorContainer.parentNode).tagName == 'TR') {
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
            let td = HTMLHelper.getNextSibling(cursorContainer.parentNode).children[colIndex];
            let rowIndex = [...cursorContainer.parentNode.parentNode.children].indexOf(cursorContainer.parentNode);
            
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let row = parseInt(matches[2]);
                if (row == rowIndex) {
                  return '';
                } else if (row > rowIndex) {
                  return `-fsb-cell-${matches[1]}-${row-1}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-row-above';
          } else if (HTMLHelper.getPreviousSibling(cursorContainer.parentNode.previousSibling && cursorContainer.parentNode).tagName == 'TR') {
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
            let td = HTMLHelper.getPreviousSibling(cursorContainer.parentNode).children[colIndex];
            let rowIndex = [...cursorContainer.parentNode.parentNode.children].indexOf(cursorContainer.parentNode);
            
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let row = parseInt(matches[2]);
                if (row == rowIndex + 1) {
                  return '';
                } else if (row > rowIndex + 1) {
                  return `-fsb-cell-${matches[1]}-${row-1}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-row-below';
          }
          break;
        case 'delete-column':
          if (HTMLHelper.getNextSibling(cursorContainer) && HTMLHelper.getNextSibling(cursorContainer).tagName == 'TD') {
            let td = HTMLHelper.getNextSibling(cursorContainer);
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
             
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let col = parseInt(matches[1]);
                if (col == colIndex) {
                  return '';
                } else if (col > colIndex) {
                  return `-fsb-cell-${col-1}-${matches[2]}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-column-before';
          } else if (HTMLHelper.getPreviousSibling(cursorContainer) && HTMLHelper.getPreviousSibling(cursorContainer).tagName == 'TD') {
            let td = HTMLHelper.getPreviousSibling(cursorContainer.previousSibling);
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
            
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let col = parseInt(matches[1]);
                if (col == colIndex + 1) {
                  return '';
                } else if (col > colIndex + 1) {
                  return `-fsb-cell-${col-1}-${matches[2]}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-column-after';
          }
          break;
      }
      
      cursorContainer = Accessories.cursor.getDOMNode().parentNode;
      
    	switch (content.action) {
    	  case 'add-row-above':
    	  case 'add-row-below':
    	    if (content.elements == null) {
    	      let tr = document.createElement('tr');
    	      content.elements = [tr];
    	      
    	      for (let i=0; i<cursorContainer.parentNode.children.length; i++) {
    	        let td = document.createElement('td');
    	        td.className = 'internal-fsb-strict-layout internal-fsb-allow-cursor';
    	        content.elements[0].appendChild(td);
    	      }
    	    }
    	    
    	    if (content.action == 'add-row-above') {
      	    accessory = {
      	      action: 'delete-row-above'
      	    };
      	    cursorContainer.parentNode.parentNode.insertBefore(content.elements[0], cursorContainer.parentNode);
    	    } else {
    	      accessory = {
      	      action: 'delete-row-below'
      	    };
    	      cursorContainer.parentNode.parentNode.insertBefore(content.elements[0], HTMLHelper.getNextSibling(cursorContainer.parentNode));
    	    }
    	    break;
    	  case 'delete-row-above': // Internal Use
    	    if (HTMLHelper.getPreviousSibling(cursorContainer.parentNode) && HTMLHelper.getPreviousSibling(cursorContainer.parentNode).tagName == 'TR') {
      	    accessory = {
      	      action: 'add-row-above',
      	      elements: [HTMLHelper.getPreviousSibling(cursorContainer.parentNode)]
      	    };
      	    cursorContainer.parentNode.parentNode.removeChild(HTMLHelper.getPreviousSibling(cursorContainer.parentNode));
      	  } else {
      	    remember = false;
      	  }
    	    break;
    	  case 'delete-row-below': // Internal Use
    	    if (HTMLHelper.getNextSibling(cursorContainer.parentNode) && HTMLHelper.getNextSibling(cursorContainer.parentNode).tagName == 'TR') {
      	    accessory = {
      	      action: 'add-row-below',
      	      elements: [HTMLHelper.getNextSibling(cursorContainer.parentNode)]
      	    };
      	    cursorContainer.parentNode.parentNode.removeChild(HTMLHelper.getNextSibling(cursorContainer.parentNode));
      	  } else {
      	    remember = false;
      	  }
    	    break;
    	  case 'add-column-before':
    	  case 'add-column-after':
    	    let count = 0;
    	    if (content.elements == null) {
    	      content.elements = [];
    	      for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
    	        if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
    	          count += 1;
    	        }
    	      }
    	      for (let i=0; i<count; i++) {
    	        let td = document.createElement('td');
    	        td.className = 'internal-fsb-strict-layout internal-fsb-allow-cursor';
    	        content.elements.push(td);
    	      }
    	    }
    	    
    	    let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
    	    
    	    count = 0;
    	    
    	    for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
    	      if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
    	        cursorContainer.parentNode.parentNode.children[i].insertBefore(
    	          content.elements[count++],
    	          (content.action == 'add-column-before') ?
    	            cursorContainer.parentNode.parentNode.children[i].children[colIndex] :
    	            HTMLHelper.getNextSibling(cursorContainer.parentNode.parentNode.children[i].children[colIndex])
    	        );
    	      }
    	    }
    	    
    	    if (content.action == 'add-column-before') {
      	    accessory = {
      	      action: 'delete-column-before'
      	    };
    	    } else {
    	      accessory = {
      	      action: 'delete-column-after'
      	    };
    	    }
    	    break;
    	  case 'delete-column-before': // Internal Use
    	    if (HTMLHelper.getPreviousSibling(cursorContainer) && HTMLHelper.getPreviousSibling(cursorContainer).tagName == 'TD') {
      	    accessory = {
      	      action: 'add-column-before',
      	      elements: []
      	    };
      	    
      	    let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
      	    
      	    for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
      	      if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
      	        accessory.elements.push(HTMLHelper.getPreviousSibling(cursorContainer.parentNode.parentNode.children[i].children[colIndex]));
      	        cursorContainer.parentNode.parentNode.children[i].removeChild(HTMLHelper.getPreviousSibling(cursorContainer.parentNode.parentNode.children[i].children[colIndex]));
      	      }
      	    }
      	  }
    	    break;
    	  case 'delete-column-after': // Internal Use
    	    if (HTMLHelper.getNextSibling(cursorContainer) && HTMLHelper.getNextSibling(cursorContainer).tagName == 'TD') {
      	    accessory = {
      	      action: 'add-column-before',
      	      elements: []
      	    };
      	    
      	    let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
      	    
      	    for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
      	      if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
      	        accessory.elements.push(HTMLHelper.getNextSibling(cursorContainer.parentNode.parentNode.children[i].children[colIndex]));
      	        cursorContainer.parentNode.parentNode.children[i].removeChild(HTMLHelper.getNextSibling(cursorContainer.parentNode.parentNode.children[i].children[colIndex]));
      	      }
      	    }
      	  }
    	    break;
    	}
    	
    	Accessories.cellFormater.refresh();
    	CapabilityHelper.installCapabilityOfBeingMoveInCursor(selectingElement);
    }
  	
  	ManipulationHelper.updateComponentData(selectingElement);
  	LayoutHelper.invalidate();
    TimelineHelper.invalidate();
    FrontEndDOMHelper.invalidate();
    StyleHelper.invalidate();
  	
  	return [accessory, remember, link, content.action];
  },
  handleMoveElement: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let target = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content.target);
  	let origin = target.parentNode;
  	let destination = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content.destination.split(':')[0]);
  	
  	let elements = [...HTMLHelper.findAllParentsInClassName('internal-fsb-element', target), target];
  	let foundNestComponents = false;
  	for (let element of elements) {
  		if (LayoutHelper.isNestedComponent(destination, HTMLHelper.getAttribute(element, 'internal-fsb-inheriting'))) {
  			foundNestComponents = true;
  			break;
  		}
  	}
  	
  	let parents = [...HTMLHelper.findAllParentsInClassName('internal-fsb-element', destination), destination];
  	let foundNestButtons = false;
  	if (HTMLHelper.getAttribute(target, 'internal-fsb-class') == 'Button') {
	  	for (let element of parents) {
	  		if (content.direction != 'appendChild' && element == destination) continue;
	  		if (element.getAttribute('internal-fsb-class') == 'Button') {
	  			foundNestButtons = true;
	  			break;
	  		}
	  	}
	  }
  	
  	if (foundNestComponents) {
  		alert("The editor doesn't allow nest of components.");
  		remember = false;
  	} else if (foundNestButtons) {
  		alert("The editor doesn't allow nest of buttons.");
  		remember = false;
  	} else {
	  	if (remember) {
		  	let nextSibling = HTMLHelper.getNextSibling(target, ['internal-fsb-guide', 'internal-fsb-cursor', 'internal-fsb-resizer']);
		  	let previousSibling = HTMLHelper.getPreviousSibling(target, ['internal-fsb-guide', 'internal-fsb-cursor', 'internal-fsb-resizer']);
		  	
		  	if (nextSibling && HTMLHelper.hasAttribute(nextSibling, 'internal-fsb-guid')) {
		  		accessory = {
		  			target: content.target,
		  			destination: HTMLHelper.getAttribute(nextSibling, 'internal-fsb-guid'),
		  			direction: 'insertBefore'
		  		};
		  	} else if (previousSibling && HTMLHelper.hasAttribute(previousSibling, 'internal-fsb-guid')) {
		  		accessory = {
		  			target: content.target,
		  			destination: HTMLHelper.getAttribute(previousSibling, 'internal-fsb-guid'),
		  			direction: 'insertAfter'
		  		};
		  	} else {
		  		let suffix = "";
		  		if (target.parentNode.tagName == 'TD') {
		  			let layout = HTMLHelper.findTheParentInClassName('internal-fsb-element', target.parentNode);
		  			let row = [...layout.firstElementChild.childNodes].indexOf(target.parentNode.parentNode);
		  			let column = [...target.parentNode.parentNode.childNodes].indexOf(target.parentNode);
		  			
		  			suffix = ':' + row + ',' + column;
		  		}
		  		let destination = HTMLHelper.getAttribute(HTMLHelper.findTheParentInClassName('internal-fsb-element', target.parentNode, true), 'internal-fsb-guid');
		  		accessory = {
		  			target: content.target,
		  			destination: (destination == null) ? '0' : destination + suffix,
		  			direction: 'appendChild'
		  		};
		  	}
			}
			
			switch (content.direction) {
	    	case 'appendChild':
	    	  switch (HTMLHelper.getAttribute(destination, 'internal-fsb-class')) {
	      		case 'FlowLayout':
	      			break;
	      		case 'TableLayout':
	      			let info = content.destination.split(':')[1].split(',');
	      			let row = parseInt(info[0]);
	      			let column = parseInt(info[1]);
	      			
	      			destination = destination.firstElementChild.childNodes[row].childNodes[column];
	      			break;
	      		case 'AbsoluteLayout':
	      			destination = HTMLHelper.getElementByClassName('internal-fsb-allow-cursor', destination, 'internal-fsb-allow-cursor');
	      			break;
	      		case 'Label':
	      			destination = HTMLHelper.getElementByClassName('internal-fsb-allow-cursor', destination);
	      			break;
	      		case 'Rectangle':
	      		case 'Button':
	      		case 'Link':
	      			break;
	      	}
	    	default:
	    		EditorHelper.move(target, destination, content.direction);
	    		break;
	    }
	  }
  	
  	ManipulationHelper.updateComponentData(destination);
  	ManipulationHelper.updateComponentData(origin);
  	LayoutHelper.invalidate();
    TimelineHelper.invalidate();
    SchemaHelper.invalidate();
    FrontEndDOMHelper.invalidate();
  	
  	return [accessory, remember, link];
  },
  handleMoveCursor: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	if (Accessories.cursor.getDOMNode().parentNode != null && CursorHelper.findWalkPathForCursor().join(',') == content.join(',')) {
      remember = false;
    }
    if (remember) {
      accessory = CursorHelper.findWalkPathForCursor();
    }
    CursorHelper.placingCursorUsingWalkPath(content);
  	
  	return [accessory, remember, link];
  },
  handleToggleDesignMode: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	switch (content) {
      case 'guide':
        if (HTMLHelper.hasClass(document.documentElement, 'internal-fsb-guide-on')) {
          HTMLHelper.removeClass(document.documentElement, 'internal-fsb-guide-on');
          HTMLHelper.addClass(document.documentElement, 'internal-fsb-guide-off');
        } else {
          HTMLHelper.removeClass(document.documentElement, 'internal-fsb-guide-off');
          HTMLHelper.addClass(document.documentElement, 'internal-fsb-guide-on');
        }
    }
    
    remember = false;
  	
  	return [accessory, remember, link];
  },
  handleUndo: (name: string, content: any, remember: boolean, promise: Promise) => {
  	let accessory = null;
    let link = false;
  	
  	if (performedIndex >= 0) {
      let name = performed[performedIndex].name;
      let content = performed[performedIndex].content;
      let accessory = performed[performedIndex].accessory;
      let done = false;
      
      link = performed[performedIndex].link;
      
      if (DEBUG_MANIPULATION_HELPER) console.log('undo', name, content, accessory);
      
      switch (name) {
        case 'insert':
          name = 'delete[silence]';
          content = accessory.guid;
          break;
        case 'delete':
        case 'delete[silence]':
        case 'delete[cut]':
          if (HTMLHelper.hasClass(accessory.container, 'internal-fsb-absolute-layout')) {
            accessory.container.appendChild(accessory.element);
          } else {
            Accessories.cursor.getDOMNode().parentNode.insertBefore(accessory.element, Accessories.cursor.getDOMNode());
          }
          ManipulationHelper.updateComponentData(accessory.element);
          done = true;
        	break;
        case 'keydown':
          switch (content) {
            case 8:
              done = true;
              break;
            case 27:
            case 9:
              name = 'select';
              content = accessory;
              break;
          }
          break;
        case 'removePreset':
        	AnimationHelper.addPreset(accessory.key, accessory.data);
        	done = true;
        	break;
        default:
        	content = accessory;
        	break;
      }
      
      performedIndex -= 1;
      if (!done) {
        ManipulationHelper.perform(name, content, false, true);
      }
    }
    
    remember = false;
    
    if (link && performedIndex >= 0 && performed[performedIndex].link === link) {
    	promise.then(() => {
        ManipulationHelper.perform('undo', null);
      });
    }
  	
  	return [accessory, remember];
  },
  handleRedo: (name: string, content: any, remember: boolean, promise: Promise) => {
  	let accessory = null;
    let link = false;
  	
  	if (performedIndex < performed.length - 1) {
      performedIndex += 1;
      
      let name = performed[performedIndex].name;
      let content = performed[performedIndex].content;
      let accessory = performed[performedIndex].accessory;
      
      link = performed[performedIndex].link;
      
      if (DEBUG_MANIPULATION_HELPER) console.log('redo', name, content, accessory);
      
      ManipulationHelper.perform(name, (name == 'insert') ? accessory : content, false, true);
    }
    
    remember = false;
    
    if (link && performedIndex + 1 < performed.length && performed[performedIndex + 1].link === link) {
    	promise.then(() => {
        ManipulationHelper.perform('redo', null);
      });
    }
  	
  	return [accessory, remember];
  },
  handleToggleEditorPanel: (name: string, content: any, remember: boolean, promise: Promise) => {
    let accessory = null;
    let link = false;
    
    if (content.accessory) {
      // The action has taken before this line.
      // 
      accessory = content.accessory;
      content = content.id;
    } else {
      // This line is trying to undo/redo. Send the action out.
      // 
      if (content != null) {
        EditorHelper.synchronize('swap', content);
      }
    }
    
    switch (content) {
      case 'designButton':
        EditorHelper.setEditorCurrentMode('design');
        break;
      case 'animationButton':
        EditorHelper.setEditorCurrentMode('animation');
        break;
      case 'codingButton':
        EditorHelper.setEditorCurrentMode('coding');
        break;
      case 'dataButton':
        EditorHelper.setEditorCurrentMode('data');
        break;
      case 'servicesButton':
        EditorHelper.setEditorCurrentMode('services');
        break;
    }
    
    if (['siteButton', 'componentsButton', 'popupsButton', 'dataButton', 'servicesButton'].indexOf(content) != -1) {
      WorkspaceHelper.setMode(content.replace('Button', ''));
    }
    
    return [accessory, content, remember];
  },
  handleRemovePreset: (name: string, content: any, remember: boolean, promise: Promise) => {
  	let accessory = {
  		key: content,
	    data: AnimationHelper.getPreset(content)
  	}
  	
  	AnimationHelper.removePreset(content);
  	
  	return [accessory, content, remember];
  }
};

export {isShiftKeyActive, isCtrlKeyActive, isCommandKeyActive, ManipulationHelper};