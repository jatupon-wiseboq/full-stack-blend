import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {FontHelper} from '../../../helpers/FontHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {EditorHelper} from './EditorHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {CodeGeneratorHelper} from './CodeGeneratorHelper.js';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX} from '../../../Constants.js';

let cachedGenerateHTMLCodeForPages: any = {};
let currentMode = 'site';

const DefaultProjectSettings: {string: any} = {
  externalLibraries: 'react@16',
  colorSwatches: new Array(28),
  editingSiteName: 'index',
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
      stylesheets: StylesheetHelper.generateStylesheetData()
    };
  },
  initializeWorkspaceData: (data: any) => {
    Object.assign(InternalProjectSettings, data && data.globalSettings || {});
    Object.assign(InternalSites, data && data.sites || {});
    Object.assign(InternalComponents, data && data.components || {});
    
    WorkspaceHelper.loadWorkspaceData();
    if (data && data.stylesheets) StylesheetHelper.initializeStylesheetData(data.stylesheets);
  },
  setMode: (mode: string) => {
    WorkspaceHelper.saveWorkspaceData(false);
    currentMode = mode;
    WorkspaceHelper.loadWorkspaceData(false);
  },
  getEditable: () => {
    if (currentMode == 'site') {
      return (InternalProjectSettings.editingSiteName != null) ? 'site' : false;
    } else if (currentMode == 'components') {
      return (InternalProjectSettings.editingComponentID != null || InternalProjectSettings.components.filter(component => component.state != 'delete').length != 0) ? 'components' : false;
    } else if (currentMode == 'popups') {
      return (InternalProjectSettings.editingPopupID != null || InternalProjectSettings.popups.filter(popup => popup.state != 'delete').length != 0) ? 'popups' : false;
    }
  },
  loadWorkspaceData: (updateUI: boolean=false) => {
    if (currentMode == 'site') {
      if (InternalProjectSettings.editingSiteName == null) return;
      
      let page = WorkspaceHelper.getPageInfo(InternalProjectSettings.editingSiteName);
      
      FontHelper.initializeFontData(page.head.fonts)
      document.body.outerHTML = page.body;
      
      // The second head element did appear after setting content to the outerHTML of body element.
      // Remove the extra one.
      //
      if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
      
      WorkspaceHelper.updateInheritingComponents();
      EditorHelper.init(true, updateUI);
    } else if (currentMode == 'components') {
      let component = InternalProjectSettings.components.filter(component => component.id == InternalProjectSettings.editingComponentID)[0];
      if (!component) component = InternalProjectSettings.components[0];
      
      if (component) {
        component = WorkspaceHelper.getComponentData(component.id);
        
        EditorHelper.detach();
        document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
        
        // The second head element did appear after setting content to the outerHTML of body element.
        // Remove the extra one.
        //
        if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
        
        document.body.firstChild.firstChild.innerHTML = component.html || DEFAULT_COMPONENT_HTML;
        HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-react-mode', 'Site');
        HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-name', 'Component');
        HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-guid', component.id);
        EditorHelper.init(false, updateUI);
      } else {
        InternalProjectSettings.editingComponentID = null;
        document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
      }
    } else if (currentMode == 'popups') {
      let popup = InternalProjectSettings.popups.filter(popup => popup.id == InternalProjectSettings.editingPopupID)[0];
      if (!popup) popup = DefaultProjectSettings.popups[0];
      
      if (popup) {
        popup = WorkspaceHelper.getPopupData(popup.id);
        
        EditorHelper.detach();
        document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
        
        // The second head element did appear after setting content to the outerHTML of body element.
        // Remove the extra one.
        //
        if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
        
        document.body.firstChild.firstChild.innerHTML = popup.html || DEFAULT_POPUP_HTML;
        HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-react-mode', 'Site');
        HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-name', 'Popup');
        HTMLHelper.setAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-guid', popup.id);
        EditorHelper.init(false, updateUI);
      } else {
        InternalProjectSettings.editingPopupID = null;
        document.body.outerHTML = DEFAULT_SINGLE_ITEM_EDITING_HTML;
      }
    }
  },
  saveWorkspaceData: (reinit: boolean=true) => {
    if (currentMode == 'site') {
      if (InternalProjectSettings.editingSiteName == null) return;
      
      let page = WorkspaceHelper.getPageInfo(InternalProjectSettings.editingSiteName);
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
          cachedGenerateHTMLCodeForPages[InternalProjectSettings.editingSiteName] = WorkspaceHelper.generateHTMLCodeForPage();
          InternalSites[InternalProjectSettings.editingSiteName] = page;
        }
      }
    } else if (currentMode == 'components') {
      let component = InternalProjectSettings.components.filter(component => component.id == InternalProjectSettings.editingComponentID)[0];
      if (!component) component = InternalProjectSettings.components[0];
      
      if (component) {
        component = WorkspaceHelper.getComponentData(component.id);
        
        EditorHelper.detach();
        HTMLHelper.removeAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-react-mode');
        HTMLHelper.removeAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-name');
        HTMLHelper.removeAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-guid');
        component.html = document.body.firstChild.firstChild.innerHTML;
        if (reinit) EditorHelper.init(false, false);
      }
    } else if (currentMode == 'popups') {
      let popup = InternalProjectSettings.popups.filter(popup => popup.id == InternalProjectSettings.editingPopupID)[0];
      if (!popup) popup = InternalProjectSettings.popups[0];
      
      if (popup) {
        popup = WorkspaceHelper.getPopupData(popup.id);
        
        EditorHelper.detach();
        HTMLHelper.removeAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-react-mode');
        HTMLHelper.removeAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-name');
        HTMLHelper.removeAttribute(document.body.firstChild.firstChild.firstChild, 'internal-fsb-guid');
        popup.html = document.body.firstChild.firstChild.innerHTML;
        if (reinit) EditorHelper.init(false, false);
      }
    }
  },
  removeComponentData: (id: string) => {
    delete InternalComponents[id];
    InternalProjectSettings.components = InternalProjectSettings.components.filter(component => component.id != id);
  },
  addOrReplaceComponentData: (id: string, name: string, namespace: string, klass: string, html: string) => {
    let element = document.createElement('div');
    element.innerHTML = html;
    
    let accessories = [...HTMLHelper.getElementsByClassName('internal-fsb-accessory', element)];
    accessories.forEach(accessory => accessory.parentNode.removeChild(accessory));
    
    HTMLHelper.removeAttribute(element.firstChild, 'internal-fsb-react-mode');
    HTMLHelper.removeAttribute(element.firstChild, 'internal-fsb-name');
    HTMLHelper.removeAttribute(element.firstChild, 'internal-fsb-guid');
    
    html = element.innerHTML;
    
    InternalComponents[id] = {
      namespace: namespace,
      klass: klass,
      html: html
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
  updateInheritingComponents: (container: HTMLElement=window.document.body) => {
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', container)];
    let reservedAttributeNames = ['internal-fsb-inheriting', 'internal-fsb-guid', 'class', 'internal-fsb-name', 'internal-fsb-react-id', 'internal-fsb-react-data', 'internal-fsb-react-mode'];
    
    let selectingElement = EditorHelper.getSelectingElement();
    for (let component of InternalProjectSettings.components) {
      let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', component.id);
      if (element && element != selectingElement) components.push(element);
    }
    
    for (let component of components) {
      let reservedAttributeValues = reservedAttributeNames.map((name) => {
        return HTMLHelper.getAttribute(component, name);
      });
      
      let componentInfo = WorkspaceHelper.getComponentData(reservedAttributeValues[0] || reservedAttributeValues[1]);
      if (!componentInfo) continue;
      
      component.innerHTML = componentInfo.html;
      let firstChild = component.firstChild;
      component.parentNode.insertBefore(firstChild, component);
      component.parentNode.removeChild(component);
      component = firstChild;
      
      for (let i=0; i<reservedAttributeNames.length; i++) {
        if (reservedAttributeValues[i] == null) continue;
        
        if (reservedAttributeNames[i] == 'class') {
          let previous = reservedAttributeValues[i];
          let next = HTMLHelper.getAttribute(component, 'class') || '';
          
          let sizeMatches = previous.match(ALL_RESPONSIVE_SIZE_REGEX) || [];
          let offsetMatches = previous.match(ALL_RESPONSIVE_OFFSET_REGEX) || [];
          
          next = next.replace(ALL_RESPONSIVE_SIZE_REGEX, '').replace(ALL_RESPONSIVE_OFFSET_REGEX, '');
          next = [...sizeMatches, ...offsetMatches, next].join(' ');
          
          HTMLHelper.setAttribute(component, reservedAttributeNames[i], next);
        } else {
          HTMLHelper.setAttribute(component, reservedAttributeNames[i], reservedAttributeValues[i]);
        }
      }
      
      CapabilityHelper.installCapabilitiesForInternalElements(component);
    }
  },
  getComponentData: (id: string) => {
    let existingComponentInfo = InternalProjectSettings.components.filter(component => component.id == id)[0] || {};
    return Object.assign({}, InternalComponents[id], existingComponentInfo);
  },
  getPopupData: (id: string) => {
    let existingPopupInfo = InternalProjectSettings.popups.filter(popup => popup.id == id)[0] || {};
    return Object.assign({}, InternalPopups[id], existingPopupInfo);
  },
  getPageInfo: (currentPageID: String) => {
    let page = InternalSites[currentPageID] || {};
    
    if (!page.id) page.id = currentPageID;
    if (!page.head) page.head = {};
    if (!page.head.fonts) page.head.fonts = {};
    if (!page.body) page.body = DEFAULT_PAGE_HTML;
    if (!page.accessories) page.accessories = {};
    
    return page;
  },
  generateHTMLCodeForPage: () => {
    let results = CodeGeneratorHelper.generateHTMLCodeForPage();
  	results.push(StylesheetHelper.renderStylesheet(true));
  	
  	return results;
  },
  generateHTMLCodeForPages: (clean: boolean=true) => {
    cachedGenerateHTMLCodeForPages[InternalProjectSettings.editingSiteName] = WorkspaceHelper.generateHTMLCodeForPage();
    
    let result = cachedGenerateHTMLCodeForPages;
    if (clean) cachedGenerateHTMLCodeForPages = {};
    
    return result;
  }
}

export {InternalProjectSettings, WorkspaceHelper}; 