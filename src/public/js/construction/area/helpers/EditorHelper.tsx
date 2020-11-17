import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {TimelineHelper} from './TimelineHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {AnimationHelper} from './AnimationHelper.js';
import {StyleHelper} from './StyleHelper.js';
import {SchemaHelper} from './SchemaHelper.js';
import {FrontEndDOMHelper} from './FrontEndDOMHelper.js';
import {BackEndDOMHelper} from './BackEndDOMHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {InternalProjectSettings, WorkspaceHelper} from './WorkspaceHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';
import '../controls/Cursor.js';
import '../controls/Resizer.js';
import '../controls/CellFormater.js';
import '../controls/Guide.js';
import '../controls/LayoutInfo.js';
import '../controls/Dragger.js';
import '../controls/Overlay.js';
import {LIBRARIES} from '../../Constants.js';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  cursor: null,
  resizer: null,
  cellFormater: null,
  guide: null,
  layoutInfo: null,
  dragger: null,
  overlay: null
};

let editorCurrentMode: string = null;
let cachedUpdateEditorProperties = {};
let updateEditorPropertiesTimer = null;

var EditorHelper = {
  setup: () => {
    let cursorContainer = document.createElement('div');
    Accessories.cursor = ReactDOM.render(<FullStackBlend.Controls.Cursor />, cursorContainer);
    Accessories.cursor.setDOMNode(cursorContainer.firstElementChild);
    cursorContainer.removeChild(Accessories.cursor.getDOMNode());
    
    function resizerOnPreview(original: {x: number, y: number, w: number, h: number}, diff: {dx: number, dy: number, dw: number, dh: number}) {
      let selectingElement = EditorHelper.getSelectingElement();
      if (selectingElement) {
        if (HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-strict-layout')) {
          let size = LayoutHelper.calculateColumnSize(original.w + diff.dw) || 0;
          let dOffset = (diff.dx == 0) ? 0 : LayoutHelper.calculateColumnSize(original.w) - size;
          if (size !== 0) {
            ManipulationHelper.perform('update[responsive]', {
              size: size,
              dOffset: dOffset,
              h: original.h,
              y: original.y,
              dh: diff.dh,
              dy: diff.dy
            }, false);
          }
        }
      }
    }
    function resizerOnUpdate(original: {x: number, y: number, w: number, h: number}, diff: {dx: number, dy: number, dw: number, dh: number}) {
      let selectingElement = EditorHelper.getSelectingElement();
      if (selectingElement) {
        if (HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-strict-layout')) {
          let size = LayoutHelper.calculateColumnSize(original.w + diff.dw) || 0;
          let dOffset = (diff.dx == 0) ? 0 : LayoutHelper.calculateColumnSize(original.w) - size;
          if (size !== 0) {
            ManipulationHelper.perform('update[responsive]', {
              size: size,
              dOffset: dOffset,
              h: original.h,
              y: original.y,
              dh: diff.dh,
              dy: diff.dy
            }, true);
          }
        } else {
          ManipulationHelper.perform('update[size]', {dx: diff.dx,
                                                      dy: diff.dy,
                                                      dw: diff.dw,
                                                      dh: diff.dh}, true);
        }
      }
    }
    
    let resizerContainer = document.createElement('div');
    Accessories.resizer = ReactDOM.render(<FullStackBlend.Controls.Resizer onPreview={resizerOnPreview} onUpdate={resizerOnUpdate} />, resizerContainer);
    Accessories.resizer.setDOMNode(resizerContainer.firstElementChild);
    resizerContainer.removeChild(Accessories.resizer.getDOMNode());
    
    let cellFormaterContainer = document.createElement('div');
    Accessories.cellFormater = ReactDOM.render(<FullStackBlend.Controls.CellFormater />, cellFormaterContainer);
    Accessories.cellFormater.setDOMNode(cellFormaterContainer.firstElementChild);
    
    let guideContainer = document.createElement('div');
    Accessories.guide = ReactDOM.render(<FullStackBlend.Controls.Guide />, guideContainer);
    Accessories.guide.setDOMNode(guideContainer.firstElementChild);
    guideContainer.removeChild(Accessories.guide.getDOMNode());
    
    let layoutContainer = document.createElement('div');
    Accessories.layoutInfo = ReactDOM.render(<FullStackBlend.Controls.LayoutInfo />, layoutContainer);
    Accessories.layoutInfo.setDOMNode(layoutContainer.firstElementChild);
    
    let draggerContainer = document.createElement('div');
    Accessories.dragger = ReactDOM.render(<FullStackBlend.Controls.Dragger />, draggerContainer);
    Accessories.dragger.setDOMNode(draggerContainer.firstElementChild);
    draggerContainer.removeChild(Accessories.dragger.getDOMNode());
    
    let overlayContainer = document.createElement('div');
    Accessories.overlay = ReactDOM.render(<FullStackBlend.Controls.Overlay />, overlayContainer);
    Accessories.overlay.setDOMNode(overlayContainer.firstElementChild);
    overlayContainer.removeChild(Accessories.overlay.getDOMNode());
    
    EditorHelper.init(true, true);
  },
  detach: () => {
    Accessories.cellFormater.setTableElement(null);
  },
  init: (restoreAccessoryStates: boolean, updateEditorUI: boolean) => {
    CapabilityHelper.installCapabilitiesForInternalElements(document.body);
    
    if (updateEditorUI) EditorHelper.updateEditorProperties();
    EditorHelper.updateExternalLibraries();
    
    document.body.appendChild(Accessories.cellFormater.getDOMNode());
    document.body.appendChild(Accessories.layoutInfo.getDOMNode());
    
    // Restore element selecting and cursor placement.
    // 
    if (restoreAccessoryStates) {
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      
      if (page.accessories.selectingElementGUID) {
        let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', page.accessories.selectingElementGUID);
        EditorHelper.select(element);
      }
      
      if (page.accessories.currentCursorWalkPath) {
        CursorHelper.placingCursorUsingWalkPath(page.accessories.currentCursorWalkPath);
      } else {
        CursorHelper.moveCursorToTheEndOfDocument(false);
      }
    }
  },
  
  perform: (name: string, content: any) => {
  	ManipulationHelper.perform(name, content);
  },
  synchronize: (name: string, content: any) => {
  	if (name == 'updateEditorProperties') {
  		window.clearTimeout(updateEditorPropertiesTimer);
  		updateEditorPropertiesTimer = window.setTimeout(() => {
  			let recent = cachedUpdateEditorProperties;
	  		cachedUpdateEditorProperties = Object.assign({}, content);
	  		
	  		for (let key in content) {
	  			if (content.hasOwnProperty(key)) {
	  				if (recent[key] == content[key]) {
	  					content[key] = '~';
	  				} else if (key === 'extensions') {
	  					let extensions = content[key] || {};
		  				let recentExtensions = recent[key] || {};
		  				for (let extensionKey in extensions) {
				  			if (extensions.hasOwnProperty(extensionKey)) {
				  				if (recentExtensions[extensionKey] == extensions[extensionKey]) {
				  					extensions[extensionKey] = '~';
				  				}
				  			}
				  		}
		  			}
	  			}
	  		}
	  		
		    window.top.postMessage(JSON.stringify({
		    	target: 'editor',
		      name: name,
		      content: content
		    }), '*');
  		}, 200);
  	} else {
	    window.top.postMessage(JSON.stringify({
	    	target: 'editor',
	      name: name,
	      content: content
	    }), '*');
  	}
  },
  update: (tag: string=null) => {
    var event = document.createEvent("Event");
    event.initEvent("update", false, true); 
    window.dispatchEvent(event);
    EditorHelper.updateEditorProperties(tag);
  },
  updateEditorProperties: (tag: string=null) => {
    let element = EditorHelper.getSelectingElement();
    
    let current = element;
    let found = false;
   	while (current) {
   		if (HTMLHelper.getAttribute(current, 'internal-fsb-guid') == '0') {
   			found = true;
   			break;
   		}
   		current = current.parentNode;
   	}
   	if (!found) element = null;
   	
    if (element == null) {
    	EditorHelper.synchronize('updateEditorProperties', {
    		attributes: HTMLHelper.getAttributes(document.body, false),
	      extensions: Object.assign({}, InternalProjectSettings, {
	        isSelectingElement: false,
	        hasParentReactComponent: false,
	        elementTreeNodes: LayoutHelper.getElementTreeNodes(),
	        timelineTreeNodes: TimelineHelper.getElementTreeNodes(),
	        schemataTreeNodes: SchemaHelper.getElementTreeNodes(),
	        elementComputedStyleNodes: [],
	        editorCurrentMode: editorCurrentMode,
	        editing: WorkspaceHelper.getEditable(),
	       	areFormatAndStyleOptionsAvailable: (editorCurrentMode != 'animation' ||
	      		(InternalProjectSettings.editingAnimationID != null && InternalProjectSettings.editingKeyframeID != null)),
        	autoGeneratedCodeForMergingBackEndScript: BackEndDOMHelper.generateCodeForMergingSection(document.body),
        	animationGroupName: AnimationHelper.getAnimationGroupName(),
        	animationGroupNote: AnimationHelper.getAnimationGroupNote(),
        	animationGroupState: AnimationHelper.getAnimationGroupState(),
        	animationGroupMode: AnimationHelper.getAnimationGroupMode(),
	        animationRepeatMode: null,
	        animationRepeatTime: null
	      }),
	      tag: tag
	    });
    	return;
    }
    
    let reusablePresetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name') || null;
    let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
    let attributes = null;
    
    if (EditorHelper.getEditorCurrentMode() == 'animation') {
    	attributes = HTMLHelper.getAttributes(element, false, {
        style: AnimationHelper.getStylesheetDefinition(presetId)
      });
    } else {
	    if (reusablePresetName) {
	      attributes = HTMLHelper.getAttributes(element, false, {
	        style: StylesheetHelper.getStylesheetDefinition(presetId)
	      });
	    } else {
	      attributes = HTMLHelper.getAttributes(element, false);
	    }
	  }
    
    EditorHelper.synchronize('updateEditorProperties', {
      attributes: attributes,
      extensions: Object.assign({}, InternalProjectSettings, {
      	isSelectingElement: true,
	      hasParentReactComponent: EditorHelper.hasParentReactComponent(element),
        currentActiveLayout: Accessories.layoutInfo.currentActiveLayout(),
        stylesheetDefinitionKeys: StylesheetHelper.getStylesheetDefinitionKeys(),
        stylesheetDefinitionRevision: StylesheetHelper.getStylesheetDefinitionRevision(),
        animationDefinitionKeys: AnimationHelper.getStylesheetDefinitionKeys(),
        animationDefinitionRevision: AnimationHelper.getStylesheetDefinitionRevision(),
        elementTreeNodes: LayoutHelper.getElementTreeNodes(),
	      timelineTreeNodes: TimelineHelper.getElementTreeNodes(),
        schemataTreeNodes: SchemaHelper.getElementTreeNodes(),
        elementComputedStyleNodes: StyleHelper.getElementComputedStyleNodes(element),
        autoGeneratedCodeForRenderMethod: FrontEndDOMHelper.generateCodeForReactRenderMethod(element),
        autoGeneratedCodeForMergingRenderMethod: FrontEndDOMHelper.generateCodeForMergingSection(element),
        autoGeneratedCodeForMergingBackEndScript: BackEndDOMHelper.generateCodeForMergingSection(document.body),
        editorCurrentMode: editorCurrentMode,
	      editing: WorkspaceHelper.getEditable(),
	      areFormatAndStyleOptionsAvailable: (editorCurrentMode != 'animation' ||
	      	(InternalProjectSettings.editingAnimationID != null && InternalProjectSettings.editingKeyframeID != null)),
      	animationGroupName: AnimationHelper.getAnimationGroupName(),
      	animationGroupNote: AnimationHelper.getAnimationGroupNote(),
      	animationGroupState: AnimationHelper.getAnimationGroupState(),
        animationGroupMode: AnimationHelper.getAnimationGroupMode(),
        animationRepeatMode: AnimationHelper.getAnimationRepeatMode(presetId),
        animationRepeatTime: AnimationHelper.getAnimationRepeatTime(presetId)
      }, Accessories.cellFormater.getInfo()),
	    tag: tag
    });
  },
  updateExternalLibraries: () => {
    let externalStylesheets = [];
		let externalScripts = [];
		let selectedLibraries: string[] = (InternalProjectSettings.externalLibraries || '').split(' ');
    for (let library of LIBRARIES) {
        if (selectedLibraries.indexOf(library.id) != -1) {
            if (library.development.stylesheets) {
                for (let stylesheet of library.development.stylesheets) {
                    let element = document.createElement('link');
                    element.setAttribute('rel', 'stylesheet');
                    element.setAttribute('type', 'text/css');
                    element.setAttribute('href', stylesheet);
                    element.setAttribute('internal-stylesheet-element', library.id);
                    document.head.appendChild(element);
                }
            }
        } else {
            let elements = [...HTMLHelper.getElementsByAttribute("internal-stylesheet-element")].filter(element => HTMLHelper.getAttribute(element, 'internal-stylesheet-element') == library.id);
            for (let element of elements) {
                document.head.removeChild(element);
            }
        }
    }
    
    let elements = [...HTMLHelper.getElementsByAttributeNameAndValue('internal-stylesheet-element', 'custom')];
    
		let externalLibraries: string[] = (InternalProjectSettings.customExternalLibraries || '').split(' ');
    for (let externalLibrary of externalLibraries) {
			  if (!externalLibrary) continue;
			  
	    	let splited = externalLibrary.split('#');
	    	if (splited[0].toLowerCase().indexOf('.css') != -1) {
	    			let filters = elements.filter(element => element.getAttribute('rel') === 'stylesheet' && element.getAttribute('href') === splited[0]);
	    			
	    			if (filters.length == 0) {
			    			let element = document.createElement('link');
		            element.setAttribute('rel', 'stylesheet');
		            element.setAttribute('type', 'text/css');
		            element.setAttribute('href', splited[0]);
		            element.setAttribute('internal-stylesheet-element', 'custom');
		            document.head.appendChild(element);
	          } else {
	          		elements = elements.filter(element => filters.indexOf(element) == -1);
	          }
		    }
    }
    
    for (let element of elements) {
    		element.parentNode.removeChild(element);
    }
  },
  
  select: (element: HTMLElement) => {
    if (!element) return;
    if (HTMLHelper.hasClass(element, 'internal-fsb-element')) {
      element.appendChild(Accessories.resizer.getDOMNode());
      
      let current = element;
      while (current != null) {
        if (HTMLHelper.hasClass(current, 'container') ||
        		HTMLHelper.hasClass(current, 'container-fluid') ||
        		(HTMLHelper.hasClass(current, 'internal-fsb-allow-cursor') && current.tagName == 'TD')) {
          current.insertBefore(Accessories.guide.getDOMNode(), current.firstElementChild);
          break;
        }
        current = current.parentNode;
      }
      
      EditorHelper.synchronize('select', HTMLHelper.getAttribute(element, 'internal-fsb-class'));
      EditorHelper.update();
    }
    if (element.tagName == 'TABLE') {
	    Accessories.cellFormater.setTableElement(element);
	  } else {
	  	Accessories.cellFormater.setTableElement(null);
	  }
  },
  deselect: () => {
    if (Accessories.resizer.getDOMNode().parentNode != null) {
      Accessories.resizer.getDOMNode().parentNode.removeChild(Accessories.resizer.getDOMNode());
    }
    EditorHelper.synchronize("click", null);
  },
  selectNextElement: () => {
    let allElements = [...HTMLHelper.getElementsByClassName('internal-fsb-element')];
    if (allElements.length == 0) return;
    
    let selectingElement = EditorHelper.getSelectingElement();
    let index = allElements.indexOf(selectingElement);
    
    if (index + 1 < allElements.length) {
      EditorHelper.select(allElements[index + 1]);
    } else {
      EditorHelper.select(allElements[0]);
    }
  },
  getSelectingElement: () => {
  	if (Accessories.resizer == null) return null;
  	
    let current = Accessories.resizer.getDOMNode();
    while (current != null && current != document.body) {
      current = current.parentNode;
    }
    
    if (current == document.body && HTMLHelper.hasClass(Accessories.resizer.getDOMNode().parentNode, 'internal-fsb-element')) {
      return Accessories.resizer.getDOMNode().parentNode;
    } else {
      return null;
    }
  },
  move: (target: HTMLElement, destination: HTMLElement, direction: string) => {
  	switch (direction) {
    	case 'insertBefore':
    		destination.parentNode.insertBefore(target, destination);
  			destination.parentNode.insertBefore(Accessories.guide.getDOMNode(), destination.parentNode.firstElementChild);
    		break;
    	case 'appendChild':
    		destination.appendChild(target);
  			destination.insertBefore(Accessories.guide.getDOMNode(), destination.firstElementChild);
    		break;
    	case 'insertAfter':
    		destination.parentNode.insertBefore(target, HTMLHelper.getNextSibling(destination));
  			destination.parentNode.insertBefore(Accessories.guide.getDOMNode(), destination.parentNode.firstElementChild);
    		break;
  	}
  },
  getEditorCurrentMode: () => {
    return editorCurrentMode;
  },
  setEditorCurrentMode: (mode: string) => {
    editorCurrentMode = mode;
  },
  hasParentReactComponent: (element: HTMLElement) => {
  	return HTMLHelper.findAllParentValuesInAttributeName("internal-fsb-react-mode", element, document.body, true).length != 0;
  }
};

export {Accessories, EditorHelper};