import {CodeHelper} from '../../helpers/CodeHelper';
import {FontHelper} from '../../helpers/FontHelper';
import {HTMLHelper} from '../../helpers/HTMLHelper';
import {TextHelper} from '../../helpers/TextHelper';
import {BackEndScriptHelper} from '../../helpers/BackEndScriptHelper';
import {RandomHelper} from '../../helpers/RandomHelper';
import {Accessories, EditorHelper} from './EditorHelper';
import {CapabilityHelper} from './CapabilityHelper';
import {StylesheetHelper} from './StylesheetHelper';
import {AnimationHelper} from './AnimationHelper';
import {CursorHelper} from './CursorHelper';
import {FrontEndDOMHelper} from './FrontEndDOMHelper';
import {BackEndDOMHelper} from './BackEndDOMHelper';
import {SchemaHelper} from './SchemaHelper';
import {LayoutHelper} from './LayoutHelper';
import {TimelineHelper} from './TimelineHelper';
import {StatusHelper} from './StatusHelper';
import {MalformationRepairHelper} from './MalformationRepairHelper';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, FORWARD_STYLE_TO_CHILDREN_CLASS_LIST, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES, INHERITING_COMPONENT_RESERVED_STYLE_NAMES, BACKEND_DATA_EXTENSIONS, CAMEL_OF_EVENTS_DICTIONARY} from '../../Constants';

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
  editingSelector: null,
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
let version = 1.3;

const DEFAULT_FLOW_PAGE_HTML = `<body><div class="internal-fsb-begin" internal-fsb-guid="0"><div class="internal-fsb-strict-layout internal-fsb-begin-layout internal-fsb-allow-cursor"></div></div></body>`.split('\n');
const DEFAULT_SINGLE_ITEM_EDITING_HTML = `<body><div class="internal-fsb-begin" internal-fsb-guid="0"><div class="internal-fsb-strict-layout internal-fsb-begin-layout"></div></div></body>`.split('\n');
const DEFAULT_ABSOLUTE_PAGE_HTML = `<body class="internal-fsb-disabled-guide"><div class="internal-fsb-begin" internal-fsb-guid="0" style="height: 100%;"><div class="internal-fsb-absolute-layout internal-fsb-begin-layout internal-fsb-allow-cursor" style="height: 100%;"></div></div></body>`.split('\n');
const DEFAULT_COMPONENT_HTML = `<div class="col-4 internal-fsb-element internal-fsb-strict-layout internal-fsb-allow-cursor" internal-fsb-name="Component" internal-fsb-event-no-propagate="1" internal-fsb-class="FlowLayout" internal-fsb-react-mode="Site" style="padding-left: 0px; padding-right: 0px"></div>`.split('\n');
const DEFAULT_POPUP_HTML = `<div class="internal-fsb-element" internal-fsb-class="Popup" style="height: 100vh; left: 0px; position: fixed; top: 0px; width: 100vw" internal-fsb-event-no-propagate="1" internal-fsb-name="Screen" internal-fsb-react-mode="Site" style="padding-left: 0px; padding-right: 0px"><div class="container-fluid" internal-fsb-event-no-propagate="1"><div class="internal-fsb-allow-cursor internal-fsb-strict-layout row"><div class="col-8 internal-fsb-element internal-fsb-inverse offset-2" internal-fsb-name="Center" internal-fsb-event-no-propagate="1" internal-fsb-class="FlowLayout" style="-ms-flex-direction: column; -webkit-flex-direction: column; -webkit-justify-content: center; flex-direction: column; height: 100vh; justify-content: center; padding-left: 0px; padding-right: 0px"><div class="container-fluid" internal-fsb-event-no-propagate="1"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"><div class="internal-fsb-element" internal-fsb-name="Dialog" internal-fsb-event-no-propagate="1" internal-fsb-class="FlowLayout" style="min-height: 400px; padding-left: 0px; padding-right: 0px"><div class="container-fluid" internal-fsb-event-no-propagate="1"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div></div></div></div></div></div></div>`.split('\n');
const DEFAULT_PAGE_EXTENSIONS = {};

