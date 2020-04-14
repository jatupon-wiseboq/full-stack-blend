import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Cursor.js';
import '../controls/Resizer.js';
import '../controls/Guide.js';
import '../controls/LayoutInfo.js';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  cursor: null,
  resizer: null,
  guide: null,
  layoutInfo: null
};

let stylesheetDefinitions = {};
let stylesheetDefinitionRevision = 0;
let cachedPrioritizedKeys = null;
let cachedPrioritizedKeysRevision = -1;

function renderStylesheet() {
  let lines = [];
  let prioritizedKeys = EditorHelper.getStylesheetDefinitionKeys();
  
  for (let i=prioritizedKeys.length-1; i>=0; i--) {
    let key = prioritizedKeys[i];
    lines.push('.internal-fsb-strict-layout > .internal-fsb-element[internal-fsb-presets*="+' + key + '+"], ' +
               '.internal-fsb-absolute-layout > .internal-fsb-element[internal-fsb-presets*="+' + key + '+"] { ' + stylesheetDefinitions[key] + ' }');
  }
  let source = lines.join('\n');
  
  let element = document.getElementById('internal-fsb-stylesheet');
  if (!element) {
    element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    element.setAttribute('id', 'internal-fsb-stylesheet');
    document.head.appendChild(element);
  }
  
  element.innerText = source;
}

