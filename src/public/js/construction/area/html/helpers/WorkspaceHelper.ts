import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {FontHelper} from '../../../helpers/FontHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {EditorHelper} from './EditorHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {CodeGeneratorHelper} from './CodeGeneratorHelper.js';

let cachedGenerateHTMLCodeForPages: any = {};

const DefaultProjectSettings: {string: any} = {
  externalLibraries: 'react@16',
  colorSwatches: new Array(28),
  editingSiteName: 'index',
  pages: [{id: 'index', name: 'Home', path: '/', state: 'create'}]
};
let InternalProjectSettings = CodeHelper.clone(DefaultProjectSettings);
let InternalSites = {};
let InternalComponents = {};

const DEFAULT_HTML = `<body class="internal-fsb-guide-on"><div class="container-fluid internal-fsb-begin" internal-fsb-guid="0"><div class="row internal-fsb-strict-layout internal-fsb-begin-layout internal-fsb-allow-cursor"></div></div></body>`;

var WorkspaceHelper = {
  generateWorkspaceData: () => {
    WorkspaceHelper.saveWorkspaceData();
    
    return {
      globalSettings: InternalProjectSettings,
      sites: InternalSites,
      components: InternalComponents
    };
  },
  initializeWorkspaceData: (data: any) => {
    Object.assign(InternalProjectSettings, data && data.globalSettings || {});
    Object.assign(InternalSites, data && data.sites || {});
    Object.assign(InternalComponents, data && data.components || {});
    
    WorkspaceHelper.loadWorkspaceData();
  },
  loadWorkspaceData: () => {
    if (InternalProjectSettings.editingSiteName == null) return;
    
    let page = WorkspaceHelper.getPageInfo(InternalProjectSettings.editingSiteName);
    
    StylesheetHelper.initializeStylesheetData(page.head.stylesheets);
    FontHelper.initializeFontData(page.head.fonts)
    document.body.outerHTML = page.body;
    
    // The second head element did appear after setting content to the outerHTML of body element.
    // Remove the extra one.
    //
    if (document.head.nextSibling.tagName == 'HEAD') document.head.nextSibling.remove();
    
    WorkspaceHelper.updateInheritingComponents();
    EditorHelper.init();
  },
  saveWorkspaceData: () => {
    if (InternalProjectSettings.editingSiteName == null) return;
    
    let page = WorkspaceHelper.getPageInfo(InternalProjectSettings.editingSiteName);
    let cloned = CodeHelper.clone(page);
    
    page.head.stylesheets = StylesheetHelper.generateStylesheetData();
    page.head.fonts = FontHelper.generateFontData();
    
    let selectingElement = EditorHelper.getSelectingElement();
    
    page.accessories.selectingElementGUID = selectingElement && HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
    page.accessories.currentCursorWalkPath = CursorHelper.findWalkPathForCursor();
    
    EditorHelper.detach();
    page.body = document.body.outerHTML;
    EditorHelper.init();
    
    if (!CodeHelper.equals(cloned, page)) {
      cachedGenerateHTMLCodeForPages[InternalProjectSettings.editingSiteName] = WorkspaceHelper.generateHTMLCodeForPage();
      InternalSites[InternalProjectSettings.editingSiteName] = page;
    }
  },
  removeComponentData: (id: string) => {
    delete InternalComponents[id];
    WorkspaceHelper.regenerateInfoOfComponentsInProjectSettings();
  },
  addOrReplaceComponentData: (id: string, name: string, html: string) => {
    let element = document.createElement('div');
    element.innerHTML = html;
    
    let accessories = [...HTMLHelper.getElementsByClassName('internal-fsb-accessory', element)];
    accessories.forEach(accessory => accessory.parentNode.removeChild(accessory));
    
    HTMLHelper.removeAttribute(element.firstChild, 'internal-fsb-react-mode');
    HTMLHelper.removeAttribute(element.firstChild, 'internal-fsb-name');
    HTMLHelper.removeAttribute(element.firstChild, 'internal-fsb-guid');
    
    html = element.innerHTML;
    
    InternalComponents[id] = {
      name: name,
      html: html
    };
    WorkspaceHelper.regenerateInfoOfComponentsInProjectSettings();
    WorkspaceHelper.updateInheritingComponents();
  },
  updateInheritingComponents: (container: HTMLElement=window.document.body) => {
    let components = [...HTMLHelper.getElementsByAttribute('internal-fsb-inheriting', container)];
    for (let component of components) {
      let reservedAttributeNames = ['internal-fsb-guid', 'internal-fsb-inheriting', 'internal-fsb-name', 'internal-fsb-react-id'];
      let reservedAttributeValues = reservedAttributeNames.map((name) => {
        return HTMLHelper.getAttribute(component, name);
      });
      
      let componentInfo = WorkspaceHelper.getComponentData(reservedAttributeValues[1]);
      if (!componentInfo) continue;
      
      component.innerHTML = componentInfo.html;
      let firstChild = component.firstChild;
      component.parentNode.insertBefore(firstChild, component);
      component.parentNode.removeChild(component);
      component = firstChild;
      
      for (let i=0; i<reservedAttributeNames.length; i++) {
        HTMLHelper.setAttribute(component, reservedAttributeNames[i], reservedAttributeValues[i]);
      }
      
      CapabilityHelper.installCapabilityOfBeingSelected(component);
    }
  },
  getComponentData: (id: string) => {
    return InternalComponents[id];
  },
  regenerateInfoOfComponentsInProjectSettings: () => {
    InternalProjectSettings.components = Object.keys(InternalComponents).map((key) => {
      return {
        id: key,
        name: InternalComponents[key].name
      }
    });
  },
  getPageInfo: (currentPageID: String) => {
    let page = InternalSites[currentPageID] || {};
    
    if (!page.id) page.id = currentPageID;
    if (!page.head) page.head = {};
    if (!page.head.stylesheets) page.head.stylesheets = {};
    if (!page.head.fonts) page.head.fonts = {};
    if (!page.body) page.body = DEFAULT_HTML;
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