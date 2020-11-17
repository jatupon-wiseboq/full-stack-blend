import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {ManipulationHelper} from './ManipulationHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {InternalProjectSettings} from './WorkspaceHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {SINGLE_DOM_CONTAINER_ELEMENTS} from '../../Constants.js';

var CursorHelper = {
	moveCursorToTheEndOfDocument: (remember: boolean=true) => {
    let element = HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (element) {
      ManipulationHelper.perform('move[cursor]', CursorHelper.createWalkPathForCursor(), remember);
      element.parentNode.appendChild(Accessories.guide.getDOMNode());
    }
  },
  moveCursorToTheLeft: (link: any=Math.random()) => {
    let {allAllowCursorElements, allAllowCursorPositions} = CursorHelper.getDepthFirstReferencesForCursorWalks();
    
    let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
    let indexOfTheCursor = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
    let index = -1;
    
    for (let i=0; i<=indexOfTheCursor; i++) {
      index = allAllowCursorElements.indexOf(theAllowCursorElement, index + 1);
    }
    
    if (index > 0) {
      let walkPath = CursorHelper.findWalkPathForElement(allAllowCursorElements[index - 1]);
      walkPath[2] = allAllowCursorPositions[index - 1];
      
      ManipulationHelper.perform('move[cursor]', walkPath, true, false, link);
      
      if (LayoutHelper.isContainedInInheritedComponent(Accessories.cursor.getDOMNode())) {
      	CursorHelper.moveCursorToTheLeft(link);
      }
    }
  },
  moveCursorUp: () => {
    let walkPath = [...CursorHelper.findWalkPathForCursor()];
    walkPath[2] = Math.max(0, walkPath[2] - 1);
    
    if (walkPath[2] == 0) {
      if (Accessories.cursor.getDOMNode().parentNode.tagName == 'TD' &&
        HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode().parentNode.parentNode) &&
        HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).tagName == 'TR') {
        
        let colIndex = [...Accessories.cursor.getDOMNode().parentNode.parentNode.children].indexOf(Accessories.cursor.getDOMNode().parentNode);
        let nextContainer = HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).children[colIndex];
        
        walkPath[1] -= Accessories.cursor.getDOMNode().parentNode.parentNode.children.length;
        walkPath[2] = nextContainer.children.length;
      }
    }
    
    ManipulationHelper.perform('move[cursor]', walkPath);
  },
  moveCursorToTheRight: (link: any=Math.random()) => {
    let {allAllowCursorElements, allAllowCursorPositions} = CursorHelper.getDepthFirstReferencesForCursorWalks();
    
    let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
    let indexOfTheCursor = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
    let index = -1;
    
    for (let i=0; i<=indexOfTheCursor; i++) {
      index = allAllowCursorElements.indexOf(theAllowCursorElement, index + 1);
    }
    
    if (index < allAllowCursorElements.length - 1) {
      let walkPath = CursorHelper.findWalkPathForElement(allAllowCursorElements[index + 1]);
      walkPath[2] = allAllowCursorPositions[index + 1];
      
      ManipulationHelper.perform('move[cursor]', walkPath, true, false, link);
      
      if (LayoutHelper.isContainedInInheritedComponent(Accessories.cursor.getDOMNode())) {
      	CursorHelper.moveCursorToTheRight(link);
      }
    } else {
      CursorHelper.moveCursorToTheEndOfDocument();
    }
  },
  moveCursorDown: () => {
    let walkPath = [...CursorHelper.findWalkPathForCursor()];
    let maximum = walkPath[2];
    
    let referenceElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', walkPath[0]);
    if (referenceElement) {
      let allowCursorElements = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1) ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElements[walkPath[1]];
      
      if (theAllowCursorElement) {
        let children = [...theAllowCursorElement.children];
        let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
        maximum = count;
      }
    }
    
    walkPath[2] = Math.min(maximum, walkPath[2] + 1);
    
    if (walkPath[2] == Accessories.cursor.getDOMNode().parentNode.children.length - 1) {
      if (Accessories.cursor.getDOMNode().parentNode.tagName == 'TD' &&
        HTMLHelper.getNextSibling(Accessories.cursor.getDOMNode().parentNode.parentNode) &&
        HTMLHelper.getNextSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).tagName == 'TR') {
        
        let colIndex = [...Accessories.cursor.getDOMNode().parentNode.parentNode.children].indexOf(Accessories.cursor.getDOMNode().parentNode);
        let nextContainer = HTMLHelper.getNextSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).children[colIndex];
        
        walkPath[1] += Accessories.cursor.getDOMNode().parentNode.parentNode.children.length;
        walkPath[2] = 0;
      }
    }
    
    ManipulationHelper.perform('move[cursor]', walkPath);
  },
  getDepthFirstReferencesForCursorWalks: (container: HTMLElement=document.body, allAllowCursorElements: [HTMLElement]=[], allAllowCursorPositions: number[]=[]) => {
    let isContainerAllowedCursor = HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor');
    
    let children = [...container.children];
    let count = 0;
    let total = 0;
    for (let i=0; i<children.length; i++) {
      if (children[i] == Accessories.cursor.getDOMNode()) continue;
      if (children[i] == Accessories.resizer.getDOMNode()) continue;
      if (isContainerAllowedCursor) {
        allAllowCursorElements.push(container);
        allAllowCursorPositions.push(count);
        
        count += 1;
      }
      
      total += 1;
      
      CursorHelper.getDepthFirstReferencesForCursorWalks(children[i], allAllowCursorElements, allAllowCursorPositions);
    }
    
    if (isContainerAllowedCursor) {
      allAllowCursorElements.push(container);
      allAllowCursorPositions.push(total);
    }
    
    return {allAllowCursorElements, allAllowCursorPositions};
  },
	findWalkPathForElement: function(allowCursorElement: HTMLElement) {
    let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement) || HTMLHelper.getElementByClassName('internal-fsb-begin');
    let isReferenceElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1);
    
    if (isReferenceElementASingleDomElement) {
    	referenceElement = allowCursorElement;
    }
    
    if (referenceElement) {
      let allowCursorElements = isReferenceElementASingleDomElement ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElement;
      let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
      
      if (indexOfAllowCursorElement != -1) {
        let positionInTheAllowCursorElement = theAllowCursorElement.children.length;
        return CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
                                                    indexOfAllowCursorElement,
                                                    positionInTheAllowCursorElement);
      }
    }
    
    return CursorHelper.createWalkPathForCursor();
  },
  findWalkPathForCursor: function() {
    let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode()) || HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (referenceElement) {
      let allowCursorElements = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1) ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
      let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);
      
      if (indexOfAllowCursorElement != -1) {
        if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
          let positionInTheAllowCursorElement = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());
          
          if (positionInTheAllowCursorElement != -1) {
            return CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
                                                        indexOfAllowCursorElement,
                                                        positionInTheAllowCursorElement);
          }
        } else {
          return CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
                                                      indexOfAllowCursorElement,
                                                      parseInt(Accessories.cursor.getDOMNode().style.left),
                                                      parseInt(Accessories.cursor.getDOMNode().style.top));
        }
      }
    }
    
    return CursorHelper.createWalkPathForCursor();
  },
  createWalkPathForCursor: function(referenceElementGUID: string='0', indexOfAllowCursorElement: number=0,
                                    positionXInTheAllowCursorElement: number=null, positionYInTheAllowCursorElement: number=null) {
    if (positionXInTheAllowCursorElement == null) {
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
    	let isReferenceElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1);
      let allowCursorElements = isReferenceElementASingleDomElement ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElements[walkPath[1]];
      
      if (theAllowCursorElement) {
        if (walkPath[3] == null) {
          if (Accessories.cursor.getDOMNode().parentNode != null) {
            Accessories.cursor.getDOMNode().parentNode.removeChild(Accessories.cursor.getDOMNode());
          }
          
          let isTheAllowCursorElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(theAllowCursorElement, 'internal-fsb-class')) != -1);
          
          Accessories.cursor.getDOMNode().style.left = '-1.0px';
          Accessories.cursor.getDOMNode().style.top = isTheAllowCursorElementASingleDomElement ? '20px' : '0px';
          HTMLHelper.setAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode', 'relative');
          theAllowCursorElement.insertBefore(Accessories.cursor.getDOMNode(), theAllowCursorElement.children[walkPath[2]] || null);
        } else {
          Accessories.cursor.getDOMNode().style.left = walkPath[2] + 'px';
          Accessories.cursor.getDOMNode().style.top = walkPath[3] + 'px';
          HTMLHelper.setAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode', 'absolute');
          theAllowCursorElement.insertBefore(Accessories.cursor.getDOMNode(), theAllowCursorElement.firstElementChild);
        }
      }
    }
  }
};

export {CursorHelper};