var EditorHelper = {
  setup: () => {
    let cursorContainer = document.createElement('div');
    Accessories.cursor = ReactDOM.render(<FullStackBlend.Controls.Cursor />, cursorContainer);
    Accessories.cursor.setDOMNode(cursorContainer.firstChild);
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
    Accessories.resizer.setDOMNode(resizerContainer.firstChild);
    resizerContainer.removeChild(Accessories.resizer.getDOMNode());
    
    let guideContainer = document.createElement('div');
    Accessories.guide = ReactDOM.render(<FullStackBlend.Controls.Guide />, guideContainer);
    Accessories.guide.setDOMNode(guideContainer.firstChild);
    guideContainer.removeChild(Accessories.guide.getDOMNode());
    
    let layoutContainer = document.createElement('div');
    Accessories.layoutInfo = ReactDOM.render(<FullStackBlend.Controls.LayoutInfo />, layoutContainer);
    window.document.body.appendChild(layoutContainer);
    
    EditorHelper.moveCursorToTheEndOfDocument(false);
  },
  
  synchronize: (name: string, content: any) => {
    window.top.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  },
  update: () => {
    var event = document.createEvent("Event");
    event.initEvent("update", false, true); 
    window.dispatchEvent(event);
    EditorHelper.updateEditorProperties();
  },
  
  moveCursorToTheEndOfDocument: (remember: boolean=true) => {
    let element = HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (element) {
      ManipulationHelper.perform('move[cursor]', EditorHelper.createWalkPathForCursor(), remember);
      element.parentNode.appendChild(Accessories.guide.getDOMNode());
    }
  },
  moveCursorToTheLeft: () => {
    let {allAllowCursorElements, allAllowCursorPositions} = EditorHelper.getDepthFirstReferencesForCursorWalks();
    
    let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
    let indexOfTheCursor = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
    let index = -1;
    
    for (let i=0; i<=indexOfTheCursor; i++) {
      index = allAllowCursorElements.indexOf(theAllowCursorElement, index + 1);
    }
    
    if (index > 0) {
      let walkPath = EditorHelper.findWalkPathForElement(allAllowCursorElements[index - 1]);
      walkPath[2] = allAllowCursorPositions[index - 1];
      
      ManipulationHelper.perform('move[cursor]', walkPath);
    } else {
      let walkPath = EditorHelper.createWalkPathForCursor();
      walkPath[2] = 0;
    }
  },
  moveCursorUp: () => {
    let walkPath = [...EditorHelper.findWalkPathForCursor()];
    walkPath[2] = Math.max(0, walkPath[2] - 1);
    
    ManipulationHelper.perform('move[cursor]', walkPath);
  },
  moveCursorToTheRight: () => {
    let {allAllowCursorElements, allAllowCursorPositions} = EditorHelper.getDepthFirstReferencesForCursorWalks();
    
    let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
    let indexOfTheCursor = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
    let index = -1;
    
    for (let i=0; i<=indexOfTheCursor; i++) {
      index = allAllowCursorElements.indexOf(theAllowCursorElement, index + 1);
    }
    
    if (index < allAllowCursorElements.length - 1) {
      let walkPath = EditorHelper.findWalkPathForElement(allAllowCursorElements[index + 1]);
      walkPath[2] = allAllowCursorPositions[index + 1];
      
      ManipulationHelper.perform('move[cursor]', walkPath);
    } else {
      EditorHelper.moveCursorToTheEndOfDocument();
    }
  },
  moveCursorDown: () => {
    let walkPath = [...EditorHelper.findWalkPathForCursor()];
    let maximum = walkPath[2];
    
    let referenceElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', walkPath[0]);
    if (referenceElement) {
      let allowCursorElements = HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element');
      let theAllowCursorElement = allowCursorElements[walkPath[1]];
      
      if (theAllowCursorElement) {
        let children = [...theAllowCursorElement.children];
        let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
        maximum = count;
      }
    }
    
    walkPath[2] = Math.min(maximum, walkPath[2] + 1);
    
    ManipulationHelper.perform('move[cursor]', walkPath);
  },
  getDepthFirstReferencesForCursorWalks: (container: HTMLElement=document.body, allAllowCursorElements: [HTMLElement]=[], allAllowCursorPositions: [number]=[]) => {
    let isContainerAllowedCursor = HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor');
    
    let children = [...container.children];
    let count = 0;
    for (let i=0; i<children.length; i++) {
      if (isContainerAllowedCursor && children[i] != Accessories.cursor.getDOMNode()) {
        allAllowCursorElements.push(container);
        allAllowCursorPositions.push(i);
        
        count += 1;
      }
    
      EditorHelper.getDepthFirstReferencesForCursorWalks(children[i], allAllowCursorElements, allAllowCursorPositions);
    }
    
    if (isContainerAllowedCursor) {
      allAllowCursorElements.push(container);
      allAllowCursorPositions.push(children.length);
    }
    
    return {allAllowCursorElements, allAllowCursorPositions};
  },
  
  select: (element: HTMLElement) => {
    if (!element) return;
    if (HTMLHelper.hasClass(element, 'internal-fsb-element')) {
      element.insertBefore(Accessories.resizer.getDOMNode(), element.childNodes[0]);
      
      let current = element;
      while (current != null) {
        if (HTMLHelper.hasClass(current, 'container') || HTMLHelper.hasClass(current, 'container-fluid')) {
          current.insertBefore(Accessories.guide.getDOMNode(), current.firstChild);
          break;
        }
        current = current.parentNode;
      }
      
      EditorHelper.synchronize('select', element.getAttribute('internal-fsb-class'));
      EditorHelper.update();
    }
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
  updateEditorProperties: () => {
    let element = EditorHelper.getSelectingElement();
    if (element == null) return;
    
    let reusablePresetName = element.getAttribute('internal-fsb-reusable-preset-name') || null;
    let attributes = null;
    
    if (reusablePresetName) {
      attributes = HTMLHelper.getAttributes(element, false, {
        style: EditorHelper.getStylesheetDefinition(reusablePresetName)
      });
    } else {
      attributes = HTMLHelper.getAttributes(element, false);
    }
    
    EditorHelper.synchronize('updateEditorProperties', {
      attributes: attributes,
      currentActiveLayout: Accessories.layoutInfo.currentActiveLayout(),
      stylesheetDefinitionKeys: EditorHelper.getStylesheetDefinitionKeys(),
      stylesheetDefinitionRevision: EditorHelper.getStylesheetDefinitionRevision()
    });
  },
  getSelectingElement: () => {
    if (Accessories.resizer && Accessories.resizer.getDOMNode().parentNode && HTMLHelper.hasClass(Accessories.resizer.getDOMNode().parentNode, 'internal-fsb-element')) {
      return Accessories.resizer.getDOMNode().parentNode;
    } else {
      return null;
    }
  },
  deselect: () => {
    if (Accessories.resizer.getDOMNode().parentNode != null) {
      Accessories.resizer.getDOMNode().parentNode.removeChild(Accessories.resizer.getDOMNode());
    }
  },
  
  installCapabilityOfBeingSelected: (element: HTMLElement, guid: string) => {
    element.setAttribute('internal-fsb-guid', guid);
    element.addEventListener('click', (event) => {
      if (EventHelper.checkIfDenyForHandle(event)) return;
      
      let selecting = EditorHelper.getSelectingElement();
      let willSelected = EventHelper.getCurrentElement(event);
      let parents = HTMLHelper.findAllParentsInClassName('internal-fsb-element', willSelected);
      parents.splice(0, 0, willSelected);
      let index = parents.indexOf(selecting);
      
      if (index != -1) {
        willSelected = parents[Math.max(0, index - 1)];
      } else {
        willSelected = parents[parents.length - 1];
      }
      
      if (selecting != willSelected) {
        ManipulationHelper.perform('select', willSelected.getAttribute('internal-fsb-guid'));
      }
      
      EditorHelper.synchronize("click", null);
      return EventHelper.cancel(event);
    }, false);
    EventHelper.setDenyForEarlyHandle(element);
  },
  installCapabilityOfBeingMoveInCursor: (container: HTMLElement) => {
    let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', container)];
    if (HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor')) {
      allowCursorElements.push(container);
    }
    allowCursorElements.forEach((allowCursorElement: HTMLElement) => {
      if (allowCursorElement.getAttribute('internal-fsb-binded-click') != '1') {
        allowCursorElement.setAttribute('internal-fsb-binded-click', '1');
        
        if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-strict-layout')) {
          allowCursorElement.addEventListener('click', (event) => {
            if (EventHelper.checkIfDenyForHandle(event)) return;
            
            let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement);
            if (referenceElement != null) {
              let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
              let theAllowCursorElement = allowCursorElement;
              let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
              
              if (indexOfAllowCursorElement != -1) {
                let children = [...theAllowCursorElement.children];
                let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
                let maximum = count;
                let walkPath = EditorHelper.createWalkPathForCursor(referenceElement.getAttribute('internal-fsb-guid'), indexOfAllowCursorElement, maximum);
                ManipulationHelper.perform('move[cursor]', walkPath);
              }
              
              referenceElement.click();
            }
            
            EditorHelper.synchronize("click", null);
            return EventHelper.cancel(event);
          }, false);
        } else if (HTMLHelper.hasClass(allowCursorElement, 'internal-fsb-absolute-layout')) {
          allowCursorElement.addEventListener('click', (event) => {
            if (EventHelper.checkIfDenyForHandle(event)) return;
            
            let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement);
            if (referenceElement != null) {
              referenceElement.click();
              
              if (referenceElement == EditorHelper.getSelectingElement()) {
                let layoutPosition = HTMLHelper.getPosition(allowCursorElement);
                let mousePosition = EventHelper.getMousePosition(event);
                
                ManipulationHelper.perform('move[cursor]', EditorHelper.createWalkPathForCursor(
                  referenceElement.getAttribute('internal-fsb-guid'),
                  0,
                  mousePosition[0] - layoutPosition[0],
                  mousePosition[1] - layoutPosition[1]
                ));
              }
            }
            
            EditorHelper.synchronize("click", null);
            return EventHelper.cancel(event);
          }, false);
        }
          
        EventHelper.setDenyForEarlyHandle(allowCursorElement);
      }
    });
  },
  
  installCapabilitiesForInternalElements: (container: HTMLElement) => {
    let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-element', container)];
    elements.forEach((element) => {
      EditorHelper.installCapabilityOfBeingSelected(element);
    });
    EditorHelper.installCapabilityOfBeingMoveInCursor(container);
  },
  
  findWalkPathForElement: function(allowCursorElement: HTMLElement) {
    let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement) || HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (referenceElement) {
      let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElement;
      let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
      
      if (indexOfAllowCursorElement != -1) {
        let positionInTheAllowCursorElement = theAllowCursorElement.children.length;
        return EditorHelper.createWalkPathForCursor(referenceElement.getAttribute('internal-fsb-guid'),
                                                    indexOfAllowCursorElement,
                                                    positionInTheAllowCursorElement);
      }
    }
    
    return EditorHelper.createWalkPathForCursor();
  },
  findWalkPathForCursor: function() {
    let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode()) || HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (referenceElement) {
      let allowCursorElements = [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
      let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
      
      if (indexOfAllowCursorElement != -1) {
        if (Accessories.cursor.getDOMNode().getAttribute('internal-cursor-mode') == 'relative') {
          let positionInTheAllowCursorElement = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
          
          if (positionInTheAllowCursorElement != -1) {
            return EditorHelper.createWalkPathForCursor(referenceElement.getAttribute('internal-fsb-guid'),
                                                        indexOfAllowCursorElement,
                                                        positionInTheAllowCursorElement);
          }
        } else {
          return EditorHelper.createWalkPathForCursor(referenceElement.getAttribute('internal-fsb-guid'),
                                                      indexOfAllowCursorElement,
                                                      parseInt(Accessories.cursor.getDOMNode().style.left),
                                                      parseInt(Accessories.cursor.getDOMNode().style.top));
        }
      }
    }
    
    return EditorHelper.createWalkPathForCursor();
  },
  createWalkPathForCursor: function(referenceElementGUID: string='0', indexOfAllowCursorElement: number=0,
                                    positionXInTheAllowCursorElement: number=null, positionYInTheAllowCursorElement: number=null) {
    if (positionXInTheAllowCursorElement == -1) {
      let children = [...HTMLHelper.getElementByClassName('internal-fsb-begin-layout').children];
      let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
      let maximum = count;
      positionXInTheAllowCursorElement = maximum;
    }
    
    return [referenceElementGUID, indexOfAllowCursorElement, positionXInTheAllowCursorElement, positionYInTheAllowCursorElement];
  },
  placingCursorUsingWalkPath: function(walkPath: [string, number, number, number]) {
    let referenceElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', walkPath[0]);
    if (referenceElement) {
      let allowCursorElements = HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element');
      let theAllowCursorElement = allowCursorElements[walkPath[1]];
      
      if (theAllowCursorElement) {
        if (walkPath[3] == null) {
          if (Accessories.cursor.getDOMNode().parentNode != null) {
            Accessories.cursor.getDOMNode().parentNode.removeChild(Accessories.cursor.getDOMNode());
          }
          Accessories.cursor.getDOMNode().style.left = 'inherit';
          Accessories.cursor.getDOMNode().style.top = 'inherit';
          Accessories.cursor.getDOMNode().setAttribute('internal-cursor-mode', 'relative');
          theAllowCursorElement.insertBefore(Accessories.cursor.getDOMNode(), theAllowCursorElement.children[walkPath[2]] || null);
        } else {
          Accessories.cursor.getDOMNode().style.left = walkPath[2] + 'px';
          Accessories.cursor.getDOMNode().style.top = walkPath[3] + 'px';
          Accessories.cursor.getDOMNode().setAttribute('internal-cursor-mode', 'absolute');
          theAllowCursorElement.insertBefore(Accessories.cursor.getDOMNode(), theAllowCursorElement.firstChild);
        }
      }
    }
  },
  
  setStyle: function(element: HTMLElement, style: string) {
    let reusablePresetName = element.getAttribute('internal-fsb-reusable-preset-name') || null;
    
    if (reusablePresetName) {
      EditorHelper.setStylesheetDefinition(reusablePresetName, style, element.getAttribute('internal-fsb-guid'));
    } else {
      element.setAttribute('style', style);
    }
  },
  getStyle: function(element: HTMLElement) {
    let reusablePresetName = element.getAttribute('internal-fsb-reusable-preset-name') || null;
    let style = (reusablePresetName) ? EditorHelper.getStylesheetDefinition(reusablePresetName) : element.getAttribute('style');
    
    return style;
  },
  setStyleAttribute: function(element: HTMLElement, styleName: string, styleValue: string) {
    let style = EditorHelper.getStyle(element);
    style = HTMLHelper.updateInlineStyle(style, styleName, styleValue);
    
    EditorHelper.setStyle(element, style);
  },
  getStyleAttribute: function(element: HTMLElement, styleName: string) {
    let style = EditorHelper.getStyle(element);
    
    return HTMLHelper.getInlineStyle(style, styleName);
  },
  getStylesheetDefinition: function(name: string) {
    return stylesheetDefinitions[name] || null;
  },
  removeStylesheetDefinition: function(name: string, guid: string) {
    delete stylesheetDefinitions[name];
    
    let elements = HTMLHelper.getElementsByAttribute('internal-fsb-presets');
    for (let element of elements) {
      element.setAttribute('internal-fsb-presets', (element.getAttribute('internal-fsb-presets') || '').replace('+' + name + '+', '+' + guid + '+'));
    }
    
    stylesheetDefinitionRevision++;
  },
  setStylesheetDefinition: function(name: string, content: string, guid: string) {
    if (stylesheetDefinitions[name] === undefined) {
      let elements = HTMLHelper.getElementsByAttribute('internal-fsb-presets');
      for (let element of elements) {
        element.setAttribute('internal-fsb-presets', (element.getAttribute('internal-fsb-presets') || '').replace('+' + guid + '+', '+' + name + '+'));
      }
    }
    
    stylesheetDefinitions[name] = content;
    stylesheetDefinitionRevision++;
    
    renderStylesheet();
  },
  swapStylesheetName: function(previousName: string, nextName: string) {
    stylesheetDefinitions[nextName] = stylesheetDefinitions[previousName];
    delete stylesheetDefinitions[previousName];
    
    stylesheetDefinitionRevision++;
    
    let elements = HTMLHelper.getElementsByAttribute('internal-fsb-presets');
    for (let element of elements) {
      element.setAttribute('internal-fsb-presets', (element.getAttribute('internal-fsb-presets') || '').replace('+' + previousName + '+', '+' + nextName + '+'));
    }
    
    renderStylesheet();
  },
  getStylesheetDefinitionKeys: function() {
    if (cachedPrioritizedKeysRevision != stylesheetDefinitionRevision || cachedPrioritizedKeys == null) {
      cachedPrioritizedKeysRevision = stylesheetDefinitionRevision;
      cachedPrioritizedKeys = Object.keys(stylesheetDefinitions).sort((a, b) => {
        let pa = HTMLHelper.getInlineStyle(stylesheetDefinitions[a], 'internal-fsb-priority') || 0;
        let pb = HTMLHelper.getInlineStyle(stylesheetDefinitions[b], 'internal-fsb-priority') || 0;
        
        return (pa != pb) ? pa < pb : a > b;
      });
    }
    return cachedPrioritizedKeys;
  },
  getStylesheetDefinitionRevision: function() {
    return stylesheetDefinitionRevision;
  }
};

export {Accessories, EditorHelper};