import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CodeHelper} from '../../helpers/CodeHelper';
import {LayoutHelper} from './LayoutHelper';
import {TimelineHelper} from './TimelineHelper';
import {CursorHelper} from './CursorHelper';
import {ManipulationHelper} from './ManipulationHelper';
import {StylesheetHelper} from './StylesheetHelper';
import {AnimationHelper} from './AnimationHelper';
import {StyleHelper} from './StyleHelper';
import {StatusHelper} from './StatusHelper';
import {SchemaHelper} from './SchemaHelper';
import {FrontEndDOMHelper} from './FrontEndDOMHelper';
import {BackEndDOMHelper} from './BackEndDOMHelper';
import {CapabilityHelper} from './CapabilityHelper';
import {InternalProjectSettings, WorkspaceHelper} from './WorkspaceHelper';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper';
import '../controls/Cursor';
import '../controls/Resizer';
import '../controls/CellFormater';
import '../controls/Guide';
import '../controls/LayoutInfo';
import '../controls/Dragger';
import '../controls/Overlay';
import '../controls/RedLine';
import {LIBRARIES, INPUT_ELEMENT_TAGS} from '../../Constants';

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

let editorCurrentMode: string = 'design';
let cachedUpdateEditorProperties = {};
let updateEditorPropertiesTimer = null;
let elementAuthoringStatuses = {};

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
    
    let redLineContainer = document.createElement('div');
    Accessories.redLine = ReactDOM.render(<FullStackBlend.Controls.RedLine />, redLineContainer);
    Accessories.redLine.setDOMNode(redLineContainer.firstElementChild);
    redLineContainer.removeChild(Accessories.redLine.getDOMNode());
    
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
    
    Accessories.redLine.reset();
    Accessories.redLine.detach();
    
    // Restore element selecting and cursor placement.
    // 
    if (restoreAccessoryStates) {
    	let selectingElementGUID = null;
    	let currentCursorWalkPath = null;
    	
    	switch (InternalProjectSettings.currentMode) {
    		case 'site':
    			const page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
    			selectingElementGUID = page.accessories.selectingElementGUID;
    			currentCursorWalkPath = page.accessories.currentCursorWalkPath;
    			break;
    		case 'components':
    			const component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
    			selectingElementGUID = component.accessories.selectingElementGUID;
    			currentCursorWalkPath = component.accessories.currentCursorWalkPath;
    			break;
    		case 'popups':
    			const popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
    			selectingElementGUID = popup.accessories.selectingElementGUID;
    			currentCursorWalkPath = popup.accessories.currentCursorWalkPath;
    			break;
    	}
      
      if (selectingElementGUID) {
        let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', selectingElementGUID);
        EditorHelper.select(element);
      }
      
      if (currentCursorWalkPath) {
        CursorHelper.placingCursorUsingWalkPath(currentCursorWalkPath);
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
	        isInputElement: false,
      		isFirstElementOfComponent: false,
	        hasParentReactComponent: false,
	        isInheritingComponent: false,
	        isNotContainingInFlexbox: true,
	        elementTreeNodes: LayoutHelper.getElementTreeNodes(false),
	        elementTreeNodesIncludeInheriting: LayoutHelper.getElementTreeNodes(true),
	        elementAuthoringStatuses: StatusHelper.getElementAuthoringStatuses(),
	        elementAuthoringRevision: StatusHelper.getElementAuthoringRevision(),
	        timelineTreeNodes: editorCurrentMode == 'animation' && TimelineHelper.getElementTreeNodes(),
	        schemataTreeNodes: InternalProjectSettings.currentMode == 'data' && SchemaHelper.getElementTreeNodes() || [],
	        elementComputedStyleNodes: [],
	        editorCurrentMode: editorCurrentMode,
	        editorCurrentExplore: InternalProjectSettings.currentMode,
	        editing: WorkspaceHelper.getEditable(),
	       	areFormatAndStyleOptionsAvailable: (editorCurrentMode != 'animation' ||
	      		(InternalProjectSettings.editingAnimationID != null && InternalProjectSettings.editingKeyframeID != null)),
        	autoGeneratedCodeForMergingBackEndScript: BackEndDOMHelper.generateCodeForMergingSection(document.body, document.body, InternalProjectSettings.editingPageID),
        	animationGroupName: AnimationHelper.getAnimationGroupName(),
        	animationGroupNote: AnimationHelper.getAnimationGroupNote(),
        	animationGroupState: AnimationHelper.getAnimationGroupState(),
        	animationGroupTestState: AnimationHelper.getAnimationGroupTestState(),
        	animationGroupMode: AnimationHelper.getAnimationGroupMode(),
        	animationSynchronizeMode: AnimationHelper.getAnimationSynchronizeMode(),
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
	  
	  const parentElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', element);
	  const displayStyle = parentElement && HTMLHelper.getInlineStyle(HTMLHelper.getAttribute(parentElement, 'style'), 'display') || null;
	  const isFlexContainer = HTMLHelper.getAttribute(parentElement, 'internal-fsb-class') == 'FlowLayout' || displayStyle == 'flex';
    
    EditorHelper.synchronize('updateEditorProperties', {
      attributes: attributes,
      extensions: Object.assign({}, InternalProjectSettings, {
      	isSelectingElement: true,
      	isInputElement: (INPUT_ELEMENT_TAGS.indexOf(element.firstElementChild && element.firstElementChild.tagName || null) != -1 || INPUT_ELEMENT_TAGS.indexOf(element && element.tagName || null) != -1),
      	isFirstElementOfComponent: (["components", "popups"].indexOf(WorkspaceHelper.getEditable()) != -1) && EditorHelper.getIsFirstElement(element),
      	isTableLayoutRow: (element.tagName == 'TR'),
      	isInheritingComponent: HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting'),
	      isNotContainingInFlexbox: !isFlexContainer,
	      hasParentReactComponent: EditorHelper.hasParentReactComponent(element),
        currentActiveLayout: Accessories.layoutInfo.currentActiveLayout(),
        stylesheetDefinitionKeys: StylesheetHelper.getStylesheetDefinitionKeys(),
        stylesheetDefinitionRevision: StylesheetHelper.getStylesheetDefinitionRevision(),
        animationDefinitionKeys: AnimationHelper.getStylesheetDefinitionKeys(),
        animationDefinitionRevision: AnimationHelper.getStylesheetDefinitionRevision(),
        elementTreeNodes: LayoutHelper.getElementTreeNodes(false),
        elementTreeNodesIncludeInheriting: LayoutHelper.getElementTreeNodes(true),
        elementAuthoringStatuses: StatusHelper.getElementAuthoringStatuses(),
        elementAuthoringRevision: StatusHelper.getElementAuthoringRevision(),
	      timelineTreeNodes: editorCurrentMode == 'animation' && TimelineHelper.getElementTreeNodes(),
        schemataTreeNodes: InternalProjectSettings.currentMode == 'data' && SchemaHelper.getElementTreeNodes() || [],
        elementComputedStyleNodes: StyleHelper.getElementComputedStyleNodes(element),
        autoGeneratedCodeForRenderMethod: FrontEndDOMHelper.generateCodeForReactRenderMethod(document.body, element),
        autoGeneratedCodeForMergingRenderMethod: FrontEndDOMHelper.generateCodeForMergingSection(document.body, element),
        autoGeneratedCodeForMergingBackEndScript: (WorkspaceHelper.getEditable() != 'data') ? BackEndDOMHelper.generateCodeForMergingSection(document.body, document.body, InternalProjectSettings.editingPageID) : BackEndDOMHelper.generateCodeForMergingSectionInData(element),
        editorCurrentMode: editorCurrentMode,
	      editorCurrentExplore: InternalProjectSettings.currentMode,
	      editing: WorkspaceHelper.getEditable(),
	      areFormatAndStyleOptionsAvailable: (editorCurrentMode != 'animation' ||
	      	(InternalProjectSettings.editingAnimationID != null && InternalProjectSettings.editingKeyframeID != null)),
      	animationGroupName: AnimationHelper.getAnimationGroupName(),
      	animationGroupNote: AnimationHelper.getAnimationGroupNote(),
      	animationGroupState: AnimationHelper.getAnimationGroupState(),
      	animationGroupTestState: AnimationHelper.getAnimationGroupTestState(),
        animationGroupMode: AnimationHelper.getAnimationGroupMode(),
        animationSynchronizeMode: AnimationHelper.getAnimationSynchronizeMode(),
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
                		if (HTMLHelper.getElementByAttributeNameAndValue('href', stylesheet) == null) {
	                      let element = document.createElement('link');
	                      element.setAttribute('rel', 'stylesheet');
	                      element.setAttribute('type', 'text/css');
	                      element.setAttribute('href', stylesheet);
	                      element.setAttribute('internal-stylesheet-element', library.id);
	                      document.head.appendChild(element);
	                  }
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
    	const selecting = HTMLHelper.getElementByClassName('internal-fsb-selecting');
    	if (selecting) HTMLHelper.removeClass(selecting, 'internal-fsb-selecting');
    	
    	HTMLHelper.addClass(element, 'internal-fsb-selecting');
    	
      element.appendChild(Accessories.resizer.getDOMNode());
      element.appendChild(Accessories.redLine.getDOMNode());
      
      Accessories.guide.getDOMNode().remove();
      Accessories.redLine.reset();
      
      let current = element;
      while (current != null) {
        if ((current != element && HTMLHelper.getAttribute(current, 'internal-fsb-class') == 'FlowLayout') ||
        		HTMLHelper.hasClass(current, 'internal-fsb-begin-layout') ||
        		(HTMLHelper.hasClass(current, 'internal-fsb-allow-cursor') && current.tagName == 'TD')) {
          current.insertBefore(Accessories.guide.getDOMNode(), current.firstElementChild);
      		Accessories.guide.invalidate();
          break;
        }
        current = current.parentNode;
      }
      
      element.parentNode.insertBefore(Accessories.cursor.getDOMNode(), element.nextSibling);
      
      let previous = HTMLHelper.getElementByClassName('internal-fsb-walking');
      if (previous) HTMLHelper.removeClass(previous, 'internal-fsb-walking');
      
      if (element) HTMLHelper.addClass(element, 'internal-fsb-walking');
      
      EditorHelper.synchronize('select', HTMLHelper.getAttribute(element, 'internal-fsb-class'));
      EditorHelper.update();
    } else if (element.tagName == 'TR') {
    	const selecting = HTMLHelper.getElementByClassName('internal-fsb-selecting');
    	if (selecting) HTMLHelper.removeClass(selecting, 'internal-fsb-selecting');
    	
    	Accessories.guide.getDOMNode().remove();
    	Accessories.resizer.getDOMNode().remove();
    	
    	HTMLHelper.addClass(element, 'internal-fsb-selecting');
    }
    if (element.tagName == 'TABLE') {
	    Accessories.cellFormater.setTableElement(element);
	  } else {
	  	Accessories.cellFormater.setTableElement(null);
	  }
  },
  deselect: () => {
    if (Accessories.resizer.getDOMNode().parentNode != null) {
    	const selecting = HTMLHelper.getElementByClassName('internal-fsb-selecting');
    	if (selecting) HTMLHelper.removeClass(selecting, 'internal-fsb-selecting');
    	
      Accessories.resizer.getDOMNode().parentNode.removeChild(Accessories.resizer.getDOMNode());
      Accessories.redLine.getDOMNode().parentNode.removeChild(Accessories.redLine.getDOMNode());
      
      Accessories.redLine.reset();
      
      document.activeElement && document.activeElement.blur();
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
  getSelectingElement: (_window: any=window, _document: any=window.document) => {
  	if (Accessories.resizer == null) return null;
  	
    let current = Accessories.resizer.getDOMNode();
    while (current != null && current != _document.body) {
      current = current.parentNode;
    }
    
    if (current == _document.body && HTMLHelper.hasClass(Accessories.resizer.getDOMNode().parentNode, 'internal-fsb-element')) {
      return Accessories.resizer.getDOMNode().parentNode;
    } else {
      return HTMLHelper.getElementByClassName('internal-fsb-selecting', _document);
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
    
    Accessories.guide.invalidate();
  },
  getEditorCurrentMode: () => {
    return editorCurrentMode;
  },
  setEditorCurrentMode: (mode: string) => {
    editorCurrentMode = mode;
  },
  hasParentReactComponent: (element: HTMLElement) => {
		if (element == document) return false;
		
  	const _document = element.ownerDocument;
		const _window = _document.defaultView || _document.parentWindow;
		
  	return HTMLHelper.findAllParentValuesInAttributeName("internal-fsb-react-mode", element, _window.document.body, true).length != 0;
  },
  getIsFirstElement: (element: HTMLElement) => {
  	return element && HTMLHelper.hasClass(element.parentNode, 'internal-fsb-begin-layout') || false;
  }
};

export {Accessories, EditorHelper};