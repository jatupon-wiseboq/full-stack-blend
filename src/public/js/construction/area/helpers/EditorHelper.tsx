import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Cursor.js';
import '../controls/Resizer.js';
import '../controls/CellFormater.js';
import '../controls/Guide.js';
import '../controls/LayoutInfo.js';

declare let React: any;
declare let ReactDOM: any;

let Accessories = {
  cursor: null,
  resizer: null,
  cellFormater: null,
  guide: null,
  layoutInfo: null
};

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
    
    let cellFormaterContainer = document.createElement('div');
    Accessories.cellFormater = ReactDOM.render(<FullStackBlend.Controls.CellFormater />, cellFormaterContainer);
    window.document.body.appendChild(cellFormaterContainer);
    
    let guideContainer = document.createElement('div');
    Accessories.guide = ReactDOM.render(<FullStackBlend.Controls.Guide />, guideContainer);
    Accessories.guide.setDOMNode(guideContainer.firstChild);
    guideContainer.removeChild(Accessories.guide.getDOMNode());
    
    let layoutContainer = document.createElement('div');
    Accessories.layoutInfo = ReactDOM.render(<FullStackBlend.Controls.LayoutInfo />, layoutContainer);
    window.document.body.appendChild(layoutContainer);
    
    CursorHelper.moveCursorToTheEndOfDocument(false);
    
    EditorHelper.updateClassNameBaseOnChangedPresets();
  },
  
  perform: (name: string, content: any) => {
  	ManipulationHelper.perform(name, content);
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
  updateEditorProperties: () => {
    let element = EditorHelper.getSelectingElement();
    if (element == null) {
    	EditorHelper.synchronize('updateEditorProperties', {
	      extensions: Object.assign({
	        isSelectingElement: false,
	        elementTreeNodes: LayoutHelper.getElementTreeNodes()
	      })
	    });
    	return;
    }
    
    let reusablePresetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name') || null;
    let attributes = null;
    
    if (reusablePresetName) {
      attributes = HTMLHelper.getAttributes(element, false, {
        style: StylesheetHelper.getStylesheetDefinition(reusablePresetName)
      });
    } else {
      attributes = HTMLHelper.getAttributes(element, false);
    }
    
    EditorHelper.synchronize('updateEditorProperties', {
      attributes: attributes,
      extensions: Object.assign({
      	isSelectingElement: true,
        currentActiveLayout: Accessories.layoutInfo.currentActiveLayout(),
        stylesheetDefinitionKeys: StylesheetHelper.getStylesheetDefinitionKeys(),
        stylesheetDefinitionRevision: StylesheetHelper.getStylesheetDefinitionRevision(),
        elementTreeNodes: LayoutHelper.getElementTreeNodes()
      }, Accessories.cellFormater.getInfo())
    });
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
          current.insertBefore(Accessories.guide.getDOMNode(), current.firstChild);
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
    if (Accessories.resizer && Accessories.resizer.getDOMNode().parentNode && HTMLHelper.hasClass(Accessories.resizer.getDOMNode().parentNode, 'internal-fsb-element')) {
      return Accessories.resizer.getDOMNode().parentNode;
    } else {
      return null;
    }
  },
  move: (target: HTMLElement, destination: HTMLElement, direction: string) => {
  	switch (direction) {
    	case 'insertBefore':
    		destination.parentNode.insertBefore(target, destination);
  			destination.parentNode.insertBefore(Accessories.guide.getDOMNode(), destination.parentNode.firstChild);
    		break;
    	case 'appendChild':
    		destination.appendChild(target);
  			destination.insertBefore(Accessories.guide.getDOMNode(), destination.firstChild);
    		break;
    	case 'insertAfter':
    		destination.parentNode.insertBefore(target, destination.nextSibling);
  			destination.parentNode.insertBefore(Accessories.guide.getDOMNode(), destination.parentNode.firstChild);
    		break;
  	}
  },
  
  updateClassNameBaseOnChangedPresets: () => {
  	let elements = HTMLHelper.getElementsByClassName('internal-fsb-element');
  	for (let element of elements) {
  		HTMLHelper.setAttribute(element,
  			'class',
  			TextHelper.mergeClassNameWithPrefixedClasses(
  				HTMLHelper.getAttribute(element, 'class'),
  				'-fsb-preset-',
  				(StylesheetHelper.getStyleAttribute(element, '-fsb-inherited-presets') || '').split(', ')
  			)
  		);
  	}
  }
};

export {Accessories, EditorHelper};