var WorkspaceHelper = {
  generateWorkspaceData: (removeSHADict: boolean=false) => {
    WorkspaceHelper.saveWorkspaceData(true, true);
    
    let clonedInternalProjectSettings = CodeHelper.clone(InternalProjectSettings);
    for (let key of BACKEND_DATA_EXTENSIONS) {
      delete clonedInternalProjectSettings[key];
    }
    
    clonedInternalProjectSettings.currentMode = 'site';
    clonedInternalProjectSettings.editingPageID = 'index';
    clonedInternalProjectSettings.editingComponentID = null;
    clonedInternalProjectSettings.editingPopupID = null;
	  clonedInternalProjectSettings.editingAnimationID = null;
	  clonedInternalProjectSettings.editingKeyframeID = null;
	  clonedInternalProjectSettings.editingSelector = null;
    
    let clonedInternalSites = CodeHelper.clone(InternalSites);
    for (let key in clonedInternalSites) {
  		if (clonedInternalSites.hasOwnProperty(key)) {
  			clonedInternalSites[key].accessories = {};
  		}
  	}
    
    let clonedInternalComponents = CodeHelper.clone(InternalComponents);
    for (let key in clonedInternalComponents) {
  		if (clonedInternalComponents.hasOwnProperty(key)) {
  			clonedInternalComponents[key].accessories = {};
  		}
  	}
    
    let clonedInternalPopups = CodeHelper.clone(InternalPopups);
    for (let key in clonedInternalPopups) {
  		if (clonedInternalPopups.hasOwnProperty(key)) {
  			clonedInternalPopups[key].accessories = {};
  		}
  	}
    
    return Object.assign(
    	{
	    	version: version,
	      globalSettings: clonedInternalProjectSettings,
	      sites: clonedInternalSites,
	      components: clonedInternalComponents,
	      popups: clonedInternalPopups,
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
        InternalDataFlows.default = html_beautify(InternalDataFlows.default || DEFAULT_ABSOLUTE_PAGE_HTML).split('\n');
        InternalServices.default = html_beautify(InternalServices.default || DEFAULT_ABSOLUTE_PAGE_HTML).split('\n');
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
      if (!data.version || data.version <= 1.2) {
      	if (InternalDataFlows.default.join('') === '') InternalDataFlows.default = CodeHelper.clone(DEFAULT_ABSOLUTE_PAGE_HTML);
      	if (InternalServices.default.join('') === '') InternalServices.default = CodeHelper.clone(DEFAULT_ABSOLUTE_PAGE_HTML);
      }
    }
    
    WorkspaceHelper.loadWorkspaceData();
    EditorHelper.updateEditorProperties();
  },
  setMode: (mode: string) => {
  	if (InternalProjectSettings.currentMode == mode) return;
  
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
  getAllUsingFonts: () => {
    let usingFonts = {};
    
    for (let key in InternalSites) {
      if (InternalSites.hasOwnProperty(key)) {
        let page = WorkspaceHelper.getPageData(key);
        if (page == null) continue;
        
        Object.assign(usingFonts, page.head.fonts || {});
      }
    }
    
    return usingFonts;
  },
  loadWorkspaceData: (updateUI: boolean=false) => {
    if (InternalProjectSettings.currentMode == 'site') {
      if (InternalProjectSettings.editingPageID == null) return;
      
      if (!WorkspaceHelper.loadPageData(InternalProjectSettings.currentMode, InternalProjectSettings.editingPageID)) return;
      
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      
      FontHelper.initializeFontData(page.head.fonts);
      StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      AnimationHelper.initializeStylesheetData(InternalAnimations);
      
      Accessories.overlay.setEnable(false);
    } else if (InternalProjectSettings.currentMode == 'data') {
      WorkspaceHelper.loadPageData(InternalProjectSettings.currentMode, null);
      
      let accessories = [...HTMLHelper.getElementsByClassName('internal-fsb-accessory', document.body)];
    	accessories.forEach(accessory => accessory.parentNode.removeChild(accessory));
      
      Accessories.overlay.setEnable(true);
    } else if (InternalProjectSettings.currentMode == 'services') {
      WorkspaceHelper.loadPageData(InternalProjectSettings.currentMode, null);
      
      Accessories.overlay.setEnable(false);
    } else if (InternalProjectSettings.currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
      
      if (!WorkspaceHelper.loadPageData(InternalProjectSettings.currentMode, InternalProjectSettings.editingComponentID)) return;
      
      HTMLHelper.setAttribute(document.body.firstElementChild.firstElementChild.firstElementChild, 'internal-fsb-guid', InternalProjectSettings.editingComponentID);
      
      FontHelper.initializeFontData(WorkspaceHelper.getAllUsingFonts());
      StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      AnimationHelper.initializeStylesheetData(InternalAnimations);
      
      Accessories.overlay.setEnable(false);
    } else if (InternalProjectSettings.currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
      
      if (!WorkspaceHelper.loadPageData(InternalProjectSettings.currentMode, InternalProjectSettings.editingPopupID)) return;
      
      let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
      
      HTMLHelper.setAttribute(document.body.firstElementChild.firstElementChild.firstElementChild, 'internal-fsb-guid', InternalProjectSettings.editingPopupID);
      
      if (!popup.html) {
      	const elements = HTMLHelper.getElementsByClassName('internal-fsb-element', document.body.firstElementChild.firstElementChild.firstElementChild);
      	
      	Array.from(elements).forEach((element) => {
      		HTMLHelper.setAttribute(element, 'internal-fsb-guid', RandomHelper.generateGUID());
      	});
      }
      
      FontHelper.initializeFontData(WorkspaceHelper.getAllUsingFonts());
      StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      AnimationHelper.initializeStylesheetData(InternalAnimations);
      
      Accessories.overlay.setEnable(false);
    }
    
    WorkspaceHelper.migrateCode();
    
    LayoutHelper.invalidate();
    TimelineHelper.invalidate();
    SchemaHelper.invalidate();
    StatusHelper.invalidate();
    
    EditorHelper.init(['site'].indexOf(InternalProjectSettings.currentMode) != -1, updateUI);
		
  	HTMLHelper.setAttribute(document.body, 'mode', InternalProjectSettings.currentMode);
  },
  loadPageData: (mode: string, editingID: string, _window: any=window) => {
  	HTMLHelper.sortAttributes(_window.document);
  	
    if (mode == 'site') {
      let page = WorkspaceHelper.getPageData(editingID);
      if (page == null) return false;
      
      WorkspaceHelper.replaceBodyOuterHTML(_window, page.body.join('\n'));
      
      for (let key of BACKEND_DATA_EXTENSIONS) {
      	delete InternalProjectSettings[key];
      	if (page.extensions[key]) {
      		InternalProjectSettings[key] = page.extensions[key];
      	}
      }
      
      for (let key of BACKEND_DATA_EXTENSIONS) {
      	if (page.extensions.hasOwnProperty(key)) {
        	InternalProjectSettings[key] = page.extensions[key] && page.extensions[key].join('\n') || null;
        }
      }
      
      WorkspaceHelper.updateInPageComponents(_window.document.body);
      WorkspaceHelper.updateInheritingComponents(_window.document.body);
      MalformationRepairHelper.repair(_window.document.body);
      
      FontHelper.initializeFontData(page.head.fonts, _window);
    } else if (mode == 'data') {
    	WorkspaceHelper.replaceBodyOuterHTML(_window, (InternalDataFlows.default || DEFAULT_ABSOLUTE_PAGE_HTML).join('\n'));
    } else if (mode == 'services') {
    	WorkspaceHelper.replaceBodyOuterHTML(_window, (InternalServices.default || DEFAULT_ABSOLUTE_PAGE_HTML).join('\n'));
    } else if (mode == 'components') {
      let component = WorkspaceHelper.getComponentData(editingID);
      if (component == null) return false;
      
      WorkspaceHelper.replaceBodyOuterHTML(_window, (DEFAULT_SINGLE_ITEM_EDITING_HTML).join('\n'));
      
      _window.document.body.firstElementChild.firstElementChild.innerHTML = (component.html || DEFAULT_COMPONENT_HTML).join('\n');
      
      WorkspaceHelper.updateInPageComponents(_window.document.body);
      WorkspaceHelper.updateInheritingComponents(_window.document.body);
      MalformationRepairHelper.repair(_window.document.body);
    } else if (mode == 'popups') {
      let popup = WorkspaceHelper.getPopupData(editingID);
      if (popup == null) return false;
      
      WorkspaceHelper.replaceBodyOuterHTML(_window, (DEFAULT_SINGLE_ITEM_EDITING_HTML).join('\n'));
      
      _window.document.body.firstElementChild.firstElementChild.innerHTML = (popup.html || DEFAULT_POPUP_HTML).join('\n');
      
      WorkspaceHelper.updateInPageComponents(_window.document.body);
      WorkspaceHelper.updateInheritingComponents(_window.document.body);
      MalformationRepairHelper.repair(_window.document.body);
    }
    
    return true;
  },
  saveWorkspaceData: (reinit: boolean=true, force: boolean=false) => {
  	HTMLHelper.sortAttributes();
  	
  	HTMLHelper.removeAttribute(document.body, 'mode');
  	
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
      page.automaticSchemata = SchemaHelper.generateAutomaticSchemata();
      page.references = WorkspaceHelper.getAllReferencingKlasses();
      
      if (reinit) {
        FontHelper.initializeFontData(page.head.fonts);
      	StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      	AnimationHelper.initializeStylesheetData(InternalAnimations);
      }
      
      if (force || !CodeHelper.equals(clonedPage, page)) {
      	cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()] = WorkspaceHelper.generateFrontEndCodeForCurrentPage()
      		|| cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()];
      	cacheOfGeneratedBackEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateBackEndCodeForID(InternalProjectSettings.editingPageID);
      }
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    } else if (InternalProjectSettings.currentMode == 'data') {
      EditorHelper.detach();
      InternalDataFlows.default = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupPageHTMLData(document.body.outerHTML)))).split('\n');
      
      // Need mode setting before re-render overlay.
      // 
      HTMLHelper.setAttribute(document.body, 'mode', InternalProjectSettings.currentMode);
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
    	let previous = component.html;
    	
    	const element = HTMLHelper.getElementsByClassName('internal-fsb-element')[0];
    	
      component.html = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupComponentHTMLData(element.outerHTML)))).split('\n');
      component.namespace = HTMLHelper.getAttribute(element, 'internal-fsb-react-namespace') || 'Project.Controls';
      component.klass = HTMLHelper.getAttribute(element, 'internal-fsb-react-class') ||
      	(HTMLHelper.getAttribute(element, 'internal-fsb-class') + '_' + HTMLHelper.getAttribute(element, 'internal-fsb-guid'));
      component.references = WorkspaceHelper.getAllReferencingKlasses();
      
      let selectingElement = EditorHelper.getSelectingElement();
      component.accessories.selectingElementGUID = selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      component.accessories.currentCursorWalkPath = CursorHelper.findWalkPathForCursor();
      
      if (reinit) {
        FontHelper.initializeFontData(WorkspaceHelper.getAllUsingFonts());
      	StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      	AnimationHelper.initializeStylesheetData(InternalAnimations);
      }
      
      if (force || component.html != previous) {
      	cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()] = WorkspaceHelper.generateFrontEndCodeForCurrentPage()
      		|| cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()];
        WorkspaceHelper.generateFrontEndCodeForAnyReferencingComponentsOrPopups();
      	WorkspaceHelper.generateBackEndCodeForAnyReferencingComponentsOrPopups();
      }
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    } else if (InternalProjectSettings.currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
    	
    	let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
    	let previous = popup.html;
    	
    	const element = HTMLHelper.getElementsByClassName('internal-fsb-element')[0];
    	
      popup.html = merging_beautify(html_beautify(TextHelper.removeMultipleBlankLines(WorkspaceHelper.cleanupComponentHTMLData(element.outerHTML)))).split('\n');
      popup.namespace = HTMLHelper.getAttribute(element, 'internal-fsb-react-namespace') || 'Project.Controls';
      popup.klass = HTMLHelper.getAttribute(element, 'internal-fsb-react-class') ||
      	(HTMLHelper.getAttribute(element, 'internal-fsb-class') + '_' + HTMLHelper.getAttribute(element, 'internal-fsb-guid'));
      popup.references = WorkspaceHelper.getAllReferencingKlasses();
      
      let selectingElement = EditorHelper.getSelectingElement();
      popup.accessories.selectingElementGUID = selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      popup.accessories.currentCursorWalkPath = CursorHelper.findWalkPathForCursor();
      
      if (reinit) {
        FontHelper.initializeFontData(WorkspaceHelper.getAllUsingFonts());
      	StylesheetHelper.initializeStylesheetData(InternalStylesheets);
      	AnimationHelper.initializeStylesheetData(InternalAnimations);
      }
      
      if (force || popup.html != previous) {
      	cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()] = WorkspaceHelper.generateFrontEndCodeForCurrentPage()
      		|| cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()];
      	WorkspaceHelper.generateFrontEndCodeForAnyReferencingComponentsOrPopups();
      	WorkspaceHelper.generateBackEndCodeForAnyReferencingComponentsOrPopups();
      }
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    }
    
    HTMLHelper.setAttribute(document.body, 'mode', InternalProjectSettings.currentMode);
  },
  replaceBodyOuterHTML: (window: any, html: string) => {
  	const document = window.document;
  
    while(document.body.attributes.length > 0) document.body.removeAttribute(document.body.attributes[0].name);
    
    const container = document.createElement('div');
    container.innerHTML = html.replace(/^\<body/, '<div').replace(/body\>$/, 'div>');
    
    while(container.firstChild.attributes.length > 0) {
      document.body.setAttribute(container.firstChild.attributes[0].name, container.firstChild.attributes[0].value);
      container.firstChild.removeAttribute(container.firstChild.attributes[0].name);
    }
    
    while(document.body.children.length != 0) document.body.removeChild(document.body.firstChild);
    while(container.firstChild.children.length != 0) document.body.appendChild(container.firstChild.firstChild);
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
    
    const selecting = HTMLHelper.getElementByClassName('internal-fsb-selecting', holder);
    if (selecting) HTMLHelper.removeClass(selecting, 'internal-fsb-selecting');
    
    const walking = HTMLHelper.getElementByClassName('internal-fsb-walking', holder);
    if (walking) HTMLHelper.removeClass(walking, 'internal-fsb-walking');
    
    return holder.innerHTML;
  },
  cleanupPageHTMLData: (html: string, preview: boolean=false) => {
  	let holder = document.createElement('iframe');
  	document.body.appendChild(holder);
  	
  	let holderWindow = holder.contentWindow || holder.contentDocument.document || holder.contentDocument;
  	
    holderWindow.document.open('text/htmlreplace');
    if (document.domain == 'stackblend.org') holderWindow.document.write(`<html><head><script type="text/javascript">document.domain = '${document.domain}';</script></head>${html}</html>`);
    else holderWindow.document.write(`<html><head></head>${html}</html>`);
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
    
    const selectings = Array.from(HTMLHelper.getElementsByClassName('internal-fsb-selecting', holder));
    for (const selecting of selectings) {
    	HTMLHelper.removeClass(selecting, 'internal-fsb-selecting');
    }
    
    const walkings = Array.from(HTMLHelper.getElementsByClassName('internal-fsb-walking', holder));
    for (const walking of walkings) {
   		HTMLHelper.removeClass(walking, 'internal-fsb-walking');
   	}
    
    const outerHTML = holderWindow.document.body.outerHTML;
    document.body.removeChild(holder);
    
    return outerHTML;
  },
  migrateCode: () => {
  	let element = document.getElementById('internal-fsb-stylesheet');
  	if (element) element.className = 'internal-fsb-accessory';
  },
  getAllReferencingKlasses: () => {
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', document.body)].map((element: any) => {
      return HTMLHelper.getAttribute(element, 'internal-fsb-inheriting');
    });
    let inPageComponents = [...HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-react-mode', 'Site', document.body)]
      .filter((element: any) => {
        return HTMLHelper.getAttribute(element, 'internal-fsb-inheriting') == null;
      })
      .map((element: any) => {
        return HTMLHelper.getAttribute(element, 'internal-fsb-guid');
      });
    let popups = [...HTMLHelper.getElementsByAttribute('internal-fsb-popup-init-class', document.body)].map((element: any) => {
      return WorkspaceHelper.getPopupKeyFromPath(HTMLHelper.getAttribute(element, 'internal-fsb-popup-init-class'));
    });
    
    return Array.from(new Set([...components, ...inPageComponents, ...popups]));
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
	    
	    if (HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', HTMLHelper.getAttribute(element, 'internal-fsb-guid')).length > 1) {
	    	HTMLHelper.removeAttribute(element, 'internal-fsb-class');
	    	HTMLHelper.removeAttribute(element, 'internal-fsb-guid');
	    }
	    
	    HTMLHelper.removeAttribute(element, 'internal-fsb-inheriting');
  	}
  	
  	let elements = [...element.children];
  	for (let _element of elements) {
    	WorkspaceHelper.recursiveCleanupComponentPreviewDOM(_element);
	  }
  },
  updateInPageComponents: (container: HTMLElement=document.body) => {
    for (let _component of InternalProjectSettings.components) {
      let component = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', _component.id, container);
      if (component && (InternalProjectSettings.currentMode != 'components' || component != document.body.firstElementChild.firstElementChild.firstElementChild)) {
	      let componentInfo = WorkspaceHelper.getComponentData(_component.id);
	      if (componentInfo) {
		      let element = document.createElement('div');
		      let parentNode = component.parentNode;
		      element.innerHTML = (componentInfo.html || DEFAULT_COMPONENT_HTML).join('\n');
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
      element.innerHTML = WorkspaceHelper.cleanupComponentHTMLData((componentInfo.html || DEFAULT_COMPONENT_HTML).join('\n'));
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
    
    InternalComponents[id].accessories = InternalComponents[id].accessories || {};
    
    return InternalComponents[id];
  },
  getPopupData: (id: string) => {
    let existingPopupInfo = InternalProjectSettings.popups.filter(popup => popup.id == id)[0];
    if (!existingPopupInfo) return null;
    
    InternalPopups[id] = InternalPopups[id] || CodeHelper.clone(existingPopupInfo) || {};
    
    Object.assign(InternalPopups[id], existingPopupInfo);
    
    InternalPopups[id].accessories = InternalPopups[id].accessories || {};
    
    return InternalPopups[id];
  },
  getPopupKeyFromPath: (path: string): string => {
    for (let key in InternalPopups) {
    	if (InternalPopups.hasOwnProperty(key)) {
    		if (`${InternalPopups[key]['namespace']}.${InternalPopups[key]['klass']}` == path) {
    			return key;
    		}
    	}
    }
    
    return null;
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
  	if (['site', 'components', 'popups'].indexOf(InternalProjectSettings.currentMode) != -1) return WorkspaceHelper.generateFrontEndCodeForID();
  	else return null;
  },
  generateFrontEndCodeForAnyReferencingComponentsOrPopups: () => {
    if (['components', 'popups'].indexOf(InternalProjectSettings.currentMode) != -1) {
    	let referencing = [WorkspaceHelper.getCurrentGenerateFrontEndKey()];
    	let refreshed = [];
    	
    	while (referencing.length != 0) {
    		const reference = referencing[0];
    		referencing.splice(0, 1);
    		refreshed.push(reference);
    		
    		for (let key in InternalComponents) {
	        if (InternalComponents.hasOwnProperty(key)) {
	          if (InternalComponents[key].references) {
	          	if (InternalComponents[key].references.indexOf(reference) != -1) {
	          		referencing.push(key);
	          		referencing = referencing.filter(reference => refreshed.indexOf(reference) == -1);
	          		
	          		cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey('components', key)] = WorkspaceHelper.generateFrontEndCodeForID('components', key);
	          	}
	          }
	        }
	      }
	      for (let key in InternalPopups) {
	        if (InternalPopups.hasOwnProperty(key)) {
	          if (InternalPopups[key].references) {
	          	if (InternalPopups[key].references.indexOf(reference) != -1) {
	          		referencing.push(key);
	          		referencing = referencing.filter(reference => refreshed.indexOf(reference) == -1);
	          		
	          		cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey('popups', key)] = WorkspaceHelper.generateFrontEndCodeForID('popups', key);
	          	}
	          }
	        }
	      }
	      for (let key in InternalSites) {
	        if (InternalSites.hasOwnProperty(key)) {
	          if (InternalSites[key].references) {
	          	if (InternalSites[key].references.indexOf(reference) != -1) {
	          		referencing.push(key);
	          		referencing = referencing.filter(reference => refreshed.indexOf(reference) == -1);
	          		
	          		cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey('site', key)] = WorkspaceHelper.generateFrontEndCodeForID('site', key);
	          	}
	          }
	        }
	      }
	    }
    }
  },
  createTempIframe: () => {
  	const temp = document.createElement('iframe');
		HTMLHelper.setAttribute(temp, 'style', 'visibility: hidden; pointer-events: none;');
		HTMLHelper.setAttribute(temp, 'width', '0');
		HTMLHelper.setAttribute(temp, 'height', '0');
		
  	document.body.appendChild(temp);
		
		const _document = temp.contentDocument || temp.contentWindow.document;
  	
  	_document.open();
		_document.write('<html><head /><body /></html>');
		_document.close();
  	
  	return temp;
  },
  disposeTempIframe: (temp: any) => {
  	const _document = temp.contentDocument || temp.contentWindow.document;
  	
  	_document.open();
		_document.write('<html />');
		_document.close();
		
  	document.body.removeChild(temp);
  },
  generateFrontEndCodeForID: (mode: string=InternalProjectSettings.currentMode, id: string=WorkspaceHelper.getCurrentGenerateFrontEndKey()) => {
    const temp = WorkspaceHelper.createTempIframe();
    const _document = temp.contentDocument || temp.contentWindow.document;
    const _window = _document.defaultView;
    
    WorkspaceHelper.loadPageData(mode, id, _window);
    const results = WorkspaceHelper.generateFrontEndCodeForPage(mode, HTMLHelper.getElementByAttributeNameAndValue("internal-fsb-guid", "0", _window.document.body), true);
    
    WorkspaceHelper.disposeTempIframe(temp);
    
    return results;
  },
  generateFrontEndCodeForPage: (mode: string='site', container: any=document.body, update: boolean=true) => {
    let results = null;
    
  	if (mode == 'site') {
  		const stylesheetAndExtension = AnimationHelper.renderStylesheetAndExtension(true, false);
  		
  		const element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0', container.ownerDocument);
  		const currentAnimationGroup = element && HTMLHelper.getAttribute(element, 'internal-fsb-animation') || '';
  		
  		element && HTMLHelper.setAttribute(element, 'internal-fsb-animation', stylesheetAndExtension[2]);
  		
  		if (update) {
	  		WorkspaceHelper.plugComponentInputs(container);
	  		WorkspaceHelper.updateInPageComponents(container);
	      WorkspaceHelper.updateInheritingComponents(container);
	    }
  		
  		results = FrontEndDOMHelper.generateFrontEndCode(container.ownerDocument, container);
  		
  		if (update) {
  			WorkspaceHelper.unplugComponentInputs(container);
  		}
  		
  		element && HTMLHelper.setAttribute(element, 'internal-fsb-animation', currentAnimationGroup);
  		
  		results.push([StylesheetHelper.renderStylesheet(true), stylesheetAndExtension[0]].join(' '));
  		results.push(stylesheetAndExtension[1]);
  	} else if (['components', 'popups'].indexOf(mode) != -1) {
  		const stylesheetAndExtension = AnimationHelper.renderStylesheetAndExtension(true, false);
  		
  		const element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', '0', container.ownerDocument);
  		const currentAnimationGroup = element && HTMLHelper.getAttribute(element, 'internal-fsb-animation') || '';
  		
  		element && HTMLHelper.setAttribute(element, 'internal-fsb-animation', stylesheetAndExtension[2]);
  		
  		if (update) {
	  		WorkspaceHelper.plugComponentInputs(container);
	  		WorkspaceHelper.updateInPageComponents(container);
	      WorkspaceHelper.updateInheritingComponents(container);
	    }
	    
  		results = FrontEndDOMHelper.generateFrontEndCode(container.ownerDocument, container);
  		
  		if (update) {
  			WorkspaceHelper.unplugComponentInputs(container);
  		}
  		
  		results[0] = false;
  		results[1] = false;
  		results[3] = false;
  		results[4] = false;
  		
  		element && HTMLHelper.setAttribute(element, 'internal-fsb-animation', currentAnimationGroup);
  		
  		results.push([StylesheetHelper.renderStylesheet(true), stylesheetAndExtension[0]].join(' '));
  		results.push(stylesheetAndExtension[1]);
  	}
  	
  	return results;
  },
  generateBackEndCodeForAnyReferencingComponentsOrPopups: () => {
    if (['components', 'popups'].indexOf(InternalProjectSettings.currentMode) != -1) {
    	let referencing = [WorkspaceHelper.getCurrentGenerateFrontEndKey()];
    	let refreshed = [];
    	
    	while (referencing.length != 0) {
    		const reference = referencing[0];
    		referencing.splice(0, 1);
    		refreshed.push(reference);
    		
    		for (let key in InternalComponents) {
	        if (InternalComponents.hasOwnProperty(key)) {
	          if (InternalComponents[key].references) {
	          	if (InternalComponents[key].references.indexOf(reference) != -1) {
	          		referencing.push(key);
	          		referencing = referencing.filter(reference => refreshed.indexOf(reference) == -1);
	          	}
	          }
	        }
	      }
	      for (let key in InternalPopups) {
	        if (InternalPopups.hasOwnProperty(key)) {
	          if (InternalPopups[key].references) {
	          	if (InternalPopups[key].references.indexOf(reference) != -1) {
	          		referencing.push(key);
	          		referencing = referencing.filter(reference => refreshed.indexOf(reference) == -1);
	          	}
	          }
	        }
	      }
	      for (let key in InternalSites) {
	        if (InternalSites.hasOwnProperty(key)) {
	          if (InternalSites[key].references) {
	          	if (InternalSites[key].references.indexOf(reference) != -1) {
	          		referencing.push(key);
	          		referencing = referencing.filter(reference => refreshed.indexOf(reference) == -1);
	          		
	          		cacheOfGeneratedBackEndCodeForAllPages[key] = WorkspaceHelper.generateBackEndCodeForID(key);
	          	}
	          }
	        }
	      }
	    }
    }
  },
  generateBackEndCodeForID: (id: string=InternalProjectSettings.editingPageID) => {
  	const temp = WorkspaceHelper.createTempIframe();
    const _document = temp.contentDocument || temp.contentWindow.document;
    const _window = _document.defaultView;
    
    WorkspaceHelper.loadPageData('site', id, _window);
    const results = WorkspaceHelper.generateBackEndCodeForPage('site', id, HTMLHelper.getElementByAttributeNameAndValue("internal-fsb-guid", "0", _window.document.body));
    
    WorkspaceHelper.disposeTempIframe(temp);
    
    return results;
  },
  generateBackEndCodeForPage: (mode: string='site', key: string=InternalProjectSettings.editingPageID, container: any=document.body) => {
    let results;
  	if (mode == 'site') {
  		WorkspaceHelper.plugComponentInputs(container);
  		WorkspaceHelper.updateInPageComponents(container);
      WorkspaceHelper.updateInheritingComponents(container);
  		results = BackEndDOMHelper.generateBackEndCode(container, key);
  		WorkspaceHelper.unplugComponentInputs(container);
  	} else {
  		results = null;
  	}
  	
  	return results;
  },
  getCurrentGenerateFrontEndCodeKey: (mode: string=InternalProjectSettings.currentMode, key: string=null) => {
  	switch (mode) {
  		case 'site':
  			return key || InternalProjectSettings.editingPageID;
  		case 'components':
  			return '__' + (key || InternalProjectSettings.editingComponentID);
  		case 'popups':
  			return '__' + (key || InternalProjectSettings.editingPopupID);
  		default:
  			return '__' + (key || RandomHelper.generateGUID());
  	}
  },
  getCurrentGenerateFrontEndKey: () => {
  	return WorkspaceHelper.getCurrentGenerateFrontEndCodeKey().replace('__', '');
  },
  generateFrontEndCodeForAllPages: () => {
    const result = WorkspaceHelper.generateFrontEndCodeForCurrentPage();
    if (result != null) cacheOfGeneratedFrontEndCodeForAllPages[WorkspaceHelper.getCurrentGenerateFrontEndCodeKey()] = result;
    
    for (let key in cacheOfGeneratedFrontEndCodeForAllPages) {
      if (cacheOfGeneratedFrontEndCodeForAllPages.hasOwnProperty(key)) {
        if (cacheOfGeneratedFrontEndCodeForAllPages[key] === null) {
          delete cacheOfGeneratedFrontEndCodeForAllPages[key];
        }
      }
    }
    
    return CodeHelper.sortHashtable(cacheOfGeneratedFrontEndCodeForAllPages);
  },
  generateBackEndCodeForAllPages: () => {
  	const result = WorkspaceHelper.generateBackEndCodeForID(InternalProjectSettings.editingPageID);
    if (result != null) cacheOfGeneratedBackEndCodeForAllPages[InternalProjectSettings.editingPageID] = result;
    
    for (let key in cacheOfGeneratedBackEndCodeForAllPages) {
      if (cacheOfGeneratedBackEndCodeForAllPages.hasOwnProperty(key)) {
        if (cacheOfGeneratedBackEndCodeForAllPages[key] === null) {
          delete cacheOfGeneratedBackEndCodeForAllPages[key];
        }
      }
    }
    
    return cacheOfGeneratedBackEndCodeForAllPages;
 	},
 	generateConnectorCode: () => {
 		const temp = WorkspaceHelper.createTempIframe();
    const _document = temp.contentDocument || temp.contentWindow.document;
    const _window = _document.defaultView;
    
    WorkspaceHelper.loadPageData('data', null, _window);
    
    const connectors = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'Connection', _document);
    const results = {};
    
    for (const connector of connectors) {
	    let info = HTMLHelper.getAttributes(connector);
	    if (!Object.keys(CAMEL_OF_EVENTS_DICTIONARY).some(key => !!info[key])) continue;
			
			info['editingPagePath'] = '/connectors';
			info['editingPageID'] = info['internal-fsb-guid'];
			info['autoGeneratedCodeForMergingBackEndScript'] = BackEndDOMHelper.generateCodeForMergingSectionInData(connector)
			
    	results[info['internal-fsb-guid']] = BackEndScriptHelper.generateConnectorCode(info);
    }
    
    WorkspaceHelper.disposeTempIframe(temp);
    
    return results;
 	},
 	generateWorkerCode: () => {
 		const temp = WorkspaceHelper.createTempIframe();
    const _document = temp.contentDocument || temp.contentWindow.document;
    const _window = _document.defaultView;
    
    WorkspaceHelper.loadPageData('data', null, _window);
    
    const workers = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'Queue', _document);
    const results = {};
    
    for (const worker of workers) {
    	let info = HTMLHelper.getAttributes(worker);
			
			info['editingPagePath'] = '/workers';
			info['editingPageID'] = info['internal-fsb-guid'];
			info['autoGeneratedCodeForMergingBackEndScript'] = BackEndDOMHelper.generateCodeForMergingSectionInData(worker)
			
    	results[info['internal-fsb-guid']] = BackEndScriptHelper.generateWorkerCode(info);
    }
    
    WorkspaceHelper.disposeTempIframe(temp);
    
    return results;
 	},
 	generateSchedulerCode: () => {
 		const temp = WorkspaceHelper.createTempIframe();
    const _document = temp.contentDocument || temp.contentWindow.document;
    const _window = _document.defaultView;
    
    WorkspaceHelper.loadPageData('data', null, _window);
    
    const schedulers = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'Scheduler', _document);
    const results = {};
    
    for (const scheduler of schedulers) {
    	let info = HTMLHelper.getAttributes(scheduler);
			
			info['editingPagePath'] = '/schedulers';
			info['editingPageID'] = info['internal-fsb-guid'];
			info['autoGeneratedCodeForMergingBackEndScript'] = BackEndDOMHelper.generateCodeForMergingSectionInData(scheduler)
			
    	results[info['internal-fsb-guid']] = BackEndScriptHelper.generateSchedulerCode(info);
    }
    
    WorkspaceHelper.disposeTempIframe(temp);
    
    return results;
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
  			element.innerHTML = (InternalComponents[key].html || DEFAULT_COMPONENT_HTML).join('\n');
  			
  			container.appendChild(element);
  		}
  	}
  	for (let key in InternalPopups) {
  		if (InternalPopups.hasOwnProperty(key)) {
  			let element = document.createElement('div');
  			element.innerHTML = (InternalPopups[key].html || DEFAULT_POPUP_HTML).join('\n');
  			
  			container.appendChild(element);
  		}
  	}
  	
  	WorkspaceHelper.plugComponentInputs(container);
  	WorkspaceHelper.updateInPageComponents();
    WorkspaceHelper.updateInheritingComponents();
  	let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet;
  	[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = FrontEndDOMHelper.generateFrontEndCode(container.ownerDocument, container);
  	WorkspaceHelper.unplugComponentInputs(container);
  	
  	return combinedExpandingFeatureScripts || '';
  },
  plugComponentInputs: (root: HTMLElement=HTMLHelper.getElementByAttributeNameAndValue("internal-fsb-guid", "0")) => {
  	let popups = [...HTMLHelper.getElementsByAttribute('internal-fsb-popup-init-class', root)];
  	popups.forEach(popup => {
  		const popupClass = HTMLHelper.getAttribute(popup, 'internal-fsb-popup-init-class');
  		const key = WorkspaceHelper.getPopupKeyFromPath(popupClass);
	  	const popupInfo = key && WorkspaceHelper.getPopupData(key);
  		
  		if (popupInfo) {
	  		let element = document.createElement('div');
	      element.innerHTML = WorkspaceHelper.cleanupComponentHTMLData(popupInfo.html.join('\n'));
	      element = element.firstElementChild;
	      
	      HTMLHelper.addClass(element, 'internal-fsb-plug');
	      
	      root.appendChild(element);
	    }
  	});
  },
  unplugComponentInputs: (root: HTMLElement=HTMLHelper.getElementByAttributeNameAndValue("internal-fsb-guid", "0")) => {
  	let plugs = [...HTMLHelper.getElementsByClassName('internal-fsb-plug', root)];
    plugs.forEach(plug => plug.parentNode.removeChild(plug));
  }
}

export {InternalProjectSettings, WorkspaceHelper}; 