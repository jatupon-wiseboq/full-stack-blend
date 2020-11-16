import {CodeHelper} from '../../helpers/CodeHelper.js';
import {FontHelper} from '../../helpers/FontHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {AnimationHelper} from './AnimationHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {FrontEndDOMHelper} from './FrontEndDOMHelper.js';
import {BackEndDOMHelper} from './BackEndDOMHelper.js';
import {SchemaHelper} from './SchemaHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {TimelineHelper} from './TimelineHelper.js';
import {MalformationRepairHelper} from './MalformationRepairHelper.js';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, FORWARD_STYLE_TO_CHILDREN_CLASS_LIST, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES, INHERITING_COMPONENT_RESERVED_STYLE_NAMES, BACKEND_DATA_EXTENSIONS} from '../../Constants.js';

declare let js_beautify;
declare let css_beautify;
declare let html_beautify;

const merging_beautify = (beautified_content: string) => {
	if (!beautified_content) return beautified_content;
	
	return beautified_content.replace(/\n[ \t]+</g, '\n<').replace(/></g, '>\n<').replace(/ ([a-zA-Z0-9\_\-]+=")/g, '\n    $1');
};

let cacheOfGeneratedFrontEndCodeForAllPages: any = {};
let cacheOfGeneratedBackEndCodeForAllPages: any = {};

const DefaultProjectSettings: {[Identifier: string]: any} = {
  currentMode: 'site',
  externalLibraries: 'react@16',
  colorSwatches: new Array(28),
  editingPageID: 'index',
  editingComponentID: null,
  editingPopupID: null,
  editingAnimationID: null,
  editingKeyframeID: null,
  pages: [{id: 'index', name: 'Home', path: '/', state: 'create'}],
  components: [],
  popups: []
};
let InternalProjectSettings = CodeHelper.clone(DefaultProjectSettings);
let InternalSites = {};
let InternalComponents = {};
let InternalPopups = {};
let InternalDataFlows = {};
let InternalServices = {};
let InternalStylesheets = {};
let InternalAnimations = {};
let backEndControllerBlobSHADict = {};
let frontEndComponentsBlobSHADict = {};
let viewBlobSHADict = {};
let routeBlobSHA = null;
let controllerBlobSHA = null;
let siteBundleBlobSHA = null;
let version = 1.2;

const DEFAULT_FLOW_PAGE_HTML = `<body><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout internal-fsb-allow-cursor"></div></div></body>`.split('\n');
const DEFAULT_SINGLE_ITEM_EDITING_HTML = `<body><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout"></div></div></body>`.split('\n');
const DEFAULT_ABSOLUTE_PAGE_HTML = `<body class="internal-fsb-disabled-guide"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0" style="height: 100%;"><div class="row internal-fsb-absolute-layout internal-fsb-begin-layout internal-fsb-allow-cursor" style="height: 100%;"></div></div></body>`.split('\n');
const DEFAULT_COMPONENT_HTML = `<div class="internal-fsb-element col-4"><div class="container-fluid"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div>`.split('\n');
const DEFAULT_POPUP_HTML = `<div class="internal-fsb-element col-12" style="width: 100vw; height: 100vh"><div class="container-fluid"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div>`.split('\n');
const DEFAULT_PAGE_EXTENSIONS = {};

var WorkspaceHelper = {
  generateWorkspaceData: (removeSHADict: boolean=false) => {
    WorkspaceHelper.saveWorkspaceData(false, true);
    
    let clonedInternalProjectSettings = CodeHelper.clone(InternalProjectSettings);
    for (let key of BACKEND_DATA_EXTENSIONS) {
      delete clonedInternalProjectSettings[key];
    }
    
    clonedInternalProjectSettings.currentMode = 'site';
    clonedInternalProjectSettings.editingPageID = 'index';
    clonedInternalProjectSettings.editingComponentID = null;
    clonedInternalProjectSettings.editingPopupID = null;
    
    let clonedInternalSites = CodeHelper.clone(InternalSites);
    for (let key in clonedInternalSites) {
  		if (clonedInternalSites.hasOwnProperty(key)) {
  			clonedInternalSites[key].accessories = {};
  		}
  	}
    
    return Object.assign(
    	{
	    	version: version,
	      globalSettings: clonedInternalProjectSettings,
	      sites: clonedInternalSites,
	      components: InternalComponents,
	      popups: InternalPopups,
	      flows: InternalDataFlows,
	      services: InternalServices,
	      stylesheets: StylesheetHelper.generateStylesheetData(),
	      animations: AnimationHelper.generateStylesheetData()
	    }, removeSHADict ? {} : {
	      backEndControllerBlobSHADict: backEndControllerBlobSHADict,
	      frontEndComponentsBlobSHADict: frontEndComponentsBlobSHADict,
	      viewBlobSHADict: viewBlobSHADict,
				routeBlobSHA: routeBlobSHA,
				controllerBlobSHA: controllerBlobSHA,
				siteBundleBlobSHA: siteBundleBlobSHA
	    }
   	);
  },
  initializeWorkspaceData: (data: any) => {
    InternalProjectSettings = data && data.globalSettings || DefaultProjectSettings;
    InternalSites = data && data.sites || {};
    InternalComponents = data && data.components || {};
    InternalPopups = data && data.popups || {};
    InternalDataFlows = data && data.flows || {};
    InternalServices = data && data.services || {};
    InternalStylesheets = data && data.stylesheets || {};
    InternalAnimations = data && data.animations || {};
    InternalDataFlows.schema = InternalDataFlows.schema || {};
    
    backEndControllerBlobSHADict = data.backEndControllerBlobSHADict || {};
    frontEndComponentsBlobSHADict = data.frontEndComponentsBlobSHADict || {};
    viewBlobSHADict = data.viewBlobSHADict || {};
    routeBlobSHA = data.routeBlobSHA || null;
    controllerBlobSHA = data.controllerBlobSHA || null;
    siteBundleBlobSHA = data.siteBundleBlobSHA || null;
    
    InternalProjectSettings.currentMode = 'site';
    
    if (data) {
      if (!data.version || data.version == 1) {
        for (let key in InternalSites) {
          if (InternalSites.hasOwnProperty(key)) {
            InternalSites[key].body = html_beautify(InternalSites[key].body || '').split('\n');
          }
        }
        for (let key in InternalComponents) {
          if (InternalComponents.hasOwnProperty(key)) {
            InternalComponents[key].html = html_beautify(InternalComponents[key].html || '').split('\n');
          }
        }
        for (let key in InternalPopups) {
          if (InternalPopups.hasOwnProperty(key)) {
            InternalPopups[key].html = html_beautify(InternalPopups[key].html || '').split('\n');
          }
        }
        InternalDataFlows.default = html_beautify(InternalDataFlows.default || '').split('\n');
        InternalServices.default = html_beautify(InternalServices.default || '').split('\n');
      }
      if (!data.version || data.version <= 1.1) {
        for (let key in InternalSites) {
          if (InternalSites.hasOwnProperty(key)) {
            for (let extension of BACKEND_DATA_EXTENSIONS) {
              if (InternalSites[key].extensions && InternalSites[key].extensions.hasOwnProperty(extension)) {
                InternalSites[key].extensions[extension] = InternalSites[key].extensions[extension] &&
                	InternalSites[key].extensions[extension].split('\n') || null;
              }
            }
          }
        }
        for (let key in InternalComponents) {
          if (InternalComponents.hasOwnProperty(key)) {
            for (let extension of BACKEND_DATA_EXTENSIONS) {
              if (InternalComponents[key].extensions && InternalComponents[key].extensions.hasOwnProperty(extension)) {
                InternalComponents[key].extensions[extension] = InternalComponents[key].extensions[extension] &&
                	InternalComponents[key].extensions[extension].split('\n') || null;
              }
            }
          }
        }
        for (let key in InternalPopups) {
          if (InternalPopups.hasOwnProperty(key)) {
            for (let extension of BACKEND_DATA_EXTENSIONS) {
              if (InternalPopups[key].extensions && InternalPopups[key].extensions.hasOwnProperty(extension)) {
                InternalPopups[key].extensions[extension] = InternalPopups[key].extensions[extension] &&
                	InternalPopups[key].extensions[extension].split('\n') || null;
              }
            }
          }
        }
      }
    }
    
    WorkspaceHelper.loadWorkspaceData();
    EditorHelper.updateEditorProperties();
  },
  setMode: (mode: string) => {
    WorkspaceHelper.saveWorkspaceData(false);
    InternalProjectSettings.currentMode = mode;
    WorkspaceHelper.loadWorkspaceData(true);
  },
  getEditable: () => {
    if (InternalProjectSettings.currentMode == 'site') {
      return (InternalProjectSettings.editingPageID != null) ? 'site' : false;
    } else if (InternalProjectSettings.currentMode == 'components') {
      return (InternalProjectSettings.editingComponentID != null || InternalProjectSettings.components.filter(component => component.state != 'delete').length != 0) ? 'components' : false;
    } else if (InternalProjectSettings.currentMode == 'popups') {
      return (InternalProjectSettings.editingPopupID != null || InternalProjectSettings.popups.filter(popup => popup.state != 'delete').length != 0) ? 'popups' : false;
    } else if (InternalProjectSettings.currentMode == 'data') {
      return 'data';
    } else if (InternalProjectSettings.currentMode == 'services') {
      return 'services';
    }
  },
  loadWorkspaceData: (updateUI: boolean=false) => {
    if (InternalProjectSettings.currentMode == 'site') {
      if (InternalProjectSettings.editingPageID == null) return;
      
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      if (page == null) return;
      
      document.body.outerHTML = page.body.join('\n');
      
      for (let key of BACKEND_DATA_EXTENSIONS) {
      	delete InternalProjectSettings[key];
      	if (page.extensions[key]) {
      		InternalProjectSettings[key] = page.extensions[key];
      	}
      }
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (HTMLHelper.getNextSibling(document.head).tagName == 'HEAD') HTMLHelper.getNextSibling(document.head).remove();
      
      for (let key of BACKEND_DATA_EXTENSIONS) {
      	if (page.extensions.hasOwnProperty(key)) {
        	InternalProjectSettings[key] = page.extensions[key] && page.extensions[key].join('\n') || null;
        }
      }
      
      WorkspaceHelper.updateInPageComponents();
      WorkspaceHelper.updateInheritingComponents();
      MalformationRepairHelper.repair();
      
      FontHelper.initializeFontData(page.head.fonts);
      StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      AnimationHelper.initializeStylesheetData(InternalAnimations);
      
      HTMLHelper.getElementById('internal-fsb-stylesheet-settings').disabled = true;
      Accessories.overlay.setEnable(false);
      
      EditorHelper.init(true, updateUI);
    } else if (InternalProjectSettings.currentMode == 'data') {
      document.body.outerHTML = (InternalDataFlows.default || DEFAULT_ABSOLUTE_PAGE_HTML).join('\n');
            
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (HTMLHelper.getNextSibling(document.head).tagName == 'HEAD') HTMLHelper.getNextSibling(document.head).remove();
      
      HTMLHelper.getElementById('internal-fsb-stylesheet-settings').disabled = false;
      Accessories.overlay.setEnable(true);
      
      EditorHelper.init(false, updateUI);
    } else if (InternalProjectSettings.currentMode == 'services') {
      document.body.outerHTML = (InternalServices.default || DEFAULT_ABSOLUTE_PAGE_HTML).join('\n');
            
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (HTMLHelper.getNextSibling(document.head).tagName == 'HEAD') HTMLHelper.getNextSibling(document.head).remove();
      
      HTMLHelper.getElementById('internal-fsb-stylesheet-settings').disabled = false;
      Accessories.overlay.setEnable(false);
      
      EditorHelper.init(false, updateUI);
    } else if (InternalProjectSettings.currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
      
      let component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
      if (component == null) return;
      
      document.body.outerHTML = (DEFAULT_SINGLE_ITEM_EDITING_HTML).join('\n');
      document.body.firstElementChild.firstElementChild.innerHTML = (component.html || DEFAULT_COMPONENT_HTML).join('\n');
      
      HTMLHelper.setAttribute(document.body.firstElementChild.firstElementChild.firstElementChild, 'internal-fsb-guid', InternalProjectSettings.editingComponentID);
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (HTMLHelper.getNextSibling(document.head).tagName == 'HEAD') HTMLHelper.getNextSibling(document.head).remove();
      
      WorkspaceHelper.updateInPageComponents();
      WorkspaceHelper.updateInheritingComponents();
      MalformationRepairHelper.repair();
      
      StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      AnimationHelper.initializeStylesheetData(InternalAnimations);
      
      HTMLHelper.getElementById('internal-fsb-stylesheet-settings').disabled = true;
      Accessories.overlay.setEnable(false);
      
      EditorHelper.init(false, updateUI);
    } else if (InternalProjectSettings.currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
      
      let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
      if (popup == null) return;
      
      document.body.outerHTML = (DEFAULT_SINGLE_ITEM_EDITING_HTML).join('\n');
      document.body.firstElementChild.firstElementChild.innerHTML = (popup.html || DEFAULT_POPUP_HTML).join('\n');
      
      HTMLHelper.setAttribute(document.body.firstElementChild.firstElementChild.firstElementChild, 'internal-fsb-guid', InternalProjectSettings.editingPopupID)
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (HTMLHelper.getNextSibling(document.head).tagName == 'HEAD') HTMLHelper.getNextSibling(document.head).remove();
      
      WorkspaceHelper.updateInPageComponents();
      WorkspaceHelper.updateInheritingComponents();
      MalformationRepairHelper.repair();
      
      StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      AnimationHelper.initializeStylesheetData(InternalAnimations);
      
      HTMLHelper.getElementById('internal-fsb-stylesheet-settings').disabled = true;
      Accessories.overlay.setEnable(false);
      
      EditorHelper.init(false, updateUI);
    }
    
    WorkspaceHelper.migrateCode();
    
    LayoutHelper.invalidate();
    TimelineHelper.invalidate();
    SchemaHelper.invalidate();
  },
  saveWorkspaceData: (reinit: boolean=true, force: boolean=false) => {
  	HTMLHelper.sortAttributes();
  	
    if (InternalProjectSettings.currentMode == 'site') {
      if (InternalProjectSettings.editingPageID == null) return;
      
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      let clonedPage = CodeHelper.clone(page);
      
      page.head.fonts = FontHelper.generateFontData();
      
      let selectingElement = EditorHelper.getSelectingElement();
      page.accessories.selectingElementGUID = selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      page.accessories.currentCursorWalkPath = CursorHelper.findWalkPathForCursor();
      
      EditorHelper.detach();
      page.body = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupPageHTMLData(document.body.outerHTML)))).split('\n');
      
      page.extensions = {};
      for (let key of BACKEND_DATA_EXTENSIONS) {
      	if (InternalProjectSettings.hasOwnProperty(key)) {
        	page.extensions[key] = InternalProjectSettings[key] && InternalProjectSettings[key].split('\n') || null;
        }
      }
      
      page.notations = SchemaHelper.generateTreeOfDotNotations();
      
      if (reinit) {
        EditorHelper.init(true, false);
        
        FontHelper.initializeFontData(page.head.fonts);
      	StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      	AnimationHelper.initializeStylesheetData(InternalAnimations);
      }
      
      if (force || !CodeHelper.equals(clonedPage, page)) {
      	cacheOfGeneratedFrontEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateFrontEndCodeForCurrentPage();
      	cacheOfGeneratedBackEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateBackEndCodeForCurrentPage();
      }
    } else if (InternalProjectSettings.currentMode == 'data') {
      EditorHelper.detach();
      InternalDataFlows.default = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupPageHTMLData(document.body.outerHTML)))).split('\n');
      Accessories.overlay.setEnable(true);
      
      InternalDataFlows.schema = SchemaHelper.generateDataSchema();
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    } else if (InternalProjectSettings.currentMode == 'services') {
      EditorHelper.detach();
      InternalServices.default = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupPageHTMLData(document.body.outerHTML)))).split('\n');
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    } else if (InternalProjectSettings.currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
    	
    	let component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
    	
      component.html = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupComponentHTMLData(HTMLHelper.getElementsByClassName('internal-fsb-element')[0].outerHTML)))).split('\n');
    } else if (InternalProjectSettings.currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
    	
    	let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
    	
      popup.html = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupComponentHTMLData(HTMLHelper.getElementsByClassName('internal-fsb-element')[0].outerHTML)))).split('\n');
    }
  },
  removeComponentData: (id: string) => {
    delete InternalComponents[id];
    InternalProjectSettings.components = InternalProjectSettings.components.filter(component => component.id != id);
  },
  addOrReplaceComponentData: (id: string, name: string, namespace: string, klass: string, html: string) => {
  	InternalComponents[id] = {
      namespace: namespace,
      klass: klass,
      html: merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupComponentHTMLData(html || '')))).split('\n')
    };
    
    let existingComponentInfo = InternalProjectSettings.components.filter(component => component.id == id)[0];
    if (!existingComponentInfo) {
      InternalProjectSettings.components.push({
        id: id,
        name: name,
        state: 'create'
      });
    }
    
    WorkspaceHelper.updateInheritingComponents();
  },
  cleanupComponentHTMLData: (html: string) => {
  	let holder = document.createElement('div');
    holder.innerHTML = html;
    
    let accessories = [...HTMLHelper.getElementsByClassName('internal-fsb-accessory', holder)];
    accessories.forEach(accessory => accessory.parentNode.removeChild(accessory));
    
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', holder)].reverse();
    for (let component of components) {
    	component.innerHTML = '';
    }
    
    return holder.innerHTML;
  },
  cleanupPageHTMLData: (html: string, preview: boolean=false) => {
  	let holder = document.createElement('iframe');
  	document.body.appendChild(holder);
  	
  	let holderWindow = holder.contentWindow || holder.contentDocument.document || holder.contentDocument;
  	
    holderWindow.document.open('text/htmlreplace');
    holderWindow.document.write(`<html><head></head>${html}</html>`);
    holderWindow.document.close();
    
    let accessories = [...HTMLHelper.getElementsByClassName('internal-fsb-accessory', holderWindow.document)];
    accessories.forEach(accessory => accessory.parentNode.removeChild(accessory));
    
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', holderWindow.document)].reverse();
    for (let component of components) {
    	component.innerHTML = '';
    }
    
    components = [...HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-react-mode', 'Site', holderWindow.document), ...HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-react-mode', 'Global', holderWindow.document)].reverse();
    for (let component of components) {
    	component.innerHTML = '';
    	
    	let attributes = [...component.attributes || []].reverse();
    	for (let attribute of attributes) {
    		if (attribute.name.indexOf('internal-fsb-') != -1 && INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES.indexOf(attribute.name) == -1) {
    			HTMLHelper.removeAttribute(component, attribute.name);
    		}
    	}
    }
    
    document.body.removeChild(holder);
    
    return holderWindow.document.body.outerHTML;
  },
  migrateCode: () => {
  	let element = document.getElementById('internal-fsb-stylesheet');
  	if (element) element.className = 'internal-fsb-accessory';
  },
  recursiveCleanupComponentPreviewDOM: (element: HTMLElement, first: boolean=false) => {
  	if (!first) {
	    if (HTMLHelper.hasClass(element, 'internal-fsb-element')) {
	    	HTMLHelper.addClass(element, 'internal-fsb-inheriting-element');
	  		HTMLHelper.removeClass(element, 'internal-fsb-element');
	    }
	    HTMLHelper.removeClass(element, 'internal-fsb-allow-cursor');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-react-mode');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-react-command');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-react-namespace');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-react-class');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-react-id');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-react-data');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-class');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-guid');
	    HTMLHelper.removeAttribute(element, 'internal-fsb-inheriting');
  	}
  	
  	let elements = [...element.children];
  	for (let _element of elements) {
    	WorkspaceHelper.recursiveCleanupComponentPreviewDOM(_element);
	  }
  },
  updateInPageComponents: () => {
    for (let _component of InternalProjectSettings.components) {
      let component = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', _component.id);
      if (component) {
	      let componentInfo = WorkspaceHelper.getComponentData(_component.id);
	      if (componentInfo) {
		      let element = document.createElement('div');
		      let parentNode = component.parentNode;
		      element.innerHTML = componentInfo.html.join('\n');
		      let firstElementChild = element.firstElementChild;
		      parentNode.insertBefore(firstElementChild, component);
		      parentNode.removeChild(component);
	      }
	    }
    }
 	},
  updateInheritingComponents: (container: HTMLElement=document.body) => {
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', container)];
    let selectedElement = EditorHelper.getSelectingElement();
    
    for (let component of components) {
    	let isSelecting = (component == selectedElement);
      let reservedAttributeValues = INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES.map((name) => {
        return HTMLHelper.getAttribute(component, name);
      });
      
      let componentInfo = WorkspaceHelper.getComponentData(reservedAttributeValues[0]);
      if (!componentInfo) continue;
      
      let isForwardingStyleToChildren = (FORWARD_STYLE_TO_CHILDREN_CLASS_LIST.indexOf(HTMLHelper.getAttribute(component, 'internal-fsb-class')) != -1);
      
      let element = document.createElement('div');
      let parentNode = component.parentNode;
      element.innerHTML = WorkspaceHelper.cleanupComponentHTMLData(componentInfo.html.join('\n'));
      let firstElementChild = element.firstElementChild;
      parentNode.insertBefore(firstElementChild, component);
      parentNode.removeChild(component);
      component = firstElementChild;
      
      for (let i=0; i<INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES.length; i++) {
        if (reservedAttributeValues[i]) {
	        if (INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i] == 'class') {
	          let previous = reservedAttributeValues[i];
	          let next = HTMLHelper.getAttribute(component, 'class') || '';
	          
	          let sizeMatches = previous.match(ALL_RESPONSIVE_SIZE_REGEX) || [];
	          let offsetMatches = previous.match(ALL_RESPONSIVE_OFFSET_REGEX) || [];
	          
	          next = next.replace(ALL_RESPONSIVE_SIZE_REGEX, '').replace(ALL_RESPONSIVE_OFFSET_REGEX, '');
	          next = [...sizeMatches, ...offsetMatches, next].join(' ');
	          
	          HTMLHelper.setAttribute(component, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i], next);
	        } else if (INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i] == 'style') {
	        	if (!isForwardingStyleToChildren) {
		        	let previous = HTMLHelper.getHashMapFromInlineStyle(reservedAttributeValues[i]);
		        	let next = HTMLHelper.getHashMapFromInlineStyle(HTMLHelper.getAttribute(component, 'style'));
		        	
		        	for (let reservedStyleName of INHERITING_COMPONENT_RESERVED_STYLE_NAMES) {
		        		next[reservedStyleName] = previous[reservedStyleName];
		        	}
		        	
		        	HTMLHelper.setAttribute(component, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i], HTMLHelper.getInlineStyleFromHashMap(next));
		        } else {
		        	HTMLHelper.setAttribute(component, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i], reservedAttributeValues[i]);
		        }
	        } else {
	          HTMLHelper.setAttribute(component, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i], reservedAttributeValues[i]);
	        }
	      } else {
	      	 HTMLHelper.removeAttribute(component, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES[i]);
	      }
      }
      
      CapabilityHelper.installCapabilitiesForInternalElements(component);
      
      WorkspaceHelper.updateInheritingComponents(component);
      WorkspaceHelper.recursiveCleanupComponentPreviewDOM(component, true);
      
      if (isSelecting) EditorHelper.select(component);
    }
  },
  getComponentData: (id: string) => {
    let existingComponentInfo = InternalProjectSettings.components.filter(component => component.id == id)[0];
    if (!existingComponentInfo) return null;
    
    InternalComponents[id] = InternalComponents[id] || CodeHelper.clone(existingComponentInfo) || {};
    
    Object.assign(InternalComponents[id], existingComponentInfo);
    
    return InternalComponents[id];
  },
  getPopupData: (id: string) => {
    let existingPopupInfo = InternalProjectSettings.popups.filter(popup => popup.id == id)[0];
    if (!existingPopupInfo) return null;
    
    InternalPopups[id] = InternalPopups[id] || CodeHelper.clone(existingPopupInfo) || {};
    
    Object.assign(InternalPopups[id], existingPopupInfo);
    
    return InternalPopups[id];
  },
  getPageData: (id: String) => {
  	let existingPageInfo = InternalProjectSettings.pages.filter(page => page.id == id)[0];
    if (!existingPageInfo) return null;
    
    InternalSites[id] = InternalSites[id] || CodeHelper.clone(existingPageInfo) || {};
    
    Object.assign(InternalSites[id], existingPageInfo);
    
    InternalSites[id].head = InternalSites[id].head || {};
    InternalSites[id].head.fonts = InternalSites[id].head.fonts || {};
    InternalSites[id].body = InternalSites[id].body || DEFAULT_FLOW_PAGE_HTML;
    InternalSites[id].accessories = InternalSites[id].accessories || {};
    InternalSites[id].extensions = InternalSites[id].extensions || CodeHelper.clone(DEFAULT_PAGE_EXTENSIONS);
    
    return InternalSites[id];
  },
  getDataFlows: () => {
  	return InternalDataFlows.schema;
 	},
  generateFrontEndCodeForCurrentPage: () => {
    let results = FrontEndDOMHelper.generateFrontEndCode();
  	results.push([StylesheetHelper.renderStylesheet(true), AnimationHelper.renderStylesheet(true, false)].join(' '));
  	
  	return results;
  },
  generateBackEndCodeForCurrentPage: () => {
    let results = BackEndDOMHelper.generateBackEndCode();
  	
  	return results;
  },
  generateFrontEndCodeForAllPages: () => {
    cacheOfGeneratedFrontEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateFrontEndCodeForCurrentPage();
    
    return cacheOfGeneratedFrontEndCodeForAllPages;
  },
  generateBackEndCodeForAllPages: () => {
  	cacheOfGeneratedBackEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateBackEndCodeForCurrentPage();
    
    return cacheOfGeneratedBackEndCodeForAllPages;
 	},
 	clearFullStackCodeForAllPages: (data: any) => {
 		cacheOfGeneratedFrontEndCodeForAllPages = {};
 		cacheOfGeneratedBackEndCodeForAllPages = {};
    
    backEndControllerBlobSHADict = data.backEndControllerBlobSHADict || {};
    frontEndComponentsBlobSHADict = data.frontEndComponentsBlobSHADict || {};
    viewBlobSHADict = data.viewBlobSHADict || {};
    routeBlobSHA = data.routeBlobSHA || null;
    controllerBlobSHA = data.controllerBlobSHA || null;
    siteBundleBlobSHA = data.siteBundleBlobSHA || null;
 	},
  getCommonExpandingFeatureScripts: () => {
  	let container = document.createElement('div');
  	
  	for (let key in InternalComponents) {
  		if (InternalComponents.hasOwnProperty(key)) {
  			let element = document.createElement('div');
  			element.innerHTML = InternalComponents[key].html.join('\n');
  			
  			container.appendChild(element);
  		}
  	}
  	for (let key in InternalPopups) {
  		if (InternalPopups.hasOwnProperty(key)) {
  			let element = document.createElement('div');
  			element.innerHTML = InternalPopups[key].html.join('\n');
  			
  			container.appendChild(element);
  		}
  	}
  	
  	let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet;
  	[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = FrontEndDOMHelper.generateFrontEndCode(container);
  	
  	return combinedExpandingFeatureScripts || '';
  }
}

export {InternalProjectSettings, WorkspaceHelper}; 