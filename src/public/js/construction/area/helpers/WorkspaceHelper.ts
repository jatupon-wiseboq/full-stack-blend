import {CodeHelper} from '../../helpers/CodeHelper.js';
import {FontHelper} from '../../helpers/FontHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EditorHelper} from './EditorHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {FrontEndDOMHelper} from './FrontEndDOMHelper.js';
import {BackEndDOMHelper} from './BackEndDOMHelper.js';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, FORWARD_STYLE_TO_CHILDREN_CLASS_LIST, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES, INHERITING_COMPONENT_RESERVED_STYLE_NAMES, BACKEND_DATA_EXTENSIONS} from '../../Constants.js';

let cacheOfGeneratedFrontEndCodeForAllPages: any = {};
let cacheOfGeneratedBackEndCodeForAllPages: any = {};

const DefaultProjectSettings: {string: any} = {
  currentMode: 'site',
  externalLibraries: 'react@16',
  colorSwatches: new Array(28),
  editingPageID: 'index',
  editingComponentID: null,
  editingPopupID: null,
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

const DEFAULT_FLOW_PAGE_HTML = `<body class="internal-fsb-guide-on"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout internal-fsb-allow-cursor"></div></div></body>`;
const DEFAULT_SINGLE_ITEM_EDITING_HTML = `<body class="internal-fsb-guide-on"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout"></div></div></body>`;
const DEFAULT_ABSOLUTE_PAGE_HTML = `<body class="internal-fsb-guide-on internal-fsb-disabled-guide"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0" style="height: 100%;"><div class="row internal-fsb-absolute-layout internal-fsb-begin-layout internal-fsb-allow-cursor" style="height: 100%;"></div></div></body>`;
const DEFAULT_COMPONENT_HTML = `<div class="internal-fsb-element col-4"><div class="container-fluid"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div>`;
const DEFAULT_POPUP_HTML = `<div class="internal-fsb-element col-12" style="width: 100vw; height: 100vh"><div class="container-fluid"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div>`;

const DEFAULT_PAGE_EXTENSIONS = {};
for (let key of BACKEND_DATA_EXTENSIONS) {
  DEFAULT_PAGE_EXTENSIONS[key] = null;
}

var WorkspaceHelper = {
  generateWorkspaceData: () => {
    WorkspaceHelper.saveWorkspaceData();
    
    return {
      globalSettings: InternalProjectSettings,
      sites: InternalSites,
      components: InternalComponents,
      popups: InternalPopups,
      flows: InternalDataFlows,
      services: InternalServices,
      stylesheets: StylesheetHelper.generateStylesheetData()
    };
  },
  initializeWorkspaceData: (data: any) => {
    InternalProjectSettings = data && data.globalSettings || DefaultProjectSettings;
    InternalSites = data && data.sites || {};
    InternalComponents = data && data.components || {};
    InternalPopups = data && data.popups || {};
    InternalDataFlows = data && data.flows || {};
    InternalServices = data && data.services || {};
    
    InternalProjectSettings.currentMode = 'site';
    
    WorkspaceHelper.loadWorkspaceData();
    if (data && data.stylesheets) StylesheetHelper.initializeStylesheetData(data.stylesheets);
    
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
      
      document.body.outerHTML = page.body;
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      Object.assign(InternalProjectSettings, page.extensions);
      
      WorkspaceHelper.updateInPageComponents();
      WorkspaceHelper.updateInheritingComponents();
      FontHelper.initializeFontData(page.head.fonts)
      
      EditorHelper.init(true, updateUI);
    } else if (InternalProjectSettings.currentMode == 'data') {
      document.body.outerHTML = InternalDataFlows.default || DEFAULT_ABSOLUTE_PAGE_HTML;
            
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      EditorHelper.init(false, updateUI);
    } else if (InternalProjectSettings.currentMode == 'services') {
      document.body.outerHTML = InternalServices.default || DEFAULT_ABSOLUTE_PAGE_HTML;
            
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      EditorHelper.init(false, updateUI);
    } else if (InternalProjectSettings.currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
      
      let component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
      if (component == null) return;
      
      document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
      document.body.firstChild.firstChild.innerHTML = component.html || DEFAULT_COMPONENT_HTML;
      
      HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-guid', InternalProjectSettings.editingComponentID);
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      WorkspaceHelper.updateInheritingComponents();
      
      EditorHelper.init(false, updateUI);
    } else if (InternalProjectSettings.currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
      
      let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
      if (popup == null) return;
      
      document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
      document.body.firstChild.firstChild.innerHTML = popup.html || DEFAULT_COMPONENT_HTML;
      
      HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-guid', InternalProjectSettings.editingPopupID)
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      WorkspaceHelper.updateInheritingComponents();
      
      EditorHelper.init(false, updateUI);
    }
  },
  saveWorkspaceData: (reinit: boolean=true) => {
    if (InternalProjectSettings.currentMode == 'site') {
      if (InternalProjectSettings.editingPageID == null) return;
      
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      let cloned = CodeHelper.clone(page);
      
      page.head.fonts = FontHelper.generateFontData();
      
      let selectingElement = EditorHelper.getSelectingElement();
      page.accessories.selectingElementGUID = selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      page.accessories.currentCursorWalkPath = CursorHelper.findWalkPathForCursor();
      
      EditorHelper.detach();
      page.body = document.body.outerHTML;
      
      page.extensions = {};
      for (let key of BACKEND_DATA_EXTENSIONS) {
        page.extensions[key] = InternalProjectSettings[key];
      }
      
      if (reinit) {
        EditorHelper.init(true, false);
        
        if (!CodeHelper.equals(cloned, page)) {
          cacheOfGeneratedFrontEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateFrontEndCodeForCurrentPage();
        }
      }
    } else if (InternalProjectSettings.currentMode == 'data') {
      EditorHelper.detach();
      InternalDataFlows.default = document.body.outerHTML;
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    } else if (InternalProjectSettings.currentMode == 'services') {
      EditorHelper.detach();
      InternalServices.default = document.body.outerHTML;
      
      if (reinit) {
        EditorHelper.init(true, false);
      }
    } else if (InternalProjectSettings.currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
    	
    	let component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
    	
      component.html = WorkspaceHelper.cleanupComponentHTMLData(HTMLHelper.getElementsByClassName('internal-fsb-element')[0].outerHTML);
    } else if (InternalProjectSettings.currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
    	
    	let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
    	
      popup.html = WorkspaceHelper.cleanupComponentHTMLData(HTMLHelper.getElementsByClassName('internal-fsb-element')[0].outerHTML);
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
      html: WorkspaceHelper.cleanupComponentHTMLData(html)
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
  cleanupComponentHTMLData: (html: string, preview: boolean=false) => {
  	let holder = document.createElement('div');
    holder.innerHTML = html;
    
    let accessories = [...HTMLHelper.getElementsByClassName('internal-fsb-accessory', holder)];
    accessories.forEach(accessory => accessory.parentNode.removeChild(accessory));
    
    if (preview) {
    	WorkspaceHelper.recursiveCleanupComponentPreviewDOM(holder.firstChild, true);
    }
    
    return holder.innerHTML;
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
		      element.innerHTML = componentInfo.html;
		      let firstChild = element.firstChild;
		      parentNode.insertBefore(firstChild, component);
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
      element.innerHTML = WorkspaceHelper.cleanupComponentHTMLData(componentInfo.html, true);
      let firstChild = element.firstChild;
      parentNode.insertBefore(firstChild, component);
      parentNode.removeChild(component);
      component = firstChild;
      
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
  generateFrontEndCodeForCurrentPage: () => {
    let results = FrontEndDOMHelper.generateFrontEndCode();
  	results.push(StylesheetHelper.renderStylesheet(true));
  	
  	return results;
  },
  generateBackEndCodeForCurrentPage: () => {
    let results = BackEndDOMHelper.generateBackEndCode();
  	
  	return results;
  },
  generateFrontEndCodeForAllPages: (clean: boolean=true) => {
    cacheOfGeneratedFrontEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateFrontEndCodeForCurrentPage();
    
    let result = cacheOfGeneratedFrontEndCodeForAllPages;
    if (clean) cacheOfGeneratedFrontEndCodeForAllPages = {};
    
    return result;
  },
  generateBackEndCodeForAllPages: (clean: boolean=true) => {
  	cacheOfGeneratedBackEndCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateBackEndCodeForCurrentPage();
    
    let result = cacheOfGeneratedBackEndCodeForAllPages;
    if (clean) cacheOfGeneratedBackEndCodeForAllPages = {};
    
    return result;
 	},
  getCommonExpandingFeatureScripts: () => {
  	let container = document.createElement('div');
  	
  	for (let key in InternalComponents) {
  		if (InternalComponents.hasOwnProperty(key)) {
  			let element = document.createElement('div');
  			element.innerHTML = InternalComponents[key].html;
  			
  			container.appendChild(element);
  		}
  	}
  	for (let key in InternalPopups) {
  		if (InternalPopups.hasOwnProperty(key)) {
  			let element = document.createElement('div');
  			element.innerHTML = InternalPopups[key].html;
  			
  			container.appendChild(element);
  		}
  	}
  	
  	let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet;
  	[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = FrontEndDOMHelper.generateFrontEndCode(container);
  	
  	return combinedExpandingFeatureScripts || '';
  }
}

export {InternalProjectSettings, WorkspaceHelper}; 