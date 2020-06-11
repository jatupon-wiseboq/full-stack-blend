import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {FontHelper} from '../../../helpers/FontHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {EditorHelper} from './EditorHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {CodeGeneratorHelper} from './CodeGeneratorHelper.js';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, FORWARD_STYLE_TO_CHILDREN_CLASS_LIST, INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES, INHERITING_COMPONENT_RESERVED_STYLE_NAMES} from '../../../Constants.js';

let cachedgenerateHTMLCodeForAllPages: any = {};
let currentMode = 'site';

const DefaultProjectSettings: {string: any} = {
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

const DEFAULT_PAGE_HTML = `<body class="internal-fsb-guide-on"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout internal-fsb-allow-cursor"></div></div></body>`;
const DEFAULT_SINGLE_ITEM_EDITING_HTML = `<body class="internal-fsb-guide-on"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout"></div></div></body>`;
const DEFAULT_COMPONENT_HTML = `<div class="internal-fsb-element col-4"><div class="container-fluid"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div>`;
const DEFAULT_POPUP_HTML = `<div class="internal-fsb-element col-12" style="width: 100vw; height: 100vh"><div class="container-fluid"><div class="row internal-fsb-strict-layout internal-fsb-allow-cursor"></div></div></div>`;

var WorkspaceHelper = {
  generateWorkspaceData: () => {
    WorkspaceHelper.saveWorkspaceData();
    
    return {
      globalSettings: InternalProjectSettings,
      sites: InternalSites,
      components: InternalComponents,
      popups: InternalPopups,
      stylesheets: StylesheetHelper.generateStylesheetData()
    };
  },
  initializeWorkspaceData: (data: any) => {
    InternalProjectSettings = data && data.globalSettings || DefaultProjectSettings;
    InternalSites = data && data.sites || {};
    InternalComponents = data && data.components || {};
    InternalPopups = data && data.popups || {};
    
    WorkspaceHelper.loadWorkspaceData();
    if (data && data.stylesheets) StylesheetHelper.initializeStylesheetData(data.stylesheets);
    
    EditorHelper.updateEditorProperties();
  },
  setMode: (mode: string) => {
    WorkspaceHelper.saveWorkspaceData(false);
    currentMode = mode;
    WorkspaceHelper.loadWorkspaceData(false);
  },
  getEditable: () => {
    if (currentMode == 'site') {
      return (InternalProjectSettings.editingPageID != null) ? 'site' : false;
    } else if (currentMode == 'components') {
      return (InternalProjectSettings.editingComponentID != null || InternalProjectSettings.components.filter(component => component.state != 'delete').length != 0) ? 'components' : false;
    } else if (currentMode == 'popups') {
      return (InternalProjectSettings.editingPopupID != null || InternalProjectSettings.popups.filter(popup => popup.state != 'delete').length != 0) ? 'popups' : false;
    }
  },
  loadWorkspaceData: (updateUI: boolean=false) => {
    if (currentMode == 'site') {
      if (InternalProjectSettings.editingPageID == null) return;
      
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      if (page == null) return;
      
      FontHelper.initializeFontData(page.head.fonts)
      document.body.outerHTML = page.body;
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      WorkspaceHelper.updateInPageComponents();
      WorkspaceHelper.updateInheritingComponents();
      
      EditorHelper.init(true, updateUI);
    } else if (currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
      
      let component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
      if (component == null) return;
      
      document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
      document.body.firstChild.firstChild.innerHTML = component.html || DEFAULT_COMPONENT_HTML;
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      WorkspaceHelper.updateInheritingComponents();
      
      EditorHelper.init(false, updateUI);
    } else if (currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
      
      let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
      if (popup == null) return;
      
      document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
      document.body.firstChild.firstChild.innerHTML = popup.html || DEFAULT_COMPONENT_HTML;
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      WorkspaceHelper.updateInheritingComponents();
      
      EditorHelper.init(false, updateUI);
    }
  },
  saveWorkspaceData: (reinit: boolean=true) => {
    if (currentMode == 'site') {
      if (InternalProjectSettings.editingPageID == null) return;
      
      let page = WorkspaceHelper.getPageData(InternalProjectSettings.editingPageID);
      let cloned = CodeHelper.clone(page);
      
      page.head.fonts = FontHelper.generateFontData();
      
      let selectingElement = EditorHelper.getSelectingElement();
      page.accessories.selectingElementGUID = selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      page.accessories.currentCursorWalkPath = CursorHelper.findWalkPathForCursor();
      
      EditorHelper.detach();
      page.body = document.body.outerHTML;
      
      if (reinit) {
        EditorHelper.init(true, false);
        
        if (!CodeHelper.equals(cloned, page)) {
          cachedgenerateHTMLCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateHTMLCodeForCurrentPage();
        }
      }
    } else if (currentMode == 'components') {
    	if (InternalProjectSettings.editingComponentID == null) return;
    	
    	let component = WorkspaceHelper.getComponentData(InternalProjectSettings.editingComponentID);
    	
      component.html = WorkspaceHelper.cleanupComponentHTMLData(document.body.firstChild.firstChild.innerHTML);
    } else if (currentMode == 'popups') {
      if (InternalProjectSettings.editingPopupID == null) return;
    	
    	let popup = WorkspaceHelper.getPopupData(InternalProjectSettings.editingPopupID);
    	
      popup.html = WorkspaceHelper.cleanupComponentHTMLData(document.body.firstChild.firstChild.innerHTML);
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
    for (let component of InternalProjectSettings.components) {
      let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', component.id);
      if (element) {
	      let componentInfo = WorkspaceHelper.getComponentData(component.id);
	      if (componentInfo) {
		      element.outerHTML = componentInfo.html;
	      }
	    }
    }
 	},
  updateInheritingComponents: (container: HTMLElement=window.document.body) => {
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', container)];
    
    for (let component of components) {
      let reservedAttributeValues = INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES.map((name) => {
        return HTMLHelper.getAttribute(component, name);
      });
      
      let componentInfo = WorkspaceHelper.getComponentData(reservedAttributeValues[0] || reservedAttributeValues[1]);
      if (!componentInfo) continue;
      
      let isForwardingStyleToChildren = (FORWARD_STYLE_TO_CHILDREN_CLASS_LIST.indexOf(HTMLHelper.getAttribute(component, 'internal-fsb-class')) != -1);
      
      component.innerHTML = WorkspaceHelper.cleanupComponentHTMLData(componentInfo.html, true);
      let firstChild = component.firstChild;
      component.parentNode.insertBefore(firstChild, component);
      component.parentNode.removeChild(component);
      component = firstChild;
      
      for (let i=0; i<INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES.length; i++) {
        if (reservedAttributeValues[i] == null) continue;
        
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
      }
      
      CapabilityHelper.installCapabilitiesForInternalElements(component);
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
    InternalSites[id].body = InternalSites[id].body || DEFAULT_PAGE_HTML;
    InternalSites[id].accessories = InternalSites[id].accessories || {};
    
    return InternalSites[id];
  },
  generateHTMLCodeForCurrentPage: () => {
    let results = CodeGeneratorHelper.generateHTMLCode();
  	results.push(StylesheetHelper.renderStylesheet(true));
  	
  	return results;
  },
  generateHTMLCodeForAllPages: (clean: boolean=true) => {
    cachedgenerateHTMLCodeForAllPages[InternalProjectSettings.editingPageID] = WorkspaceHelper.generateHTMLCodeForCurrentPage();
    
    let result = cachedgenerateHTMLCodeForAllPages;
    if (clean) cachedgenerateHTMLCodeForAllPages = {};
    
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
  	[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = CodeGeneratorHelper.generateHTMLCode(container);
  	
  	return combinedExpandingFeatureScripts || '';
  }
}

export {InternalProjectSettings, WorkspaceHelper}; 